/*
Client-side resume parsing:
- PDF: uses pdfjs-dist to extract text
- DOCX: uses mammoth to extract text
This will extract simple Name / Email / Phone heuristically.
*/
import * as pdfjsLib from 'pdfjs-dist/legacy/build/pdf.js'
import mammoth from 'mammoth'

function extractEmail(text){
  const m = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/g)
  return m ? m[0] : null
}
function extractPhone(text){
  const m = text.match(/(\+?\d[\d \-()]{7,}\d)/g)
  return m ? m[0].replace(/\s+/g,'') : null
}
function extractName(text){
  // heuristic: first line words (assume name)
  const lines = text.split(/\n+/).map(s=>s.trim()).filter(Boolean)
  if(lines.length===0) return null
  const candidate = lines[0]
  // avoid emails/phones
  if(candidate.match(/[@\d]/)) {
    if(lines.length>1) return lines[1].split('-')[0].trim()
    return null
  }
  return candidate.split(',')[0]
}

export async function parseFile(file){
  const name = file.name.toLowerCase()
  const text = await (name.endsWith('.pdf') ? pdfToText(file) : docxToText(file))
  return {
    text,
    name: extractName(text),
    email: extractEmail(text),
    phone: extractPhone(text),
  }
}

async function pdfToText(file){
  const array = await file.arrayBuffer()
  const pdf = await pdfjsLib.getDocument({data:array}).promise
  let full = ''
  for(let i=1;i<=pdf.numPages;i++){
    const page = await pdf.getPage(i)
    const txt = await page.getTextContent()
    const pageText = txt.items.map(i=>i.str).join(' ')
    full += '\n' + pageText
  }
  return full
}

async function docxToText(file){
  const result = await mammoth.extractRawText({arrayBuffer: await file.arrayBuffer()})
  return result.value
}

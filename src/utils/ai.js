/*
Lightweight rule-based "AI" grader:
- For each question, check presence of keywords and timeTaken.
- Return a per-question score (0-10), final score average, and short summary.
*/
export function gradeAnswers(questions, answers){
  const perQ = []
  for(let i=0;i<questions.length;i++){
    const q = questions[i]
    const a = answers.find(x => x.qIndex===i)
    const text = a ? (a.answer || '') : ''
    let score = 0
    const kws = q.keywords || []
    let matched = 0
    for(const k of kws){
      if(text.toLowerCase().includes(k.toLowerCase())) matched++
    }
    if(kws.length>0) score += (matched / kws.length) * 8 // up to 8 points for keywords
    // time bonus
    if(a && a.timeTaken) {
      const t = a.timeTaken
      if(t >= q.time*0.7) score += 2
      else if(t >= q.time*0.4) score += 1
    }
    score = Math.round(score)
    perQ.push({index:i,score, matched, needed:kws.length})
  }
  const total = Math.round(perQ.reduce((s,p)=>s+p.score,0)/perQ.length)
  // summary: simple sentence
  const good = perQ.filter(p=>p.score>=6).length
  const summary = `Answered ${good}/${perQ.length} questions well. Overall score ${total}/10.`
  return { perQ, total, summary }
}

import React, { useState } from 'react'
import { parseFile } from '../utils/parseResume'
import { Button, Upload, message } from 'antd'
import { InboxOutlined } from '@ant-design/icons'
import { useDispatch } from 'react-redux'
import { createCandidate } from '../features/sessionSlice'

export default function ResumeUpload(){
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(false)

  const props = {
    name: 'file',
    multiple: false,
    accept: '.pdf,.docx',
    customRequest: ({file, onSuccess}) => {
      setTimeout(()=>onSuccess('ok'), 0)
    },
    beforeUpload: async (file) => {
      setLoading(true)
      try {
        const parsed = await parseFile(file)
        // dispatch createCandidate with parsed fields
        dispatch(createCandidate({
          name: parsed.name || '',
          email: parsed.email || '',
          phone: parsed.phone || '',
          resumeText: parsed.text || ''
        }))
        message.success('Resume parsed. Proceed to chat.')
      } catch(e){
        console.error(e)
        message.error('Failed to parse file. Try PDF or DOCX.')
      } finally { setLoading(false) }
      return false
    },
  }

  return (
    <div style={{padding:12}}>
      <Upload.Dragger {...props} style={{borderRadius:8}}>
        <p className="ant-upload-drag-icon"><InboxOutlined /></p>
        <p className="ant-upload-text">Click or drag a PDF / DOCX resume here</p>
        <p className="ant-upload-hint">We will extract Name, Email and Phone.</p>
      </Upload.Dragger>
      <div style={{marginTop:12}}>
        <small className="tiny">If any field missing the chat will collect it before starting the interview.</small>
      </div>
    </div>
  )
}

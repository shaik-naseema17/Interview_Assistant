import React, { useEffect, useState } from 'react'
import ResumeUpload from './components/ResumeUpload'
import Interviewee from './components/Interviewee'
import Interviewer from './components/Interviewer'
import { Tabs, Modal, Button } from 'antd'
import { useSelector } from 'react-redux'

export default function App(){
  const [tab, setTab] = useState('interviewee')
  const session = useSelector(s=>s.session)
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(()=>{
    if(session.unfinished) setShowWelcome(true)
  },[])

  return (
    <div className="app">
      <div className="header">
        <h2>Swipe — AI Interview Assistant</h2>
        <div style={{display:'flex', gap:8}}>
          <Button onClick={()=>setTab('interviewee')}>Interviewee</Button>
          <Button onClick={()=>setTab('interviewer')}>Interviewer</Button>
        </div>
      </div>

      {tab==='interviewee' && (
        <div className="two-col">
          <div className="left">
            <ResumeUpload />
            <Interviewee />
          </div>
          <div className="right">
            <div style={{padding:12}}>
              <h4>Session Info</h4>
              <p className="tiny">All data persisted locally. Close and reopen to see Welcome Back modal.</p>
            </div>
          </div>
        </div>
      )}

      {tab==='interviewer' && <Interviewer />}

      <Modal title="Welcome Back" open={showWelcome} onOk={()=>setShowWelcome(false)} onCancel={()=>setShowWelcome(false)}>
        <p>We detected an unfinished interview. You can resume from Interviewee tab.</p>
      </Modal>
    </div>
  )
}

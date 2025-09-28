import React, { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { startInterview, saveAnswer, finalizeCandidate } from '../features/sessionSlice'
import { Button, Input, Progress } from 'antd'
import { gradeAnswers } from '../utils/ai'
import Timer from './Timer'

export default function Interviewee() {
  const dispatch = useDispatch()
  const sessionState = useSelector(s => s.session)
  const cid = sessionState.currentCandidateId
  const session = cid ? sessionState.sessions[cid] : null
  const [localMsg, setLocalMsg] = useState('')
  const [askingFor, setAskingFor] = useState(null)
  const [timeLeftKey, setTimeLeftKey] = useState(0)

  useEffect(() => {
    if (session && !session.startedAt) {
      if (!session.name) setAskingFor('name')
      else if (!session.email) setAskingFor('email')
      else if (!session.phone) setAskingFor('phone')
      else setAskingFor(null)
    } else {
      setAskingFor(null)
    }
  }, [session])

  if (!session) return <div style={{ padding: 12 }}>Upload resume to begin. Use Interviewer tab to view candidates.</div>

  const onProvide = (field) => {
    session[field] = localMsg
    setLocalMsg('')
    setAskingFor(null)
    dispatch(startInterview())
  }

  const onAnswer = (answer, auto = false, timeTaken = 0) => {
    dispatch(saveAnswer({ candidateId: cid, answer, auto, timeTaken }))
    setTimeLeftKey(k => k + 1)
    const s = sessionState.sessions[cid]
    if (s && s.currentQ + 1 >= (s.questions ? s.questions.length : 6)) {
      const res = gradeAnswers(s.questions, [...s.answers, { qIndex: s.currentQ, answer, timeTaken, auto }])
      dispatch(finalizeCandidate({ candidateId: cid, score: res.total, summary: res.summary, perQ: res.perQ }))
    }
  }

  if (askingFor) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Quick info needed: {askingFor}</h3>
        <Input value={localMsg} onChange={e => setLocalMsg(e.target.value)} placeholder={`Enter your ${askingFor}`} />
        <div style={{ marginTop: 8 }}>
          <Button type="primary" onClick={() => onProvide(askingFor)} disabled={!localMsg}>Save & Start Interview</Button>
        </div>
      </div>
    )
  }

  if (!session.startedAt) {
    return (
      <div style={{ padding: 12 }}>
        <h3>Ready to start interview — {session.name || 'Candidate'}</h3>
        <Button type="primary" onClick={() => dispatch(startInterview())}>Start Interview</Button>
      </div>
    )
  }

  const qIndex = session.currentQ
  const questions = session.questions || []
  const finished = session.finished

  return (
    <div style={{ padding: 12 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div><strong>{session.name || 'Candidate'}</strong> — Score: {session.score ?? 'In Progress'}</div>
        <div style={{ width: 240 }}><Progress percent={Math.round(((qIndex) / questions.length) * 100)} /></div>
      </div>

      <div className="chat-box" id="chat">
        {questions.map((q, i) => (
          <div key={i} className="message">
            <div className="bot"><b>Q{i + 1} ({q.level})</b>: {q.text}</div>
            <div className="tiny">Time limit: {q.time}s</div>
            {session.answers.find(a => a.qIndex === i) ? (
              <div className="user">A: {session.answers.find(a => a.qIndex === i).answer}</div>
            ) : qIndex === i ? (
              <Timer key={timeLeftKey} seconds={q.time} onSubmit={(timeTaken) => {
                const ans = prompt('Enter your answer (will auto-submit):') || ''
                onAnswer(ans, true, timeTaken)
              }} onManualSubmit={(timeTaken, answer) => {
                onAnswer(answer, false, timeTaken)
              }} />
            ) : (
              <div className="tiny">Pending...</div>
            )}
          </div>
        ))}
      </div>

      {finished && (
        <div style={{ marginTop: 12 }}>
          <h3>Interview finished</h3>
          <div className="tiny">{session.summary}</div>
        </div>
      )}
    </div>
  )
}

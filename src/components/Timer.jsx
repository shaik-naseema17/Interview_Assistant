import React, { useEffect, useState } from 'react'
import { Button, Input } from 'antd'

export default function Timer({ seconds, onSubmit, onManualSubmit }){
  const [timeLeft, setTimeLeft] = useState(seconds)
  const [answer, setAnswer] = useState('')
  useEffect(()=>{
    const id = setInterval(()=> setTimeLeft(t=>t-1), 1000)
    return ()=> clearInterval(id)
  },[])
  useEffect(() => {
  if (timeLeft <= 0) {
    onSubmit(seconds) // pass full time taken since they used the whole timer
  }
}, [timeLeft])

  return (
    <div style={{marginTop:8}}>
      <div className="tiny">Time left: {timeLeft}s</div>
      <Input.TextArea rows={4} value={answer} onChange={e=>setAnswer(e.target.value)} placeholder="Type answer here..." />
      <div style={{marginTop:8}}>
        <Button onClick={()=> onManualSubmit(seconds - timeLeft, answer || '')} type="primary">Submit Answer</Button>
      </div>
    </div>
  )
}

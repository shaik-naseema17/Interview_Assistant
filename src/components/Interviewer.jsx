import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Table, Input, Modal } from 'antd'

export default function Interviewer() {
  const cands = useSelector(s => s.candidates.list)
  const sessions = useSelector(s => s.session.sessions)
  const [q, setQ] = useState('')
  const [selected, setSelected] = useState(null)

  const data = cands
    .map(c => ({
      key: c.id,
      id: c.id,
      name: c.name,
      score: c.score,
      summary: c.summary,
    }))
    .filter(r => r.name.toLowerCase().includes(q.toLowerCase()))

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', sorter: (a, b) => a.name.localeCompare(b.name) },
    { title: 'Score', dataIndex: 'score', key: 'score', sorter: (a, b) => (a.score ?? 0) - (b.score ?? 0) },
    { title: 'Summary', dataIndex: 'summary', key: 'summary' },
  ]

  const candidateSession = selected ? sessions[selected.id] : null

  return (
    <div style={{ padding: 12 }}>
      <Input.Search
        placeholder="Search name..."
        onChange={e => setQ(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <Table
        columns={columns}
        dataSource={data}
        onRow={(record) => ({
          onClick: () => setSelected(record),
        })}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        open={!!selected}
        title={selected ? `${selected.name} — Detailed Results` : ''}
        footer={null}
        onCancel={() => setSelected(null)}
        width={800}
      >
        {candidateSession ? (
          <div>
            <h4>Overall Score: {candidateSession.score}/10</h4>
            <p>{candidateSession.summary}</p>
            <h4>Per Question Breakdown</h4>
            <div style={{ maxHeight: 400, overflow: 'auto' }}>
              {candidateSession.questions.map((q, i) => {
                const ans = candidateSession.answers.find(a => a.qIndex === i)
                const perQ = candidateSession.perQuestion?.find(p => p.index === i)
                return (
                  <div key={i} style={{ marginBottom: 16, padding: 8, border: '1px solid #eee', borderRadius: 8 }}>
                    <strong>Q{i + 1} ({q.level})</strong>: {q.text}
                    <div><em>Answer:</em> {ans ? ans.answer : 'No answer given'}</div>
                    {perQ && (
                      <div>
                        <em>Score:</em> {perQ.score}/10 — matched {perQ.matched}/{perQ.needed} keywords
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <p>No detailed session available.</p>
        )}
      </Modal>
    </div>
  )
}

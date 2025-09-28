import { createSlice } from '@reduxjs/toolkit'
import { sampleQuestions } from '../utils/questions'
import { v4 as uuidv4 } from 'uuid'
import { addCandidateSummary } from './candidatesSlice'

const initial = {
  currentCandidateId: null,
  unfinished: null,
  sessions: {}, // id -> session
}

const slice = createSlice({
  name: 'session',
  initialState: initial,
  reducers: {
    createCandidate(state, action) {
      const id = uuidv4()
      const { name, email, phone, resumeText } = action.payload
      state.sessions[id] = {
        id, name, email, phone, resumeText, createdAt: Date.now(),
        answers: [],
        currentQ: 0,
        finished: false,
        score: null,
        summary: null,
        startedAt: null,
      }
      state.currentCandidateId = id
      state.unfinished = id
    },
    loadCandidate(state, action) {
      state.currentCandidateId = action.payload
    },
    startInterview(state) {
      const id = state.currentCandidateId
      if (!id) return
      state.sessions[id].startedAt = Date.now()
      state.sessions[id].questions = sampleQuestions()
      state.sessions[id].currentQ = 0
      state.unfinished = id
    },
    saveAnswer(state, action) {
      const { candidateId, answer, timeTaken, auto } = action.payload
      const s = state.sessions[candidateId]
      if (!s) return
      s.answers.push({ qIndex: s.currentQ, answer, timeTaken, auto })
      s.currentQ += 1
      if (s.currentQ >= s.questions.length) {
        s.finished = true
        state.unfinished = null
      }
    },
    finishAndScore(state, action) {
      const { candidateId, score, summary, perQ } = action.payload
      const s = state.sessions[candidateId]
      if (!s) return
      s.finished = true
      s.score = score
      s.summary = summary
      s.perQuestion = perQ
      state.unfinished = null
    },
    restoreState(state, action) {
      return action.payload
    }
  }
})

export const { createCandidate, loadCandidate, startInterview, saveAnswer, finishAndScore, restoreState } = slice.actions

// Thunk: finish interview and also update candidates list
export const finalizeCandidate = (payload) => (dispatch, getState) => {
  dispatch(finishAndScore(payload))
  const { candidateId, score, summary } = payload
  const cand = getState().session.sessions[candidateId]
  if (cand) {
    dispatch(addCandidateSummary({
      id: cand.id,
      name: cand.name || 'Unknown',
      score,
      summary,
    }))
  }
}

export default slice.reducer

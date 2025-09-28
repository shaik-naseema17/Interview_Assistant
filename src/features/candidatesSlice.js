import { createSlice } from '@reduxjs/toolkit'

const initial = {
  list: []
}

const slice = createSlice({
  name: 'candidates',
  initialState: initial,
  reducers: {
    addCandidateSummary(state, action) {
      // prevent duplicate entries (overwrite if exists)
      const idx = state.list.findIndex(c => c.id === action.payload.id)
      if (idx >= 0) {
        state.list[idx] = action.payload
      } else {
        state.list.push(action.payload)
      }
    },
    updateCandidate(state, action) {
      const i = state.list.findIndex(c => c.id === action.payload.id)
      if (i >= 0) state.list[i] = action.payload
    }
  }
})

export const { addCandidateSummary, updateCandidate } = slice.actions
export default slice.reducer

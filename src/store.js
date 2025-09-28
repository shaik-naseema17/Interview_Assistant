import { configureStore, combineReducers } from '@reduxjs/toolkit'
import sessionReducer from './features/sessionSlice'
import candidatesReducer from './features/candidatesSlice'
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage' // localStorage

const root = combineReducers({
  session: sessionReducer,
  candidates: candidatesReducer,
})

const persisted = persistReducer({ key: 'root', storage }, root)

export const store = configureStore({
  reducer: persisted,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
})

export const persistor = persistStore(store)
export default store

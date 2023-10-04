import { combineReducers } from '@reduxjs/toolkit'
import { currentUserReducer } from './currentUser'
import { noteListReducer } from './noteList';

export const combinedReducer = combineReducers({
  currentUser: currentUserReducer,
  noteList: noteListReducer
})

export { setCurrentUser } from './currentUser'
export { setNotes } from './noteList'

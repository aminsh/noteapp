import { NoteState } from '../../../type/entity'
import { createSlice } from '@reduxjs/toolkit';

const initialState: NoteState = {
  myNotes: [],
  sharedNotes: []
}

const noteListSlice = createSlice({
  name: 'noteList',
  initialState,
  reducers: {
    setNotes: (state: NoteState, { payload }: { payload: NoteState }) => {
      state.myNotes = payload.myNotes
      state.sharedNotes = payload.sharedNotes
    }
  }
})

export const { setNotes } = noteListSlice.actions
export const noteListReducer = noteListSlice.reducer

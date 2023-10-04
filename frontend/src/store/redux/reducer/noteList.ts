import { NoteState } from '../../../type/entity'
import { createSlice } from '@reduxjs/toolkit';

const initialState: NoteState = {
  noteMenuItems: []
}

const noteListSlice = createSlice({
  name: 'noteList',
  initialState,
  reducers: {
    setNotes: (state: NoteState, { payload }: { payload: NoteState }) => {
      state.noteMenuItems = payload.noteMenuItems
    }
  }
})

export const { setNotes } = noteListSlice.actions
export const noteListReducer = noteListSlice.reducer

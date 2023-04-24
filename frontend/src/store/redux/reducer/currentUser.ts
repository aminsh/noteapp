import { createSlice } from '@reduxjs/toolkit';
import { User } from '../../../type/entity';

const initialState: User = {
  id: undefined,
  email: '',
  name: ''
};

const currentUserSlice = createSlice({
  name: "currentUser",
  initialState,
  reducers: {
    setCurrentUser: (state: User, { payload }: { payload: User }) => {
      if (!payload) return;

      state.id = payload.id;
      state.email = payload.email;
      state.name = payload.name;
    },
  },
});

export const { setCurrentUser } = currentUserSlice.actions;
export const currentUserReducer = currentUserSlice.reducer;

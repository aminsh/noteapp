import { combineReducers } from '@reduxjs/toolkit';
import { currentUserReducer } from './currentUser';

export const combinedReducer = combineReducers({
  currentUser: currentUserReducer,
});

export { setCurrentUser } from './currentUser';

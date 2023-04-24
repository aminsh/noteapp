import { configureStore } from '@reduxjs/toolkit';
import { combinedReducer } from './redux/reducer';

const masterReducer = (state: any, action: any) => {
  return combinedReducer(state, action);
};

export const store = configureStore({
  reducer: masterReducer,
});

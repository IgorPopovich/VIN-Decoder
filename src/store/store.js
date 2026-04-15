import { configureStore } from '@reduxjs/toolkit';
import variablesReducer from './variablesSlice';

export const store = configureStore({
  reducer: {
    variables: variablesReducer,
  },
});

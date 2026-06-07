import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/root-reducer';
import { createLogger } from 'redux-logger';

const isDev = process.env.NODE_ENV !== 'production';

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const base = getDefaultMiddleware();
    return isDev ? base.concat(createLogger({ collapsed: true })) : base;
  },
});

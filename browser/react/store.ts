import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/root-reducer';

const isDev = process.env.NODE_ENV !== 'production';

const devLogger = store => next => action => {
  const prev = store.getState();
  const result = next(action);
  console.groupCollapsed(action.type);
  console.log('prev state', prev);
  console.log('action', action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const base = getDefaultMiddleware();
    return isDev ? base.concat(devLogger) : base;
  },
});

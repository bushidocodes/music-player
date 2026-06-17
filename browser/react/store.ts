import { configureStore } from '@reduxjs/toolkit';
import type { Middleware, ThunkAction } from '@reduxjs/toolkit';
import rootReducer from './reducers/root-reducer';
import type { AppAction } from './types';

const isDev = import.meta.env.DEV;

const devLogger: Middleware = store => next => action => {
  const prev = store.getState();
  const result = next(action);
  console.groupCollapsed((action as AppAction).type);
  console.log('prev state', prev);
  console.log('action', action);
  console.log('next state', store.getState());
  console.groupEnd();
  return result;
};

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => {
    const base = getDefaultMiddleware();
    return isDev ? base.concat(devLogger) : base;
  },
});

export default store;

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<R = void> = ThunkAction<R, RootState, unknown, AppAction>;

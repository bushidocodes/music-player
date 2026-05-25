import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './reducers/root-reducer';
import createLogger from 'redux-logger';

const logger = createLogger({ collapsed: true });

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(logger),
});
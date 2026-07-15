import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from './store';

// Pre-typed versions of the react-redux hooks (see store.ts for RootState /
// AppDispatch). Containers should use these instead of the untyped originals.
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();

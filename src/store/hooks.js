import { useDispatch, useSelector } from 'react-redux';

// Typed hooks (for JavaScript)
export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;
export { useMtkColor } from './hooks/useMtkColor';
export { useAuth } from './hooks/useAuth';
export { useMaterialTailwindController } from './hooks/useMaterialTailwind';


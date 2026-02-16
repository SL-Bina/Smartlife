import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeUser } from '@/store/slices/authSlice';
import { setDarkMode } from '@/store/slices/uiSlice';
import { useAppSelector } from '@/store/hooks';

export function ReduxInitializer({ children }) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.ui.darkMode);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);

  // Initialize auth
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeUser());
    }
  }, [dispatch, isInitialized]);

  // Apply dark mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (darkMode) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }
  }, [darkMode]);

  return children;
}


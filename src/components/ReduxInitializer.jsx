import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { initializeUser } from '@/store/slices/authSlice';
import { setDarkMode } from '@/store/slices/uiSlice';
import { loadAllLists } from '@/store/slices/managementSlice';
import { useAppSelector } from '@/store/hooks';

export function ReduxInitializer({ children }) {
  const dispatch = useAppDispatch();
  const darkMode = useAppSelector((state) => state.ui.darkMode);
  const isInitialized = useAppSelector((state) => state.auth.isInitialized);
  const isManagementInitializing = useAppSelector((state) => state.management.isInitializing);
  const managementListsLoaded = useAppSelector((state) => {
    const lists = state.management.lists;
    return lists.mtks.ids.length > 0;
  });

  // Initialize auth
  useEffect(() => {
    if (!isInitialized) {
      dispatch(initializeUser());
    }
  }, [dispatch, isInitialized]);

  // Load management lists after auth is initialized
  useEffect(() => {
    if (isInitialized && !isManagementInitializing && !managementListsLoaded) {
      dispatch(loadAllLists());
    }
  }, [dispatch, isInitialized, isManagementInitializing, managementListsLoaded]);

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


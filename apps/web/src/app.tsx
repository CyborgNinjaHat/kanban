import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router';
import { useDialogStore } from '@/store/dialog.store';

export const App = () => {
  const { key: locationKey } = useLocation();

  useEffect(() => {
    if (locationKey) {
      useDialogStore.getState().closeDialog();
    }
  }, [locationKey]);

  return <Outlet />;
};

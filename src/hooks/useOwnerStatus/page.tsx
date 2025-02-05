// hooks/useOwnerStatus.ts
'use client'

import Cookies from 'js-cookie';
import { useEffect, useState } from 'react';

export const useOwnerStatus = () => {
  const [isOwnerInitialized, setIsOwnerInitialized] = useState(false);

  useEffect(() => {
    // Baca status dari cookie
    const ownerStatus = Cookies.get('owner_initialized');
    setIsOwnerInitialized(ownerStatus === 'true');
  }, []);

  const setOwnerInitialized = (status: boolean) => {
    // Simpan status ke cookie
    Cookies.set('owner_initialized', String(status));
    setIsOwnerInitialized(status);
  };

  return { isOwnerInitialized, setOwnerInitialized };
};

'use client';

import { NotificationAPIProvider } from '@notificationapi/react';

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <NotificationAPIProvider
      userId="hamov2003@gmail.com"
      clientId="jy82q73bv06v1l5529imosiila"
      customServiceWorkerPath="/notificationapi-service-worker.js"
    >
      {children}
    </NotificationAPIProvider>
  );
}
'use client';

import dynamic from 'next/dynamic';
import { NotificationAPIProvider } from '@notificationapi/react';

const NotificationPopup = dynamic(
  () => import('@notificationapi/react').then((mod) => mod.NotificationPopup),
  {
    ssr: false
  }
);

interface NotificationProviderProps {
  children: React.ReactNode;
}

export default function NotificationProvider({ children }: NotificationProviderProps) {
  return (
    <NotificationAPIProvider
      userId="hamov2003@gmail.com"
      clientId="vsbqnhxe5aqbfjzro9slzx3fvh"
      apiURL="api.eu.notificationapi.com"
      wsURL="ws.eu.notificationapi.com"
      customServiceWorkerPath="/notificationapi-service-worker.js"
    >
      {children}
      <NotificationPopup
        buttonStyles={{
          width: 40,
          height: 40,
          backgroundColor: '#1890ff'
        }}
        popoverPosition={{
          anchorOrigin: {
          vertical: 'bottom',
          horizontal: 'center'
          }
        }}
        iconColor="#ffffff"
        buttonIconSize={20}
        popupWidth={400}
        popupHeight={500}
      />
    </NotificationAPIProvider>
  );
}
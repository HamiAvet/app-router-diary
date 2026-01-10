'use client';

import { NotificationAPIProvider } from '@notificationapi/react';

const WebPushPermissionButton: React.FC = () => {
  const notificationapi = NotificationAPIProvider.useNotificationAPIContext();

  return (
    <button
      onClick={() => {
        notificationapi.setWebPushOptIn(true);
      }}
      style={{
        color: "rgb(255, 255, 255)",
        cursor: "pointer",
        background: "rgb(66, 127, 250)",
        border: "none",
        borderRadius: "8px",
        width: "165px",
        padding: "10px 18px",
        fontWeight: "600",
        transition: "0.2s",
      }}
    >
      Enable Notifications
    </button>
  );
};

export default WebPushPermissionButton;
import React from 'react';
import Notification from './Notification';
import { useNotificationStore } from '../../store/notification';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotificationStore();

  return (
    <>
      {notifications.map(({ id, message, type, duration }) => (
        <Notification
          key={id}
          message={message}
          type={type}
          duration={duration}
          onClose={() => removeNotification(id)}
        />
      ))}
    </>
  );
};

export default NotificationContainer;
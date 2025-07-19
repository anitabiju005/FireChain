import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

interface NotificationProviderProps {
  children: ReactNode;
}

export const NotificationProvider: React.FC<NotificationProviderProps> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Load notifications from localStorage
    const saved = localStorage.getItem('firechain-notifications');
    if (saved) {
      try {
        setNotifications(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    }

    // Simulate some initial notifications
    const initialNotifications: Notification[] = [
      {
        id: '1',
        type: 'warning',
        title: 'High Fire Risk Alert',
        message: 'Elevated fire risk detected in Yellowstone National Park area',
        timestamp: Date.now() - 3600000,
        read: false,
        actionUrl: '/map'
      },
      {
        id: '2',
        type: 'success',
        title: 'Incident Verified',
        message: 'Your fire report #1247 has been verified. You earned 10 FCT tokens!',
        timestamp: Date.now() - 7200000,
        read: false
      },
      {
        id: '3',
        type: 'info',
        title: 'New Satellite Data',
        message: 'LANDSAT-8 has detected thermal anomalies in 3 new locations',
        timestamp: Date.now() - 10800000,
        read: true
      }
    ];

    if (!saved) {
      setNotifications(initialNotifications);
    }
  }, []);

  useEffect(() => {
    // Save notifications to localStorage
    localStorage.setItem('firechain-notifications', JSON.stringify(notifications));
  }, [notifications]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: Date.now(),
      read: false
    };

    setNotifications(prev => [newNotification, ...prev]);

    // Auto-remove after 10 seconds for non-error notifications
    if (notification.type !== 'error') {
      setTimeout(() => {
        removeNotification(newNotification.id);
      }, 10000);
    }
  };

  const markAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  const value: NotificationContextType = {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export { NotificationContext }
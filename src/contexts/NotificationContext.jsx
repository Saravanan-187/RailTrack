import React, { createContext, useState, useContext, useEffect } from "react";
import { toast } from "sonner";

// Create context
const NotificationContext = createContext(undefined);

// Provider component
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Load notifications from localStorage on initial render
  useEffect(() => {
    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications) {
      const parsed = JSON.parse(savedNotifications);
      setNotifications(parsed);
      setUnreadCount(parsed.filter(n => !n.read).length);
    }
  }, []);

  // Save notifications to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("notifications", JSON.stringify(notifications));
    setUnreadCount(notifications.filter(n => !n.read).length);
  }, [notifications]);

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now().toString(),
      read: false,
      timestamp: new Date().toISOString(),
      ...notification
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    
    // Show toast notification
    if (notification.type === "booking_reminder") {
      toast.info(`Upcoming journey: ${notification.title}`, {
        description: notification.message,
        duration: 5000
      });
    } else if (notification.type === "booking_confirmation") {
      toast.success(notification.title, {
        description: notification.message,
        duration: 5000
      });
    } else {
      toast(notification.title, {
        description: notification.message,
        duration: 5000
      });
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, read: true }))
    );
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  // Function to check for upcoming bookings and create reminders
  const checkUpcomingBookings = (bookings) => {
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    bookings.forEach(booking => {
      if (booking.status === "confirmed") {
        const bookingDate = new Date(booking.booking_date);
        const timeDiff = bookingDate.getTime() - now.getTime();
        
        // If booking is within 24 hours and we haven't created a reminder yet
        if (timeDiff > 0 && timeDiff <= oneDay) {
          const existingReminder = notifications.find(n => 
            n.type === "booking_reminder" && 
            n.bookingId === booking.id
          );
          
          if (!existingReminder) {
            addNotification({
              type: "booking_reminder",
              title: "Upcoming Journey",
              message: `Your train ${booking.train_id} departs in ${Math.floor(timeDiff / (60 * 60 * 1000))} hours`,
              bookingId: booking.id
            });
          }
        }
      }
    });
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      addNotification, 
      markAsRead, 
      markAllAsRead, 
      removeNotification, 
      clearAllNotifications,
      checkUpcomingBookings
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

// Custom hook to use notification context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider");
  }
  return context;
};
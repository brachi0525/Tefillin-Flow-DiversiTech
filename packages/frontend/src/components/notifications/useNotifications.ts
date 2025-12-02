import { useState, useCallback } from "react";
import { Notification } from "../../features/notifiacation/notification.types";




export const useNotifications = (initialNotifications: Notification[] = []) => {
    const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);

    const markAsRead = useCallback((id: number) => {
        setNotifications(prev =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
    }, []);

    const unread = notifications.filter(n => !n.isRead);
    const all = notifications;
    const unreadCount = unread.length;

    return {
        notifications: all,
        unreadNotifications: unread,
        unreadCount,
        markAsRead,
        setNotifications,
    };
};
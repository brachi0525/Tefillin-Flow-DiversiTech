import { Popover, List, Box, Typography, Divider, Button } from "@mui/material";
import { FC } from "react";
import { Notification } from "../../features/notifiacation/notification.types";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
    anchorEl: null | HTMLElement;
    notifications: Notification[];
    onClose: () => void;
    onShowAll: () => void;
    maxToShow?: number;
}

const NotificationList: FC<NotificationListProps> = ({
    anchorEl,
    notifications,
    onClose,
    onShowAll,
    maxToShow = 10
}) => {
    const unreadNotifications = notifications.filter(n => !n.isRead);
    const limitedNotifications = unreadNotifications.slice(0, maxToShow);

    return (
        <Popover
            open={Boolean(anchorEl)}
            anchorEl={anchorEl}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            PaperProps={{ sx: { minWidth: 320, maxWidth: 380, maxHeight: 440 } }}
        >
            <Box sx={{ p: 2, pb: 0 }}>
                <Typography variant="h6" sx={{ mb: 1, textAlign: "center" }}>התראות חדשות</Typography>
            </Box>
            <Divider />
            {unreadNotifications.length === 0 && (
                <Box sx={{ p: 2 }}>
                    <Typography color="text.secondary" align="center">
                        אין התראות חדשות
                    </Typography>
                </Box>
            )}
            <List sx={{ width: '100%', maxWidth: 380, p: 0 }}>
                {limitedNotifications.map((notif) => (
                    <NotificationItem key={notif.id} notification={notif} />
                ))}
            </List>
            <Box sx={{ p: 1, textAlign: "center" }}>
                <Button size="small" color="primary" onClick={() => { onShowAll(); onClose(); }}>
                    קרא עוד
                </Button>
            </Box>
        </Popover>
    );
};

export default NotificationList;
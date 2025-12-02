import { Box, Typography, IconButton, Button, Divider, List, useTheme, useMediaQuery, SwipeableDrawer } from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import { FC } from "react";
import { Notification } from "../../features/notifiacation/notification.types";

interface NotificationDetailsPanelProps {
    open: boolean;
    notifications: Notification[];
    onClose: () => void;
    onOpen: () => void;
    onMarkAsRead: (id: number) => void;
}

const NotificationDetailsPanel: FC<NotificationDetailsPanelProps> = ({
    open,
    notifications,
    onClose,
    onOpen,
    onMarkAsRead,
}) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const unread = notifications
        .filter(n => !n.isRead)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date));
    const read = notifications
        .filter(n => n.isRead)
        .sort((a, b) => +new Date(b.date) - +new Date(a.date));

    const sortedNotifications = [...unread, ...read];

    return (
        <SwipeableDrawer anchor="left" open={open} onClose={onClose} onOpen={onOpen}>
            <Box sx={{ width: isMobile ? '100vw' : 380, p: 3, bgcolor: theme.palette.background.default }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6">כל ההתראות</Typography>
                    <IconButton onClick={onClose}><CloseIcon /></IconButton>
                </Box>
                <Divider sx={{ mb: 2 }} />
                <List>
                    {sortedNotifications.map(n => (
                        <Box key={n.id} sx={{
                            mb: 2, p: 2, bgcolor: n.isRead
                                ? theme.palette.background.default
                                : theme.palette.background.paper, borderRadius: 2
                        }}>
                            <Typography variant="subtitle1" fontWeight={n.isRead ? "normal" : "bold"} sx={{
                                fontSize: {
                                    xs: '1rem',
                                    sm: '1rem',
                                    md: '1.1rem'
                                },
                                whiteSpace: 'pre-line',
                                wordBreak: 'break-word',
                                overflowWrap: 'break-word',
                                ...(n.title.length > 40 && {
                                    fontSize: { xs: '0.95rem', sm: '1rem', md: '1.05rem' }
                                })
                            }}>
                                {n.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                {n.description}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                {new Date(n.date).toLocaleString("he-IL")}
                            </Typography>
                            {!n.isRead && (
                                <Button
                                    sx={{ border: `0.5px solid ${theme.palette.primary.main}`, color: theme.palette.primary.main }}
                                    variant="outlined"
                                    size="small"
                                    onClick={() => onMarkAsRead(n.id)}
                                >סמן כנקרא</Button>
                            )}
                        </Box>
                    ))}
                </List>
            </Box >
        </SwipeableDrawer >
    );
};

export default NotificationDetailsPanel;
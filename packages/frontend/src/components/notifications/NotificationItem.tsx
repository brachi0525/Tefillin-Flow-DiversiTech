import { Notification } from "../../features/notifiacation/notification.types";
import InfoIcon from '@mui/icons-material/Info';
import ErrorIcon from '@mui/icons-material/Error';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { Avatar, ListItem, ListItemAvatar, ListItemText, Typography } from "@mui/material";
import { FC } from "react";


interface NotificationItemProps {
    notification: Notification;
}

const getIcon = (type: Notification["type"]) => {
    switch (type) {
        case "info": return <InfoIcon sx={{ color: "#1976d2" }} />;
        case "error": return <ErrorIcon sx={{ color: "#d32f2f" }} />;
        case "success": return <CheckCircleIcon sx={{ color: "#388e3c" }} />;
        default: return <InfoIcon />;
    }
};


const NotificationItem: FC<NotificationItemProps> = ({ notification }) => (
    <ListItem sx={{ bgcolor: "#e3f2fd", borderBottom: "1px solid #f0f0f0" }} >
        <ListItemAvatar>
            <Avatar sx={{ bgcolor: "transparent" }}>
                {getIcon(notification.type)}
            </Avatar>
        </ListItemAvatar>
        <ListItemText primary={
            <Typography variant="subtitle1" fontWeight="bold">
                {notification.title}
            </Typography>} />
    </ListItem>
);

export default NotificationItem;
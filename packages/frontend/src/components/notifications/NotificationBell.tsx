import { Badge, IconButton } from "@mui/material";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { FC } from "react";
import { currentUser } from '../../features/user/userSlice';
import { useSelector } from "react-redux";


interface NotificationBellProps {
    unreadCount: number;
    onClick: (event: React.MouseEvent<HTMLElement>) => void;
}

const NotificationBell: FC<NotificationBellProps> = ({ unreadCount, onClick }) => {
    const user = useSelector(currentUser);
    return (
        <>
            {user ? (
                <IconButton color="inherit" onClick={onClick} sx={{ color: 'text.secondary' }}>
                    <Badge badgeContent={unreadCount} color="error">
                        <NotificationsIcon />
                    </Badge>
                </IconButton>
            ) : null}
        </>
    );
};

export default NotificationBell;
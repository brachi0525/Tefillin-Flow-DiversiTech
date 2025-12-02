import { useState } from "react";
import NotificationBell from "./NotificationBell";
import NotificationDetailsPanel from "./NotificationDetailsPanel";
import NotificationList from "./NotificationList";
import { useNotifications } from "./useNotifications";





const Notifications = () => {
    const { notifications, unreadCount, markAsRead } = useNotifications();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [detailsOpen, setDetailsOpen] = useState(false);

    const handleBellClick = (event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget);
    const handlePopoverClose = () => setAnchorEl(null);
    const handleShowDetails = () => setDetailsOpen(true);
    const handleDetailsClose = () => setDetailsOpen(false);
    const handleDetailsOpen = () => setDetailsOpen(true);

    return (

        <>
            <NotificationBell unreadCount={unreadCount} onClick={handleBellClick} />
            <NotificationList
                anchorEl={anchorEl}
                notifications={notifications}
                onClose={handlePopoverClose}
                onShowAll={handleShowDetails}
            />
            <NotificationDetailsPanel
                open={detailsOpen}
                notifications={notifications}
                onClose={handleDetailsClose}
                onOpen={handleDetailsOpen}
                onMarkAsRead={markAsRead}
            />
        </>
    )
}
export default Notifications;
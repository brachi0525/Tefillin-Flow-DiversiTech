import { Alert, Button, Snackbar } from "@mui/material"
import { useState } from "react";
import PhoneIcon from '@mui/icons-material/Phone';

const isMobile = () => {
    return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(navigator.userAgent);
};

interface phoneProps {
    phoneNumber: string;
    label: any;
}

const PhoneButton = ({ phoneNumber, label }: phoneProps) => {
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handlePhoneCall = (phoneNumber: string) => {
        if (isMobile()) {
            window.location.href = `tel:${phoneNumber}`;
        } else {
            setOpenSnackbar(true);
        }
    };

    return (
        <div>
            <Button
                sx={{
                    color: 'text.primary', fontWeight: 'normal', backgroundColor: 'transparent',
                    boxShadow: 'none',
                    ":hover": {
                        textDecoration: 'underline',
                        backgroundColor: 'transparent',
                        boxShadow: 'none'
                    },
                }}
                onClick={() => handlePhoneCall(phoneNumber)}
                variant="text"
            >
                {label}
            </Button>
            <Snackbar
                open={openSnackbar}
                autoHideDuration={4000}
                onClose={() => setOpenSnackbar(false)}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert severity="warning" onClose={() => setOpenSnackbar(false)} sx={{ width: '100%' }}>
                    לא ניתן להתחבר לאפליקציית טלפון ממחשב זה.
                </Alert>
            </Snackbar>
        </div>
    )
}

export default PhoneButton
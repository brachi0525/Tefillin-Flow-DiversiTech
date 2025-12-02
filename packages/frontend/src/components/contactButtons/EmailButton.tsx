import { Button } from "@mui/material";
import EmailIcon from '@mui/icons-material/Email';

interface emailProps {
    email: string | undefined;
    label: any;
}

const EmailButton = ({ email, label }: emailProps) => {
    const handleEmailClick = (email: string | undefined) => {
        window.location.href = `mailto:${email}`;
    };
    return (
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
            onClick={() => handleEmailClick(email)}
            variant="text"
        >
            {label}
        </Button>
    )
}

export default EmailButton
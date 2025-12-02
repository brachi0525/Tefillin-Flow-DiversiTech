import { Button, Dialog, DialogContent, DialogTitle, IconButton, Stack, TextField } from "@mui/material";
import { useState } from "react";
import SendIcon from '@mui/icons-material/Send';
import Paper from '@mui/material/Paper';
import InputBase from '@mui/material/InputBase';
import { useGetAllMessages } from "../../services/messageService";
import WhatsAppIcon from '@mui/icons-material/WhatsApp';

interface whatsAppProps {
    phoneNumber: string | undefined;
    label: any;
}

const WhatsAppButton = ({ phoneNumber,label }: whatsAppProps) => {

    const [openDialog, setOpenDialog] = useState(false);
    const [messageInput, setMessageInput] = useState('');

    const handleInputChange = (event: any) => {
        setMessageInput(event.target.value);
    };
    const messages = useGetAllMessages().data || [];

    const handleWhatsAppMenuClick = () => {
        console.log("WhatsApp menu option selected. Attempting to open dialog.");
        setOpenDialog(true);
        console.log("openDialog state set to true.");
    };

    const handleSelectMessage = (message: string) => {
        alert(`Message selected from dialog: "${message}". Opening WhatsApp.`);
        setOpenDialog(false);
        const encoded = encodeURIComponent(message);
        const normalizedNumber = normalizePhoneNumber(phoneNumber || '');
        window.open(`https://wa.me/${normalizedNumber}?text=${encoded}`, '_blank');
    };

    const normalizePhoneNumber = (phone: string): string => {
    let cleaned = phone.trim();
    if (cleaned.startsWith('972')) {
        return cleaned;
    }
    if (cleaned.startsWith('0')) {
        return '972' + cleaned.slice(1);
    }
    return cleaned; 
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
                onClick={() => handleWhatsAppMenuClick()}
                variant="text"
            >
                {/* <WhatsAppIcon sx={{ color: '#25D366' }} /> */}
                {label}
            </Button>
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} fullWidth maxWidth="xs">
                <DialogTitle align="center">בחר הודעת וואטסאפ</DialogTitle>
                <DialogContent>
                    <Stack spacing={2}>
                        {messages.map((msg, idx) => (
                            <Button
                                key={idx}
                                variant="outlined"
                                fullWidth
                                onClick={() => handleSelectMessage(msg.content)}
                            >
                                {msg.title}
                            </Button>
                        ))}
                        <div>
                            <Paper
                                component="form"
                                sx={{
                                    display: 'flex', alignItems: 'center', width: 400, border: '1px solid',
                                    borderColor: 'primary.main', boxShadow: 'none', borderRadius: '15px'
                                }}
                            >
                                <InputBase
                                    name="messageInput"
                                    sx={{ ml: 1, flex: 1, color: 'primary.main' }}
                                    placeholder="הודעה מותאמת אישית"
                                    onChange={e => handleInputChange(e)}
                                />
                                < IconButton type="button" sx={{ p: '10px', color: '#primary.main' }}  onClick={() => handleSelectMessage(messageInput)}>
                                    <SendIcon sx={{ color: '' }} />
                                </IconButton>
                            </Paper>
                        </div>
                    </Stack>
                </DialogContent>
            </Dialog>
        </div >
    )
}

export default WhatsAppButton
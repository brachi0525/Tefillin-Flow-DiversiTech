import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Zoom,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CloseIcon from '@mui/icons-material/Close';
import QRScanner from '../qr/QRScanner';
import { useDirection } from '../../hooks/useDirection';
const FloatingQRButton = () => {
  const [open, setOpen] = useState(false);
  const [visible, setVisible] = useState(true);
  const { isRTL } = useDirection();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <Zoom in={visible}>
        <Tooltip
          title="סרוק ברקוד תפילין"
          placement={isRTL ? 'left' : 'right'}
          arrow
          componentsProps={{
            tooltip: {
              sx: {
                backgroundColor: '#1B5E20',
                color: '#FFFFFF',
                fontSize: '0.875rem',
                fontWeight: 500,
                '& .MuiTooltip-arrow': {
                  color: '#1B5E20',
                },
              },
            },
          }}
        >
          <button
            onClick={handleClickOpen}
            aria-label="סרוק ברקוד תפילין"
            className={`fixed bottom-6 ${
              isRTL ? 'right-6' : 'left-6'
            } z-[1200] flex items-center justify-center rounded-full bg-green-700 text-white shadow-lg transition-all duration-300 ease-in-out hover:bg-green-800 hover:scale-105 active:scale-95 animate-[float_3s_ease-in-out_infinite] ${
              isMobile ? 'w-12 h-12 text-[1.2rem]' : 'w-14 h-14 text-[1.5rem]'
            }`}
          >
            <QrCodeScannerIcon fontSize="inherit" />
          </button>
        </Tooltip>
      </Zoom>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            direction: isRTL ? 'rtl' : 'ltr',
          },
        }}
      >
        <DialogTitle
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: '#2E7D32',
            color: '#FFFFFF',
            fontWeight: 'bold',
          }}
        >
          סריקת ברקוד תפילין
          <IconButton onClick={handleClose} size="small" sx={{ color: 'inherit' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0 }}>
          <QRScanner />
        </DialogContent>
      </Dialog>
      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </>
  );
};
export default FloatingQRButton;
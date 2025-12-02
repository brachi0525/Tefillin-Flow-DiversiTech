import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Box, Typography, Button, Fade } from "@mui/material";
import { useNavigate } from "react-router-dom";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import { useTheme } from "@mui/material/styles";
const QRScanner: React.FC = () => {
  const theme = useTheme();
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const timeoutRef = useRef<number | null>(null);
  const [detected, setDetected] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [started, setStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const stopScanner = async () => {
    try {
      await scannerRef.current?.stop();
      await scannerRef.current?.clear();
    } catch (err) {
      console.error("Error stopping scanner:", err);
    }
  };
  const resetTimeout = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };
  useEffect(() => {
    if (!started) return;
    setError(null);
    const scanner = new Html5Qrcode("reader");
    scannerRef.current = scanner;
    scanner
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 200, height: 200 } },
        (decodedText) => {
          setDetected(true);
          setIsScanning(false);
          stopScanner();
          setTimeout(() => {
            if (decodedText.startsWith("http")) {
              window.location.href = decodedText;
            } else {
              navigate(decodedText);
            }
          }, 300);
        },
        () => {
          setIsScanning(true);
          resetTimeout();
          timeoutRef.current = window.setTimeout(() => setIsScanning(false), 300);
        }
      )
      .catch((err: any) => {
        console.error("Error starting scanner:", err);
        if (
          err.name === "NotAllowedError" ||
          (typeof err.message === "string" && err.message.toLowerCase().includes("permission"))
        ) {
          setError("Camera access was denied. Please allow access to the camera to scan QR.");
        } else if (
          err.name === "NotFoundError" ||
          (typeof err.message === "string" && err.message.toLowerCase().includes("not found"))
        ) {
          setError("No active camera found on the device.");
        } else {
          setError("An error occurred while starting the camera.");
        }
      });
    return () => {
      resetTimeout();
      stopScanner();
    };
  }, [started, navigate]);
  const getStatus = () => {
    if (error) return { color: theme.palette.error.main, text: error };
    if (detected) return { color: theme.palette.primary.main, text: "Successfully detected!" };
    if (isScanning) return { color: theme.palette.secondary.main, text: "Scanning..." };
    return { color: theme.palette.text.secondary, text: "Ready to scan" };
  };
  const status = getStatus();
  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2} p={2}>
      {!started ? (
        <Button
          variant="contained"
          color="primary"
          startIcon={<CameraAltIcon />}
          onClick={() => setStarted(true)}
          sx={{ fontWeight: "bold", borderRadius: "20px", px: 3, py: 1 }}
        >
          Start Scanning
        </Button>
      ) : (
        <>
          <Box
            width={280}
            height={280}
            border={`4px solid ${
              error ? theme.palette.error.main : theme.palette.primary.main
            }`}
            borderRadius="12px"
            position="relative"
            bgcolor={theme.palette.background.paper}
            boxShadow={`0 0 12px ${
              error
                ? theme.palette.error.main + "66"
                : theme.palette.primary.main + "66"
            }`}
            overflow="hidden"
          >
            <Box
              id="reader"
              sx={{
                width: "100%",
                height: "100%",
                "& video": {
                  width: "100% !important",
                  height: "100% !important",
                  objectFit: "cover",
                },
              }}
            />
            <Fade in={detected} timeout={300}>
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bgcolor={`${theme.palette.primary.main}33`}
                display="flex"
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  width={60}
                  height={60}
                  borderRadius="50%"
                  bgcolor={theme.palette.primary.main}
                  color={theme.palette.getContrastText(theme.palette.primary.main)}
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize={24}
                  fontWeight="bold"
                  boxShadow={`0 0 20px ${theme.palette.primary.main}99`}
                >
                  ✓
                </Box>
              </Box>
            </Fade>
          </Box>
          <Typography variant="body2" color="text.secondary" textAlign="center">
            Place the QR code in the center of the frame
          </Typography>
          <Box
            display="flex"
            alignItems="center"
            gap={1}
            px={2}
            py={1}
            borderRadius={20}
            border={`1px solid ${status.color}44`}
            bgcolor={`${status.color}22`}
          >
            <Box width={8} height={8} borderRadius="50%" bgcolor={status.color} />
            <Typography variant="caption" fontWeight={500} color={status.color}>
              {status.text}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
};
export default QRScanner;

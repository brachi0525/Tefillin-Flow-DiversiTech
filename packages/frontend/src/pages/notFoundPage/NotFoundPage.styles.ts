import { styled, keyframes } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

const float = keyframes`
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-15px) rotate(3deg); }
`;

const fadeInUp = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const orbFloat = keyframes`
  0%, 100% { transform: translate(0, 0) scale(1); }
  33% { transform: translate(20px, -20px) scale(1.05); }
  66% { transform: translate(-15px, 15px) scale(0.95); }
`;

export const NotFoundWrapper = styled(Box)(({ theme }) => ({
  height: '100vh',
  width: '100vw',
  minWidth: '320px',
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%, 
    ${theme.palette.mode === 'dark' ? '#1a1a2e' : '#f8fafc'} 100%)`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  position: 'fixed',
  top: 0,
  left: 0,
  overflow: 'hidden',
  direction: theme.direction,
}));

export const GradientOrb = styled('div')(({ theme }) => ({
  position: 'absolute',
  borderRadius: '50%',
  background: `linear-gradient(45deg, 
    ${theme.palette.primary.main}15, 
    ${theme.palette.secondary.main}15)`,
  filter: 'blur(30px)',
  animation: `${orbFloat} 8s ease-in-out infinite`,
  
  '&.orb-1': {
    width: 'clamp(200px, 20vw, 250px)',
    height: 'clamp(200px, 20vw, 250px)',
    top: '5%',
    left: '5%',
    animationDelay: '0s',
  },
  '&.orb-2': {
    width: 'clamp(150px, 15vw, 180px)',
    height: 'clamp(150px, 15vw, 180px)',
    top: '60%',
    right: '10%',
    animationDelay: '2s',
  },
  '&.orb-3': {
    width: 'clamp(100px, 12vw, 120px)',
    height: 'clamp(100px, 12vw, 120px)',
    bottom: '15%',
    left: '15%',
    animationDelay: '4s',
  },
}));

export const NotFoundContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '74%',
  height: '100%',
  position: 'relative',
  zIndex: 2,
  animation: `${fadeInUp} 0.8s ease-out`,
}));

export const NotFoundIllustration = styled(Box)(() => ({
  position: 'relative',
  width: 'clamp(200px, 40vw, 300px)',
  height: 'clamp(120px, 20vh, 180px)',
  marginBottom: 'clamp(16px, 3vh, 32px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

export const FloatingElement = styled('div')(({ theme }) => ({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 16,
  fontWeight: 700,
  userSelect: 'none',
  
  '&.float-1': {
    fontSize: 'clamp(2.5rem, 8vw, 4rem)',
    color: theme.palette.primary.main,
    background: `linear-gradient(135deg, 
      ${theme.palette.background.paper}, 
      ${theme.palette.background.default})`,
    padding: 'clamp(12px, 2vw, 24px) clamp(20px, 3vw, 40px)',
    boxShadow: theme.shadows[8],
    animation: `${float} 3s ease-in-out infinite`,
    zIndex: 3,
  },
}));

export const NotFoundContent = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  background: theme.palette.background.paper,
  borderRadius: 'clamp(16px, 3vw, 24px)',
  padding: 'clamp(24px, 5vw, 48px) clamp(20px, 4vw, 32px)', 
  boxShadow: theme.shadows[12],
  border: `1px solid ${theme.palette.divider}`,
  backdropFilter: 'blur(10px)',
  width: '100%',
  maxHeight: '75vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
}));

export const NotFoundTitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1.8rem, 5vw, 3rem)',
  fontWeight: 800,
  color: theme.palette.text.primary,
  marginBottom: 'clamp(12px, 2vh, 24px)',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.secondary.main})`,
  backgroundClip: 'text',
  WebkitBackgroundClip: 'text',
  WebkitTextFillColor: 'transparent',
  lineHeight: 1.3,
}));

export const NotFoundSubtitle = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(1rem, 3vw, 1.4rem)',
  fontWeight: 600,
  color: theme.palette.text.primary,
  marginBottom: 'clamp(12px, 2vh, 24px)',
  lineHeight: 1.4,
}));

export const NotFoundDescription = styled(Typography)(({ theme }) => ({
  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
  color: theme.palette.text.secondary,
  lineHeight: 1.6,
  marginBottom: 'clamp(24px, 4vh, 48px)',
  maxWidth: 'min(100%, 500px)',
  margin: `0 auto clamp(24px, 4vh, 48px) auto`,
}));

export const NotFoundActions = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: 'clamp(12px, 2vw, 24px)',
  justifyContent: 'center',
  flexWrap: 'wrap',
  width: '100%',
  
  [theme.breakpoints.down('sm')]: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 'clamp(12px, 3vw, 16px)',
  },
}));

export const NotFoundButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 700,
  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
  padding: 'clamp(12px, 2vh, 16px) clamp(24px, 4vw, 32px)',
  background: `linear-gradient(135deg, 
    ${theme.palette.primary.main}, 
    ${theme.palette.primary.dark})`,
  boxShadow: theme.shadows[4],
  textTransform: 'none',
  transition: 'all 0.3s ease',
  minWidth: 'clamp(160px, 30vw, 200px)',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: theme.shadows[8],
  },
  
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: 280, 
  },
}));

export const NotFoundSecondaryButton = styled(Button)(({ theme }) => ({
  borderRadius: 12,
  fontWeight: 600,
  fontSize: 'clamp(0.9rem, 2.5vw, 1.1rem)',
  padding: 'clamp(12px, 2vh, 16px) clamp(24px, 4vw, 32px)',
  borderColor: theme.palette.primary.main,
  color: theme.palette.primary.main,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  minWidth: 'clamp(160px, 30vw, 200px)',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    backgroundColor: `${theme.palette.primary.main}08`,
  },
  
  [theme.breakpoints.down('sm')]: {
    width: '100%',
    maxWidth: 280,
  },
}));

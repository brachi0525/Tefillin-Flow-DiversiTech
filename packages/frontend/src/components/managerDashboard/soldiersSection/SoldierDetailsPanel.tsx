import { Box, Typography, IconButton, Chip, List, ListItem, ListItemText, ListItemIcon, Paper, TextField, Button, Card } from '@mui/material';
import { Close, Person, Phone, Email, Home, PanTool, AccountCircle, LocationOn, ContactPhone, FamilyRestroom, Schedule, Assignment, EditCalendar, EventAvailable, WhatsApp, Comment, CheckCircle, Inventory2, CalendarToday } from '@mui/icons-material';
import { Soldier, SoldierStatus, StatusChange } from '../../../features/soldier/soldierTypes';
import { useState } from 'react';
import { SoldierComment } from '../../../../../../types/comments';
import PhoneButton from '../../contactButtons/PhoneButton';
import WhatsAppButton from '../../contactButtons/WhatsAppButton';
import EmailButton from '../../contactButtons/EmailButton';
import  ImageGallery  from '../../imageProcessing/imageGallery';
import { soldierStatusLabels } from '../../../constants/soldierStatusLabels';

const STATUS_STEPS = Object.entries(soldierStatusLabels).map(([value, { label, icon }]) => ({
  label,
  value,
  icon,
}));

type StatusStepIconProps = {
  iconType: React.ElementType;
  isCompleted: boolean;
  isActive: boolean;
  isMobile: boolean;
};


type StatusHistoryMap = {
  [key: string]: {
    date: Date;
    user_name?: string;
  };
};


const StatusStepIcon: React.FC<StatusStepIconProps> = ({ iconType: IconType, isCompleted, isActive, isMobile }) => {
  const getColor = () => {
    if (isActive) return '#43a047'; // ירוק
    if (isCompleted) return '#1976d2'; // כחול
    return '#9e9e9e'; // אפור
  };

  const bgColor = getColor();
  const circleSize = isActive ? (isMobile ? 32 : 40) : (isMobile ? 24 : 30);
  const iconSize = isActive ? (isMobile ? 18 : 24) : (isMobile ? 14 : 18);

  return (
    <Box
      sx={{
        width: circleSize,
        height: circleSize,
        borderRadius: '50%',
        backgroundColor: bgColor,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 1,
      }}
    >
      <IconType sx={{ color: '#fff', fontSize: iconSize }} />
    </Box>
  );
};


const renderStatusSteps = (activeStep: number, statusHistoryMap: StatusHistoryMap) => {
  return STATUS_STEPS.map((step, idx) => {
    const isCompleted = idx < activeStep;
    const isActive = idx === activeStep;
    const historyItem = statusHistoryMap[step.value];
    const dateStr = historyItem ? new Date(historyItem.date).toLocaleDateString('he-IL') : '';
    const userName = historyItem?.user_name || '';

    return (
      <Box key={step.label} sx={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
        <StatusStepIcon iconType={step.icon} isCompleted={isCompleted} isActive={isActive} isMobile={false} />
        <Typography variant="body2" fontWeight="bold">{step.label}</Typography>
        {dateStr && <Typography variant="caption" color="text.secondary">{dateStr}</Typography>}
        {userName && <Typography variant="caption" color="text.secondary">{userName}</Typography>}
      </Box>
    );
  });
};


type SoldierDetailsPanelProps = {
  selected: Soldier | null;
  onDrawerClose: () => void;
  open: boolean;
};

type InfoItem = {
  icon?: React.ReactNode;
  primary: string;
  secondary?: any;
};

type InfoSectionProps = {
  title: string;
  items: InfoItem[];
};


const InfoSection: React.FC<InfoSectionProps> = ({ title, items }) => (
  <Paper elevation={1} sx={{ marginBottom: '12px', marginTop: '12px', textAlign: 'right', padding: 2 }}>
    <Typography variant="h6" gutterBottom sx={{
      fontSize: { xs: '1rem', sm: '1.25rem' },
      textAlign: 'right',
      fontWeight: 'bold',
      color: 'primary.main',
    }}>
      {title}
    </Typography>
    <List dense sx={{ padding: 0 }}>
      {items.map((item, index) => (
        <ListItem key={index} >
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={<Typography variant="body1" sx={{ fontWeight: 'bold' }}>{item.primary}</Typography>}
            secondary={item.secondary}
            sx={{ textAlign: 'right' }} />
        </ListItem>
      ))}
    </List>
  </Paper>
);

const SoldierDetailsPanel: React.FC<SoldierDetailsPanelProps> = ({ selected, onDrawerClose }) => {
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState<SoldierComment[]>(selected?.comments || []);

  const handleAddComment = () => {
    if (!newComment.trim()) return;
    const comment: SoldierComment = {
      id: Math.random().toString(36).slice(2),
      // userID: 'me',
      soldierID: selected?.id || '',
      content: newComment,
      visibleToAll: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setComments([...comments, comment]);
    setNewComment('');
  };


  if (!selected) return null;

  const filteredComments = comments.filter(comment => comment.soldierID === selected.id);


  const activeStep = STATUS_STEPS.findIndex(
    (step) => step.value === selected.currentStatus
  );
  const statusHistoryMap: { [key: string]: StatusChange } = {};
  (selected?.statusHistory || []).forEach((s: StatusChange) => {
    statusHistoryMap[s.status] = s;
  });



  const personalInfoItems: InfoItem[] = [
    //
    { icon: <Person fontSize="small" />, primary: "שם מלא", secondary: selected.name },
    { icon: <Phone fontSize="small" />, primary: "טלפון", secondary: <PhoneButton phoneNumber={selected.phone} label={selected.phone} /> },
    { icon: <WhatsApp fontSize="small" />, primary: "וואצאפ", secondary: <WhatsAppButton phoneNumber={selected.phone} label={selected.phone} /> },
    ...(selected.email ? [{ icon: <Email fontSize="small" />, primary: "אימייל", secondary: <EmailButton email={selected.email} label={selected.email} /> }] : []),
    { icon: <Home fontSize="small" />, primary: "כתובת", secondary: selected.address },
    { icon: <PanTool fontSize="small" />, primary: "יד דומיננטית", secondary: selected.dominantHand === 'left' ? 'שמאל' : 'ימין' },
    ...(selected.mothersName ? [{ icon: <FamilyRestroom fontSize="small" />, primary: "שם האם", secondary: selected.mothersName }] : []),
  ].filter(Boolean);

  const formFillerItems: InfoItem[] = [
    ...(selected.formFillerName ? [{ icon: <AccountCircle fontSize="small" />, primary: "שם הממלא", secondary: selected.formFillerName }] : []),
    ...(selected.formFillerPhone ? [{ icon: <ContactPhone fontSize="small" />, primary: "טלפון הממלא", secondary: selected.formFillerPhone }] : []),
    ...(selected.formFillerRelationship ? [{ icon: <FamilyRestroom fontSize="small" />, primary: "קרבה", secondary: selected.formFillerRelationship }] : []),
  ];
  const additionalInfoItems: InfoItem[] = [
    ...(selected.locationId ? [{ icon: <LocationOn fontSize="small" />, primary: "מיקום", secondary: selected.locationId }] : []),
    ...(selected.tefillinId ? [{ icon: <Assignment fontSize="small" />, primary: "תפילין מוקצה", secondary: selected.tefillinId }] : []),
    ...(selected.lastContactDate ? [{ icon: <Schedule fontSize="small" />, primary: "יצירת קשר אחרון", secondary: new Date(selected.lastContactDate).toLocaleDateString('he-IL') }] : []),
    ...(selected.nextContactDate ? [{ icon: <Schedule fontSize="small" />, primary: "יצירת קשר הבא", secondary: new Date(selected.nextContactDate).toLocaleDateString('he-IL') }] : []),
  ];

  const systemInfoItems: InfoItem[] = [
    ...(selected.createdAt ? [{ icon: <EventAvailable fontSize="small" />, primary: "תאריך הרשמה", secondary: new Date(selected.createdAt).toLocaleDateString('he-IL') }] : []),
    ...(selected.updatedAt ? [{ icon: <EditCalendar fontSize="small" />, primary: "עדכון אחרון", secondary: new Date(selected.updatedAt).toLocaleDateString('he-IL') }] : []),
  ];


  const commentItems: InfoItem[] = filteredComments.length === 0
    ? [{ icon: <Comment fontSize="small" />, primary: "אין הערות" }]
    : filteredComments.map(comment => ({
      icon: <Comment fontSize="small" />,
      primary: comment.content,
      secondary: new Date(comment.createdAt).toLocaleString('he-IL'),
    }));


  return (
    <Box sx={{ direction: 'rtl', padding: '2rem' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <IconButton onClick={onDrawerClose}>
          <Close />
        </IconButton>
      </Box>
      <Card>
        <Box sx={{ position: 'relative', width: '100%', mb: 0.2, paddingTop: 2 }}>
          <Box sx={{ position: 'absolute', left: 0, right: 0, height: 2, bgcolor: 'text.secondary', zIndex: 1, width: '100%', top: 32 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', direction: 'rtl', position: 'relative', width: '100%', zIndex: 2 }}>
            {renderStatusSteps(activeStep, statusHistoryMap)}
          </Box>
        </Box>
      </Card>
      <InfoSection title="מידע אישי" items={personalInfoItems} />
      {(selected.formFillerName || selected.formFillerPhone) && <InfoSection title="פרטי מילוי הטופס" items={formFillerItems} />}
      {(selected.locationId || selected.tefillinId || selected.lastContactDate || selected.nextContactDate) && <InfoSection title="מידע נוסף" items={additionalInfoItems} />}
      <InfoSection title="מידע מערכת" items={systemInfoItems} />
      <InfoSection title="הערות" items={commentItems} />      
      {selected.currentStatus === SoldierStatus.RECEIVED && <ImageGallery soldier_id= {selected.id} />}

      <Paper elevation={1} sx={{ position: 'sticky', bottom: 0 }}>
        <Box display="flex" gap={0.2} mt={2} sx={{ padding: 2 }}>
          <TextField
            label="הוסף הערה"
            value={newComment}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewComment(e.target.value)}
            fullWidth
            size="small"
          />
          <Button variant="contained" onClick={handleAddComment}>
            הוסף
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default SoldierDetailsPanel;
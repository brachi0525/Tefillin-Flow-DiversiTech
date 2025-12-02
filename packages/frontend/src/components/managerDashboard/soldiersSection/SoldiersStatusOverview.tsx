import React from 'react';
import { Card, Typography, Box, useTheme, Avatar, LinearProgress, Tooltip, useMediaQuery } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ScheduleIcon from '@mui/icons-material/Schedule';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssignmentIcon from '@mui/icons-material/Assignment';
import RedeemIcon from '@mui/icons-material/Redeem';
import PeopleIcon from '@mui/icons-material/People'
import { SoldierStatus } from '../../../features/soldier/soldierTypes';

interface StatusOverviewProps {
  statusCounts: {
    [key in SoldierStatus]: number;
  };
  totalSoldiers: number;
}

const statusItems: { status: SoldierStatus; label: string; icon: React.ReactNode }[] = [
  {
    status: 'registered' as SoldierStatus,
    label: 'נרשמו',
    icon: <AssignmentIcon fontSize="large" />,
  },
  {
    status: 'approved' as SoldierStatus,
    label: 'מאושרים',
    icon: <CheckCircleIcon fontSize="large" />,
  },
  {
    status: 'paid' as SoldierStatus,
    label: 'ביצעו תשלום',
    icon: <AttachMoneyIcon fontSize="large" />,
  },
  {
    status: 'scheduled' as SoldierStatus,
    label: 'מתוזמנים',
    icon: <ScheduleIcon fontSize="large" />,
  },
  {
    status: 'received' as SoldierStatus,
    label: 'קיבלו תפילין',
    icon: <RedeemIcon fontSize="large" />,
  },
];

const StatusOverview: React.FC<StatusOverviewProps> = ({ statusCounts, totalSoldiers }) => {

  console.log("StatusOverview rendered with statusCounts:", statusCounts, "and totalSoldiers:", totalSoldiers);


  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const cardColor = theme.palette.primary.main;
  const cardBg = theme.palette.grey[50];

  return (
    <Box
      sx={{ display: 'flex', gap: '1rem', margin: '1rem', flexDirection: isMobile ? 'column' : 'row', bgcolor: theme.palette.background.default }}
    >
      <Tooltip key='all' title='הכל' arrow>
        <Card elevation={2}
          sx={{
            borderRadius: 3,
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            padding: 2,
            bgcolor: cardBg,
            border: `1.5px solid ${cardColor}22`,
            boxShadow: '0 2px 8px #e3e3e333',
            overflow: 'hidden',
            width: '15vw',
            justifyContent: 'center',
          }}>
          <Avatar
            sx={{
              bgcolor: theme.palette.background.default,
              color: cardColor,
              width: 40,
              height: 40,
              mr: 2,
              boxShadow: 1,
              textAlign: 'center'
            }}
          >
            {<PeopleIcon />}
          </Avatar>
          <Box sx={{ flex: 1 }}>
            <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 0.3 }}>
              הכל
            </Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.7 }}>
              {totalSoldiers}
            </Typography>
            <LinearProgress
              variant="determinate"
              sx={{
                height: 6,
                borderRadius: 3,
                bgcolor: theme.palette.grey[200],
                [`& .MuiLinearProgress-bar`]: {
                  bgcolor: cardColor,
                },
              }}
            />
          </Box>
        </Card>
      </Tooltip>
      {statusItems.map((item) => {
        console.log("status items", item, "statusCounts[item.status]", statusCounts[item.status], "totalSoldiers", totalSoldiers);
        console.log("count scheduled", statusCounts["scheduled"]);
        
        
        const count = statusCounts[item.status] || 0;
        const percentage = totalSoldiers > 0 ? Math.round((count / totalSoldiers) * 100) : 0;
        return (
          <Tooltip key={item.status} title={item.label} arrow>
            <Card
              elevation={2}
              sx={{
                borderRadius: 3,
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                padding: 2,
                bgcolor: cardBg,
                border: `1.5px solid ${cardColor}22`,
                boxShadow: '0 2px 8px #e3e3e333',
                overflow: 'hidden',
                width: '15vw'
              }}
            >
              <Avatar
                sx={{
                  bgcolor: theme.palette.background.default,
                  color: cardColor,
                  width: 40,
                  height: 40,
                  mr: 2,
                  boxShadow: 1,
                }}
              >
                {item.icon}
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography variant="subtitle1" fontWeight={700} color="primary" sx={{ mb: 0.3 }}>
                  {item.label}
                </Typography>
                <Typography variant="body2" color="text.secondary" fontWeight={500} sx={{ mb: 0.7 }}>
                  {count} ({percentage}%)
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={percentage}
                  sx={{
                    height: 6,
                    borderRadius: 3,
                    bgcolor: theme.palette.grey[200],
                    [`& .MuiLinearProgress-bar`]: {
                      bgcolor: cardColor,
                    },
                  }}
                />
              </Box>
            </Card>
          </Tooltip>
        );
      })}
    </Box>
  );
};

export default StatusOverview;
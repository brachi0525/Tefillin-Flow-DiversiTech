import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { skipToken } from '@reduxjs/toolkit/query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';

import SearchIcon from '@mui/icons-material/Search';
import PersonIcon from '@mui/icons-material/Person';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import AssignmentIcon from '@mui/icons-material/Assignment';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';
import MilitaryTechIcon from '@mui/icons-material/MilitaryTech';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import CloseIcon from '@mui/icons-material/Close';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

import { Soldier, SoldierStatus } from '../../features/soldier/soldierTypes';
import { DEFAULT_ROLE_CAPABILITIES, UserRole } from '../../features/user/userTypes';
import { useGetLocationById } from '../../services/locationService';
import { useGetMediaByTefillinId, useGetMediaGalleryByTefillinId } from '../../services/media/mediaService';
import TefillinMediaUploader from '../mediaProcessing/TefillinMediaUploader';
import { CircularProgress } from '@mui/material';
import CardMedia from '@mui/material/CardMedia';
import Modal from '@mui/material/Modal';
import IconButton from '@mui/material/IconButton';
import DeliveryCompletedButton from '../rabbiDashbord/DeliveryCompletedButton';
import TefillinGallery from './TefillinGallery';
import { useGetTefillinById } from '../../services/tefillinService';
import { useGetSoldierByTefillinId, useGetSoldiersByStatus, useUpdateSoldierTefillinId } from '../../services/soldierService ';

function getCurrentUser() {
    const token = localStorage.getItem('token');
    if (!token) return null;
    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        return {
            id: payload.id,
            role: payload.role as UserRole,
            capabilities: DEFAULT_ROLE_CAPABILITIES[payload.role as UserRole] || [],
        };
    } catch {
        return null;
    }
}

const TefillinDetails = () => {
    const user = getCurrentUser();
    const { id } = useParams<{ id: string }>();
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedSoldier, setSelectedSoldier] = useState<Soldier | null>(null);
    const [openModal, setOpenModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);
    const [showDeliveryButton, setShowDeliveryButton] = useState(false);

    const parentFolderId = "1nzoj_jvJYGdps5HzKulKmfi54pw06l6j"
    const subFolderId = id || ""


    const [assignTefillinToSoldier] = useUpdateSoldierTefillinId();
    const { data: tefillin, isLoading: isTefillinLoading, isError: isTefillinError } = useGetTefillinById(id!);
    const { data: soldierData, refetch: refetchSoldierData } = useGetSoldierByTefillinId(tefillin?.id ?? skipToken);
    const { data: paidSoldiers, refetch: refetchPaidSoldiers } = useGetSoldiersByStatus(SoldierStatus.PAID);
    const { data: location } = useGetLocationById(tefillin?.locationId ?? skipToken);
    const { getMedia, data: mediaItems, isLoading: isMediaLoading } = useGetMediaByTefillinId(parentFolderId, subFolderId);
    const { getMediaGallery, data: mediaGallery, isLoading: isLoading } = useGetMediaGalleryByTefillinId(subFolderId);
    useEffect(() => {
        const fetchMedia = async () => {
            if (parentFolderId && subFolderId) {
                try {
                    await getMedia();
                } catch (error) {
                    console.error('Error fetching media:', error);
                }
            }
        };

        fetchMedia();
    }, [parentFolderId, subFolderId]);

    useEffect(() => {
        if (subFolderId) {
            getMediaGallery(subFolderId);
        }
    }, [subFolderId]);



    if (isLoading) return <CircularProgress />;

    if (isTefillinLoading) return <p>טוען פרטי תפילין...</p>;
    if (isTefillinError || !tefillin) return <p>שגיאה בטעינת פרטי תפילין</p>;

    const isAdmin = user?.role === UserRole.ADMINISTRATOR || user?.role === UserRole.SYSTEM_ADMIN;
    const isManager = user?.role === UserRole.MANAGER;
    const isRabbi = user?.role === UserRole.LOCATION_RABBI;

    const handleAssignTefillin = async (soldierId: string) => {
        if (!tefillin?.id) return;
        await assignTefillinToSoldier(soldierId, tefillin.id);
        setSelectedSoldier(null);
        refetchSoldierData();
        refetchPaidSoldiers();
    };

    const mappedSoldiers = paidSoldiers?.map((soldier: Soldier) => ({
        ...soldier,
        tefillinId: (soldier as any).tefillin_id || soldier.tefillinId,
    }));

    const filteredSoldiers = mappedSoldiers
        ?.filter((soldier: Soldier) => !soldier.tefillinId)
        ?.filter((soldier: Soldier) => {
            const search = searchTerm.toLowerCase();
            return (
                soldier.name.toLowerCase().includes(search) ||
                soldier.email?.toLowerCase().includes(search) ||
                soldier.phone?.toLowerCase().includes(search) ||
                soldier.address?.toLowerCase().includes(search)
            );
        });

    const handleClick = () => {
        setShowDeliveryButton(true);
    };

    
    return (
        <Box sx={{ display: 'flex', flexDirection: 'row', gap: 3, alignItems: 'flex-start' }}>
            <TefillinGallery
                mediaItems={mediaItems || []}
                mediaGallery={mediaGallery || []}
                isMediaLoading={isMediaLoading}
                isGalleryLoading={isLoading}
                isAdmin={isAdmin}
                isManager={isManager}
                id={id!}
                onMediaUpload={() => {
                    getMedia();
                    getMediaGallery(subFolderId);
                }}
            />

            <Box sx={{ flex: 1, maxWidth: 500, marginLeft: 'auto', mr: 8, mt: 4 }} dir="rtl">

                <Card
                    sx={{
                        boxShadow: 3,
                        borderRadius: 2,
                        backgroundColor: '#fafafa',
                        maxWidth: 500,
                        mx: 'auto',
                        mb: 4,
                        border: '1px solid #ddd',
                    }}
                >
                    <CardContent sx={{ p: 3 }}>
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 'bold',
                                color: '#1976d2',
                                mb: 3,
                                textAlign: 'center',
                            }}
                        >
                            פרטי תפילין
                        </Typography>

                        <Stack spacing={2}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <PersonIcon color="primary" />
                                <Typography variant="body1">
                                    <strong>שם סופר:</strong> {tefillin.scribename || 'לא צוין'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VerifiedUserIcon color="primary" />
                                <Typography variant="body1">
                                    <strong>בודק:</strong> {tefillin.checkername || 'לא צוין'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <AssignmentIcon color="primary" />
                                <Typography variant="body1">
                                    <strong>סטטוס:</strong> {tefillin.status || 'לא צוין'}
                                </Typography>
                            </Box>

                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <VolunteerActivismIcon color="primary" />
                                <Typography variant="body1">
                                    <strong>תורם:</strong> {tefillin.donorname || 'אנונימי'}
                                </Typography>
                            </Box>

                            {soldierData?.name && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <MilitaryTechIcon color="primary" />
                                    <Typography variant="body1">
                                        <strong>חייל:</strong> {soldierData.name}
                                    </Typography>
                                </Box>
                            )}

                            {location?.address && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                    <LocationOnIcon color="primary" />
                                    <Typography variant="body1">
                                        <strong>מיקום:</strong> {`${location.address.street}, ${location.address.city}, ${location.address.country}`}
                                    </Typography>
                                </Box>
                            )}
                        </Stack>
                    </CardContent>
                </Card>

                {!soldierData && (isAdmin || isManager) && (
                    <Card
                        sx={{
                            maxWidth: 500,
                            mx: 'auto',
                            boxShadow: 3,
                            borderRadius: 2,
                            pb: 2,
                            backgroundColor: '#e3f2fd',
                        }}
                    >
                        <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#0d47a1' }}>
                                שיוך חייל לתפילין
                            </Typography>
                            <Typography variant="body2" sx={{ mb: 2, color: 'text.secondary' }}>
                                בחר חייל מרשימת החיילים ששילמו ועדיין לא משויך לתפילין
                            </Typography>

                            <TextField
                                fullWidth
                                placeholder="חיפוש לפי שם, כתובת, טלפון..."
                                variant="outlined"
                                size="small"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon />
                                        </InputAdornment>
                                    ),
                                    sx: { borderRadius: '8px', backgroundColor: "white" },
                                }}
                                sx={{ mb: 2 }}
                            />

                            <Box sx={{ maxHeight: 230, overflowY: 'auto', pr: 1, mb: 2 }}>
                                {filteredSoldiers && filteredSoldiers.length > 0 ? (
                                    filteredSoldiers.map((soldier: Soldier) => {
                                        const isSelected = selectedSoldier?.id === soldier.id;
                                        return (
                                            <Card
                                                key={soldier.id}
                                                onClick={() => setSelectedSoldier(soldier)}
                                                sx={{
                                                    mb: 1.5,
                                                    cursor: 'pointer',
                                                    boxShadow: isSelected ? 6 : 1,
                                                    borderRadius: 2,
                                                    p: 2,
                                                    display: 'flex',
                                                    flexDirection: 'column',
                                                    alignItems: 'flex-start',
                                                    direction: 'rtl',
                                                    borderRight: isSelected ? '5px solid #1976d2' : '5px solid transparent',
                                                    backgroundColor: isSelected ? '#bbdefb' : '#fff',
                                                    transition: '0.3s',
                                                }}
                                            >
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', mb: 1 }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexDirection: 'row-reverse' }}>
                                                        <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                                                            {soldier.name}
                                                        </Typography>
                                                        <Avatar sx={{ bgcolor: '#1976d2', width: 28, height: 28 }}>
                                                            <PersonOutlineIcon sx={{ fontSize: '1.2rem' }} />
                                                        </Avatar>
                                                    </Box>
                                                    {soldier.currentStatus && (
                                                        <Chip label={soldier.currentStatus} size="small" sx={{ bgcolor: '#90caf9', color: '#0d47a1' }} />
                                                    )}
                                                </Box>

                                                <Stack spacing={0.5} sx={{ width: '100%' }}>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <PhoneIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {soldier.phone || 'לא צוין טלפון'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <EmailIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            {soldier.email || 'לא צוין אימייל'}
                                                        </Typography>
                                                    </Box>
                                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                                        <CalendarMonthIcon sx={{ fontSize: '0.9rem', color: 'text.secondary' }} />
                                                        <Typography variant="body2" color="text.secondary">
                                                            שולם: {soldier.payments ? new Date(soldier.createdAt).toLocaleDateString('he-IL') : 'לא צוין'}
                                                        </Typography>
                                                    </Box>
                                                </Stack>
                                            </Card>
                                        );
                                    })
                                ) : (
                                    <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', mt: 3 }}>
                                        לא נמצאו חיילים העונים לקריטריונים.
                                    </Typography>
                                )}
                            </Box>

                            {selectedSoldier && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2 }}>
                                    <Button variant="contained" color="primary" onClick={() => handleAssignTefillin(selectedSoldier.id)}>
                                        שיוך תפילין
                                    </Button>
                                    <Button variant="outlined" color="primary" onClick={() => setSelectedSoldier(null)}>
                                        ביטול
                                    </Button>
                                </Box>
                            )}
                        </CardContent>
                    </Card>
           )}

                {(isRabbi) && (
                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
                        {!showDeliveryButton && <Button
                            variant="contained"
                            color="primary"
                            sx={{ backgroundColor: '#1976d2', ':hover': { backgroundColor: '#115293' } }}
                            onClick={handleClick}
                        >
                            למסירת תפילין
                        </Button>}
                        {soldierData && showDeliveryButton && <DeliveryCompletedButton tefillinId={tefillin.id} soldierId={soldierData.id} />}
                    </Box>
               )} 

            </Box>
        </Box>
    );
};

export default TefillinDetails;
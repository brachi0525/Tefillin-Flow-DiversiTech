import React, { useEffect, useState } from 'react';
import {
    Box,
    Card,
    CardMedia,
    Typography,
    Modal,
    IconButton,
    CircularProgress
} from '@mui/material';
import {
    PlayArrow as PlayArrowIcon,
    Close as CloseIcon,
    NavigateBefore as NavigateBeforeIcon,
    NavigateNext as NavigateNextIcon
} from '@mui/icons-material';
import TefillinMediaUploader from '../mediaProcessing/TefillinMediaUploader';

interface GallerySectionProps {
    title: string;
    mediaItems: any[];
    isLoading: boolean;
}

const GallerySection: React.FC<GallerySectionProps> = ({ title, mediaItems, isLoading }) => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(0);

    const handlePrevImage = () => {
        setSelectedImageIndex((prev) => (prev === 0 ? mediaItems.length - 1 : prev - 1));
    };

    const handleNextImage = () => {
        setSelectedImageIndex((prev) => (prev === mediaItems.length - 1 ? 0 : prev + 1));
    };

    const handleKeyPress = (event: KeyboardEvent) => {
        if (!openModal) return;
        if (event.key === 'ArrowLeft') handleNextImage();
        if (event.key === 'ArrowRight') handlePrevImage();
        if (event.key === 'Escape') setOpenModal(false);
    };

    useEffect(() => {
        window.addEventListener('keydown', handleKeyPress);
        return () => window.removeEventListener('keydown', handleKeyPress);
    }, [openModal]);

    return (
        <Card sx={{
            textAlign: 'center',
            py: 4,
            px: 2,
            borderRadius: 2,
            backgroundColor: '#fcfdff',
            boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
            mb: 3
        }}>
            <Typography variant="subtitle1" fontWeight="bold" mb={2}>{title}</Typography>

            {isLoading ? (
                <CircularProgress />
            ) : mediaItems && mediaItems.length > 0 ? (
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: 2,
                    p: 2,
                    width: '100%'
                }}>
                    {mediaItems.map((media: any, index: number) => (
                        <MediaCard
                            key={index}
                            media={media}
                            index={index}
                            onClick={() => {
                                setSelectedImageIndex(index);
                                setOpenModal(true);
                            }}
                        />
                    ))}
                </Box>
            ) : (
                <Typography variant="body2" color="text.secondary">לא נמצאו תמונות</Typography>
            )}

            <MediaModal
                open={openModal}
                onClose={() => setOpenModal(false)}
                mediaItems={mediaItems}
                selectedImageIndex={selectedImageIndex}
                onPrev={handlePrevImage}
                onNext={handleNextImage}
                setSelectedImageIndex={setSelectedImageIndex}
            />
        </Card>
    );
};

interface TefillinGalleryProps {
    mediaItems: any[];
    mediaGallery: any[];
    isMediaLoading: boolean;
    isGalleryLoading: boolean;
    isAdmin: boolean;
    isManager: boolean;
    id: string;
    onMediaUpload: () => void;
}

const TefillinGallery: React.FC<TefillinGalleryProps> = ({
    mediaItems,
    mediaGallery,
    isMediaLoading,
    isGalleryLoading,
    isAdmin,
    isManager,
    id,
    onMediaUpload
}) => {
    return (
        <Box sx={{ width: 600, flexShrink: 0 }}>
            <GallerySection
                title="גלריית הקלף"
                mediaItems={mediaItems || []}
                isLoading={isMediaLoading}
            />

            {mediaGallery && mediaGallery.length > 0 && (
                <GallerySection
                    title="גלריית מסירת התפילין"
                    mediaItems={mediaGallery}
                    isLoading={isGalleryLoading}
                />
            )}

            {(isAdmin || isManager) && 
                <Box sx={{ padding: 2, textAlign: 'center' }}>
                    <TefillinMediaUploader
                        id={id}
                        onSuccess={onMediaUpload}
                    />
                </Box>
            }
        </Box>
    );
};

interface MediaCardProps {
    media: any;
    index: number;
    onClick: () => void;
}

const MediaCard: React.FC<MediaCardProps> = ({ media, index, onClick }) => (
    <Card
        onClick={onClick}
        sx={{
            width: '100%',
            aspectRatio: '1',
            transition: 'transform 0.2s',
            cursor: 'pointer',
            '&:hover': {
                transform: 'scale(1.05)',
                boxShadow: 4
            }
        }}
    >
        {typeof media === 'string' ? (
            // עבור מדיה שהיא רק URL
            <CardMedia
                component="img"
                image={media}
                alt={`תמונה ${index + 1}`}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                }}
            />
        ) : media.type === 'video' ? (
            // עבור וידאו
            <Box sx={{ position: 'relative', height: '100%' }}>
                <CardMedia
                    component="video"
                    src={media.url}
                    sx={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '8px'
                    }}
                />
                <PlayArrowIcon
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        transform: 'translate(-50%, -50%)',
                        fontSize: 40,
                        color: 'white',
                        backgroundColor: 'rgba(0,0,0,0.5)',
                        borderRadius: '50%',
                        p: 1
                    }}
                />
            </Box>
        ) : (
            // עבור תמונה עם אובייקט
            <CardMedia
                component="img"
                image={media.url}
                alt={media.title || `תמונה ${index + 1}`}
                sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '8px'
                }}
            />
        )}
    </Card>
);

interface MediaModalProps {
    open: boolean;
    onClose: () => void;
    mediaItems: any[];
    selectedImageIndex: number;
    onPrev: () => void;
    onNext: () => void;
    setSelectedImageIndex: (index: number) => void;
}

const MediaModal: React.FC<MediaModalProps> = ({
    open,
    onClose,
    mediaItems,
    selectedImageIndex,
    onPrev,
    onNext,
    setSelectedImageIndex
}) => {
    if (!mediaItems?.length || selectedImageIndex < 0 || selectedImageIndex >= mediaItems.length) {
        return null;
    }

    const currentMedia = mediaItems[selectedImageIndex];
    if (!currentMedia) {
        return null;
    }

    return (
        <Modal
            open={open}
            onClose={onClose}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}
        >
            <Box sx={{
                width: '100%',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                bgcolor: 'rgba(0, 0, 0, 0.2)',
                p: 2
            }}>
                {/* Modal Content */}
                <Box sx={{
                    position: 'relative',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '50%',
                    mb: 2
                }}>
                    {typeof currentMedia === 'string' ? (
                        <img
                            src={currentMedia}
                            alt={`תמונה ${selectedImageIndex + 1}`}
                            style={{
                                width: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain'
                            }}
                        />
                    ) : currentMedia?.type === 'video' && currentMedia?.url ? (
                        <video
                            src={currentMedia.url}
                            controls
                            style={{
                                width: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain'
                            }}
                        />
                    ) : currentMedia?.url ? (
                        <img
                            src={currentMedia.url}
                            alt={currentMedia.title || `תמונה ${selectedImageIndex + 1}`}
                            style={{
                                width: '100%',
                                maxHeight: '70vh',
                                objectFit: 'contain'
                            }}
                        />
                    ) : (
                        <Typography color="error">תמונה לא תקינה</Typography>
                    )}

                    <NavigationButtons onClose={onClose} onPrev={onPrev} onNext={onNext} />
                </Box>

                {/* Thumbnails */}
                <Box sx={{
                    display: 'flex',
                    gap: 1,
                    justifyContent: 'center',
                    maxWidth: '60%',
                    overflowX: 'auto',
                    p: 1
                }}>
                    {mediaItems.map((media: any, index: number) => (
                        <Box
                            key={index}
                            onClick={() => setSelectedImageIndex(index)}
                            sx={{
                                width: 60,
                                height: 60,
                                flexShrink: 0,
                                opacity: index === selectedImageIndex ? 1 : 0.6,
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: index === selectedImageIndex ? '2px solid white' : '2px solid transparent',
                                borderRadius: 1,
                                overflow: 'hidden',
                                '&:hover': {
                                    opacity: 0.9
                                }
                            }}
                        >
                            {typeof media === 'string' ? (
                                <img
                                    src={media}
                                    alt={`תמונה ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : media?.type === 'video' && media?.url ? (
                                <Box sx={{ position: 'relative', height: '100%' }}>
                                    <video
                                        src={media.url}
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover'
                                        }}
                                    />
                                    <PlayArrowIcon
                                        sx={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                            color: 'white',
                                            fontSize: 20
                                        }}
                                    />
                                </Box>
                            ) : media?.url ? (
                                <img
                                    src={media.url}
                                    alt={media.title || `תמונה ${index + 1}`}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                            ) : (
                                <Typography variant="caption" color="error">תמונה לא תקינה</Typography>
                            )}
                        </Box>
                    ))}
                </Box>
            </Box>
        </Modal>
    );
};

const NavigationButtons: React.FC<{
    onClose: () => void;
    onPrev: () => void;
    onNext: () => void;
}> = ({ onClose, onPrev, onNext }) => (
    <>
        <IconButton
            onClick={onPrev}
            sx={{
                position: 'absolute',
                left: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.7)'
            }}
            aria-label="Previous"
        >
            <NavigateBeforeIcon fontSize="large" />
        </IconButton>
        <IconButton
            onClick={onNext}
            sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                bgcolor: 'rgba(255,255,255,0.7)'
            }}
            aria-label="Next"
        >
            <NavigateNextIcon fontSize="large" />
        </IconButton>
        <IconButton
            onClick={onClose}
            sx={{
                position: 'absolute',
                top: 8,
                right: 8,
                bgcolor: 'rgba(255,255,255,0.7)'
            }}
            aria-label="Close"
        >
            <CloseIcon fontSize="large" />
        </IconButton>
    </>
);

export default TefillinGallery;
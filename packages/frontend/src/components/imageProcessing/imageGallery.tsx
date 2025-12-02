import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle, Button, ImageList, ImageListItem, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useShowSoliderMedia } from '../../services/media/mediaService';

interface ImageGalleryProps {
    soldier_id: string;
}

interface ImageItem {
    type: string;
    url: string;
    title: string;
}

const ImageGallery: React.FC<ImageGalleryProps> = ({ soldier_id }) => {
    const [open, setOpen] = useState(false);
    const [images, setImages] = useState<ImageItem[]>([]);
    const [loadingImage] = useShowSoliderMedia();
    console.log(images);

    const handleClickOpen = async () => {
        const response = await loadingImage(soldier_id);
        if (response.data) {
            setImages(response.data);
            setOpen(true);
        } else {
            console.error(response.error);
        }
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
                <Button variant="contained" onClick={handleClickOpen}>
                    לצפיה בתמונות ההפצה
                </Button>
            </div>


            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>
                    <IconButton
                        edge="end"
                        color="inherit"
                        onClick={handleClose}
                        aria-label="close"
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <ImageList cols={1} rowHeight={200}>
                        {images.map((img, index) => (
                            <ImageListItem key={index}>
                                <img
                                    src={img.url}
                                    alt={img.title || `Image ${index + 1}`}
                                />
                            </ImageListItem>
                        ))}
                    </ImageList>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default ImageGallery;
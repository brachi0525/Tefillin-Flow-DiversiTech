import { CircularProgress } from '@mui/material';
import React from 'react';

const GenericLoading: React.FC = () => {
    return (
        <div className="loading-overlay">
            <CircularProgress />
        </div>
    );
};

export default GenericLoading;
import React, { useState } from 'react';

export const CameraInput = ({ onFilesSelected }: any) => {
    const handleFileChange = async (event: any) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            await onFilesSelected(files);
        }
    };

    return (
        <div>
            <input
                type="file"
                className="file-input"
                accept="image/*,video/*"
                capture="environment"
                multiple
                onChange={handleFileChange}
                id="file-upload"
                style={{ display: 'none' }}
            />
            <label htmlFor="file-upload" className="file-label"> לצילום</label>
        </div>
    );
};
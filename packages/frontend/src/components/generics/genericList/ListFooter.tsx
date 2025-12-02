import React from 'react';
import { Box, Typography } from '@mui/material';

interface ListFooterProps {
    total: number;
    displayed: number;
    selected: number;
    groupCount?: number;
}
export function ListFooter({ total, displayed, selected, groupCount }: ListFooterProps) {
    return (
        <Box sx={{ p: 1, display: 'flex', gap: 2, alignItems: 'center', bgcolor: 'background.default' }}>
            <Typography variant="caption" color="text.secondary">
                סה"כ: {total}
            </Typography>
            {displayed !== total && (
                <Typography variant="caption" color="primary.maim">{displayed} מוצגים</Typography>
            )}
            {selected > 0 && (
                <Typography variant="caption" color="success.main">{selected} נבחרו</Typography>
            )}
            {groupCount !== undefined && (
                <Typography variant="caption" color="secondary.main">{groupCount} קבוצות</Typography>
            )}
        </Box>
    );
}
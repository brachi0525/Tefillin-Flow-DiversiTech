import { Box, Typography } from '@mui/material';

interface TableFooterProps {
    total: number;
    displayed: number;
    selected: number;
}
export function TableFooter({ total, displayed, selected }: TableFooterProps) {
    return (
        <Box sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Typography variant="caption" color="text.secondary">
                {total} רשומות
            </Typography>
            {displayed !== total && (
                <Typography variant="caption" color="primary">{displayed} מוצגות</Typography>
            )}
            {selected > 0 && (
                <Typography variant="caption" color="primary.main">{selected} נבחרו</Typography>
            )}
        </Box>
    );
}
import React from 'react';
import { Box, Toolbar, TextField, Select, MenuItem, Button, Chip, Typography } from '@mui/material';
import { FilterConfig, ListField } from './types';

interface ListToolbarProps<T> {
    searchTerm: string;
    setSearchTerm: (v: string) => void;
    filters: FilterConfig<T>[];
    setFilters: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
    fields: ListField<T>[];
    filterable?: boolean;
    searchable?: boolean;
    searchPlaceholder?: string;
    processedData: T[];
    total: number;
    onClear: () => void;
}

export function ListToolbar<T>({
    searchTerm, setSearchTerm,
    filters, setFilters,
    fields, filterable, searchable,
    searchPlaceholder, processedData, total,
    onClear
}: ListToolbarProps<T>) {
    return (
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', bgcolor: 'background.default', minHeight: 'unset !important' }}>
            {searchable && (
                <TextField
                    size="small"
                    label={searchPlaceholder}
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    sx={{ minWidth: 200, flex: 1 }}
                />
            )}
            {filterable && fields
                .filter(field => field.filterOptions?.length)
                .map(field => (
                    <Select
                        key={String(field.key)}
                        size="small"
                        value={filters.find(f => f.key === field.key)?.value ?? ''}
                        onChange={e => {
                            setFilters(fs =>
                                e.target.value
                                    ? [
                                        ...fs.filter(f => f.key !== field.key),
                                        { key: field.key, value: e.target.value, operator: 'equals' }
                                    ]
                                    : fs.filter(f => f.key !== field.key)
                            );
                        }}
                        displayEmpty
                        sx={{ minWidth: 120, mx: 1 }}
                    >
                        <MenuItem value="">כל {field.label}</MenuItem>
                        {field.filterOptions!.map(opt =>
                            <MenuItem key={opt} value={opt}>{opt}</MenuItem>
                        )}
                    </Select>
                ))}
            {(searchTerm || filters.length > 0) && (
                <>
                    <Button color="error" size="small" onClick={onClear}>
                        איפוס
                    </Button>
                    <Box>
                        {searchTerm && (
                            <Chip
                                label={`חיפוש: "${searchTerm}"`}
                                onDelete={() => setSearchTerm('')}
                                sx={{ mx: 0.5 }}
                                color="info"
                            />
                        )}
                        {filters.map((filter, i) =>
                            <Chip
                                key={i}
                                label={`${fields.find(f => String(f.key) === String(filter.key))?.label || String(filter.key)}: ${filter.value}`}
                                onDelete={() => setFilters(fs => fs.filter(f => f.key !== filter.key))}
                                sx={{ mx: 0.5 }}
                                color="success"
                            />
                        )}
                    </Box>
                </>
            )}
            <Box sx={{ flexGrow: 1 }} />
            <Typography variant="caption" color="text.secondary">
                {processedData.length !== total
                    ? `${processedData.length} מתוך ${total} פריטים`
                    : `${total} פריטים`
                }
            </Typography>
        </Toolbar>
    );
}
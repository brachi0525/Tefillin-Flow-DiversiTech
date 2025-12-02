import React from 'react';
import { Box, Toolbar, TextField, Select, MenuItem, Button, InputBase, Paper, Typography, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { Column, FilterConfig, FilterOption } from './types';
interface TableToolbarProps<T> {
  searchTerm: string;
  setSearchTerm: (v: string) => void;
  filters: FilterConfig<T>[];
  setFilters: React.Dispatch<React.SetStateAction<FilterConfig<T>[]>>;
  columns: Column<T>[];
  filterable?: boolean;
  searchPlaceholder?: string;
  tableName: string;
  addButton?: React.ReactNode;
}
export function TableToolbar<T>({
  searchTerm,
  setSearchTerm,
  filters,
  setFilters,
  columns,
  filterable,
  searchPlaceholder,
  tableName,
  addButton,
}: TableToolbarProps<T>) {
  return (
    <Toolbar sx={{ gap: 2, flexWrap: 'wrap', bgcolor: 'background.paper' }}>
      <Box
        sx={{
          p: '2px 4px',
          display: 'flex',
          alignItems: 'center',
          width: 400,
          border: '1px solid #ccc',
          borderRadius: 1,
          minWidth: 200,
          direction: 'rtl',
        }}
      >
        <InputBase
          sx={{ ml: 1, flex: 1 }}
          placeholder={searchPlaceholder}
          onChange={(e) => setSearchTerm(e.target.value)}
          value={searchTerm}
        />
        <IconButton type="button" sx={{ p: '10px' }}>
          <SearchIcon />
        </IconButton>
      </Box>
      {filterable &&
        columns
          .filter((col) => col.filterOptions && col.filterOptions.length)
          .map((col) => (
            <Select
              key={String(col.key)}
              size="small"
              value={filters.find((f) => f.key === col.key)?.value || ''}
              onChange={(e) => {
                setFilters((fs) =>
                  e.target.value
                    ? [
                        ...fs.filter((f) => f.key !== col.key),
                        { key: col.key, value: e.target.value, operator: 'equals' },
                      ]
                    : fs.filter((f) => f.key !== col.key)
                );
              }}
              displayEmpty
              sx={{ minWidth: 120, mx: 1 }}
            >
              <MenuItem value="">כל {col.header}</MenuItem>
              {col.filterOptions &&
                col.filterOptions.map((opt) =>
                  typeof opt === 'string' ? (
                    <MenuItem key={opt} value={opt}>
                      {opt}
                    </MenuItem>
                  ) : (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  )
                )}
            </Select>
          ))}
      {(searchTerm || filters.length > 0) && (
        <Button color="error" size="small" onClick={() => { setSearchTerm(''); setFilters([]); }}>
          איפוס
        </Button>
      )}
      {addButton && addButton}
    </Toolbar>
  );
}






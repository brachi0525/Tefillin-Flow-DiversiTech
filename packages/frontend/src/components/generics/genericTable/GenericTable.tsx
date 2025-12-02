import React, { useState, useMemo, useCallback } from 'react';
import { Paper, TableContainer, Table } from '@mui/material';
import { Action, Column, FilterConfig } from './types';
import { TableToolbar } from './TableToolBar';
import { TableHeadRow } from './TableHeadRow';
import { TableBodyRows } from './TableBodyRows';
import { TableFooter } from './TableFooter';

interface GenericTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  actions?: Action<T>[];
  selectable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  filterable?: boolean;
  defaultFilters?: FilterConfig<T>[];
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  searchable?: boolean;
  striped?: boolean;
  hoverable?: boolean;
  compact?: boolean;
  tableName: string;
  tableHeight?: string | number;
}

export function GenericTable<T>({
  data,
  columns,
  keyExtractor,
  loading = false,
  emptyMessage = 'אין נתונים להצגה',
  actions = [],
  selectable = false,
  searchPlaceholder = 'חפש...',
  searchKeys,
  filterable = false,
  defaultFilters = [],
  tableName,
  tableHeight = 'auto',

}: GenericTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterConfig<T>[]>(defaultFilters);
  const [sortKey, setSortKey] = useState<keyof T | string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedItems, setSelectedItems] = useState<T[]>([]);

  const searchInKeys = useMemo(
    () => searchKeys || columns.filter(col => col.searchable !== false).map(col => col.key),
    [columns, searchKeys]
  );

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchTerm)
      result = result.filter(item =>
        searchInKeys.some(key => {
          const val = getNestedValue(item, String(key));
          return val != null && String(val).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    if (filterable && filters.length)
      result = result.filter(item =>  
        filters.every(filter => {
          const value = getNestedValue(item, String(filter.key));
          if (value == null) return false;
          const str = String(value).toLowerCase();
          const filterVal = filter.value.toLowerCase();
          return filter.operator === 'equals' ? str === filterVal : str.includes(filterVal);
        })
      );
    if (sortKey)
      result = [...result].sort((a, b) => {
        const aVal = getNestedValue(a, String(sortKey));
        const bVal = getNestedValue(b, String(sortKey));
        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        return sortDirection === 'asc'
          ? String(aVal).localeCompare(String(bVal), 'he')
          : String(bVal).localeCompare(String(aVal), 'he');
      });
    return result;
  }, [data, searchTerm, filters, sortKey, sortDirection, searchInKeys, filterable]);

  const handleSort = useCallback((key: keyof T | string) => {
    if (sortKey === key) setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDirection('asc');
    }
  }, [sortKey]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.length === processedData.length) setSelectedItems([]);
    else setSelectedItems([...processedData]);
  }, [selectedItems, processedData]);

  const handleSelectItem = useCallback((item: T) => {
    setSelectedItems(items =>
      items.some(i => keyExtractor(i, 0) === keyExtractor(item, 0))
        ? items.filter(i => keyExtractor(i, 0) !== keyExtractor(item, 0))
        : [...items, item]
    );
  }, [keyExtractor]);

  return (
    <Paper
      sx={{
        width: 'fit-content',
        maxWidth: '95vw',
        mx: 'auto',
        my: 1,
        p: 1,
        borderRadius: 2,
        boxShadow: 1,
        overflow: 'auto',
        direction: 'rtl',
      }}
    >
      <TableToolbar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        columns={columns}
        filterable={filterable}
        searchPlaceholder={searchPlaceholder}
        tableName={tableName}
      />
      
      <TableContainer sx={{ maxHeight: tableHeight, overflow: 'auto' }}>
        <Table
          size="small"
          sx={{
            minWidth: 300,
            '& th, & td': {
              padding: '4px 8px',
              fontSize: '0.75rem',
              whiteSpace: 'nowrap',
            },
            '& th': {
              backgroundColor: 'background.paper',
              fontWeight: 600,
            },
            '& tbody tr:hover': {
              backgroundColor: '#f9f9f9',
            },
          }}
        >
          <TableHeadRow
            columns={columns}
            selectable={selectable}
            actions={actions}
            sortKey={sortKey}
            sortDirection={sortDirection}
            onSort={handleSort}
            allSelected={selectedItems.length === processedData.length && processedData.length > 0}
            onSelectAll={handleSelectAll}
          />
          <TableBodyRows
            data={processedData}
            columns={columns}
            keyExtractor={keyExtractor}
            actions={actions}
            selectable={selectable}
            selectedItems={selectedItems}
            onSelectItem={handleSelectItem}
            emptyMessage={emptyMessage}
          />
        </Table>
      </TableContainer>
      <TableFooter
        total={data.length}
        displayed={processedData.length}
        selected={selectedItems.length}
      />
    </Paper>
  );
}

function getNestedValue(obj: any, path: string): any {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}
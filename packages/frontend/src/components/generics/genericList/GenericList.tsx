import React, { useState, useMemo } from 'react';
import { Paper, Box } from '@mui/material';
import { Action, FilterConfig, ItemIcon, ListField } from './types';
import { ListToolbar } from './ListToolBar';
import { ListGroup } from './ListGroup';
import { ListFooter } from './ListFooter';


export interface GenericListProps<T> {
  data: T[];
  fields: ListField<T>[];
  keyExtractor: (item: T, index: number) => string | number;
  loading?: boolean;
  emptyMessage?: string;
  actions?: Action<T>[];
  itemIcon?: ItemIcon<T>;
  selectable?: boolean;
  selectedItems?: T[];
  onSelectionChange?: (selectedItems: T[]) => void;
  layout?: 'card' | 'compact' | 'detailed';
  spacing?: 'tight' | 'normal' | 'loose';
  showDividers?: boolean;
  hoverable?: boolean;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchKeys?: (keyof T | string)[];
  filterable?: boolean;
  defaultFilters?: FilterConfig<T>[];
  groupBy?: keyof T | string;
  showGroupHeaders?: boolean;
  onItemClick?: (item: T) => void;
  onDataChange?: (filteredData: T[]) => void;
}

export function GenericList<T>({
  data,
  fields,
  keyExtractor,
  loading = false,
  emptyMessage = 'אין פריטים להצגה',
  actions = [],
  itemIcon,
  selectable = false,
  selectedItems = [],
  onSelectionChange,
  layout = 'card',
  spacing = 'normal',
  showDividers = true,
  hoverable = true,
  searchable = false,
  searchPlaceholder = 'חפש...',
  searchKeys,
  filterable = false,
  defaultFilters = [],
  groupBy,
  showGroupHeaders = true,
  onItemClick,
  onDataChange,
}: GenericListProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterConfig<T>[]>(defaultFilters);
  const [sortKey, setSortKey] = useState<keyof T | string | undefined>(undefined);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  const getNestedValue = (obj: any, path: string): any =>
    path.split('.').reduce((current, key) => current?.[key], obj);

  const processedData = useMemo(() => {
    let result = [...data];
    if (searchable && searchTerm) {
      const searchInKeys = searchKeys || fields.filter(f => f.searchable !== false).map(f => f.key);
      result = result.filter(item =>
        searchInKeys.some(key => {
          const val = getNestedValue(item, String(key));
          return val != null && String(val).toLowerCase().includes(searchTerm.toLowerCase());
        })
      );
    }
    if (filterable && filters.length) {
      result = result.filter(item =>
        filters.every(filter => {
          const value = getNestedValue(item, String(filter.key));
          if (value == null) return false;
          const str = String(value).toLowerCase();
          const filterVal = filter.value.toLowerCase();
          switch (filter.operator || 'contains') {
            case 'equals': return str === filterVal;
            case 'contains': return str.includes(filterVal);
            case 'startsWith': return str.startsWith(filterVal);
            case 'endsWith': return str.endsWith(filterVal);
            case 'greaterThan': return Number(value) > Number(filter.value);
            case 'lessThan': return Number(value) < Number(filter.value);
            default: return str.includes(filterVal);
          }
        })
      );
    }
    if (sortKey) {
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
    }
    onDataChange?.(result);
    return result;
  }, [data, searchTerm, filters, sortKey, sortDirection, fields, filterable, searchable, searchKeys, onDataChange]);

  const groupedData = useMemo(() => {
    if (!groupBy) return { '': processedData };
    return processedData.reduce((acc, item) => {
      const group = String(getNestedValue(item, String(groupBy)) ?? 'אחר');
      if (!acc[group]) acc[group] = [];
      acc[group].push(item);
      return acc;
    }, {} as Record<string, T[]>);
  }, [processedData, groupBy]);

  const handleSort = (key: keyof T | string) => {
    if (sortKey === key) setSortDirection(dir => (dir === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDirection('asc');
    }
  };

  const handleSelectAll = () => {
    if (!onSelectionChange) return;
    if (selectedItems.length === processedData.length) onSelectionChange([]);
    else onSelectionChange([...processedData]);
  };

  return (
    <Paper sx={{ borderRadius: 2, overflow: 'hidden', width: '100%', direction: 'rtl' }}>
      <ListToolbar<T>
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        filters={filters}
        setFilters={setFilters}
        fields={fields}
        filterable={filterable}
        searchable={searchable}
        searchPlaceholder={searchPlaceholder}
        processedData={processedData}
        total={data.length}
        onClear={() => { setSearchTerm(''); setFilters([]); }}
      />

      <Box sx={{
        px: 2, py: 1,
        minHeight: 200,
        bgcolor: processedData.length === 0 ? 'background.default' : undefined
      }}>
        {processedData.length === 0 ? (
          <Box sx={{ textAlign: 'center', color: 'text.secondary', py: 6 }}>
            {emptyMessage}
          </Box>
        ) : (
          Object.entries(groupedData).map(([group, items]) =>
            <ListGroup<T>
              key={group}
              groupName={group}
              items={items}
              fields={fields}
              keyExtractor={keyExtractor}
              actions={actions}
              itemIcon={itemIcon}
              selectable={selectable}
              selectedItems={selectedItems}
              onSelectionChange={onSelectionChange}
              layout={layout}
              showDividers={showDividers}
              hoverable={hoverable}
              onItemClick={onItemClick}
              showHeader={showGroupHeaders}
              onSort={handleSort}
              sortKey={sortKey}
              sortDirection={sortDirection}
            />
          )
        )}
      </Box>

      <ListFooter
        total={data.length}
        displayed={processedData.length}
        selected={selectedItems?.length ?? 0}
        groupCount={groupBy ? Object.keys(groupedData).length : undefined}
      />
    </Paper>
  );
}
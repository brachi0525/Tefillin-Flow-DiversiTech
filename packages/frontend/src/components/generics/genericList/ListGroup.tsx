import React from 'react';
import { Box, Typography, Divider, List } from '@mui/material';
import { Action, ItemIcon, ListField } from './types';
import { ListItemComp } from './ListItem';

interface ListGroupProps<T> {
    groupName: string;
    items: T[];
    fields: ListField<T>[];
    keyExtractor: (item: T, index: number) => string | number;
    actions?: Action<T>[];
    itemIcon?: ItemIcon<T>;
    selectable: boolean;
    selectedItems?: T[];
    onSelectionChange?: (selectedItems: T[]) => void;
    layout: 'card' | 'compact' | 'detailed';
    showDividers: boolean;
    hoverable: boolean;
    onItemClick?: (item: T) => void;
    showHeader?: boolean;
    onSort?: (key: keyof T | string) => void;
    sortKey?: keyof T | string;
    sortDirection?: 'asc' | 'desc';
}

export function ListGroup<T>({
    groupName, items, fields, keyExtractor,
    actions, itemIcon, selectable, selectedItems = [],
    onSelectionChange, layout, showDividers, hoverable,
    onItemClick, showHeader = true
}: ListGroupProps<T>) {
    return (
        <Box sx={{ mb: 3 }}>
            {showHeader && groupName && (
                <Typography variant="subtitle2" sx={{
                    bgcolor: 'primary.main',
                    color: 'text.secondary',
                    px: 2, py: 0.7,
                    borderRadius: 1,
                    mb: 1,
                    width: 'fit-content',
                    fontWeight: 'bold'
                }}>
                    {groupName}
                </Typography>
            )}
            <List sx={{ width: '100%', p: 0 }}>
                {items.map((item, i) => (
                    <React.Fragment key={keyExtractor(item, i)}>
                        <ListItemComp<T>
                            item={item}
                            fields={fields}
                            actions={actions}
                            itemIcon={itemIcon}
                            selectable={selectable}
                            selected={selectedItems.some(sel => keyExtractor(sel, 0) === keyExtractor(item, 0))}
                            onSelect={() => {
                                if (!onSelectionChange) return;
                                const isSelected = selectedItems.some(sel => keyExtractor(sel, 0) === keyExtractor(item, 0));
                                if (isSelected) {
                                    onSelectionChange(selectedItems.filter(sel => keyExtractor(sel, 0) !== keyExtractor(item, 0)));
                                } else {
                                    onSelectionChange([...selectedItems, item]);
                                }
                            }}
                            layout={layout}
                            hoverable={hoverable}
                            onClick={() => onItemClick?.(item)}
                        />
                        {showDividers && i < items.length - 1 && <Divider component="li" />}
                    </React.Fragment>
                ))}
            </List>
        </Box>
    );
}
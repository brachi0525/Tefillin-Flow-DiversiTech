import React from 'react';
import { TableBody, TableRow, TableCell, Checkbox, IconButton, Tooltip, Typography } from '@mui/material';
import { Action, Column } from './types';

interface TableBodyRowsProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T, index: number) => string | number;
    actions: Action<T>[];
    selectable: boolean;
    selectedItems: T[];
    onSelectItem: (item: T) => void;
    emptyMessage: string;
}

function getNestedValue(obj: any, path: string): any {
    return path.split('.').reduce((current, key) => current?.[key], obj);
}

export function TableBodyRows<T>({
    data, columns, keyExtractor, actions,
    selectable, selectedItems, onSelectItem, emptyMessage
}: TableBodyRowsProps<T>) {
    if (data.length === 0) {
        return (
            <TableBody >
                <TableRow>
                    <TableCell colSpan={columns.length + (selectable ? 1 : 0) + (actions.length ? 1 : 0)} align="center">
                        <Typography variant="body2">{emptyMessage}</Typography>
                    </TableCell>
                </TableRow>
            </TableBody>
        );
    }
    return (
        <TableBody sx={{ backgroundColor: 'background.default' }}>
            {data.map((item, idx) => (
                <TableRow
                    key={keyExtractor(item, idx)}
                    selected={selectedItems.some(i => keyExtractor(i, 0) === keyExtractor(item, 0))}
                    hover
                >
                    {selectable && (
                        <TableCell padding="checkbox">
                            <Checkbox
                                checked={selectedItems.some(i => keyExtractor(i, 0) === keyExtractor(item, 0))}
                                onChange={() => onSelectItem(item)}
                            />
                        </TableCell>
                    )}
                    {columns.map(col => (
                        <TableCell key={String(col.key)} align={col.align}>
                            {col.render
                                ? col.render(item, getNestedValue(item, String(col.key)))
                                : String(getNestedValue(item, String(col.key)) ?? '')
                            }
                        </TableCell>
                    ))}
                    {actions.length > 0 && (
                        <TableCell align="center">
                            {actions.map((action, i) =>
                            (action.hidden?.(item) ? null : (
                                <Tooltip title={action.label} key={i}>
                                    <span>
                                        <IconButton
                                            size="small"
                                            onClick={e => {
                                                e.stopPropagation();
                                                if (!action.disabled?.(item)) action.onClick(item);
                                            }}
                                            disabled={action.disabled?.(item)}
                                        >
                                            {action.icon || action.label}
                                        </IconButton>
                                    </span>
                                </Tooltip>
                            ))
                            )}
                        </TableCell>
                    )}
                </TableRow>
            ))}
        </TableBody>
    );
}
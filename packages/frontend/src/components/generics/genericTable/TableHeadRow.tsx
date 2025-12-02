import { TableHead, TableRow, TableCell, Checkbox, TableSortLabel } from '@mui/material';
import { Action, Column } from './types';

interface TableHeadRowProps<T> {
    columns: Column<T>[];
    selectable: boolean;
    actions: Action<T>[];
    sortKey?: keyof T | string;
    sortDirection: 'asc' | 'desc';
    onSort: (key: keyof T | string) => void;
    allSelected: boolean;
    onSelectAll: () => void;
}

export function TableHeadRow<T>({
    columns, selectable, actions,
    sortKey, sortDirection, onSort,
    allSelected, onSelectAll
}: TableHeadRowProps<T>) {
    return (
        <TableHead>
            <TableRow>
                {selectable && (
                    <TableCell padding="checkbox">
                        <Checkbox
                            checked={allSelected}
                            onChange={onSelectAll}
                        />
                    </TableCell>
                )}
                {columns.map(col => (
                    <TableCell 
                        key={String(col.key)} 
                        align={col.align} 
                        sortDirection={sortKey === col.key ? sortDirection : false}
                        style={{ textAlign: 'center' }} // הוסף את המאפיין הזה
                    >
                        {col.sortable ? (
                            <TableSortLabel
                                active={sortKey === col.key}
                                direction={sortKey === col.key ? sortDirection : 'asc'}
                                onClick={() => onSort(col.key)}
                            >
                                {col.header}
                            </TableSortLabel>
                        ) : col.header}
                    </TableCell>
                ))}
                {actions.length > 0 && (
                    <TableCell align="center" style={{ textAlign: 'center' }}>פעולות</TableCell> // הוסף גם כאן
                )}
            </TableRow>
        </TableHead>
    );
}

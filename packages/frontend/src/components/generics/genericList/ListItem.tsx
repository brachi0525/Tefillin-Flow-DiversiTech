import { ListItem, ListItemButton, ListItemIcon, ListItemText, Checkbox, Box, IconButton, Tooltip } from '@mui/material';
import { Action, ItemIcon, ListField } from './types';

interface ListItemCompProps<T> {
    item: T;
    fields: ListField<T>[];
    actions?: Action<T>[];
    itemIcon?: ItemIcon<T>;
    selectable: boolean;
    selected: boolean;
    onSelect: () => void;
    layout: 'card' | 'compact' | 'detailed';
    hoverable: boolean;
    onClick?: () => void;
}

export function ListItemComp<T>({
    item, fields, actions = [], itemIcon, selectable,
    selected, onSelect, layout, hoverable, onClick
}: ListItemCompProps<T>) {
    const visibleFields = fields.filter(f => f.visible !== false);

    return (
        <ListItem
            disablePadding
            secondaryAction={actions.length > 0 &&
                <Box sx={{ display: 'flex', gap: 1 }}>
                    {actions.map((action, i) =>
                        action.hidden?.(item) ? null : (
                            <Tooltip title={action.label} key={i}>
                                <span>
                                    <IconButton
                                        size="small"
                                        color={action.variant === 'danger' ? 'error' : action.variant === 'success' ? 'success' : 'primary'}
                                        disabled={action.disabled?.(item)}
                                        onClick={e => {
                                            e.stopPropagation();
                                            if (!action.disabled?.(item)) action.onClick(item);
                                        }}
                                    >
                                        {action.icon || action.label}
                                    </IconButton>
                                </span>
                            </Tooltip>
                        )
                    )}
                </Box>
            }
            sx={{
                borderRadius: 1,
                bgcolor: selected ? 'info.lighter' : 'background.paper',
                mb: 0.5,
                '&:hover': hoverable ? { bgcolor: 'action.hover' } : undefined,
                transition: 'background 0.2s',
                px: 0.5
            }}
        >
            <ListItemButton
                selected={selected}
                onClick={onClick}
                sx={{ borderRadius: 1, '&:hover': hoverable ? { bgcolor: 'action.hover' } : undefined }}
            ></ListItemButton>
            {selectable && (
                <ListItemIcon sx={{ minWidth: 30 }}>
                    <Checkbox
                        edge="start"
                        checked={selected}
                        onClick={e => { e.stopPropagation(); onSelect(); }}
                        tabIndex={-1}
                        disableRipple
                    />
                </ListItemIcon>
            )}
            {itemIcon && itemIcon.position !== 'end' && (
                <ListItemIcon>
                    {itemIcon.render(item)}
                </ListItemIcon>
            )}
            <ListItemText
                primary={
                    layout === 'compact'
                        ? (
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                {visibleFields.map((f, i) =>
                                    <span key={i}><b>{f.label}:</b> {f.render ? f.render(item, item[f.key as keyof T]) : String(item[f.key as keyof T])}</span>
                                )}
                            </Box>
                        )
                        : (
                            <span>
                                <b>{visibleFields[0]?.label}:</b> {visibleFields[0]?.render ? visibleFields[0].render(item, item[visibleFields[0].key as keyof T]) : String(item[visibleFields[0]?.key as keyof T])}
                                {layout === 'detailed' && visibleFields.length > 1 && (
                                    <Box sx={{ mt: 0.5, color: 'text.secondary', fontSize: '0.90em' }}>
                                        {visibleFields.slice(1).map((f, i) =>
                                            <div key={i}><b>{f.label}:</b> {f.render ? f.render(item, item[f.key as keyof T]) : String(item[f.key as keyof T])}</div>
                                        )}
                                    </Box>
                                )}
                            </span>
                        )
                }
            />
            {itemIcon && itemIcon.position === 'end' && (
                <ListItemIcon>
                    {itemIcon.render(item)}
                </ListItemIcon>
            )}
        </ListItem>
    );
}
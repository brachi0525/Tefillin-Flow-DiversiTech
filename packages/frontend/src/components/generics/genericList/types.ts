import React from "react";

export interface ListField<T> {
    key: keyof T | string;
    label: string;
    render?: (item: T, value: any) => React.ReactNode;
    searchable?: boolean;
    filterOptions?: string[];
    visible?: boolean;
    priority?: 'high' | 'medium' | 'low';
}

export interface Action<T> {
    label: string;
    icon?: React.ReactNode;
    onClick: (item: T) => void;
    variant?: 'primary' | 'secondary' | 'danger' | 'success' | 'warning';
    disabled?: (item: T) => boolean;
    hidden?: (item: T) => boolean;
}

export interface ItemIcon<T> {
    render: (item: T) => React.ReactNode;
    position?: 'start' | 'end';
}

export interface FilterConfig<T> {
    key: keyof T | string;
    value: string;
    operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan';
}

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
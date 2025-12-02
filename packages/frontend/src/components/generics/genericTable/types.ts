export interface FilterOption {
  value: string;
  label: string;
}
export interface Column<T> {
  key: string;
  header: string;
  align?: 'left' | 'center' | 'right';
  sortable?: boolean;
  searchable?: boolean;
  filterOptions?: string[] | FilterOption[];
  render?: (item: T, value?: any) => React.ReactNode;
}
export interface Action<T> {
  hidden?: (item: T) => boolean;
  disabled?: (item: T) => boolean;
  icon?: React.ReactNode;
  label: string;
  onClick: (item: T) => void;
}
export interface FilterConfig<T> {
  key: keyof T | string;
  operator: 'equals' | 'contains';
  value: string;
}
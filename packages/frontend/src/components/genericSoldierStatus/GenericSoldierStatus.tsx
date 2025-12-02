
import React, { JSX, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Button } from '@mui/material';
import { Soldier, SoldierStatus } from '../../features/soldier/soldierTypes';
import { setSelectedSoldier } from '../../features/soldier/soldierSlice';
import { Column } from '../generics/genericTable/types';
import { GenericTable } from '../generics/genericTable/GenericTable';
import { useLoading } from '../generics/genericLoading/LoadingContext';
import { useGetAllSoldier } from '../../services/soldierService ';

type Props = {
  filters?: Record<string, any>;
  extraColumns?: Column<Soldier>[];
  onRefetchAvailable?: (refetch: () => void) => void;
};

export default function GenericSoldierStatus({
  filters,
  extraColumns = [],
  onRefetchAvailable,
}: Props): JSX.Element {
  const { setLoading } = useLoading();
  const dispatch = useDispatch();

  const { data: soldiers, isLoading, error, refetch } = useGetAllSoldier(filters);


  useEffect(() => {
    if (onRefetchAvailable) {
      onRefetchAvailable(refetch);
    }
  }, [refetch, onRefetchAvailable]);

  const handleViewDetails = (soldier: Soldier) => {
    dispatch(setSelectedSoldier(soldier));
  };

  const baseColumns: Column<Soldier>[] = [
    { key: 'name', header: 'שם חייל', sortable: true, searchable: true },
    { key: 'phone', header: 'מספר טלפון', sortable: false, searchable: true },
    {
      key: 'currentStatus',
      header: 'סטטוס',
      sortable: true,
      searchable: true,
      filterOptions: Object.values(SoldierStatus),
      render: (_item: Soldier, value: SoldierStatus) => (
        <span style={{ color: '#2196F3', fontWeight: 'bold' }}>{value}</span>
      ),
    },
    {
      key: 'details',
      header: 'פרטים',
      render: (soldier: Soldier) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(soldier)}
          sx={{ minWidth: 'auto' }}
        >
          צפה בפרטים
        </Button>
      ),
    },
  ];

  const columns = [
    ...baseColumns.filter(
      (col) => !extraColumns.some((extra) => extra.key === col.key)
    ),
    ...extraColumns,
  ];

  if (isLoading) return <div>טוען נתונים...</div>;
  if (error) return <div>שגיאה בטעינת הנתונים</div>;

  return (
    <>
      <GenericTable<Soldier>
        tableName='חיילים'
        data={soldiers}
        columns={columns}
        keyExtractor={(item: Soldier, idx: number) => item.id || item.phone + idx}
        searchable
        filterable
        striped
        hoverable
        compact={false}
        searchPlaceholder="חפש חייל..."
        emptyMessage="לא נמצאו חיילים"
      />
    </>
  );
}

import React from 'react';
import { Chip, Tooltip, CircularProgress, Box } from '@mui/material';
import { Column } from '../generics/genericTable/types';
import { Tefillin } from '../../features/tefillin/tefillinTypes';
import TefillinStatus from '../../pages/rabbiDashbord/TefillinStatus';
import { tefillinStatusLabels } from '../../constants/tefillinStatusLabels';
import { GenericTable } from '../generics/genericTable/GenericTable';
import { useGetLocations } from '../../services/locationService';
import { Soldier } from '../../features/soldier/soldierTypes';
import { useGetAllSoldier } from '../../services/soldierService ';

const statusColors: Record<string, 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'info' | 'error'> = {
  with_scribe: 'info',
  with_checker: 'info',
  in_transit: 'warning',
  at_center: 'primary',
  at_location: 'secondary',
  assigned: 'success',
  distributed: 'success',
};
interface Props {
  rows: Tefillin[];
  extraColumns?: Column<Tefillin>[];
}
const GenericTefillinStatusTable: React.FC<Props> = ({ rows, extraColumns = [] }) => {
  const { data: soldiers = [], isLoading: loadingSoldiers } = useGetAllSoldier();
  const { data: locations = [], isLoading: loadingLocations } = useGetLocations();
  if (loadingSoldiers || loadingLocations) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  const mappedRows = rows.map((tefillin) => {
    const soldier = soldiers.find((s:Soldier) => s.tefillinId === tefillin.id);
    return {
      ...tefillin,
      soldierID: soldier?.name || soldier?.id || '-',
    };
  });
  const columns: Column<Tefillin>[] = [
    {
      key: 'scribeName',
      header: 'סופר',
      align: 'center',
      sortable: true,
      searchable: true,
      render: (item, value) => value || '-',
    },
    {
      key: 'checkerName',
      header: 'בודק',
      align: 'center',
      sortable: true,
      searchable: true,
      render: (item, value) => value || '-',
    },
    {
      key: 'status',
      header: 'סטטוס',
      align: 'center',
      sortable: true,
      searchable: true,
      filterOptions: Object.entries(tefillinStatusLabels).map(([key, label]) => ({ value: key, label })),
      render: (item, value) => {
      const label = tefillinStatusLabels[value] || value;
        return (
          <Tooltip title={label}>
            <Chip
              label={label}
              color={statusColors[value] || 'default'}
              variant="outlined"
            />
          </Tooltip>
        );
      },
    },
    {
      key: 'locationId',
      header: 'מיקום',
      align: 'center',
      sortable: true,
      searchable: true,
      render: (item, value)  => {
        const loc = locations.find((l) => l.id === value);
        return loc?.name || '-';
      },
    },
    {
      key: 'soldierID',
      header: 'חייל',
      align: 'center',
      sortable: true,
      searchable: true,
      render: (item, value) => value || '-',
    },
    {
      key: 'donorName',
      header: 'תורם',
      align: 'center',
      sortable: true,
      searchable: true,
      render: (item, value) => value || item.donorID || '-',
    },
    ...extraColumns,
  ];
  return (
    <GenericTable
      data={mappedRows}
      columns={columns}
      keyExtractor={(item) => item.id}
      emptyMessage="אין נתונים להצגה"
      searchPlaceholder="חפש תפילין..."
      searchKeys={['scribeName', 'checkerName', 'soldierID', 'donorName']}
      filterable
      searchable tableName={''}    />
  );
};
export default GenericTefillinStatusTable;
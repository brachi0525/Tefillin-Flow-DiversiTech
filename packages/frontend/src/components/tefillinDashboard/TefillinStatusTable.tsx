import React, { useState } from 'react';
import { Select, MenuItem, Snackbar, Alert } from '@mui/material';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { Tefillin } from '../../../../../types/tefillin';


import { tefillinStatusLabels } from '../../constants/tefillinStatusLabels';
import { Column } from '../generics/genericTable/types';
import { useGetLocations } from '../../services/locationService';
import GenericTefillinStatusTable from './GenericTefillinStatusTable';
import { Soldier } from '../../features/soldier/soldierTypes';
import { useGetAllSoldier } from '../../services/soldierService ';

interface Props {
  rows: Tefillin[];
  onStatusChange?: (id: string, newStatus: string) => void;
  onTransfer?: (id: string, toLocation: string) => void;
}
const TefillinStatusTable: React.FC<Props> = ({ rows, onStatusChange, onTransfer }) => {
  const { data: locations = [], isLoading: loadingLocations } = useGetLocations();
  const { data: soldiers = [] } = useGetAllSoldier();
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const mappedRows = rows.map((tefillin) => {
    const soldier = soldiers.find((s: Soldier) => s.tefillinId === tefillin.id);
    return {
      ...tefillin,
      soldierID: soldier?.name || soldier?.id || '-',
    };
  });
  const extraColumns: Column<Tefillin>[] = [];
  if (onStatusChange) {
    extraColumns.push({
      key: 'statusChange',
      header: 'שינוי סטטוס',
      align: 'center',
      render: (item) => (
        <Select
          value={item.status}
          onChange={(e) => {
            onStatusChange(item.id, e.target.value);
            setSnackbarMessage('הסטטוס התעדכן בהצלחה');
            setSnackbarOpen(true);
          }}
          size="small"
          sx={{ minWidth: 120, backgroundColor: 'background.default' }}
          IconComponent={AutorenewIcon}
        >
          {Object.entries(tefillinStatusLabels).map(([value, label]) => (
            <MenuItem key={value} value={value}>
              {label}
            </MenuItem>
          ))}
        </Select>
      ),
    });
  }
  if (onTransfer) {
    extraColumns.push({
      key: 'locationTransfer',
      header: 'העבר מיקום',
      align: 'center',
      render: (item) => (
        <Select
          size="small"
          value={item.locationId || ''}
          onChange={(e) => {
            const toLocation = e.target.value;
            const selectedLocation = locations.find((loc) => loc.id === toLocation);
            if (toLocation && selectedLocation) {
              onTransfer(item.id, toLocation);
              setSnackbarMessage('המיקום התעדכן בהצלחה');
              setSnackbarOpen(true);
            }
          }}
          displayEmpty
          sx={{ minWidth: 140 }}
          disabled={loadingLocations}
        >
          <MenuItem value="" disabled>
            בחר מיקום
          </MenuItem>
          {locations.map((loc) => (
            <MenuItem key={loc.id} value={loc.id}>
              {loc.name}
            </MenuItem>
          ))}
        </Select>
      ),
    });
  }
  return (
    <>
      <GenericTefillinStatusTable
        rows={mappedRows}
        extraColumns={extraColumns}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        slotProps={{
          content: {
            sx: {
              backgroundColor: 'rgba(128, 128, 128, 0.9)',
              color: '#fff',
              borderRadius: '999px',
              padding: '6px 12px',
              fontSize: { xs: '0.75rem', sm: '0.85rem' },
              minWidth: 'unset',
              maxWidth: 'unset',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
            }
          },
        }}
        message={
          <span style={{ width: '100%', textAlign: 'center' }}>
            {snackbarMessage}
          </span>
        }
      />
    </>
  );
};
export default TefillinStatusTable;
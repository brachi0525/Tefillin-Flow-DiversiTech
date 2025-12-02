import React, { useState } from 'react';
import { Soldier } from '../../features/soldier/soldierTypes';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import DeliveryCompletedButton from '../../components/rabbiDashbord/DeliveryCompletedButton';
import GenericSoldierStatus from '../../components/genericSoldierStatus/GenericSoldierStatus';
import { Column } from '../../components/generics/genericTable/types';
import GenericButton from '../../components/generics/GenericButton';

export default function SoldierStatus() {
  const [showCompleted, setShowCompleted] = useState<Record<string, boolean>>({});
  const [refetchSoldiers, setRefetchSoldiers] = useState<() => void>(() => {});

  const handleStartDelivery = (soldier: Soldier) => {
    // מסוגלים להתחיל מסירה רק אם לחייל יש tefillinId
    if (!soldier.tefillinId) return;
    setShowCompleted((prev) => ({
      ...prev,
      [soldier.id]: true,
    }));
  };

  const extraColumns: Column<Soldier>[] = [
    {
      key: 'startDelivery',
      header: 'מסירה',
      render: (soldier: Soldier) => (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <GenericButton
            label="תחילת מסירה"
            onClick={() => handleStartDelivery(soldier)}
            variant="contained"
            disabled={!soldier.tefillinId}  // הכפתור יהיה מושבת אם אין tefillinId
          >
            <LocalShippingIcon sx={{ ml: 1 }} />
          </GenericButton>
          {showCompleted[soldier.id] && soldier.tefillinId && (
            <DeliveryCompletedButton
              tefillinId={soldier.tefillinId}
              soldierId={soldier.id}
              locationId={soldier.locationId}
              onStatusUpdated={refetchSoldiers}
            />
          )}
        </div>
      ),
    },
  ];

  return (
    <GenericSoldierStatus
      extraColumns={extraColumns}
      onRefetchAvailable={(refetch) => setRefetchSoldiers(() => refetch)}
    />
  );
}
import React, { useState } from 'react';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { TefillinStatus } from '../../features/tefillin/tefillinTypes';
import { OpenCamera } from '../imageProcessing/openCamera';
import GenericButton from '../generics/GenericButton';
import { useUpdateTefillinStatus } from '../../services/tefillinService';


const DeliveryCompletedButton = ({
  tefillinId,
  soldierId,
  locationId,
  onStatusUpdated,
}: {
  tefillinId: string;
  soldierId: string;
  locationId?: string;
  onStatusUpdated?: () => void;
}) => {
  const [updateStatus] = useUpdateTefillinStatus();
  const [completed, setCompleted] = useState(false);

  const handleComplete = async () => {
    try {
      await updateStatus(tefillinId, TefillinStatus.DISTRIBUTED);
      setCompleted(true);
      if (onStatusUpdated) onStatusUpdated();
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  return (
    <>
      <OpenCamera
        tefillin_id={tefillinId}
        soldier_id={soldierId}
        locationId={locationId}
      />
      <GenericButton
        label={completed ? 'המסירה הושלמה' : 'לאישור המסירה'}
        onClick={handleComplete}
        variant="outlined"
      >
        {completed && <CheckCircleIcon sx={{ ml: 1 }} />}
      </GenericButton>
    </>
  );
};

export default DeliveryCompletedButton;
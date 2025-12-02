import React from 'react';
import Tooltip from '@mui/material/Tooltip';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SendIcon from '@mui/icons-material/Send';
import { Soldier } from "../../features/soldier/soldierTypes";
import { useNavigate } from 'react-router-dom';
import { Button } from '@mui/material';

export const SoldierActions: React.FC<{ soldier: Soldier }> = ({ soldier }) => {
  const navigate = useNavigate();

  const handleApprove = () => {
    // מעבר לדף אישור חייל אמור להשתנות ע"פ הניתוב האמיתי
    navigate(`/soldier/approve/${soldier.id}`);
  };
  const handleDelete = () => {
    // מעבר לדף מחיקת חייל -אמור להשתנות ע"פ הניתוב האמיתי
    navigate(`/soldier/delete/${soldier.id}`);
  };
  const handleSend = () => {
    //מעבר לדף שליחת פרטים אמור להשתנות ע"פ הניתוב האמיתי
    navigate(`/soldier/send/${soldier.id}`);
  };

  return (
    <div style={{ display: 'inline-flex', gap: 4 }}>
      <Tooltip title="אישור חייל">
        <span>
          <Button
            onClick={handleApprove}
          >
            <CheckCircleIcon style={{ color: '#2e7d32' }} />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="שלח פרטים">
        <span>
          <Button
            onClick={handleSend}
          >
            <SendIcon style={{ color: '#1976d2' }} />
          </Button>
        </span>
      </Tooltip>
      <Tooltip title="מחיקת חייל">
        <span>
          <Button
            onClick={handleDelete}
          >
            <DeleteIcon style={{ color: '#d32f2f' }} />
          </Button>
        </span>
      </Tooltip>
    </div>
  );
};
import { SoldierStatus } from '../../../features/soldier/soldierTypes';

export const getStatusColor = (status: SoldierStatus): string => {
  switch (status) {
    case SoldierStatus.REGISTERED: return '#1565C0';   
    case SoldierStatus.APPROVED:   return '#2E7D32';    
    case SoldierStatus.PAID:       return '#00897B';   
    case SoldierStatus.SCHEDULED:  return '#F9A825'; 
    case SoldierStatus.RECEIVED:   return '#C62828';    
    default:                       return '#607D8B';   
  }
};

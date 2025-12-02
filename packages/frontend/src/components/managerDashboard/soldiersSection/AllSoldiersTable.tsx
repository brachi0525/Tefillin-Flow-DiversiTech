import { useEffect } from 'react';
import WhatsAppButton from '../../contactButtons/WhatsAppButton';
import { useLoading } from '../../generics/genericLoading/LoadingContext';
import { Soldier, SoldierStatus } from '../../../features/soldier/soldierTypes';
import { Column } from '../../generics/genericTable/types';
import { GenericTable } from '../../generics/genericTable/GenericTable';
import GenericLoading from '../../generics/genericLoading/GenericLoading';
import GenericButton from '../../generics/GenericButton';
import EmailButton from '../../contactButtons/EmailButton';
import { getStatusColor } from './getStatusColor';
import PhoneButton from '../../contactButtons/PhoneButton';
import { Check, CheckCircleOutline, Delete, DoneOutline, Email, HighlightOff, Phone, WhatsApp } from '@mui/icons-material';
import { Chip } from '@mui/material';
import { soldierStatusLabels } from '../../../constants/soldierStatusLabels';
import { useChangeSoldierStatus } from '../../../services/soldierService ';


type SoldierTableProps = {
  soldiers: Soldier[];
  isLoading: boolean;
  handleSoldierSelect: (soldier: Soldier) => void;
};

const AllSoldiersTable: React.FC<SoldierTableProps> = ({ soldiers, isLoading, handleSoldierSelect }) => {
const [changeStatus] = useChangeSoldierStatus();
  const { setLoading } = useLoading();
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const columns: Column<Soldier>[] = [
    { key: 'name', header: 'שם חייל', sortable: true, searchable: true },
    {
      key: 'contact', header: 'יצירת קשר', sortable: false, searchable: true, render: (soldier: Soldier) => (
        <div style={{ display: 'flex', alignItems: 'center', columnGap: '0' }}>
          <WhatsAppButton phoneNumber={soldier.phone} label={<WhatsApp />} />
          <EmailButton email={soldier.email} label={<Email />} />
          <PhoneButton phoneNumber={soldier.phone} label={<Phone />} />
        </div>
      )
    },
    {
      key: 'currentStatus',
      header: 'סטטוס',
      sortable: true,
      searchable: true,
      filterOptions: Object.values(SoldierStatus).map(status => soldierStatusLabels[status].label || status),
      render: (soldier: Soldier) => {
        const value = soldier.currentStatus;
        const label = soldierStatusLabels[value]?.label || value;
        return (
          <Chip
            label={label}
            variant='outlined'
            style={{
              borderColor: getStatusColor(soldier.currentStatus),
              color: getStatusColor(soldier.currentStatus)
            }} />
        );
      },
    },
    {
      key: 'actions',
      header: 'פעולות מהירות',
      render: (soldier: Soldier) => (
        soldier.currentStatus === 'registered' ? ( // בדוק אם הסטטוס הוא "registered"
          <>
            <GenericButton
              label={<CheckCircleOutline sx={{ color: 'green' }} />}
              onClick={() => changeStatus(soldier.id, SoldierStatus.APPROVED)}
              variant="text"
            />
            <GenericButton
              label={<HighlightOff sx={{ color: '#a50a0aff' }} />}
              onClick={() => changeStatus(soldier.id, SoldierStatus.REJECTED)}
              variant="text"
            />
          </>
        ) : null
      )
    },
    {
      key: 'details',
      header: 'פרטים',
      render: (soldier: Soldier) => (
        <GenericButton
          label="פרטים"
          onClick={() => handleSoldierSelect(soldier)}
          variant="outlined"
        />
      )
    },

  ];



  if (isLoading) {
    return <GenericLoading />;
  }

  // if (error) {
  //   return <div>שגיאה בטעינת הנתונים</div>;
  // }

  return (
    <>
      <GenericTable<Soldier>
        data={soldiers}
        tableHeight="50vh"
        columns={columns}
        keyExtractor={(item: Soldier, idx: number) => item.id || item.phone + idx}
        searchable
        filterable
        striped
        hoverable
        compact={false}
        searchPlaceholder="חפש חייל..."
        emptyMessage="לא נמצאו חיילים ממתינים לאישור"
        tableName='חיילים'
      />
    </>
  );
}
export default AllSoldiersTable;  
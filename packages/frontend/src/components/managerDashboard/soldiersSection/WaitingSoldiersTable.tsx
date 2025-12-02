import React, { JSX } from 'react';
import { useDispatch } from 'react-redux';
import { setSelectedSoldier } from '../../../features/soldier/soldierSlice';
import { Column } from '../../generics/genericTable/types';
import { GenericTable } from '../../generics/genericTable/GenericTable';
import { Soldier } from '../../../features/soldier/soldierTypes';
import { SoldierActions } from '../../quickActions/quickActions';
import GenericLoading from '../../generics/genericLoading/GenericLoading';
import { Button } from '@mui/material';
import { useGetRegisteredSoldiers } from '../../../services/soldierService ';



const WaitingSoldiersTable: React.FC = () => {
  const dispatch = useDispatch();
  const { data: soldiers, isLoading, error } = useGetRegisteredSoldiers();
  console.log("all soldiers", soldiers, "error", error, "is loading", isLoading);

  console.log({ soldiers, isLoading, error });
  const handleViewDetails = (soldier: Soldier) => {
    dispatch(setSelectedSoldier(soldier));
  };
  const columns: Column<Soldier>[] = [
    { key: 'name', header: 'שם חייל', sortable: true, searchable: true },
    { key: 'phone', header: 'מספר טלפון', sortable: false, searchable: true },
    {
      key: 'actions',
      header: 'פעולות',
      render: (soldier: Soldier) => (
        <SoldierActions soldier={soldier} />
      ),
    },
    {
      key: 'actions',
      header: 'פעולות',
      sortable: false,
      searchable: false,
      render: (soldier: Soldier) => (
        <Button
          variant="outlined"
          size="small"
          onClick={() => handleViewDetails(soldier)}
          sx={{ minWidth: 'auto' }}
        >
          צפה בפרטים
        </Button>
      )
    }
  ];
  if (isLoading) {
    return <GenericLoading />;
  }
  if (error) {
    return <div>שגיאה בטעינת הנתונים</div>;
  }
  
  return (
    <>
      <GenericTable<Soldier>
        data={soldiers}
        columns={columns}
        keyExtractor={(item: Soldier, idx: number) => item.id || item.phone + idx}
        searchable
        filterable
        striped
        hoverable
        compact={false}
        searchPlaceholder="חפש חייל..."
        emptyMessage="לא נמצאו חיילים ממתינים לאישור"
        tableName="חיילים הממתינים לאישור"
      />
      {/* <SoldierDetailsPanel /> */}
    </>
  );
}

export default WaitingSoldiersTable;
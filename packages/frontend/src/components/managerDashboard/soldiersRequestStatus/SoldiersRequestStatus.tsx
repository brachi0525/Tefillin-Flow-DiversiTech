import React, { JSX, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Soldier, SoldierStatus } from '../../../features/soldier/soldierTypes';
import { setSelectedSoldier } from '../../../features/soldier/soldierSlice';
import GenericSoldierStatus from '../../genericSoldierStatus/GenericSoldierStatus';
import PhoneButton from '../../contactButtons/PhoneButton';
import WhatsAppButton from '../../contactButtons/WhatsAppButton';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import PhoneIcon from '@mui/icons-material/Phone';
import { useLoading } from '../../generics/genericLoading/LoadingContext';
import { Column } from '../../generics/genericTable/types';
import { SoldierActions } from '../../quickActions/quickActions';
import { useGetAllSoldier } from '../../../services/soldierService ';


const extraColumns: Column<Soldier>[] = [];
export default function SoldiersRequestStatus() {

  const { setLoading } = useLoading();
  const dispatch = useDispatch();

  const { data: soldiers, isLoading, error } = useGetAllSoldier();
  const handleViewDetails = (soldier: Soldier) => {
    dispatch(setSelectedSoldier(soldier));
    console.log("getting soldiers info")
  };
  useEffect(() => {
    setLoading(isLoading);
  }, [isLoading, setLoading]);

  const columns: Column<Soldier>[] = [
    { key: 'name', header: 'שם חייל', sortable: true, searchable: true },
    {
      key: 'phone', header: 'מספר טלפון', sortable: false, searchable: true, render: (soldier: Soldier) => (
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PhoneButton phoneNumber={soldier.phone} label={<PhoneIcon />}></PhoneButton>
          <WhatsAppButton phoneNumber={soldier.phone} label={<WhatsAppIcon />}></WhatsAppButton>
        </div>
      )
    },
    {
      key: 'currentStatus',
      header: 'סטטוס',
      sortable: true,
      searchable: true,
      filterOptions: Object.values(SoldierStatus),
      render: (_item: Soldier, value: SoldierStatus) => {
        return <span style={{ color: '#2196f3', fontWeight: 'bold' }}>{value}</span>;
      }
    },

    {
      key: 'actions',
      header: 'פעולות',
      sortable: false,
      searchable: false,
      render: (soldier: Soldier) => <SoldierActions soldier={soldier} />,
    },
  ];
  return <GenericSoldierStatus extraColumns={extraColumns} />;
}
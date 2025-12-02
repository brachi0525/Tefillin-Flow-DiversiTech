import { Tefillin, TefillinStatus } from "../features/tefillin/tefillinTypes";
import { useGetAllQuery, useGetByIdQuery, useUpdateMutation } from "./apiClient";

const path = '/tefilin';

export const useTefillinList = (
  params?: { search?: string; status?: TefillinStatus; locationId?: string }
) => {
  return useGetAllQuery({ path, params });
};

export const useUpdateTefillinStatus = () => {
  const [updateMutation, result] = useUpdateMutation<any>();

  const updateStatus = (id: string, status: TefillinStatus) => {
    return updateMutation({
      path: `${path}/status`,
      id: '',
      body: {tefilinId: id, status },
    });
  };

  return [updateStatus, result] as const; 
};

export const useTransferTefillin = () => {
  const [updateMutation, result] = useUpdateMutation<Tefillin>();

  const transfer = (id: string, toLocation: string) => {
    return updateMutation({
      path: `${path}/transfer`,
      id: '',
      body: { tefilinId: id, newLocationId: toLocation }, 
    });
  };

  return [transfer, result] as const;
};

export const useGetTefillinById = (id: string) => {
  return useGetByIdQuery({ path:`${path}/id`,id });
};
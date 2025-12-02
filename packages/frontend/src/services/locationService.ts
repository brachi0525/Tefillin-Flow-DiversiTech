import { CreateLocationDto, Location } from './../features/location/locationTypes';
import {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useRemoveMutation,
  useUpdateRabbiMutation,
} from './apiClient';

const path = '/locations';

export const useGetLocations = () => {
  const result = useGetAllQuery({ path });
  
  return result;
};

export const useGetLocationById = (id: string) => {
  const result = useGetByIdQuery({ path, id });
  return result;
};

export const useCreateLocation = () => {
  const [createMutation, result] = useCreateMutation<CreateLocationDto>();
  const createLocation = (location: CreateLocationDto) =>
    createMutation({ path, body: location });
  return [createLocation, result] as const;
};

export const useUpdateLocation = () => {
  const [updateMutation, result] = useUpdateMutation<Location>();
  const updateLocation = (location: Location) =>
    updateMutation({ path, id: location.id, body: location });
  return [updateLocation, result] as const;
};
export const useUpdateLocationRabbi = () => {
  const [UpdateRabbiMutation, result] = useUpdateRabbiMutation<Location>();
  const updateLocation = (locId:string,email:string) =>
    UpdateRabbiMutation({ path, id: locId, body: { email } });
  return [updateLocation, result] as const;
};
export const useRemoveLocation = () => {
  const [removeMutation, result] = useRemoveMutation<Location>();
  const removeLocation = (id: string) =>
    removeMutation({ path, id });
  return [removeLocation, result] as const;
};
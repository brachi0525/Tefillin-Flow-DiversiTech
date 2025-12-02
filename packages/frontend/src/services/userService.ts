
import { useCreateMutation, useGetAllQuery, useGetUserByRoleQuery, useRemoveMutation, useUpdateMutation } from "./apiClient";
import { UserDTO } from "./../features/user/userTypes";


const path = '/users';

export const useGetAll = () => {
  const { data, error, isLoading } = useGetAllQuery({ path });
  return { data: data , error, isLoading }; 
}
export const useGetUsersByRole = (role: string) => {
  const { data, error, isLoading, refetch} = useGetUserByRoleQuery({
    path,
    role,
  });
  return { data, error, isLoading, refetch };
};
export const useUpdateUser = () => {
  const [updateMutation, result] = useUpdateMutation<UserDTO>();

  const updateUser = (user: UserDTO) => {
    return updateMutation({
      path,
      id: user.email,
      body: user,
    });
  };

  return [updateUser, result] as const;
};

export const useCreateUser = () => {
  const [createMutation, result] = useCreateMutation<UserDTO>();

  const createUser = (user: UserDTO) => {
    return createMutation({
      path,
      body: user,
    });
  };

  return [createUser, result] as const;
};

export const useDeleteUser = () => {
  const [deleteMutation, result] = useRemoveMutation<{id : string}>();

   const deleteUser = (id : string) => {
    return deleteMutation({
      path,
      id,
    });
  };

  return [deleteUser, result] as const;
}
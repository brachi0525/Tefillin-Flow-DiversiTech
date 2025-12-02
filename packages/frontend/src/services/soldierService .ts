
import { Soldier, SoldierStatus } from "../features/soldier/soldierTypes";
import { useGetAllQuery, useGetByIdQuery, useUpdateMutation } from "./apiClient";

const path = '/soldiers';

export const useGetAllSoldier = (
  filters?: Record<string, any>, 
  search?: Record<string, string>
) => {
  const queryParams: Record<string, string> = {};

  if (filters && Object.keys(filters).length > 0) {
    queryParams.filters = JSON.stringify(filters);
  }

  if (search && Object.keys(search).length > 0) {
    queryParams.search = JSON.stringify(search);
  }

  const { data, error, isLoading, refetch } = useGetAllQuery({
    path,
    params: queryParams,
  });

  return {
    data: data || [],
    error,
    isLoading,
    refetch, 
  };
};

 export const useGetRegisteredSoldiers = () => {
    const { data, error, isLoading } = useGetAllQuery({ path: './soldiers/pending' });
    

    return { data: data || [], error, isLoading };
};


export type StatusCounts = Record<SoldierStatus, number>;

export const useStatusOverview = () => {
    const { data, ...result } = useGetAllQuery({ path });

    const soldiers = (data as Soldier[]) || [];

    const statusCounts = soldiers.reduce((acc: StatusCounts, soldier) => {
        const status = soldier.currentStatus;
        if (Object.values(SoldierStatus).includes(status)) {
            acc[status] = (acc[status] ?? 0) + 1;
        }
        return acc;
    }, {} as StatusCounts);

    return {
        statusCounts,
        totalSoldiers: soldiers.length,
        ...result,
    };
};


export const useGetSoldierByTefillinId = (tefillinId: string) => {
    return useGetByIdQuery({ path: `/soldiers/tefillin`, id: tefillinId });
}

export const useUpdateSoldierTefillinId = () => {
  const [updateMutation, result] = useUpdateMutation<Soldier>();
  const assignTefillin = (soldierId: string, tefillinId: string) => {
    return updateMutation({
      path: `/soldiers/assignTefillin`,
      id: soldierId,
      body: { tefillinId },
    });
  };
  return [assignTefillin, result] as const;
};


export const useGetSoldiersByStatus = (status: SoldierStatus) => {
  return useGetByIdQuery({ path:'soldiers/report', id: status });
};

export const useChangeSoldierStatus = () => {
  const [updateMutation, result] = useUpdateMutation<Soldier>();
  const changeStatus = (
    soldierId: string,
    newStatus: SoldierStatus,
  ) => {
    return updateMutation({
      path: `/soldiers/status`,
      id: soldierId,
      body: { new_status: newStatus },
    });
  };
  return [changeStatus, result] as const;
};

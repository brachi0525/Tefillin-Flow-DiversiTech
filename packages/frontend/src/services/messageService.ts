import { useGetAllQuery, useGetByIdQuery } from "./apiClient";

const path = '/messages';


export const useGetAllMessages = () => {
    const { data, error, isLoading } = useGetAllQuery({ path });
    return { data: data || [], error, isLoading };
};

export const useGetMessageById = (id: string) => {
    const result = useGetByIdQuery({ path, id });
    return result;
};

export const useGetMessagesByUsers = (fromRole: string, toRole: string) => {
    const { data, error, isLoading } = useGetAllQuery({ path, params: { fromRole, toRole } });
    return { data: data || [], error, isLoading };
};
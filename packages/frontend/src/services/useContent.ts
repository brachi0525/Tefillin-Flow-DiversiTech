import { useGetAllQuery, useUpdateMutation } from "./apiClient";

export const useContent = (path: string, id?: string) => {
  return useGetAllQuery({
    path: id ? `${path}/${id}` : path,
  });
};

export const useUpdateContent = (path: string) => {
  const [updateMutation, result] = useUpdateMutation<any>();

  const updateContent = async (body: any, adminEmail: string, lang: string) => {
    const res = await updateMutation({
      path,
      id: lang,
      body,
      // @ts-expect-error: headers are not typed
      headers: { 'x-admin-email': adminEmail },
    });

    if ('error' in res) {
      throw res.error;
    }

    return res.data;
  };

  return [updateContent, result] as const;
};

export function flattenObject(obj: any, prefix = ''): Record<string, string> {
  return Object.entries(obj).reduce((acc, [key, value]) => {
    const newKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null) {
      Object.assign(acc, flattenObject(value, newKey));
    } else {
      acc[newKey] = String(value);
    }
    return acc;
  }, {} as Record<string, string>);
}

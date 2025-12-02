import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api',
  credentials: 'include',
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiClient = createApi({
  reducerPath: 'apiClient',
  baseQuery,
  tagTypes: ['Generic'],
  endpoints: (builder) => ({
    getAll: builder.query<any[], { path: string; params?: Record<string, any> }>({
      query: ({ path, params }) => ({
        url: `${path}`,
        method: 'GET',
        params,
      }),
      providesTags: ['Generic'],
    }),

    getById: builder.query<any, { path: string; id: string }>({
      query: ({ path, id }) => `${path}/${id}`,
    }),

    create: builder.mutation<any, { path: string; body: any }>({
      query: ({ path, body }) => ({
        url: `${path}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Generic'],
    }),
    
    update: builder.mutation<any, { path: string; id: string; body: any }>({
      query: ({ path, id, body }) => ({
        url: `${path}/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Generic'],
    }),

    updateRabbi: builder.mutation<any, { path: string; id: string; body: any }>({
      query: ({ path, id, body }) => ({
        url: `${path}/${id}/rabbi`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Generic'],
    }),

    remove: builder.mutation<any, { path: string; id: string }>({
      query: ({ path, id }) => ({
        url: `${path}/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Generic'],
    }),

    getUserByRole: builder.query<any, { path: string; role: string }>({
      query: ({ path, role }) => `${path}/role/${role}`,
    }),

    refreshToken: builder.mutation<{ accessToken: string }, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        body: {
          refreshToken: localStorage.getItem('refreshToken') || '',
        },
      }),
    }),
  }),
});

export const {
  useGetAllQuery,
  useGetByIdQuery,
  useCreateMutation,
  useUpdateMutation,
  useUpdateRabbiMutation,
  useRemoveMutation,
  useGetUserByRoleQuery,
  useRefreshTokenMutation,
} = apiClient;

export default apiClient;

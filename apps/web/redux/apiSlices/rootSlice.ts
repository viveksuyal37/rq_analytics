import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rootApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'http://localhost:3002' }),
  endpoints: () => ({}),
});

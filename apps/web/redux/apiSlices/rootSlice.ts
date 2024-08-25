import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const rootApiSlice = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: 'https://rq-analytics.onrender.com' }),
  endpoints: () => ({}),
});

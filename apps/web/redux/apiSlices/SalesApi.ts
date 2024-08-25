import { querySchemaT } from '../../types/api.types';
import { rootApiSlice } from './rootSlice';

const SalesApi = rootApiSlice.injectEndpoints({
  endpoints: builder => ({
    getTotalSales: builder.query<any, querySchemaT>({
      query: params => ({
        url: '/sales/analytics/total',
        method: 'GET',
        params,
      }),
    }),
    getSalesGrowth: builder.query<any, querySchemaT>({
      query: params => ({
        url: '/sales/analytics/growth',
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const { useGetTotalSalesQuery, useGetSalesGrowthQuery } = SalesApi;

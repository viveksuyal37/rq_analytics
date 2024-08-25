import { cityLocationMapping } from '../../app/constants/cityLocationMapping';
import { querySchemaT } from '../../types/api.types';
import { rootApiSlice } from './rootSlice';

const customerApi = rootApiSlice.injectEndpoints({
  endpoints: builder => ({
    getNewCustomers: builder.query<any, querySchemaT>({
      query: params => ({
        url: '/customers/analytics/new',
        method: 'GET',
        params,
      }),
    }),
    getRepeatedCustomers: builder.query<any, querySchemaT>({
      query: params => ({
        url: '/customers/analytics/repeated',
        method: 'GET',
        params,
      }),
    }),
    getCityWiseCustomers: builder.query<any, any>({
      query: () => ({
        url: '/customers/analytics/citywise-dist',
        method: 'GET',
      }),
      transformResponse: (response: any) => {
        const transformedData = response.data?.map((item: any) => ({
          ...item,
          lat: cityLocationMapping[
            item.city as keyof typeof cityLocationMapping
          ].lat,
          long: cityLocationMapping[
            item.city as keyof typeof cityLocationMapping
          ].long,
        }));

        return transformedData;
      },
    }),
    getCustomerLTV: builder.query<any, any>({
      query: params => ({
        url: '/customers/analytics/value',
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useGetNewCustomersQuery,
  useGetCityWiseCustomersQuery,
  useGetRepeatedCustomersQuery,
  useGetCustomerLTVQuery,
} = customerApi;

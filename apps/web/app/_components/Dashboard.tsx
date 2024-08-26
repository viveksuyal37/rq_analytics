import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import {
  useGetSalesGrowthQuery,
  useGetTotalSalesQuery,
} from '../../redux/apiSlices/SalesApi';
import { Frequency, querySchemaT } from '../../types/api.types';

const SalesDashboard = () => {
  //TODO: Can use GlobalState to store params to maintain state across navigation

  const [params, setParams] = useState({
    year: 2023,
    frequency: Frequency.MONTHLY,
  });

  return (
    <div className="flex-grow w-full h-1 p-2 overflow-auto border border-gray-300 rounded-md ">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold">Dashboard</h2>
        <div className="flex gap-4">
          <select
            value={params.year}
            onChange={e =>
              setParams({ ...params, year: Number(e.target.value) })
            }
            className="p-1 text-black bg-gray-200 rounded-md"
          >
            {/* <option value={''}>choose year</option> */}
            <option value={2023}>2023</option>
            <option value={2022}>2022</option>
            <option value={2021}>2021</option>
            <option value={2020}>2020</option>
          </select>
          <select
            value={params.frequency}
            onChange={e =>
              setParams({ ...params, frequency: e.target.value as Frequency })
            }
            className="p-1 text-black bg-gray-200 rounded-md"
          >
            {/* <option value={''}>choose frequency</option> */}
            <option value={Frequency.DAILY}>Daily</option>
            <option value={Frequency.MONTHLY}>Monthly</option>
            <option value={Frequency.QUARTERLY}>Quarterly</option>
            <option value={Frequency.YEARLY}>Yearly</option>
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4 p-2 child-border child:border-black">
        <TotalSales params={params} />
        <SalesGrowth params={params} />
      </div>
    </div>
  );
};

type ApiParamsT = querySchemaT;

const TotalSales = ({ params }: { params: ApiParamsT }) => {
  const {
    data: totalSales,
    isSuccess,
    isFetching,
  } = useGetTotalSalesQuery({
    year: params.year,
    frequency: params.frequency,
  });

  console.log({ totalSales });

  if (isFetching) return <div>Loading...</div>;

  if (!isSuccess) return <div>Error</div>;

  return (
    <div className="w-full h-[300px] shadow-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-[10px]">Total Sales</h2>
      {isSuccess && totalSales?.data?.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            width={500}
            height={300}
            data={totalSales?.data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Area type="monotone" dataKey="totalSales" />
          </AreaChart>
        </ResponsiveContainer>
      ) : (
        <div>No data found</div>
      )}
    </div>
  );
};

const SalesGrowth = ({ params }: { params: ApiParamsT }) => {
  const {
    data: growth,
    isSuccess,
    isFetching,
  } = useGetSalesGrowthQuery({
    year: params.year,
    frequency: params.frequency,
  });

  const salesData = useMemo(() => {
    return growth?.data?.map((item: any) => ({
      ...item,
      salesGrowthRate: parseFloat(item.salesGrowthRate.replace('%', '')),
    }));
  }, [growth]);

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="w-full h-[300px] shadow-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-[10px]">Sales Growth</h2>
      {isSuccess && salesData?.length ? (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            width={500}
            height={300}
            data={salesData}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <XAxis dataKey="month" />
            <YAxis dataKey="salesGrowthRate" />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="salesGrowthRate" stroke="#82ca9d" />
          </LineChart>
        </ResponsiveContainer>
      ) : (
        <div>No data found</div>
      )}
    </div>
  );
};

export default SalesDashboard;

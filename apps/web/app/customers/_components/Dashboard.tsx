// import 'leaflet/dist/leaflet.css';
import {
  Bar,
  BarChart,
  Label,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { useState } from 'react';
import {
  useGetCustomerLTVQuery,
  useGetNewCustomersQuery,
  useGetRepeatedCustomersQuery,
} from '../../../redux/apiSlices/CustomerApi';
import { Frequency, querySchemaT } from '../../../types/api.types';

const CustomerDashboard = () => {
  const [params, setParams] = useState({
    year: 2022,
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
        <NewCustomers params={params} />
        <RepeatedCustomers params={params} />
        <ValuedCustomers params={params} />
      </div>
      <h2>note: citywise customer dist is disabled (as it was using window object in server /dist resulting in build errors) , uncomment and run project in dev mode to view it.</h2>
      {/* <CityWiseCustomers params={params} /> */}
    </div>
  );
};

type ApiParamsT = querySchemaT;

const NewCustomers = ({ params }: { params: ApiParamsT }) => {
  const {
    data: newCustomers,
    isSuccess,
    isFetching,
  } = useGetNewCustomersQuery({
    year: params.year,
    frequency: params.frequency,
  });

  console.log({ newCustomers });

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="w-full h-[350px] my-4 shadow-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-[10px]">New Customers</h2>
      {isSuccess && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={newCustomers?.data}
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

            <Bar type="monotone" dataKey="total" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const RepeatedCustomers = ({ params }: { params: ApiParamsT }) => {
  const {
    data: repeatedCustomers,
    isSuccess,
    isFetching,
  } = useGetRepeatedCustomersQuery({
    year: params.year,
    frequency: params.frequency,
  });

  console.log({ repeatedCustomers });

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="w-full h-[350px] my-4 shadow-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-[10px]">Repeated Customers</h2>
      {isSuccess && (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            width={500}
            height={300}
            data={repeatedCustomers?.data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 25,
            }}
          >
            <XAxis dataKey="month">
              <Label value="Month" offset={-5} position="insideBottom" />
            </XAxis>
            <YAxis />
            <Tooltip />
            <Legend />

            <Bar
              type="monotone"
              dataKey="orderCount"
              stroke="#1ddb66"
              fill="#5adb8c"
            />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

const ValuedCustomers = ({ params }: { params: ApiParamsT }) => {
  const {
    data: valuedCustomers,
    isFetching,
    isSuccess,
  } = useGetCustomerLTVQuery({
    year: params.year,
    frequency: params.frequency,
  });

  console.log({ valuedCustomers });

  if (isFetching) return <div>Loading...</div>;

  return (
    <div className="w-full h-[350px] col-span-2 my-4 shadow-md p-4 rounded-md">
      <h2 className="text-xl font-semibold mb-[10px]">
        Customer Lifetime Value
      </h2>
      {isSuccess && (
        <ResponsiveContainer width="100%" height="90%">
          <LineChart
            width={500}
            height={300}
            data={valuedCustomers?.data}
            margin={{
              top: 5,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <XAxis dataKey="customerCount" />
            <YAxis />
            <Tooltip />
            <Legend />

            <Line type="monotone" dataKey="lifetimeValue" />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

// const CityWiseCustomers = ({ params }: { params: ApiParamsT }) => {
//   const { data, isFetching, isSuccess } = useGetCityWiseCustomersQuery({
//     year: params.year,
//     frequency: params.frequency,
//   });
//   const position: LatLngTuple = [36.1699, -115.1398];

//   if (isFetching) return <div>Loading...</div>;
//   if (!isSuccess) return <div>Error</div>;

//   const myIcon = new L.Icon({
//     iconUrl:
//       'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=50&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     // iconRetinaUrl:
//     //   'https://plus.unsplash.com/premium_photo-1683121366070-5ceb7e007a97?q=80&w=70&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
//     popupAnchor: [-0, -0],
//     iconSize: [32, 45],
//   });

//   return (
//     <div className="my-4">
//       <h2 className="text-xl font-semibold">
//         City Wise Customers Representation
//       </h2>
//       <MapContainer
//         style={{
//           maxHeight: '700px',
//           margin: '10px 20px',
//           height: '700px',
//           border: '1px solid black',
//         }}
//         center={position}
//         zoom={5}
//         scrollWheelZoom={false}
//       >
//         <TileLayer
//           attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//           url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//         />
//         {data.map((city: any, index: number) => (
//           <Marker key={index} position={[city.lat, city.long]} icon={myIcon}>
//             <Popup>{city.count} customers</Popup>
//           </Marker>
//         ))}
//       </MapContainer>
//     </div>
//   );
// };

export default CustomerDashboard;

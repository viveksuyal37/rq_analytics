import type { Metadata } from 'next';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Aside from '../components/Aside';
import Nav from '../components/Nav';
import ReduxProvider from './ReduxProvider';
import './globals.css';

export const metadata: Metadata = {
  title: 'RQ Analytics',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <ToastContainer />
        <Nav />
        <div className="flex-grow flex gap-3">
          <Aside />

          <ReduxProvider>{children}</ReduxProvider>
        </div>
      </body>
    </html>
  );
}

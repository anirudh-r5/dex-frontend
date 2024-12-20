import type { Metadata } from 'next';
import { notoSans } from './components/ui/fonts';
import './globals.css';
import '@rainbow-me/rainbowkit/styles.css';
import NavBar from './components/ui/Navbar';
import Connections from './components/ui/Connections';

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`h-full ${notoSans.className} antialiased`}>
        <Connections>
          <NavBar />
          {children}
        </Connections>
      </body>
    </html>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Sportselling Marketplace',
  description: 'Discover sports memorabilia and connect with fellow collectors.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

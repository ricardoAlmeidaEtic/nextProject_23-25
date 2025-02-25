import type { Metadata } from "next";
import "./globals.css";
import Drawer from '../components/Drawer/Drawer';

export const metadata: Metadata = {
  title: "Groupie",
  description: "Sophisticated music streaming experience",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased bg-wine-800  text-ivory-100">
        <div className="drawer lg:drawer-open">
          <input id="main-drawer" type="checkbox" className="drawer-toggle" />
          
          {/* Main Content */}
          <div className="drawer-content flex flex-col">
            {/* Mobile Menu Button */}
            <label htmlFor="main-drawer" className="btn btn-ghost lg:hidden fixed top-4 left-4 z-50 text-ivory-100 hover:bg-wine-800">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            </label>
            
            {/* Page Content */}
            <main className="flex-1 p-4 lg:p-8 lg:ml-64 bg-gradient-to-br from-wine-900/90 via-wine-900/50 to-wine-950">
              {children}
            </main>
          </div>
          
          {/* Drawer Sidebar */}
          <Drawer />
        </div>
      </body>
    </html>
  );
}
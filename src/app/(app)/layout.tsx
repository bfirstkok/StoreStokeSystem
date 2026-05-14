"use client";

import { useState } from "react";
import Sidebar from "@/components/layout/Sidebar";
import Topbar from "@/components/layout/Topbar";

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 text-gray-900">
      <Sidebar
        isOpen={isMobileSidebarOpen}
        setIsOpen={setIsMobileSidebarOpen}
      />

      <div className="min-h-screen w-full md:pl-64">
        <Topbar onMenuClick={() => setIsMobileSidebarOpen(true)} />
        <main className="mx-auto w-full max-w-[1500px] px-3 py-4 sm:px-5 lg:px-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;

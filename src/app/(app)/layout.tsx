
"use client";

import { Header } from "@/components/header";
import { DesktopSidebar } from "@/components/desktop-sidebar";
import { getUserById, updateUser } from "@/lib/dummy-data";
import { useEffect, useState, Suspense } from "react";
import type { User } from "@/lib/types";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

const OnboardingTutorial = dynamic(() => import('@/components/onboarding-tutorial').then(mod => mod.OnboardingTutorial), {
  ssr: false,
  loading: () => <div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" />,
});


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const loggedInId = localStorage.getItem('loggedInUser');
    if (loggedInId) {
      const currentUser = getUserById(loggedInId);
      setUser(currentUser || null);
    }
  }, []);

  const handleTutorialFinish = () => {
    if (user) {
      const updatedUser = { ...user, hasSeenTutorial: true };
      updateUser(updatedUser);
      setUser(updatedUser);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Desktop Sidebar - Hidden on Mobile */}
      <DesktopSidebar />

      {/* Mobile Header - Hidden on Desktop */}
      <Header />

      {/* Main Content - Adjust padding for desktop sidebar */}
      <main className="pb-24 lg:pb-8 lg:pl-64">{children}</main>

      {isClient && user && !user.hasSeenTutorial && (
        <Suspense fallback={<div className="fixed inset-0 bg-black/60 z-[100] backdrop-blur-sm" />}>
          <OnboardingTutorial onFinish={handleTutorialFinish} />
        </Suspense>
      )}
    </div>
  );
}

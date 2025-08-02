
"use client";

import { Header } from "@/components/header";
import { OnboardingTutorial } from "@/components/onboarding-tutorial";
import { getUserById, updateUser } from "@/lib/dummy-data";
import { useEffect, useState } from "react";
import type { User } from "@/lib/types";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
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
      <Header />
      <main className="pb-24">{children}</main>
      {user && !user.hasSeenTutorial && (
        <OnboardingTutorial onFinish={handleTutorialFinish} />
      )}
    </div>
  );
}

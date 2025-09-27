'use client';

import { useState, useEffect } from 'react';

export default function WelcomeBanner({ name, role }: { name: string, role: string }) {
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const getGreeting = () => {
      const hours = new Date().getHours();
      if (hours < 12) return 'Good morning';
      if (hours < 18) return 'Good afternoon';
      return 'Good evening';
    };
    setGreeting(getGreeting());
  }, []);

  return (
    <div className="p-6 rounded-lg bg-card shadow-sm">
      <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
        {greeting ? `${greeting}, ${name}!` : `Welcome, ${name}!`}
      </h1>
      <p className="text-muted-foreground">
        Welcome to your {role} dashboard.
      </p>
    </div>
  );
}

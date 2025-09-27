'use client';

import { useState, useEffect } from 'react';

export default function DateTime() {
  const [date, setDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setDate(new Date()), 1000);
    return () => {
      clearInterval(timer);
    };
  }, []);

  const formattedDate = date.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const formattedTime = date.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="hidden md:flex items-center gap-2 text-sm">
      <span>{formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1)}</span>
      <span className="font-semibold">{formattedTime}</span>
    </div>
  );
}

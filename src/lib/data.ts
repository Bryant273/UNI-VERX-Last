'use server';
import type { LucideIcon } from 'lucide-react';
import { allEvents } from './static-data';

export type UserRole = 
  | 'student' 
  | 'professor' 
  | 'academic-advisor' 
  | 'secretariat' 
  | 'rectorate'
  | 'admin'
  | 'erp-provider';

export interface NavLink {
  href: string;
  label: string;
  icon: LucideIcon;
}

export interface NavGroup {
  title: string;
  links: NavLink[];
}

export type NavItem = NavLink | NavGroup;

export type TimetableEventType = 'cours' | 'devoir' | 'examen' | 'activité' | 'td' | 'tp';
export type PresenceStatus = 'validated' | 'pending' | 'absent' | 'na';

export interface TimetableEvent {
  id: number;
  time: string;
  course: string;
  location: string;
  type: TimetableEventType;
  instructor?: string;
  fileLink?: string;
  profComment?: string;
  presenceStatus?: PresenceStatus;
  isPast?: boolean;
  attendanceTaken?: boolean; // New property
}

// Function to get the current or next event for a user
export async function getActiveEvent(role: UserRole): Promise<TimetableEvent | null> {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes(); // Current time in minutes from midnight

  const userEvents = allEvents[role];

  if (!userEvents || userEvents.length === 0) {
    return null;
  }

  // Find the first event that is currently happening
  const activeEvent = userEvents.find(event => {
    if (event.isPast) return false;
    const [startTime, endTime] = event.time.split(' - ').map(t => {
      const [hours, minutes] = t.split(':').map(Number);
      return hours * 60 + minutes;
    });
    return currentTime >= startTime && currentTime < endTime;
  });

  if (activeEvent) {
    return activeEvent;
  }
  
  return null; // Return null if no event is currently active
};

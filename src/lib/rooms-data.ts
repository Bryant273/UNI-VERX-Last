

import type { LucideIcon } from 'lucide-react';
import { Projector, Wifi, Users, Tv, Mic, Wind, Hand, Monitor, FlaskConical } from 'lucide-react';

export type RoomStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type RoomType = 'cours' | 'tp' | 'amphi' | 'reunion' | 'laboratoire';

export interface Room {
    id: number;
    name: string;
    building: string;
    floor: number;
    type: RoomType;
    capacity: number;
    status: RoomStatus;
    equipment: Array<{ name: string; icon: LucideIcon; }>;
    currentOccupation: string | null;
    nextReservation: string;
    area: number;
    accessibility: boolean;
}

export const allRooms: Room[] = [
    {
        id: 1, name: "A101", building: "A", floor: 1, type: "cours", capacity: 45, status: "available", 
        equipment: [{name: 'Projecteur', icon: Projector}, {name: 'Wi-Fi', icon: Wifi}, {name: 'Son', icon: Users}], 
        currentOccupation: null, nextReservation: "14:00 - Cours de Math", area: 65, accessibility: true
    },
    {
        id: 2, name: "A102", building: "A", floor: 1, type: "tp", capacity: 25, status: "occupied", 
        equipment: [{name: 'PC', icon: Monitor}, {name: 'Projecteur', icon: Projector}, {name: 'Wi-Fi', icon: Wifi}], 
        currentOccupation: "10:00-12:00 - TP Info", nextReservation: "14:00 - TP BDD", area: 45, accessibility: true
    },
    {
        id: 3, name: "A201", building: "A", floor: 2, type: "amphi", capacity: 120, status: "reserved", 
        equipment: [{name: 'Projecteur', icon: Projector}, {name: 'Son', icon: Users}, {name: 'Micro', icon: Mic}, {name: 'Wi-Fi', icon: Wifi}], 
        currentOccupation: null, nextReservation: "09:00 - Conférence", area: 150, accessibility: true
    },
    {
        id: 4, name: "B103", building: "B", floor: 1, type: "laboratoire", capacity: 15, status: "maintenance", 
        equipment: [{name: 'Hotte', icon: Wind}, {name: 'Équipement spécialisé', icon: FlaskConical}], 
        currentOccupation: null, nextReservation: "Indisponible", area: 35, accessibility: false
    },
    {
        id: 5, name: "B201", building: "B", floor: 2, type: "reunion", capacity: 12, status: "available", 
        equipment: [{name: 'Écran TV', icon: Tv}, {name: 'Visioconférence', icon: Mic}, {name: 'Wi-Fi', icon: Wifi}], 
        currentOccupation: null, nextReservation: "16:00 - Réunion", area: 25, accessibility: true
    },
    {
        id: 6, name: "C105", building: "C", floor: 1, type: "cours", capacity: 35, status: "occupied", 
        equipment: [{name: 'Projecteur', icon: Projector}, {name: 'Wi-Fi', icon: Wifi}], 
        currentOccupation: "11:00-13:00 - Anglais", nextReservation: "15:00 - Histoire", area: 50, accessibility: true
    },
    {
        id: 7, name: "C204", building: "C", floor: 2, type: "tp", capacity: 20, status: "available", 
        equipment: [{name: 'PC', icon: Monitor}, {name: 'Projecteur', icon: Projector}, {name: 'Wi-Fi', icon: Wifi}], 
        currentOccupation: null, nextReservation: "13:00 - TP Web", area: 40, accessibility: false
    },
    {
        id: 8, name: "D001", building: "D", floor: 0, type: "amphi", capacity: 200, status: "available", 
        equipment: [{name: 'Projecteur', icon: Projector}, {name: 'Son', icon: Users}, {name: 'Micro', icon: Mic}, {name: 'Wi-Fi', icon: Wifi}], 
        currentOccupation: null, nextReservation: "Libre", area: 250, accessibility: true
    }
];

// Compléter avec plus de salles pour la démonstration
for (let i = 9; i <= 42; i++) {
    const buildings = ['A', 'B', 'C', 'D'];
    const types: RoomType[] = ['cours', 'tp', 'reunion', 'laboratoire'];
    const statuses: RoomStatus[] = ['available', 'occupied', 'reserved', 'maintenance'];
    
    allRooms.push({
        id: i,
        name: `${buildings[i % 4]}${Math.floor(100 + (i * 3) % 300)}`,
        building: buildings[i % 4],
        floor: Math.floor((i % 10) / 3) + 1,
        type: types[i % 4],
        capacity: 15 + (i % 8) * 10,
        status: statuses[i % 4],
        equipment: [{name: 'Projecteur', icon: Projector}, {name: 'Wi-Fi', icon: Wifi}],
        currentOccupation: i % 3 === 0 ? "Occupée" : null,
        nextReservation: i % 2 === 0 ? "Prochaine réservation" : "Libre",
        area: 25 + (i % 5) * 10,
        accessibility: i % 3 === 0
    });
}

export interface TimeSlot {
  id: number;
  start: string;
  end: string;
}

export interface DaySetting {
  id: string;
  name: string;
  active: boolean;
}

export interface BreakSetting {
  id: number;
  name: string;
  start: string;
  end: string;
}

const generateTimeSlots = (): TimeSlot[] => {
  return [
    { id: 1, start: '08:30', end: '10:00' },
    { id: 2, start: '10:30', end: '12:00' },
    { id: 3, start: '13:30', end: '15:00' },
    { id: 4, start: '15:30', end: '17:00' },
  ];
};

const generateDays = (): DaySetting[] => {
    return [
        { id: 'lundi', name: 'Lundi', active: true },
        { id: 'mardi', name: 'Mardi', active: true },
        { id: 'mercredi', name: 'Mercredi', active: true },
        { id: 'jeudi', name: 'Jeudi', active: true },
        { id: 'vendredi', name: 'Vendredi', active: true },
        { id: 'samedi', name: 'Samedi', active: true },
    ];
};

const generateBreaks = (): BreakSetting[] => {
    return [
        { id: 1, name: 'Pause Déjeuner', start: '12:00', end: '13:30' },
    ];
};


export const initialTimeSlots = generateTimeSlots();
export const initialDays = generateDays();
export const initialBreaks = generateBreaks();

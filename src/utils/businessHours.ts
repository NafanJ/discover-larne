interface BusinessHour {
  day: string;
  closed: boolean;
  open?: string;
  close?: string;
}

const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const isBusinessOpenNow = (workingHours: string | null | any): boolean => {
  if (!workingHours) return false;
  
  try {
    const hoursString = typeof workingHours === 'string' ? workingHours : JSON.stringify(workingHours);
    const hours: BusinessHour[] = JSON.parse(hoursString);
    const now = new Date();
    const currentDay = dayNames[now.getDay()];
    const currentTime = now.getHours() * 60 + now.getMinutes(); // minutes since midnight
    
    const todayHours = hours.find(h => h.day === currentDay);
    if (!todayHours || todayHours.closed) return false;
    
    if (!todayHours.open || !todayHours.close) return false;
    
    const [openHour, openMin] = todayHours.open.split(':').map(Number);
    const [closeHour, closeMin] = todayHours.close.split(':').map(Number);
    
    const openTime = openHour * 60 + openMin;
    const closeTime = closeHour * 60 + closeMin;
    
    // Handle times that cross midnight
    if (closeTime < openTime) {
      return currentTime >= openTime || currentTime <= closeTime;
    }
    
    return currentTime >= openTime && currentTime <= closeTime;
  } catch (e) {
    return false;
  }
};

export const getCurrentDayName = (): string => {
  return dayNames[new Date().getDay()];
};

export const formatBusinessHours = (workingHours: string | null | any): BusinessHour[] | null => {
  if (!workingHours) return null;
  
  try {
    const hoursString = typeof workingHours === 'string' ? workingHours : JSON.stringify(workingHours);
    return JSON.parse(hoursString);
  } catch (e) {
    return null;
  }
};
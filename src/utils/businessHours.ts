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
    let hours: BusinessHour[];
    
    // Handle different data types from database
    if (Array.isArray(workingHours)) {
      hours = workingHours;
    } else if (typeof workingHours === 'string') {
      hours = JSON.parse(workingHours);
    } else if (typeof workingHours === 'object') {
      hours = workingHours;
    } else {
      return false;
    }
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
    // Handle different data types from database
    if (Array.isArray(workingHours)) {
      return workingHours;
    } else if (typeof workingHours === 'string') {
      return JSON.parse(workingHours);
    } else if (typeof workingHours === 'object') {
      return workingHours;
    }
    return null;
  } catch (e) {
    return null;
  }
};
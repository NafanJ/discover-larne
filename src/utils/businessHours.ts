interface BusinessHour {
  day: string;
  closed: boolean;
  open?: string;
  close?: string;
}

const dayNames = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const dayAbbreviations: { [key: string]: string } = {
  'Su': 'Sunday',
  'Mo': 'Monday', 
  'Tu': 'Tuesday',
  'We': 'Wednesday',
  'Th': 'Thursday',
  'Fr': 'Friday',
  'Sa': 'Saturday'
};

const parseBusinessHoursString = (hoursArray: string[]): BusinessHour[] => {
  return hoursArray.map(hourString => {
    const parts = hourString.split(' ');
    const dayAbbr = parts[0];
    const timeInfo = parts[1];
    
    const day = dayAbbreviations[dayAbbr] || dayAbbr;
    
    if (timeInfo === 'Closed') {
      return { day, closed: true };
    } else {
      const [open, close] = timeInfo.split('-');
      return { day, closed: false, open, close };
    }
  });
};

export const isBusinessOpenNow = (workingHours: string | null | any): boolean => {
  if (!workingHours) return false;
  
  try {
    let hoursArray: string[];
    
    // Handle different data types from database
    if (Array.isArray(workingHours)) {
      hoursArray = workingHours;
    } else if (typeof workingHours === 'string') {
      hoursArray = JSON.parse(workingHours);
    } else {
      return false;
    }
    
    const hours = parseBusinessHoursString(hoursArray);
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
    let hoursArray: string[];
    
    // Handle different data types from database
    if (Array.isArray(workingHours)) {
      hoursArray = workingHours;
    } else if (typeof workingHours === 'string') {
      hoursArray = JSON.parse(workingHours);
    } else {
      return null;
    }
    
    return parseBusinessHoursString(hoursArray);
  } catch (e) {
    return null;
  }
};
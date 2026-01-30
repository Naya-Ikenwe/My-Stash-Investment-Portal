import { v4 as uuidv4 } from "uuid";

export const detectDeviceInfo = () => {
  if (typeof window === 'undefined') {
    return {
      browser: 'Unknown',
      os: 'Unknown',
      deviceType: 'Desktop',
      deviceName: 'Web Browser'
    };
  }

  const ua = navigator.userAgent;
  let browser = 'Unknown Browser';
  let os = 'Unknown OS';
  let deviceType = 'Desktop';

  // Detect Browser
  if (ua.includes('Firefox') && !ua.includes('Seamonkey')) {
    browser = 'Firefox';
  } else if (ua.includes('Chrome') && !ua.includes('Edg') && !ua.includes('OPR')) {
    browser = 'Chrome';
  } else if (ua.includes('Safari') && !ua.includes('Chrome') && !ua.includes('Android')) {
    browser = 'Safari';
  } else if (ua.includes('Edg')) {
    browser = 'Edge';
  } else if (ua.includes('Opera') || ua.includes('OPR')) {
    browser = 'Opera';
  } else if (ua.includes('Brave')) {
    browser = 'Brave';
  }

  // Detect OS
  if (ua.includes('Windows')) {
    os = 'Windows';
  } else if (ua.includes('Mac OS')) {
    os = 'macOS';
  } else if (ua.includes('Linux')) {
    os = 'Linux';
  } else if (ua.includes('Android')) {
    os = 'Android';
  } else if (ua.includes('iOS') || ua.includes('iPhone') || ua.includes('iPad')) {
    os = 'iOS';
  }

  // Detect Device Type
  if (/mobile/i.test(ua)) {
    deviceType = 'Mobile';
  } else if (/tablet/i.test(ua)) {
    deviceType = 'Tablet';
  }

  return {
    browser,
    os,
    deviceType,
    deviceName: `${browser} on ${os} (${deviceType})`
  };
};

// Get or create persistent device ID
export const getOrCreateDeviceId = (): string => {
  if (typeof window === 'undefined') return '';
  
  // Check localStorage first
  let deviceId = localStorage.getItem('deviceId');
  
  // If not found, generate new one and store it
  if (!deviceId) {
    deviceId = uuidv4();
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
};

// Initialize device info (call this on app startup)
export const initializeDevice = () => {
  if (typeof window === 'undefined') return null;
  
  const deviceId = getOrCreateDeviceId();
  const { deviceName } = detectDeviceInfo();
  
  return { deviceId, deviceName };
};
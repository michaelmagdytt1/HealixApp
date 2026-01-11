import { createContext, useContext, useState } from 'react';
import Colors from '../constants/colors';

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);
  const [language, setLanguage] = useState('English');
  
  const [isNotificationsEnabled, setIsNotificationsEnabled] = useState(true);

  const toggleTheme = () => setIsDark(prev => !prev);
  const changeLanguage = () => setLanguage(prev => prev === 'English' ? 'Arabic' : 'English');
  
  const toggleNotifications = () => setIsNotificationsEnabled(prev => !prev);

  const translations = {
    English: {
      settings: "Settings",
      general: "General",
      language: "Language",
      theme: "Theme",
      notifications: "Notifications",
      account: "Account",
      logout: "Log out",
      notifOffTitle: "Notifications are OFF",
      notifOffMsg: "Please enable notifications from settings to view your health risk analysis.",
      riskTitle: "Current Health Risk",
      riskLevel: "Low Risk",
      riskDesc: "based on your 30-day health data",
      factors: "Risk Factors Analysis"
    },
    Arabic: {
      settings: "الإعدادات",
      general: "عام",
      language: "اللغة",
      theme: "المظهر",
      notifications: "الإشعارات",
      account: "الحساب",
      logout: "خروج",
      notifOffTitle: "الإشعارات مغلقة",
      notifOffMsg: "يرجى تفعيل الإشعارات من الإعدادات لرؤية تحليل المخاطر الصحية.",
      riskTitle: "مستوى الخطر الحالي",
      riskLevel: "خطر منخفض",
      riskDesc: "بناءً على بيانات صحتك لآخر 30 يوم",
      factors: "تحليل عوامل الخطر"
    }
  };

  const theme = {
    isDark,
    language,
    toggleTheme,
    changeLanguage,
    
    isNotificationsEnabled,
    toggleNotifications,
    t: translations[language],
    colors: {
      background: isDark ? '#121212' : Colors.bgMain,
      card: isDark ? '#1E1E1E' : '#FFFFFF',
      text: isDark ? '#FFFFFF' : Colors.textDark,
      textSub: isDark ? '#AAAAAA' : Colors.textGray,
      tabBar: isDark ? '#1E1E1E' : '#FFFFFF',
      iconDefault: isDark ? '#555' : '#B0B0B0',
    }
  };

  return (
    <ThemeContext.Provider value={theme}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
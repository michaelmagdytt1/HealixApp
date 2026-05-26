import { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import CustomLoading from "./src/components/CustomLoading";
import { ThemeProvider } from "./src/context/ThemeContext";
// 👈 1. استدعاء الـ DataContext اللي لسه عاملينه
import { DataProvider } from "./src/context/DataContext";
import AppNavigator from "./src/navigation/AppNavigator";

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadingFinish = () => {
    setIsLoading(false);
  };

  if (isLoading) {
    return <CustomLoading onFinish={handleLoadingFinish} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        {/* 👈 2. غلفنا التطبيق بالداتا عشان تبقى مقروءة في أي شاشة */}
        <DataProvider>
          <AppNavigator />
        </DataProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

import { useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import CustomLoading from './src/components/CustomLoading';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

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
        <AppNavigator />
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
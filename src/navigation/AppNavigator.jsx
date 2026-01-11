import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../context/ThemeContext';

import Colors from '../constants/colors';
import DetailsScreen from '../screens/DetailsScreen';
import HistoryScreen from '../screens/HistoryScreen';
import HomeScreen from '../screens/HomeScreen';
import SettingsScreen from '../screens/SettingsScreen';


import NotificationsScreen from '../screens/NotificationsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

function BottomTabNavigator() {
  const { colors } = useTheme();

  return (
    <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarShowLabel: false,
          tabBarStyle: [styles.tabBar, { backgroundColor: colors.tabBar }],
          tabBarIcon: ({ focused }) => {
            let iconName;
            if (route.name === 'Home') iconName = 'home';
            else if (route.name === 'History') iconName = 'calendar';
            else if (route.name === 'Settings') iconName = 'settings';

            if (focused) {
                return (
                    <View style={styles.activeIconContainer}>
                         <Ionicons name={iconName} size={28} color={Colors.white} />
                    </View>
                )
            }
            return <Ionicons name={iconName + '-outline'} size={28} color={colors.iconDefault} />;
          },
        })}
      >
        <Tab.Screen name="Settings" component={SettingsScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="History" component={HistoryScreen} />
      </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
        <Stack.Screen name="Details" component={DetailsScreen} />
        
  
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
    tabBar: {
        position: 'absolute',
        bottom: 25,
        left: 20,
        right: 20,
        elevation: 10,
        borderRadius: 25,
        height: 70,
        borderTopWidth: 0,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },
    activeIconContainer: {
        width: 60,
        height: 60,
        backgroundColor: Colors.primaryTeal,
        borderRadius: 30,
        justifyContent: 'center',
        alignItems: 'center',
        top: -15,
        shadowColor: Colors.primaryTeal,
        shadowOffset: { width: 0, height: 5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
        elevation: 6,
    }
});
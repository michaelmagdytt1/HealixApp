import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Colors from "../constants/colors";
import { useTheme } from "../context/ThemeContext";

// استدعاء الشاشات
import DetailsScreen from "../screens/DetailsScreen";
import DeviceConnectionScreen from "../screens/DeviceConnectionScreen";
import DoctorHomeScreen from "../screens/DoctorHomeScreen";
import DoctorProfileScreen from "../screens/DoctorProfileScreen";
import DoctorProfileSetup from "../screens/DoctorProfileSetup";
import FamilyHomeScreen from "../screens/FamilyHomeScreen";
import HistoryScreen from "../screens/HistoryScreen";
import HomeScreen from "../screens/HomeScreen";
import LoginScreen from "../screens/LoginScreen";
import NotificationsScreen from "../screens/NotificationsScreen";
import PatientProfileScreen from "../screens/PatientProfileScreen";
import PatientProfileSetup from "../screens/PatientProfileSetup";
import RoleSelectionScreen from "../screens/RoleSelectionScreen";
import SettingsScreen from "../screens/SettingsScreen";
import SignUpScreen from "../screens/SignUpScreen";

// استدعاء شاشة تفاصيل المريض للدكتور
import PatientDetailsForDoctor from "../screens/PatientDetailsForDoctor";

// استدعاء شاشة بيانات العائلة الجديدة
import FamilyProfileSetup from "../screens/FamilyProfileSetup";

// استدعاء شاشة بروفايل العائلة
import FamilyProfileScreen from "../screens/FamilyProfileScreen";

// استدعاء شاشة الشات بين المريض والدكتور
import PatientDoctorChat from "../screens/PatientDoctorChat";

// 🚀 استدعاء شاشة قائمة الدكاترة الخاصة بالمريض
import MyDoctorsScreen from "../screens/MyDoctorsScreen";

// 🌟 المكون السحري: Custom Tab Bar 🌟
function MyCustomTabBar({ state, descriptors, navigation, isDark }) {
  const themeBg = isDark ? "#162B3A" : "#FFFFFF";
  const shadowCol = isDark ? "#000000" : "#94A3B8";

  return (
    <View
      style={[
        styles.floatingBar,
        { backgroundColor: themeBg, shadowColor: shadowCol },
      ]}
    >
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        // تحديد الأيقونات والأسماء بناءً على اسم الشاشة
        let iconName = "grid";
        let label = "Home";
        if (route.name === "History") {
          iconName = "stats-chart";
          label = "History";
        } else if (route.name === "Settings") {
          iconName = "options";
          label = "Settings";
        } else if (
          route.name === "DoctorProfile" ||
          route.name === "FamilyProfile"
        ) {
          iconName = "person";
          label = "Profile";
        }

        return (
          <TouchableOpacity
            key={index}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={styles.tabButton}
            activeOpacity={0.6}
          >
            <Ionicons
              name={isFocused ? iconName : `${iconName}-outline`}
              size={isFocused ? 26 : 24}
              color={
                isFocused ? Colors.primaryTeal : isDark ? "#64748B" : "#94A3B8"
              }
            />

            {isFocused && (
              <Text
                style={[styles.tabLabel, { color: Colors.primaryTeal }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {label}
              </Text>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// 🟢 شريط التنقل السفلي الخاص بالمريض 🟢
function PatientBottomTabNavigator() {
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MyCustomTabBar {...props} isDark={isDark} />}
    >
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="History" component={HistoryScreen} />
    </Tab.Navigator>
  );
}

// 🔵 شريط التنقل السفلي الخاص بالدكتور 🔵
function DoctorBottomTabNavigator() {
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MyCustomTabBar {...props} isDark={isDark} />}
    >
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Home" component={DoctorHomeScreen} />
      <Tab.Screen name="DoctorProfile" component={DoctorProfileScreen} />
    </Tab.Navigator>
  );
}

// 🟠 شريط التنقل السفلي الخاص بالعائلة 🟠
function FamilyBottomTabNavigator() {
  const { isDark } = useTheme();
  return (
    <Tab.Navigator
      screenOptions={{ headerShown: false }}
      tabBar={(props) => <MyCustomTabBar {...props} isDark={isDark} />}
    >
      <Tab.Screen name="Settings" component={SettingsScreen} />
      <Tab.Screen name="Home" component={FamilyHomeScreen} />
      <Tab.Screen name="FamilyProfile" component={FamilyProfileScreen} />
    </Tab.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerShown: false,
          animation: "fade_from_bottom",
        }}
      >
        {/* شاشات الـ Auth */}
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="SignUp" component={SignUpScreen} />
        <Stack.Screen name="RoleSelection" component={RoleSelectionScreen} />

        {/* شاشات استكمال البيانات */}
        <Stack.Screen
          name="PatientProfileSetup"
          component={PatientProfileSetup}
        />
        <Stack.Screen
          name="DoctorProfileSetup"
          component={DoctorProfileSetup}
        />
        <Stack.Screen
          name="FamilyProfileSetup"
          component={FamilyProfileSetup}
        />

        {/* شاشات التطبيق الأساسية (مربوطة بالـ Tab Navigators) */}
        <Stack.Screen
          name="PatientHome"
          component={PatientBottomTabNavigator}
        />
        <Stack.Screen name="DoctorHome" component={DoctorBottomTabNavigator} />
        <Stack.Screen name="FamilyHome" component={FamilyBottomTabNavigator} />

        {/* شاشات فرعية */}
        <Stack.Screen
          name="DeviceConnection"
          component={DeviceConnectionScreen}
          options={{ headerShown: true }}
        />
        <Stack.Screen name="Details" component={DetailsScreen} />
        <Stack.Screen name="Notifications" component={NotificationsScreen} />
        <Stack.Screen name="PatientProfile" component={PatientProfileScreen} />
        <Stack.Screen
          name="PatientDetailsForDoctor"
          component={PatientDetailsForDoctor}
        />

        {/* شاشة الشات المضافة حديثاً */}
        <Stack.Screen name="PatientDoctorChat" component={PatientDoctorChat} />

        {/* 🚀 شاشة قائمة الدكاترة المضافة حديثاً */}
        <Stack.Screen name="MyDoctors" component={MyDoctorsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  floatingBar: {
    flexDirection: "row",
    position: "absolute",
    bottom: Platform.OS === "ios" ? 30 : 20,
    left: 20,
    right: 20,
    height: 70,
    borderRadius: 35,
    elevation: 15,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  tabButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "700",
    marginTop: 4,
    textAlign: "center",
  },
});

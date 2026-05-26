import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons"; // 🚀 ضفنا FontAwesome5
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import Colors from "../constants/colors";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const SettingsScreen = ({ navigation }) => {
  const {
    isDark,
    toggleTheme,
    language,
    changeLanguage,
    colors,
    t,
    isNotificationsEnabled,
    toggleNotifications,
  } = useTheme();

  const { setPatientId, setUserName } = useData();
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const userId = await AsyncStorage.getItem("patientId");
        if (userId) {
          const response = await axios.get(
            `https://healixbackend-production.up.railway.app/api/auth/profile/${userId}`,
          );
          setUserRole(response.data.role);
        }
      } catch (error) {
        console.log("Error fetching role:", error);
      }
    };
    fetchUserRole();
  }, []);

  const handleLogout = () => {
    Alert.alert(t.logout, "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Yes, Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await AsyncStorage.removeItem("patientId");
            await AsyncStorage.removeItem("userName");
            setPatientId(null);
            setUserName("");
            navigation.reset({
              index: 0,
              routes: [{ name: "Login" }],
            });
          } catch (error) {
            console.error("Error clearing async storage during logout:", error);
          }
        },
      },
    ]);
  };

  return (
    <View
      style={[styles.mainContainer, { backgroundColor: colors.background }]}
    >
      {/* === Modern Header === */}
      <View
        style={[
          styles.header,
          { backgroundColor: isDark ? "#1E293B" : Colors.primaryTeal },
        ]}
      >
        <View style={styles.headerContent}>
          <Ionicons name="settings-outline" size={32} color="#fff" />
          <Text style={styles.headerTitle}>{t.settings}</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* === General Section === */}
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#94A3B8" : "#64748B" },
          ]}
        >
          {t.general}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* Language Option */}
          <TouchableOpacity onPress={changeLanguage} style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(0, 150, 136, 0.1)" },
                ]}
              >
                <Ionicons
                  name="language"
                  size={22}
                  color={Colors.primaryTeal}
                />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t.language}
              </Text>
            </View>
            <View style={styles.settingRight}>
              <Text style={styles.settingValue}>
                {language === "English" ? "English" : "العربية"}
              </Text>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>

          <View
            style={[
              styles.divider,
              { backgroundColor: isDark ? "#334155" : "#F1F5F9" },
            ]}
          />

          {/* Theme Option */}
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                ]}
              >
                <Ionicons
                  name={isDark ? "moon" : "sunny"}
                  size={22}
                  color="#3b82f6"
                />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t.theme}
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.themeToggleContainer,
                { backgroundColor: isDark ? "#1E293B" : "#E2E8F0" },
              ]}
              onPress={toggleTheme}
            >
              <View
                style={[
                  styles.themeBtn,
                  !isDark &&
                    (isDark
                      ? styles.activeThemeBtnDark
                      : styles.activeThemeBtnLight),
                ]}
              >
                <Text
                  style={[
                    styles.themeText,
                    !isDark &&
                      (isDark
                        ? styles.activeThemeTextDark
                        : styles.activeThemeTextLight),
                  ]}
                >
                  Light
                </Text>
              </View>

              <View
                style={[
                  styles.themeBtn,
                  isDark &&
                    (isDark
                      ? styles.activeThemeBtnDark
                      : styles.activeThemeBtnLight),
                ]}
              >
                <Text
                  style={[
                    styles.themeText,
                    isDark &&
                      (isDark
                        ? styles.activeThemeTextDark
                        : styles.activeThemeTextLight),
                  ]}
                >
                  Dark
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* === Notifications Section === */}
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#94A3B8" : "#64748B" },
          ]}
        >
          {t.notifications}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(245, 158, 11, 0.1)" },
                ]}
              >
                <Ionicons
                  name="notifications-outline"
                  size={22}
                  color="#f59e0b"
                />
              </View>
              <Text style={[styles.settingLabel, { color: colors.text }]}>
                {t.notifications}
              </Text>
            </View>
            <Switch
              trackColor={{
                false: isDark ? "#334155" : "#E2E8F0",
                true: "rgba(0, 150, 136, 0.5)",
              }}
              thumbColor={
                isNotificationsEnabled ? Colors.primaryTeal : "#f4f3f4"
              }
              onValueChange={toggleNotifications}
              value={isNotificationsEnabled}
            />
          </View>
        </View>

        {/* === Account Section === */}
        <Text
          style={[
            styles.sectionTitle,
            { color: isDark ? "#94A3B8" : "#64748B" },
          ]}
        >
          {t.account || "Account"}
        </Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
          {/* 🚀 My Profile & My Doctors Options (تظهر للمريض فقط) 🚀 */}
          {userRole === "patient" && (
            <>
              {/* 1. My Profile */}
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => navigation.navigate("PatientProfile")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: "rgba(0, 150, 136, 0.1)" },
                    ]}
                  >
                    <Ionicons
                      name="person-outline"
                      size={22}
                      color={Colors.primaryTeal}
                    />
                  </View>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    My Profile
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: isDark ? "#334155" : "#F1F5F9" },
                ]}
              />

              {/* 2. My Doctors (الجديدة) */}
              <TouchableOpacity
                style={styles.settingRow}
                onPress={() => navigation.navigate("MyDoctors")}
              >
                <View style={styles.settingLeft}>
                  <View
                    style={[
                      styles.iconBox,
                      { backgroundColor: "rgba(59, 130, 246, 0.1)" },
                    ]}
                  >
                    <FontAwesome5
                      name="stethoscope"
                      size={18}
                      color="#3b82f6"
                    />
                  </View>
                  <Text style={[styles.settingLabel, { color: colors.text }]}>
                    My Doctors
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
              </TouchableOpacity>

              <View
                style={[
                  styles.divider,
                  { backgroundColor: isDark ? "#334155" : "#F1F5F9" },
                ]}
              />
            </>
          )}

          {/* Logout Option */}
          <TouchableOpacity style={styles.settingRow} onPress={handleLogout}>
            <View style={styles.settingLeft}>
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: "rgba(239, 68, 68, 0.1)" },
                ]}
              >
                <MaterialCommunityIcons
                  name="logout"
                  size={22}
                  color="#ef4444"
                />
              </View>
              <Text
                style={[
                  styles.settingLabel,
                  { color: "#ef4444", fontWeight: "600" },
                ]}
              >
                {t.logout}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  header: {
    paddingTop: 60,
    paddingBottom: 25,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 10,
  },
  headerContent: { flexDirection: "row", alignItems: "center" },
  headerTitle: {
    color: "#fff",
    fontSize: 24,
    fontWeight: "bold",
    marginLeft: 10,
  },
  contentContainer: { padding: 20, paddingTop: 10 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 25,
    marginBottom: 10,
    marginLeft: 10,
  },
  card: {
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 8,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
  },
  settingLeft: { flexDirection: "row", alignItems: "center" },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  settingLabel: { fontSize: 16, fontWeight: "500" },
  settingRight: { flexDirection: "row", alignItems: "center" },
  settingValue: { fontSize: 14, color: "#94A3B8", marginRight: 5 },
  divider: { height: 1, marginVertical: 5, marginLeft: 55 },
  themeToggleContainer: {
    flexDirection: "row",
    borderRadius: 20,
    padding: 3,
    width: 130,
    height: 38,
    overflow: "hidden",
  },
  themeBtn: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 17,
    height: "100%",
  },
  activeThemeBtnLight: {
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  activeThemeBtnDark: {
    backgroundColor: Colors.primaryTeal,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  themeText: { fontSize: 13, color: "#64748B", fontWeight: "500" },
  activeThemeTextLight: { color: Colors.primaryTeal, fontWeight: "bold" },
  activeThemeTextDark: { color: "#fff", fontWeight: "bold" },
});

export default SettingsScreen;

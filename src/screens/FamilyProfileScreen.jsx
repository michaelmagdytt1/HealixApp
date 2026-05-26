import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";

export default function FamilyProfileScreen() {
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFamilyProfile();
  }, []);

  const fetchFamilyProfile = async () => {
    try {
      // بنجيب الـ ID بتاع اليوزر اللي عامل لوج إن (اللي اتسجل في RoleSelection)
      const userId = await AsyncStorage.getItem("patientId");
      if (!userId) return;

      const response = await axios.get(
        `https://healixbackend-production.up.railway.app/api/auth/profile/${userId}`,
      );
      setProfileData(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={styles.profileImage}>
          <MaterialCommunityIcons name="account-heart" size={50} color="#fff" />
        </View>
        <Text style={styles.userName}>
          {profileData?.fullName || profileData?.name || "Family Member"}
        </Text>
        <Text style={styles.roleText}>Family Account</Text>
      </View>

      <View style={styles.infoSection}>
        <Text style={styles.sectionTitle}>Account Details</Text>

        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <MaterialCommunityIcons
                name="account-group"
                size={24}
                color="#009688"
              />
            </View>
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Relationship</Text>
              <Text style={styles.infoValue}>
                {profileData?.relation || "Not Set"}
              </Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.iconBox}>
              <Ionicons name="mail-outline" size={24} color="#009688" />
            </View>
            <View style={styles.infoTexts}>
              <Text style={styles.infoLabel}>Email Address</Text>
              <Text style={styles.infoValue}>
                {profileData?.email || "Not Set"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#009688",
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(255,255,255,0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#fff",
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 5,
  },
  roleText: { fontSize: 16, color: "#E0F2F1" },
  infoSection: { padding: 20, marginTop: -20 },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    marginLeft: 5,
  },
  infoCard: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 10 },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 15,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoTexts: { flex: 1 },
  infoLabel: { fontSize: 13, color: "#64748b", marginBottom: 4 },
  infoValue: { fontSize: 16, fontWeight: "600", color: "#1e293b" },
  divider: { height: 1, backgroundColor: "#F1F5F9", marginVertical: 10 },
});

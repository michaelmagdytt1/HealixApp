import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import * as Clipboard from "expo-clipboard"; // لنسخ الـ ID
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useData } from "../context/DataContext";

export default function PatientProfileScreen({ navigation }) {
  const { patientId } = useData();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // States for Password Change
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isChangingPass, setIsChangingPass] = useState(false);
  const [showPassSection, setShowPassSection] = useState(false);

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await axios.get(
        `https://healixbackend-production.up.railway.app/api/auth/profile/${patientId}`,
      );
      setProfileData(response.data);
    } catch (error) {
      Alert.alert("Error", "Could not fetch profile data.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangePassword = async () => {
    if (!oldPassword || !newPassword) {
      Alert.alert("Required", "Please fill both password fields.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert(
        "Weak Password",
        "New password must be at least 8 characters.",
      );
      return;
    }

    setIsChangingPass(true);
    try {
      const response = await axios.put(
        "https://healixbackend-production.up.railway.app/api/auth/change-password",
        { userId: patientId, oldPassword, newPassword },
      );

      if (response.status === 200) {
        Alert.alert("Success", "Password changed successfully! 🎉");
        setOldPassword("");
        setNewPassword("");
        setShowPassSection(false); // نقفل السيكشن بعد النجاح
      }
    } catch (error) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Something went wrong.",
      );
    } finally {
      setIsChangingPass(false);
    }
  };

  const copyToClipboard = async () => {
    await Clipboard.setStringAsync(patientId);
    Alert.alert(
      "Copied!",
      "Patient ID copied to clipboard. Share this with your doctor.",
    );
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 💳 ID Card */}
        <View style={styles.idCard}>
          <Text style={styles.idCardTitle}>Your Patient ID</Text>
          <Text style={styles.idCardDesc}>
            Share this ID with your Doctor or Family to connect.
          </Text>
          <TouchableOpacity style={styles.idBox} onPress={copyToClipboard}>
            <Text style={styles.idText} selectable={true}>
              {patientId}
            </Text>
            <Ionicons name="copy-outline" size={24} color="#009688" />
          </TouchableOpacity>
        </View>

        {/* 👤 Account Info */}
        <Text style={styles.sectionTitle}>Account Information</Text>
        <View style={styles.card}>
          <InfoRow
            icon="person-outline"
            label="Username"
            value={profileData?.name}
          />
          <View style={styles.divider} />
          <InfoRow
            icon="mail-outline"
            label="Email"
            value={profileData?.email}
          />
        </View>

        {/* 🏥 Medical Info */}
        <Text style={styles.sectionTitle}>Medical Details</Text>
        <View style={styles.card}>
          <InfoRow
            icon="document-text-outline"
            label="Full Name"
            value={profileData?.fullName || "Not set"}
          />
          <View style={styles.divider} />
          <View style={styles.rowWrapper}>
            <InfoRow
              icon="calendar-outline"
              label="Age"
              value={`${profileData?.age || "--"} Yrs`}
              flex={1}
            />
            <View style={styles.verticalDivider} />
            <InfoRow
              icon="male-female-outline"
              label="Gender"
              value={profileData?.gender || "--"}
              flex={1}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.rowWrapper}>
            <InfoRow
              icon="barbell-outline"
              label="Weight"
              value={`${profileData?.weight || "--"} kg`}
              flex={1}
            />
            <View style={styles.verticalDivider} />
            <InfoRow
              icon="body-outline"
              label="Height"
              value={`${profileData?.height || "--"} cm`}
              flex={1}
            />
          </View>
        </View>

        {/* 🔒 Security */}
        <Text style={styles.sectionTitle}>Security</Text>
        <View style={styles.card}>
          <TouchableOpacity
            style={styles.changePassToggle}
            onPress={() => setShowPassSection(!showPassSection)}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <Ionicons
                name="lock-closed-outline"
                size={24}
                color="#009688"
                style={{ marginRight: 15 }}
              />
              <Text style={styles.infoLabel}>Change Password</Text>
            </View>
            <Ionicons
              name={showPassSection ? "chevron-up" : "chevron-down"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>

          {showPassSection && (
            <View style={styles.passSection}>
              <TextInput
                style={styles.input}
                placeholder="Current Password"
                secureTextEntry
                value={oldPassword}
                onChangeText={setOldPassword}
              />
              <TextInput
                style={styles.input}
                placeholder="New Password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity
                style={styles.saveBtn}
                onPress={handleChangePassword}
                disabled={isChangingPass}
              >
                {isChangingPass ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.saveBtnText}>Update Password</Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 📌 Component صغير عشان نرتب بيه السطور
const InfoRow = ({ icon, label, value, flex }) => (
  <View style={[styles.infoRow, flex && { flex }]}>
    <Ionicons name={icon} size={24} color="#009688" style={styles.infoIcon} />
    <View>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={styles.infoValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    backgroundColor: "#009688",
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backBtn: { marginRight: 15 },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#fff" },
  content: { padding: 20 },
  idCard: {
    backgroundColor: "#1e293b",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 5,
  },
  idCardTitle: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  idCardDesc: { color: "#94a3b8", fontSize: 13, marginBottom: 15 },
  idBox: {
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 15,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  idText: { color: "#fff", fontSize: 16, fontWeight: "bold", letterSpacing: 1 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#64748b",
    marginLeft: 5,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 20,
    marginBottom: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  infoRow: { flexDirection: "row", alignItems: "center", paddingVertical: 5 },
  infoIcon: {
    marginRight: 15,
    backgroundColor: "#E0F2F1",
    padding: 8,
    borderRadius: 10,
  },
  infoLabel: { fontSize: 13, color: "#94a3b8", fontWeight: "600" },
  infoValue: {
    fontSize: 16,
    color: "#1e293b",
    fontWeight: "bold",
    marginTop: 2,
    textTransform: "capitalize",
  },
  divider: { height: 1, backgroundColor: "#f1f5f9", marginVertical: 15 },
  rowWrapper: { flexDirection: "row", justifyContent: "space-between" },
  verticalDivider: {
    width: 1,
    backgroundColor: "#f1f5f9",
    marginHorizontal: 15,
  },
  changePassToggle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  passSection: { marginTop: 20 },
  input: {
    backgroundColor: "#F8FAFC",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    padding: 15,
    fontSize: 15,
    marginBottom: 15,
  },
  saveBtn: {
    backgroundColor: "#009688",
    padding: 15,
    borderRadius: 12,
    alignItems: "center",
  },
  saveBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

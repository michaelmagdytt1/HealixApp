import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useState } from "react";
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

export default function DoctorProfileSetup({ navigation, route }) {
  const { setUserName } = useData();
  const userId = route?.params?.userId;

  const [fullName, setFullName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!userId) {
      Alert.alert("خطأ", "لم يتم العثور على بيانات الحساب.");
      return;
    }

    if (!fullName || !clinicName || !nationalId) {
      Alert.alert("Required", "Please fill all fields to continue 👨‍⚕️");
      return;
    }

    if (nationalId.length !== 14) {
      Alert.alert("Invalid ID", "National ID must be exactly 14 digits.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://healixbackend-production.up.railway.app/api/auth/update-doctor-profile",
        { userId, fullName, clinicName, nationalId },
      );

      if (response.status === 200) {
        // تحديث الاسم في الذاكرة عشان يظهر في الهوم
        await AsyncStorage.setItem("userName", fullName);
        if (setUserName) setUserName(fullName);

        Alert.alert("Welcome Doc!", "Profile updated successfully 🚀");
        navigation.replace("DoctorHome");
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Error", "Something went wrong, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconCircle}>
            <FontAwesome5 name="user-md" size={45} color="#009688" />
          </View>
          <Text style={styles.title}>Doctor Profile</Text>
          <Text style={styles.subtitle}>Lets set up your clinic details</Text>
        </View>

        <View style={styles.form}>
          {/* === Full Name === */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name (Triple)</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="person-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Dr. Ahmed Mohamed"
                placeholderTextColor="#94a3b8"
                value={fullName}
                onChangeText={setFullName}
              />
            </View>
          </View>

          {/* === Clinic Name === */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Clinic Name</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="medkit-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="e.g. Al-Shifa Clinic"
                placeholderTextColor="#94a3b8"
                value={clinicName}
                onChangeText={setClinicName}
              />
            </View>
          </View>

          {/* === National ID === */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>National ID (14 Digits)</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name="card-outline"
                size={20}
                color="#94a3b8"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Enter 14-digit ID"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={14}
                value={nationalId}
                onChangeText={setNationalId}
              />
            </View>
          </View>

          {/* === Save Button === */}
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveBtnText}>Go to Dashboard</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { padding: 24, paddingTop: 60, paddingBottom: 40 },
  header: { alignItems: "center", marginBottom: 30 },
  iconCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  title: { fontSize: 26, fontWeight: "bold", color: "#1e293b" },
  subtitle: { fontSize: 15, color: "#64748b", marginTop: 5 },
  form: { marginTop: 10 },
  inputWrapper: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: "600", color: "#475569", marginBottom: 8 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 55,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    paddingHorizontal: 15,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#1e293b" },
  saveBtn: {
    backgroundColor: "#009688",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    elevation: 4,
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
// 🚀 ضفنا المكتبات دي عشان نحفظ البيانات في الموبايل
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useData } from "../context/DataContext";

export default function RoleSelectionScreen({ navigation, route }) {
  const { userData } = route.params || {};
  const [selectedRole, setSelectedRole] = useState("patient");
  const [isLoading, setIsLoading] = useState(false);

  // 🚀 استدعاء دوال الحفظ من الـ Context
  const { setUserName, setPatientId } = useData();

  const handleRegister = async () => {
    if (!userData) {
      Alert.alert("Error", "Missing user data. Please return to Sign Up.");
      navigation.goBack();
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.post(
        "https://healixbackend-production.up.railway.app/api/auth/register",
        {
          name: userData.name,
          email: userData.email,
          password: userData.password,
          role: selectedRole,
        },
      );

      if (response.status === 201) {
        // جبنا الـ ID والاسم بتاع اليوزر الجديد من رد السيرفر
        const newUserId = response.data.user._id;
        const newUserName = response.data.user.name;

        // 🚀 التعديل الأهم: حفظ البيانات في الذاكرة والـ Context عشان التطبيق كله يشوفها
        await AsyncStorage.setItem("patientId", newUserId);
        await AsyncStorage.setItem("userName", newUserName);
        if (setPatientId) setPatientId(newUserId);
        if (setUserName) setUserName(newUserName);

        // التوجيه بناءً على الدور
        if (selectedRole === "patient") {
          navigation.replace("PatientProfileSetup", { userId: newUserId });
        } else if (selectedRole === "doctor") {
          navigation.replace("DoctorProfileSetup", { userId: newUserId });
        } else {
          // 🚀 التعديل هنا: توجيه العائلة لشاشة استكمال البيانات
          navigation.replace("FamilyProfileSetup", { userId: newUserId });
        }
      }
    } catch (error) {
      console.log("Register Error:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.message || "Something went wrong";
      Alert.alert("Registration Failed", errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Role</Text>
        <Text style={styles.subtitle}>How will you be using the app?</Text>
      </View>

      <View style={styles.cardsContainer}>
        {/* === كارت المريض === */}
        <TouchableOpacity
          style={[styles.card, selectedRole === "patient" && styles.cardActive]}
          onPress={() => setSelectedRole("patient")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="bed-outline"
            size={40}
            color={selectedRole === "patient" ? "#fff" : "#009688"}
          />
          <Text
            style={[
              styles.cardTitle,
              selectedRole === "patient" && { color: "#fff" },
            ]}
          >
            Patient
          </Text>
          <Text
            style={[
              styles.cardDesc,
              selectedRole === "patient" && { color: "#E0F2F1" },
            ]}
          >
            Track my vitals and get care
          </Text>
        </TouchableOpacity>

        {/* === كارت الدكتور === */}
        <TouchableOpacity
          style={[styles.card, selectedRole === "doctor" && styles.cardActive]}
          onPress={() => setSelectedRole("doctor")}
          activeOpacity={0.8}
        >
          <FontAwesome5
            name="user-md"
            size={35}
            color={selectedRole === "doctor" ? "#fff" : "#009688"}
          />
          <Text
            style={[
              styles.cardTitle,
              selectedRole === "doctor" && { color: "#fff" },
            ]}
          >
            Doctor
          </Text>
          <Text
            style={[
              styles.cardDesc,
              selectedRole === "doctor" && { color: "#E0F2F1" },
            ]}
          >
            {"Monitor my patients' health"}
          </Text>
        </TouchableOpacity>

        {/* === كارت العائلة === */}
        <TouchableOpacity
          style={[styles.card, selectedRole === "family" && styles.cardActive]}
          onPress={() => setSelectedRole("family")}
          activeOpacity={0.8}
        >
          <MaterialCommunityIcons
            name="home-heart"
            size={40}
            color={selectedRole === "family" ? "#fff" : "#009688"}
          />
          <Text
            style={[
              styles.cardTitle,
              selectedRole === "family" && { color: "#fff" },
            ]}
          >
            Family Member
          </Text>
          <Text
            style={[
              styles.cardDesc,
              selectedRole === "family" && { color: "#E0F2F1" },
            ]}
          >
            Keep an eye on my loved ones
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.submitBtn}
        onPress={handleRegister}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.submitBtnText}>Complete Registration</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    padding: 24,
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#64748b",
  },
  cardsContainer: {
    marginBottom: 40,
  },
  card: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: "#E2E8F0",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  cardActive: {
    backgroundColor: "#009688",
    borderColor: "#009688",
    transform: [{ scale: 1.02 }],
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 10,
    marginBottom: 4,
  },
  cardDesc: {
    fontSize: 13,
    color: "#64748b",
    textAlign: "center",
  },
  submitBtn: {
    backgroundColor: "#1e293b",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 4,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

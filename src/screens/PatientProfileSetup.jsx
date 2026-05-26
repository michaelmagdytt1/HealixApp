import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function PatientProfileSetup({ navigation, route }) {
  const userId = route?.params?.userId;

  const [fullName, setFullName] = useState("");
  const [day, setDay] = useState("");
  const [month, setMonth] = useState("");
  const [year, setYear] = useState("");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [gender, setGender] = useState("male");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    // 1. التأكد من إن الشاشة اللي قبلها بعتت الـ ID صح
    if (!userId) {
      Alert.alert(
        "خطأ برمجي ❌",
        "لم يتم العثور على User ID، يرجى التسجيل من جديد.",
      );
      return;
    }

    if (!fullName || !day || !month || !year || !weight || !height) {
      Alert.alert(
        "Required",
        "Please fill all fields to provide better care ✨",
      );
      return;
    }

    const d = parseInt(day);
    const m = parseInt(month);
    const y = parseInt(year);
    const currentYear = new Date().getFullYear();

    if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1900 || y > currentYear) {
      Alert.alert("Invalid Date", "Please enter a valid date of birth 📅");
      return;
    }

    const today = new Date();
    const birthDate = new Date(y, m - 1, d);
    let calculatedAge = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      calculatedAge--;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://healixbackend-production.up.railway.app/api/auth/update-profile",
        {
          userId: userId,
          fullName: fullName,
          age: calculatedAge,
          weight: weight,
          height: height,
          gender: gender,
        },
      );

      if (response.status === 200) {
        Alert.alert("Welcome!", "Profile updated successfully 🚀");
        navigation.replace("PatientHome");
      }
    } catch (error) {
      // 🚀 نظام كشف الأخطاء الجديد عشان نعرف السيرفر زعلان ليه
      console.log("Error details:", error.response?.data || error.message);
      const serverMessage = error.response?.data?.message || error.message;
      Alert.alert(
        "Backend Error 🔌",
        `السبب: ${serverMessage}\n\nتأكد إنك رفعت تعديلات الباك إند على Railway.`,
      );
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
            <MaterialCommunityIcons
              name="account-heart"
              size={50}
              color="#009688"
            />
          </View>
          <Text style={styles.title}>Complete Profile</Text>
          <Text style={styles.subtitle}>
            Help us tailor the experience for you
          </Text>
        </View>

        <View style={styles.form}>
          {/* === Full Name === */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Full Name (Triple)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Ahmed Mohamed Ali"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          {/* === 🚀 Date of Birth (التصميم الجديد الواضح جداً) === */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Date of Birth</Text>

            <View style={styles.row}>
              {/* مربع اليوم */}
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.subTitleLabel}>Day</Text>
                <TextInput
                  style={styles.dobInput}
                  placeholder="DD"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={2}
                  value={day}
                  onChangeText={setDay}
                />
              </View>

              {/* مربع الشهر */}
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={styles.subTitleLabel}>Month</Text>
                <TextInput
                  style={styles.dobInput}
                  placeholder="MM"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={2}
                  value={month}
                  onChangeText={setMonth}
                />
              </View>

              {/* مربع السنة */}
              <View style={{ flex: 1.2 }}>
                <Text style={styles.subTitleLabel}>Year</Text>
                <TextInput
                  style={styles.dobInput}
                  placeholder="YYYY"
                  placeholderTextColor="#94a3b8"
                  keyboardType="numeric"
                  maxLength={4}
                  value={year}
                  onChangeText={setYear}
                />
              </View>
            </View>
          </View>

          {/* === Gender === */}
          <View style={styles.inputWrapper}>
            <Text style={styles.label}>Gender</Text>
            <View style={styles.genderContainer}>
              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  gender === "male" && styles.activeGender,
                ]}
                onPress={() => setGender("male")}
              >
                <Ionicons
                  name="male"
                  size={18}
                  color={gender === "male" ? "#fff" : "#64748b"}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "male" && { color: "#fff" },
                  ]}
                >
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.genderBtn,
                  gender === "female" && styles.activeGender,
                ]}
                onPress={() => setGender("female")}
              >
                <Ionicons
                  name="female"
                  size={18}
                  color={gender === "female" ? "#fff" : "#64748b"}
                />
                <Text
                  style={[
                    styles.genderText,
                    gender === "female" && { color: "#fff" },
                  ]}
                >
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* === Weight & Height === */}
          <View style={styles.row}>
            <View style={[styles.inputWrapper, { flex: 1, marginRight: 10 }]}>
              <Text style={styles.label}>Weight (kg)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 75"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={3}
                value={weight}
                onChangeText={setWeight}
              />
            </View>
            <View style={[styles.inputWrapper, { flex: 1 }]}>
              <Text style={styles.label}>Height (cm)</Text>
              <TextInput
                style={styles.input}
                placeholder="e.g. 175"
                placeholderTextColor="#94a3b8"
                keyboardType="numeric"
                maxLength={3}
                value={height}
                onChangeText={setHeight}
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
              <Text style={styles.saveBtnText}>Get Started</Text>
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

  // 🚀 عناوين (Day, Month, Year)
  subTitleLabel: {
    textAlign: "center",
    marginBottom: 6,
    color: "#009688", // لون مميز عشان تبان
    fontWeight: "bold",
    fontSize: 13,
  },

  input: {
    backgroundColor: "#fff",
    height: 55,
    borderRadius: 16,
    paddingHorizontal: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    color: "#1e293b",
  },
  // 🚀 ستايل مخصص لمربعات التاريخ عشان تكون واضحة جدا
  dobInput: {
    backgroundColor: "#F1F5F9", // خلفية رمادي فاتح تميز المربع
    height: 55,
    borderRadius: 16,
    textAlign: "center",
    fontSize: 18, // خط كبير
    fontWeight: "bold",
    borderWidth: 1,
    borderColor: "#cbd5e1",
    color: "#0f172a", // أسود صريح
  },
  row: { flexDirection: "row", justifyContent: "space-between" },

  genderContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 16,
    padding: 4,
    height: 55,
  },
  genderBtn: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 12,
  },
  activeGender: { backgroundColor: "#009688" },
  genderText: {
    marginLeft: 8,
    fontWeight: "600",
    color: "#64748b",
    fontSize: 16,
  },
  saveBtn: {
    backgroundColor: "#009688",
    height: 60,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#009688",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

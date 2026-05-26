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

export default function FamilyProfileSetup({ navigation, route }) {
  // بنستلم الـ ID من شاشة اختيار الدور
  const { userId } = route.params || {};

  const [fullName, setFullName] = useState("");
  const [relation, setRelation] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSaveProfile = async () => {
    if (!fullName.trim() || !relation.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال الاسم الثلاثي ونوع القرابة.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await axios.put(
        "https://healixbackend-production.up.railway.app/api/auth/update-family-profile",
        {
          userId,
          fullName,
          relation,
        },
      );

      if (response.status === 200) {
        Alert.alert("نجاح ✅", "تم حفظ البيانات بنجاح!");
        // التوجيه لشاشة العائلة الرئيسية
        navigation.replace("FamilyHome");
      }
    } catch (error) {
      console.log("Setup Error:", error.response?.data || error.message);
      Alert.alert("خطأ", "حدث خطأ أثناء حفظ البيانات. حاول مرة أخرى.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <MaterialCommunityIcons name="home-heart" size={60} color="#009688" />
          <Text style={styles.title}>Family Details</Text>
          <Text style={styles.subtitle}>Tell us a bit about yourself</Text>
        </View>

        {/* Form */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons
              name="person-outline"
              size={20}
              color="#64748b"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Full Name (الاسم الثلاثي)"
              placeholderTextColor="#94a3b8"
              value={fullName}
              onChangeText={setFullName}
            />
          </View>

          <View style={styles.inputContainer}>
            <MaterialCommunityIcons
              name="account-group-outline"
              size={20}
              color="#64748b"
              style={styles.inputIcon}
            />
            <TextInput
              style={styles.input}
              placeholder="Relationship (e.g. Father, Son, Wife)"
              placeholderTextColor="#94a3b8"
              value={relation}
              onChangeText={setRelation}
            />
          </View>

          {/* Submit Button */}
          <TouchableOpacity
            style={styles.submitBtn}
            onPress={handleSaveProfile}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Get Started</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  scrollContent: { flexGrow: 1, padding: 24, justifyContent: "center" },
  header: { alignItems: "center", marginBottom: 40 },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#1e293b",
    marginTop: 15,
    marginBottom: 8,
  },
  subtitle: { fontSize: 16, color: "#64748b", textAlign: "center" },
  form: { width: "100%" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    height: 60,
    borderRadius: 16,
    marginBottom: 20,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: "#1e293b" },
  submitBtn: {
    backgroundColor: "#009688",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
  },
  submitBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
});

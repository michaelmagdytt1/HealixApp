import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function SignUpScreen({ navigation }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleNextStep = () => {
    // 1. التأكد من إدخال جميع البيانات
    if (!name || !email || !password) {
      Alert.alert("تنبيه", "يرجى إدخال جميع البيانات ⚠️");
      return;
    }

    // 2. التأكد من طول كلمة المرور
    if (password.length < 8) {
      Alert.alert("تنبيه", "كلمة المرور يجب أن تتكون من 8 أحرف على الأقل 🛡️");
      return;
    }

    // 3. التأكد من أن كلمة المرور باللغة الإنجليزية
    const arabicRegex = /[\u0600-\u06FF]/;
    if (arabicRegex.test(password)) {
      Alert.alert("تنبيه", "كلمة المرور يجب أن تكون باللغة الإنجليزية فقط 🔤");
      return;
    }

    // 🚀 التعديل هنا: مش بنكلم السيرفر، بنبعت الداتا لشاشة اختيار الدور
    navigation.navigate("RoleSelection", {
      userData: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password: password,
      },
    });
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Enter your details to get started</Text>

      <TextInput
        style={styles.input}
        placeholder="User Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />

      <TextInput
        style={styles.input}
        placeholder="Email Address"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <View style={styles.passwordContainer}>
        <TextInput
          style={styles.passwordInput}
          placeholder="Password"
          placeholderTextColor="#999"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
        />
        <TouchableOpacity
          style={styles.eyeIcon}
          onPress={() => setShowPassword(!showPassword)}
        >
          <Ionicons
            name={showPassword ? "eye-outline" : "eye-off-outline"}
            size={24}
            color="#999"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={handleNextStep}
        activeOpacity={0.8}
      >
        <Text style={styles.buttonText}>Continue</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>Or sign up with</Text>
        <View style={styles.dividerLine} />
      </View>

      <View style={styles.socialContainer}>
        <TouchableOpacity
          style={[
            styles.socialButton,
            { backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1 },
          ]}
          onPress={() => Alert.alert("قريباً", "جاري تفعيل التسجيل بجوجل ⏳")}
        >
          <Ionicons name="logo-google" size={24} color="#DB4437" />
          <Text style={[styles.socialButtonText, { color: "#333" }]}>
            Google
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
          onPress={() => Alert.alert("قريباً", "جاري تفعيل التسجيل بفيسبوك ⏳")}
        >
          <Ionicons name="logo-facebook" size={24} color="#fff" />
          <Text style={[styles.socialButtonText, { color: "#fff" }]}>
            Facebook
          </Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.linkText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f8f9fa",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1a1a1a",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: 16,
    color: "#1a1a1a",
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    marginBottom: 20,
  },
  passwordInput: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: "#1a1a1a",
  },
  eyeIcon: {
    padding: 15,
  },
  button: {
    backgroundColor: "#5b7cff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
    elevation: 4,
    shadowColor: "#5b7cff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  buttonText: { color: "#fff", fontSize: 18, fontWeight: "bold" },
  linkText: {
    color: "#5b7cff",
    textAlign: "center",
    marginTop: 25,
    fontSize: 16,
    fontWeight: "bold",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { marginHorizontal: 10, color: "#999", fontSize: 14 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  socialButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 12,
    marginHorizontal: 5,
  },
  socialButtonText: { fontSize: 16, fontWeight: "600", marginLeft: 8 },
});

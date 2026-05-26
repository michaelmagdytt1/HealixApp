import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
// 🚀 استدعينا المكتبة المسؤولة عن الحفظ في الموبايل
import AsyncStorage from "@react-native-async-storage/async-storage";
// 🚀 استدعينا الـ DataContext عشان نحدث الداتا الحية فوراً
import { useData } from "../context/DataContext";

// ❌ شلنا الـ route من الـ props عشان مش هنستقبل selectedRole
const LoginScreen = ({ navigation }) => {
  // 🚀 سحبنا دوال التحديث المباشر من الـ Context
  const { setPatientId, setUserName } = useData();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Email validation regex
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate inputs
  const validateInputs = () => {
    let isValid = true;
    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!validateEmail(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password.trim()) {
      setPasswordError("Password is required");
      isValid = false;
    } else if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      isValid = false;
    }

    return isValid;
  };

  // Real Login Function connected to Node.js Backend
  const handleLogin = async () => {
    if (!validateInputs()) {
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(
        "https://healixbackend-production.up.railway.app/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        },
      );

      const data = await response.json();

      if (response.status === 200) {
        console.log("Login Success:", data);

        // 🚀 1. بنحفظ الـ ID بتاع اليوزر في الذاكرة وبنحدث الـ Context فوراً
        if (data.user && data.user._id) {
          await AsyncStorage.setItem("patientId", data.user._id);
          setPatientId(data.user._id);
          console.log("✅ User ID saved:", data.user._id);
        }

        // 🚀 2. بنحفظ اسم اليوزر كمان عشان نعرضه في الهوم وبنحدثه فوراً
        if (data.user && data.user.name) {
          await AsyncStorage.setItem("userName", data.user.name);
          setUserName(data.user.name);
          console.log("✅ User Name saved:", data.user.name);
        }

        const role = data.user.role.toLowerCase();

        if (role === "doctor") {
          navigation.replace("DoctorHome");
        } else if (role === "family") {
          navigation.replace("FamilyHome");
        } else {
          navigation.replace("PatientHome");
        }
      } else {
        if (data.message && data.message.toLowerCase().includes("password")) {
          setPasswordError(data.message);
        } else if (
          data.message &&
          data.message.toLowerCase().includes("user")
        ) {
          setEmailError("User not found or invalid email");
        } else {
          Alert.alert("Login Failed", data.message || "Invalid credentials");
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      Alert.alert(
        "Connection Error",
        "Could not connect to the server. Please check your internet connection.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = () => {
    console.log("Forgot password pressed");
  };

  // 🚀 التعديل هنا: هيروح للـ SignUp فاضي بدون أي رول
  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Welcome Back</Text>
          {/* ❌ التعديل هنا: خلينا النص ثابت */}
          <Text style={styles.subtitle}>Sign in to your account</Text>
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={[styles.input, emailError && styles.inputError]}
            placeholder="Enter your email"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!isLoading}
          />
          {emailError ? (
            <Text style={styles.errorText}>{emailError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.passwordLabelContainer}>
            <Text style={styles.label}>Password</Text>
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Text style={styles.toggleText}>
                {showPassword ? "Hide" : "Show"}
              </Text>
            </TouchableOpacity>
          </View>
          <TextInput
            style={[styles.input, passwordError && styles.inputError]}
            placeholder="Enter your password"
            placeholderTextColor="#999"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!isLoading}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={styles.forgotPasswordContainer}
          onPress={handleForgotPassword}
          disabled={isLoading}
        >
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
          onPress={handleLogin}
          disabled={isLoading}
          activeOpacity={0.8}
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.loginButtonText}>Login</Text>
          )}
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>Or sign in with</Text>
          <View style={styles.dividerLine} />
        </View>

        <View style={styles.socialContainer}>
          <TouchableOpacity
            style={[
              styles.socialButton,
              { backgroundColor: "#fff", borderColor: "#ddd", borderWidth: 1 },
            ]}
            onPress={() => Alert.alert("قريباً", "جاري تفعيل الدخول بجوجل ⏳")}
          >
            <Ionicons name="logo-google" size={24} color="#DB4437" />
            <Text style={[styles.socialButtonText, { color: "#333" }]}>
              Google
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.socialButton, { backgroundColor: "#1877F2" }]}
            onPress={() =>
              Alert.alert("قريباً", "جاري تفعيل الدخول بفيسبوك ⏳")
            }
          >
            <Ionicons name="logo-facebook" size={24} color="#fff" />
            <Text style={[styles.socialButtonText, { color: "#fff" }]}>
              Facebook
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.signUpContainer}>
          <Text style={styles.signUpText}>{"Don't have an account? "}</Text>
          <TouchableOpacity onPress={handleSignUp} disabled={isLoading}>
            <Text style={styles.signUpLink}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 40,
    backgroundColor: "#f8f9fa",
  },
  titleContainer: { marginBottom: 40, alignItems: "center" },
  title: { fontSize: 32, fontWeight: "700", color: "#1a1a1a", marginBottom: 8 },
  subtitle: {
    fontSize: 16,
    color: "#666",
    fontWeight: "400",
    textTransform: "capitalize",
  },
  inputContainer: { marginBottom: 24 },
  label: { fontSize: 14, fontWeight: "600", color: "#1a1a1a", marginBottom: 8 },
  input: {
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    paddingHorizontal: 16,
    fontSize: 16,
    backgroundColor: "#fff",
    color: "#1a1a1a",
  },
  inputError: { borderColor: "#ff6b6b", backgroundColor: "#fff5f5" },
  errorText: {
    fontSize: 12,
    color: "#ff6b6b",
    marginTop: 6,
    fontWeight: "500",
  },
  passwordLabelContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  toggleText: { fontSize: 12, color: "#5b7cff", fontWeight: "600" },
  forgotPasswordContainer: { alignItems: "flex-end", marginBottom: 32 },
  forgotPasswordText: { fontSize: 14, color: "#5b7cff", fontWeight: "600" },
  loginButton: {
    height: 52,
    backgroundColor: "#5b7cff",
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#5b7cff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  loginButtonDisabled: { opacity: 0.7 },
  loginButtonText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: "#e0e0e0" },
  dividerText: { marginHorizontal: 10, color: "#999", fontSize: 14 },
  socialContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 32,
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
  signUpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  signUpText: { fontSize: 14, color: "#666" },
  signUpLink: { fontSize: 14, color: "#5b7cff", fontWeight: "700" },
});

export default LoginScreen;

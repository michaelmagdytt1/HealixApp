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
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function FamilyHomeScreen() {
  const [linkedPatientId, setLinkedPatientId] = useState(null);
  const [inputId, setInputId] = useState("");
  const [isLinking, setIsLinking] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);

  // داتا المريض وقراياته
  const [patientInfo, setPatientInfo] = useState(null);
  const [healthData, setHealthData] = useState({
    currentVitals: { hr: 0, spo2: 0, temp: 0, steps: 0 },
    alerts: [],
  });

  useEffect(() => {
    checkLinkedPatient();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // فحص هل العائلة ضافت مريض قبل كده ولا لأ
  const checkLinkedPatient = async () => {
    try {
      const savedPatientId = await AsyncStorage.getItem("linked_patient_id");
      if (savedPatientId) {
        setLinkedPatientId(savedPatientId);
        fetchPatientData(savedPatientId);
      } else {
        setIsLoadingData(false);
      }
    } catch (_error) {
      setIsLoadingData(false);
    }
  };

  // ربط مريض جديد
  const handleLinkPatient = async () => {
    if (!inputId.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال ID المريض");
      return;
    }

    setIsLinking(true);
    try {
      // 1. نتأكد إن الـ ID ده بتاع مريض بجد
      const response = await axios.get(
        `https://healixbackend-production.up.railway.app/api/auth/profile/${inputId.trim()}`,
      );

      if (response.data.role !== "patient") {
        Alert.alert("خطأ", "هذا المعرف لا يعود لمريض.");
        setIsLinking(false);
        return;
      }

      // 2. نحفظه في الذاكرة
      await AsyncStorage.setItem("linked_patient_id", inputId.trim());
      setLinkedPatientId(inputId.trim());

      // 3. نجيب الداتا بتاعته
      fetchPatientData(inputId.trim());
    } catch (_error) {
      Alert.alert("خطأ ❌", "لم يتم العثور على مريض بهذا الـ ID.");
      setIsLinking(false);
    }
  };

  // جلب بيانات وقرايات المريض المربوط
  const fetchPatientData = async (patientId) => {
    setIsLoadingData(true);
    try {
      // جلب الاسم والمعلومات
      const profileRes = await axios.get(
        `https://healixbackend-production.up.railway.app/api/auth/profile/${patientId}`,
      );
      setPatientInfo(profileRes.data);

      // جلب القرايات من الباك إند
      const vitalsRes = await axios.get(
        `https://healixbackend-production.up.railway.app/api/measurements/dashboard/${patientId}`,
      );

      if (vitalsRes.data) {
        setHealthData({
          currentVitals: vitalsRes.data.currentVitals || {
            hr: 0,
            spo2: 0,
            temp: 0,
            steps: 0,
          },
          alerts: vitalsRes.data.alerts || [],
        });
      }
    } catch (error) {
      console.log("Error fetching linked patient data", error.message);
    } finally {
      setIsLoadingData(false);
      setIsLinking(false);
    }
  };

  // فك الارتباط (لو عايز يتابع مريض تاني)
  const handleUnlink = async () => {
    Alert.alert(
      "Unlink Patient",
      "Are you sure you want to unlink this patient?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Unlink",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("linked_patient_id");
            setLinkedPatientId(null);
            setPatientInfo(null);
          },
        },
      ],
    );
  };

  if (isLoadingData) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={styles.loadingText}>Loading patient data...</Text>
      </View>
    );
  }

  // ==== 1. واجهة إدخال الـ ID لو مفيش مريض مربوط ====
  if (!linkedPatientId) {
    return (
      <View style={styles.centerContainer}>
        <MaterialCommunityIcons
          name="link-variant"
          size={70}
          color="#cbd5e1"
          style={{ marginBottom: 20 }}
        />
        <Text style={styles.linkTitle}>Link a Patient</Text>
        <Text style={styles.linkSub}>
          {"Enter your loved one's unique ID to start monitoring their health."}
        </Text>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Patient ID..."
            placeholderTextColor="#94a3b8"
            value={inputId}
            onChangeText={setInputId}
          />
        </View>

        <TouchableOpacity
          style={styles.linkBtn}
          onPress={handleLinkPatient}
          disabled={isLinking}
        >
          {isLinking ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.linkBtnText}>Connect</Text>
          )}
        </TouchableOpacity>
      </View>
    );
  }

  // ==== 2. واجهة المتابعة (لو في مريض مربوط) ====
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{"Loved One's Health"}</Text>
        <TouchableOpacity style={styles.unlinkBtn} onPress={handleUnlink}>
          <Ionicons name="link-off" size={20} color="#ef4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* معلومات المريض الأساسية */}
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons
              name={patientInfo?.gender === "female" ? "woman" : "man"}
              size={40}
              color="#009688"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.patientName}>
              {patientInfo?.fullName || patientInfo?.name}
            </Text>
            <Text style={styles.patientSub}>Status: Monitored Actively</Text>
          </View>
        </View>

        {/* التنبيهات الأخيرة */}
        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {healthData.alerts.length > 0 ? (
          healthData.alerts.map((alert, index) => (
            <View
              key={index}
              style={[
                styles.alertCard,
                alert.type === "danger"
                  ? styles.alertDanger
                  : styles.alertWarning,
              ]}
            >
              <Ionicons
                name={alert.type === "danger" ? "warning" : "alert-circle"}
                size={24}
                color={alert.type === "danger" ? "#dc2626" : "#d97706"}
              />
              <View style={styles.alertTexts}>
                <Text
                  style={[
                    styles.alertMessage,
                    { color: alert.type === "danger" ? "#991b1b" : "#92400e" },
                  ]}
                >
                  {alert.message}
                </Text>
                <Text style={styles.alertDate}>
                  {new Date(alert.date).toLocaleString()}
                </Text>
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noAlertsText}>
            No recent alerts. Everything looks fine! 🤍
          </Text>
        )}

        {/* القرايات الحالية */}
        <Text style={styles.sectionTitle}>Current Vitals</Text>
        <View style={styles.grid}>
          <VitalCard
            title="Heart Rate"
            value={healthData.currentVitals.hr}
            unit="BPM"
            icon="heart-pulse"
            color="#ef4444"
          />
          <VitalCard
            title="SPO2"
            value={healthData.currentVitals.spo2}
            unit="%"
            icon="water"
            color="#3b82f6"
          />
          <VitalCard
            title="Temp"
            value={healthData.currentVitals.temp}
            unit="°C"
            icon="thermometer"
            color="#f59e0b"
          />
          <VitalCard
            title="Activity"
            value={healthData.currentVitals.steps}
            unit="Steps"
            icon="run"
            color="#10b981"
          />
        </View>
      </ScrollView>
    </View>
  );
}

// مكون كارت القرايات الصغير
const VitalCard = ({ title, value, unit, icon, color }) => (
  <View style={styles.vitalCard}>
    <MaterialCommunityIcons
      name={icon}
      size={28}
      color={color}
      style={{ marginBottom: 10 }}
    />
    <Text style={styles.vitalTitle}>{title}</Text>
    <View style={styles.vitalValueRow}>
      <Text style={[styles.vitalValue, { color: color }]}>{value}</Text>
      <Text style={styles.vitalUnit}>{unit}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  centerContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  loadingText: { marginTop: 10, color: "#64748b" },

  // Link State Styles
  linkTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 10,
  },
  linkSub: {
    fontSize: 15,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 30,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingHorizontal: 15,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 20,
  },
  input: { height: 60, fontSize: 16, color: "#1e293b" },
  linkBtn: {
    width: "100%",
    backgroundColor: "#009688",
    height: 60,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    elevation: 3,
  },
  linkBtnText: { color: "#fff", fontSize: 18, fontWeight: "bold" },

  // Dashboard Styles
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: "#1e293b" },
  unlinkBtn: { padding: 8, backgroundColor: "#fef2f2", borderRadius: 12 },
  scrollContent: { padding: 20, paddingBottom: 100 },

  profileCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 20,
    marginBottom: 25,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  profileIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  profileInfo: { flex: 1 },
  patientName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
  },
  patientSub: { fontSize: 14, color: "#009688", fontWeight: "500" },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 15,
    marginLeft: 5,
  },

  alertCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    borderWidth: 1,
  },
  alertDanger: { backgroundColor: "#fef2f2", borderColor: "#fecaca" },
  alertWarning: { backgroundColor: "#fffbeb", borderColor: "#fde68a" },
  alertTexts: { flex: 1, marginLeft: 12 },
  alertMessage: { fontSize: 14, fontWeight: "600", marginBottom: 4 },
  alertDate: { fontSize: 12, color: "#64748b" },
  noAlertsText: {
    fontSize: 14,
    color: "#64748b",
    fontStyle: "italic",
    marginBottom: 20,
    marginLeft: 5,
  },

  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 25,
  },
  vitalCard: {
    width: "48%",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  vitalTitle: {
    fontSize: 13,
    color: "#64748b",
    marginBottom: 5,
    fontWeight: "500",
  },
  vitalValueRow: { flexDirection: "row", alignItems: "baseline" },
  vitalValue: { fontSize: 24, fontWeight: "bold", marginRight: 3 },
  vitalUnit: { fontSize: 12, color: "#94a3b8", fontWeight: "600" },
});

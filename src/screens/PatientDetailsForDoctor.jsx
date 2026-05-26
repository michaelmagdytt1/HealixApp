import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function PatientDetailsForDoctor({ navigation, route }) {
  const { patient } = route.params;
  const [isLoading, setIsLoading] = useState(true);

  const [patientData, setPatientData] = useState({
    currentVitals: { hr: 0, spo2: 0, temp: 0, steps: 0 },
    avgVitals: { hr: 0, spo2: 0, temp: 0 },
    alerts: [],
  });

  useEffect(() => {
    fetchRealPatientData();
  }, []);

  const fetchRealPatientData = async () => {
    try {
      const response = await axios.get(
        `https://healixbackend-production.up.railway.app/api/measurements/dashboard/${patient._id}`,
      );

      if (response.status === 200 && response.data) {
        setPatientData({
          currentVitals: response.data.currentVitals || {
            hr: 0,
            spo2: 0,
            temp: 0,
            steps: 0,
          },
          avgVitals: response.data.avgVitals || { hr: 0, spo2: 0, temp: 0 },
          alerts: response.data.alerts || [],
        });
      }
    } catch (error) {
      console.log("No real data found or endpoint missing:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#009688" />
        <Text style={{ marginTop: 10, color: "#64748b" }}>
          Loading real-time vitals...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color="#1e293b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Patient Details</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.profileCard}>
          <View style={styles.profileIcon}>
            <Ionicons
              name={patient?.gender === "female" ? "woman" : "man"}
              size={40}
              color="#009688"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.patientName}>
              {patient?.fullName || patient?.name}
            </Text>
            <Text style={styles.patientSub}>
              {patient?.age ? `${patient.age} Yrs` : "Age N/A"} •{" "}
              {patient?.gender || "Unknown"} •{" "}
              {patient?.weight ? `${patient.weight} kg` : "Weight N/A"}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Recent Alerts</Text>
        {patientData.alerts.length > 0 ? (
          patientData.alerts.map((alert, index) => (
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
            No recent alerts. Patient is stable.
          </Text>
        )}

        <Text style={styles.sectionTitle}>Latest Readings</Text>
        <View style={styles.grid}>
          <VitalCard
            title="Heart Rate"
            value={patientData.currentVitals.hr}
            unit="BPM"
            icon="heart-pulse"
            color="#ef4444"
          />
          <VitalCard
            title="SPO2"
            value={patientData.currentVitals.spo2}
            unit="%"
            icon="water"
            color="#3b82f6"
          />
          <VitalCard
            title="Temp"
            value={patientData.currentVitals.temp}
            unit="°C"
            icon="thermometer"
            color="#f59e0b"
          />
          <VitalCard
            title="Activity"
            value={patientData.currentVitals.steps}
            unit="Steps"
            icon="run"
            color="#10b981"
          />
        </View>

        <Text style={styles.sectionTitle}>Weekly Averages</Text>
        <View style={styles.avgCard}>
          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Avg Heart Rate</Text>
            <Text style={styles.avgValue}>{patientData.avgVitals.hr} BPM</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Avg Oxygen (SPO2)</Text>
            <Text style={styles.avgValue}>{patientData.avgVitals.spo2}%</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.avgRow}>
            <Text style={styles.avgLabel}>Avg Temperature</Text>
            <Text style={styles.avgValue}>{patientData.avgVitals.temp} °C</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

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
  loadingContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1e293b" },
  scrollContent: { padding: 20, paddingBottom: 40 },
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
  patientSub: { fontSize: 14, color: "#64748b" },
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
  avgCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  avgRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  avgLabel: { fontSize: 15, color: "#475569", fontWeight: "500" },
  avgValue: { fontSize: 16, color: "#1e293b", fontWeight: "bold" },
  divider: { height: 1, backgroundColor: "#f1f5f9" },
});

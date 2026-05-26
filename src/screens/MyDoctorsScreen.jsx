import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Colors from "../constants/colors";

export default function MyDoctorsScreen({ navigation }) {
  const [doctors, setDoctors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchMyDoctors();
  }, []);

  const fetchMyDoctors = async () => {
    try {
      const patientId = await AsyncStorage.getItem("patientId");
      if (!patientId) return;

      const response = await axios.get(
        `https://healixbackend-production.up.railway.app/api/chat/my-doctors/${patientId}`,
      );
      setDoctors(response.data);
    } catch (error) {
      console.log("Error fetching doctors:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderDoctor = ({ item }) => (
    <TouchableOpacity
      style={styles.doctorCard}
      onPress={() =>
        navigation.navigate("PatientDoctorChat", {
          doctorId: item._id, // 🚀 بنبعت الـ ID بتاع الدكتور لشاشة الشات
          doctorName: item.fullName || item.name, // 🚀 بنبعت اسم الدكتور الحقيقي
        })
      }
      activeOpacity={0.8}
    >
      <View style={styles.iconBox}>
        <FontAwesome5 name="user-md" size={24} color={Colors.primaryTeal} />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.doctorName}>Dr. {item.fullName || item.name}</Text>
        <Text style={styles.clinicName}>
          {item.clinicName || "Healix Clinic"}
        </Text>
      </View>
      <View style={styles.chatIconBtn}>
        <Ionicons name="chatbubbles" size={22} color="#fff" />
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color={Colors.primaryTeal} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Doctors</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* List */}
      {doctors.length === 0 ? (
        <View style={styles.centerContainer}>
          <FontAwesome5
            name="stethoscope"
            size={60}
            color="#cbd5e1"
            style={{ marginBottom: 20 }}
          />
          <Text style={styles.emptyText}>
            You havent linked with any doctors yet.
          </Text>
        </View>
      ) : (
        <FlatList
          data={doctors}
          keyExtractor={(item) => item._id}
          renderItem={renderDoctor}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  emptyText: { color: "#64748B", fontSize: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
  },
  backBtn: { padding: 5 },
  headerTitle: { fontSize: 20, fontWeight: "bold", color: "#1E293B" },
  listContainer: { padding: 20 },
  doctorCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "rgba(0, 150, 136, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  infoBox: { flex: 1 },
  doctorName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1E293B",
    marginBottom: 4,
  },
  clinicName: { fontSize: 13, color: "#64748B" },
  chatIconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryTeal,
    justifyContent: "center",
    alignItems: "center",
  },
});

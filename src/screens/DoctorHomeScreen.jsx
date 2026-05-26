import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function DoctorHomeScreen({ navigation }) {
  const [patientsList, setPatientsList] = useState([]);
  const [isModalVisible, setModalVisible] = useState(false);
  const [newPatientId, setNewPatientId] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  // تحميل قائمة المرضى المحفوظة على جهاز الدكتور
  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      const savedPatients = await AsyncStorage.getItem("doctor_patients");
      if (savedPatients) {
        setPatientsList(JSON.parse(savedPatients));
      }
    } catch (error) {
      console.log("Error loading patients", error);
    }
  };

  // إضافة مريض جديد بالـ ID
  const handleAddPatient = async () => {
    if (!newPatientId.trim()) {
      Alert.alert("تنبيه", "يرجى إدخال ID المريض");
      return;
    }

    // التأكد إن المريض مش متضاف قبل كده
    const alreadyExists = patientsList.find(
      (p) => p._id === newPatientId.trim(),
    );
    if (alreadyExists) {
      Alert.alert("موجود مسبقاً", "هذا المريض مضاف بالفعل في قائمتك.");
      return;
    }

    setIsSearching(true);
    try {
      const response = await axios.get(
        `https://healixbackend-production.up.railway.app/api/auth/profile/${newPatientId.trim()}`,
      );

      const patientData = response.data;

      // التأكد إن اللي رجع ده مريض مش دكتور زميل مثلاً 😂
      if (patientData.role !== "patient") {
        Alert.alert("خطأ", "هذا المعرف لا يعود لمريض.");
        return;
      }

      // إضافة المريض للقائمة وحفظها
      const updatedList = [...patientsList, patientData];
      setPatientsList(updatedList);
      await AsyncStorage.setItem(
        "doctor_patients",
        JSON.stringify(updatedList),
      );

      Alert.alert(
        "نجاح ✅",
        `تم إضافة المريض ${patientData.fullName || patientData.name} لقائمتك.`,
      );
      setModalVisible(false);
      setNewPatientId("");
    } catch (error) {
      Alert.alert("خطأ ❌", "لم يتم العثور على مريض بهذا المعرف (ID).");
    } finally {
      setIsSearching(false);
    }
  };

  const renderPatientCard = ({ item }) => (
    <TouchableOpacity
      style={styles.patientCard}
      activeOpacity={0.8}
      // 🚀 التعديل هنا: توجيه الدكتور لشاشة تفاصيل المريض وإرسال بيانات المريض معاه
      onPress={() =>
        navigation.navigate("PatientDetailsForDoctor", { patient: item })
      }
    >
      <View style={styles.patientIcon}>
        <Ionicons
          name={item.gender === "female" ? "woman" : "man"}
          size={30}
          color="#009688"
        />
      </View>
      <View style={styles.patientInfo}>
        <Text style={styles.patientName}>{item.fullName || item.name}</Text>
        <Text style={styles.patientDetails}>
          {item.age ? `${item.age} Years` : "Age Unknown"} •{" "}
          {item.gender || "Unknown"}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={24} color="#94a3b8" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Patients</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="add" size={24} color="#fff" />
          <Text style={styles.addBtnText}>Add</Text>
        </TouchableOpacity>
      </View>

      {/* Patients List */}
      {patientsList.length === 0 ? (
        <View style={styles.emptyState}>
          <FontAwesome5 name="clipboard-list" size={60} color="#cbd5e1" />
          <Text style={styles.emptyStateText}>
            لا يوجد مرضى في قائمتك حالياً.
          </Text>
          <Text style={styles.emptyStateSub}>
            اضغط على Add لإضافة مريض باستخدام الـ ID الخاص به.
          </Text>
        </View>
      ) : (
        <FlatList
          data={patientsList}
          keyExtractor={(item) => item._id}
          renderItem={renderPatientCard}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}

      {/* Add Patient Modal */}
      <Modal visible={isModalVisible} animationType="slide" transparent={true}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Patient</Text>
            <Text style={styles.modalSub}>
              Ask your patient for their unique ID
            </Text>

            <TextInput
              style={styles.modalInput}
              placeholder="Paste Patient ID here..."
              placeholderTextColor="#94a3b8"
              value={newPatientId}
              onChangeText={setNewPatientId}
            />

            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.confirmBtn}
                onPress={handleAddPatient}
                disabled={isSearching}
              >
                {isSearching ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text style={styles.confirmBtnText}>Add Patient</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8FAFC" },
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
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  headerTitle: { fontSize: 24, fontWeight: "bold", color: "#1e293b" },
  addBtn: {
    flexDirection: "row",
    backgroundColor: "#009688",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
    alignItems: "center",
  },
  addBtnText: { color: "#fff", fontWeight: "bold", marginLeft: 5 },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#64748b",
    marginTop: 20,
    textAlign: "center",
  },
  emptyStateSub: {
    fontSize: 14,
    color: "#94a3b8",
    textAlign: "center",
    marginTop: 10,
  },
  listContainer: { padding: 20 },
  patientCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 16,
    marginBottom: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  patientIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0F2F1",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  patientInfo: { flex: 1 },
  patientName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 4,
  },
  patientDetails: { fontSize: 13, color: "#64748b" },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "85%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 25,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1e293b",
    marginBottom: 5,
    textAlign: "center",
  },
  modalSub: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 20,
  },
  modalInput: {
    backgroundColor: "#F1F5F9",
    height: 55,
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 16,
    color: "#1e293b",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 25,
  },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  cancelBtn: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F1F5F9",
    borderRadius: 12,
    marginRight: 10,
  },
  cancelBtnText: { color: "#64748b", fontSize: 16, fontWeight: "bold" },
  confirmBtn: {
    flex: 1,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#009688",
    borderRadius: 12,
  },
  confirmBtnText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});

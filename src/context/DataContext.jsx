import axios from "axios";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
// 🚀 استدعينا AsyncStorage عشان نقرأ الـ ID والاسم اللي حفظناهم وقت اللوجين
import AsyncStorage from "@react-native-async-storage/async-storage";

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [vitals, setVitals] = useState({
    hr: 0,
    spo2: 0,
    temp: 0,
    steps: 0,
    fall: false,
  });

  const [isBluetoothConnected, setIsBluetoothConnected] = useState(false);

  // 👤 State عشان نشيل فيه الـ ID بتاع المريض الحالي
  const [patientId, setPatientId] = useState(null);

  // 📛 State جديد عشان نشيل فيه اسم اليوزر (الافتراضي "مستخدم")
  const [userName, setUserName] = useState("مستخدم");

  const lastSendTime = useRef(Date.now());

  // 🛡️ أول ما الملف يشتغل، هيروح يقرأ داتا اليوزر (الـ ID والاسم)
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const storedId = await AsyncStorage.getItem("patientId");
        const storedName = await AsyncStorage.getItem("userName"); // 👈 بيقرأ الاسم

        if (storedId) {
          setPatientId(storedId);
          console.log("👤 Current Patient ID loaded:", storedId);
        }

        if (storedName) {
          setUserName(storedName); // 👈 بيحفظ الاسم في الـ State
          console.log("📛 Current User Name loaded:", storedName);
        }
      } catch (e) {
        console.error("❌ Failed to load user data:", e);
      }
    };
    loadUserData();
  }, []);

  const saveToDatabase = useCallback(
    async (currentVitals) => {
      // 🛑 لو مفيش ID مريض (يعني معملش لوجين)، مش هنبعت حاجة للسيرفر
      if (!patientId) {
        console.log("⚠️ No patientId found. Data won't be saved.");
        return;
      }

      try {
        const BACKEND_URL =
          "https://healixbackend-production.up.railway.app/api/measurements/add";

        const payload = {
          patientId: patientId,
          ...currentVitals,
        };

        const response = await axios.post(BACKEND_URL, payload);
        console.log(`✅ Data saved for patient [${patientId}] successfully!`);
      } catch (error) {
        console.error("❌ Error saving to DB:", error.message);
      }
    },
    [patientId],
  ); // الدالة دي هتتحدث أول ما الـ patientId يتغير

  useEffect(() => {
    if (!isBluetoothConnected || vitals.hr === 0) return;

    const currentTime = Date.now();
    if (currentTime - lastSendTime.current >= 10000) {
      console.log("⏱️ Sending periodic update...");
      saveToDatabase(vitals);
      lastSendTime.current = currentTime;
    }
  }, [vitals, isBluetoothConnected, saveToDatabase]);

  return (
    <DataContext.Provider
      value={{
        vitals,
        setVitals,
        isBluetoothConnected,
        setIsBluetoothConnected,
        patientId,
        setPatientId,
        userName, // 👈 طلعنا الاسم بره عشان شاشة الـ Home تشوفه
        setUserName, // 👈 عشان نقدر نحدثه فوراً مع اللوجين
      }}
    >
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);

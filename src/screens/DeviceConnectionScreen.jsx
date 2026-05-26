import { Ionicons } from "@expo/vector-icons";
import { decode } from "base-64";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { BleManager } from "react-native-ble-plx";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const bleManager = new BleManager();

// 🔑 المفاتيح الحقيقية للسوار
const SERVICE_UUID = "12345678-1234-1234-1234-1234567890ab";
const CHARACTERISTIC_UUID = "abcd1234-ab12-cd34-ef56-abcdef123456";

export default function DeviceConnectionScreen({ navigation }) {
  const { isDark } = useTheme();
  const { setVitals, setIsBluetoothConnected } = useData();

  const [isScanning, setIsScanning] = useState(false);
  const [devices, setDevices] = useState([]);

  const requestPermissions = async () => {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      ]);
      return (
        granted["android.permission.ACCESS_FINE_LOCATION"] ===
        PermissionsAndroid.RESULTS.GRANTED
      );
    }
    return true;
  };

  const startScan = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) {
      alert("Location & Bluetooth permissions are required!");
      return;
    }

    setDevices([]);
    setIsScanning(true);

    bleManager.startDeviceScan(null, null, (error, scannedDevice) => {
      if (error) {
        console.warn(error);
        setIsScanning(false);
        return;
      }

      if (scannedDevice && scannedDevice.name) {
        setDevices((prevDevices) => {
          const deviceExists = prevDevices.find(
            (dev) => dev.id === scannedDevice.id,
          );
          if (!deviceExists) {
            return [...prevDevices, scannedDevice];
          }
          return prevDevices;
        });
      }
    });

    setTimeout(() => {
      bleManager.stopDeviceScan();
      setIsScanning(false);
    }, 10000);
  };

  const connectToDevice = async (device) => {
    bleManager.stopDeviceScan();
    setIsScanning(false);

    try {
      console.log("🚀 Starting connection to:", device.name);
      const connectedDevice = await bleManager.connectToDevice(device.id);

      if (Platform.OS === "android") {
        await connectedDevice.requestMTU(512);
        console.log("📏 MTU size updated to 512");
      }

      console.log("✅ Device Connected! Discovering services...");
      await connectedDevice.discoverAllServicesAndCharacteristics();

      console.log("📂 Services Discovered. Setting up Monitor...");
      setIsBluetoothConnected(true);
      alert(`Connected to ${device.name}`);

      let fullData = "";

      bleManager.monitorCharacteristicForDevice(
        device.id,
        SERVICE_UUID,
        CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.log("Monitoring Error:", error.message);
            return;
          }

          if (characteristic?.value) {
            try {
              const chunk = decode(characteristic.value);
              fullData += chunk;

              if (fullData.includes("}")) {
                console.log("📥 FULL JSON RECEIVED:", fullData);

                const parsedData = JSON.parse(fullData.trim());
                setVitals(parsedData);

                fullData = "";
              }
            } catch (_e) {
              // 👈 غيرنا e لـ _e عشان نسكت التنبيه
              if (fullData.length > 200) fullData = "";
            }
          }
        },
      );

      setTimeout(() => navigation.goBack(), 1000);
    } catch (error) {
      console.error("❌ Connection Error Detail:", error);
      alert("Failed to connect. Check if ESP is still on.");
    }
  };

  useEffect(() => {
    return () => bleManager.stopDeviceScan();
  }, []);

  const renderDeviceItem = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.deviceCard,
        { backgroundColor: isDark ? "#1E293B" : "#FFFFFF" },
      ]}
      onPress={() => connectToDevice(item)}
      activeOpacity={0.7}
    >
      <View style={styles.deviceInfo}>
        <Ionicons name="hardware-chip-outline" size={30} color="#007AFF" />
        <View style={styles.deviceTextContainer}>
          <Text
            style={[styles.deviceName, { color: isDark ? "#FFF" : "#333" }]}
          >
            {item.name}
          </Text>
          <Text style={styles.deviceId}>{item.id}</Text>
        </View>
      </View>
      <Ionicons name="link-outline" size={24} color="#4CAF50" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#0F172A" : "#F8FAFC" },
      ]}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Ionicons
            name="arrow-back"
            size={28}
            color={isDark ? "#FFF" : "#333"}
          />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? "#FFF" : "#333" }]}>
          Pair Device
        </Text>
        <View style={{ width: 28 }} />
      </View>

      <View style={styles.scanSection}>
        <View style={styles.iconCircle}>
          <Ionicons name="bluetooth" size={60} color="#007AFF" />
        </View>
        <Text
          style={[styles.subtitle, { color: isDark ? "#94A3B8" : "#64748B" }]}
        >
          Make sure your smart band is turned on and nearby.
        </Text>

        <TouchableOpacity
          style={[styles.scanBtn, isScanning && styles.scanningBtn]}
          onPress={startScan}
          disabled={isScanning}
        >
          {isScanning ? (
            <ActivityIndicator
              color="#FFF"
              size="small"
              style={{ marginRight: 10 }}
            />
          ) : (
            <Ionicons
              name="search"
              size={20}
              color="#FFF"
              style={{ marginRight: 10 }}
            />
          )}
          <Text style={styles.scanBtnText}>
            {isScanning ? "Scanning..." : "Search for Devices"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.listSection}>
        <Text style={[styles.listTitle, { color: isDark ? "#FFF" : "#333" }]}>
          Available Devices
        </Text>
        {devices.length === 0 && !isScanning ? (
          <Text style={styles.emptyText}>
            No devices found. Tap Search to scan.
          </Text>
        ) : (
          <FlatList
            data={devices}
            keyExtractor={(item) => item.id}
            renderItem={renderDeviceItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    paddingBottom: 15,
  },
  backBtn: { padding: 5 },
  title: { fontSize: 20, fontWeight: "bold" },
  scanSection: {
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "rgba(0, 122, 255, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  subtitle: {
    textAlign: "center",
    fontSize: 14,
    marginBottom: 25,
    lineHeight: 22,
  },
  scanBtn: {
    flexDirection: "row",
    backgroundColor: "#007AFF",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 30,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  scanningBtn: { backgroundColor: "#64748B" },
  scanBtnText: { color: "#FFF", fontSize: 16, fontWeight: "bold" },
  listSection: { flex: 1, paddingHorizontal: 20 },
  listTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  deviceCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderRadius: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  deviceInfo: { flexDirection: "row", alignItems: "center" },
  deviceTextContainer: { marginLeft: 15 },
  deviceName: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  deviceId: { fontSize: 12, color: "#94A3B8" },
  emptyText: {
    textAlign: "center",
    color: "#94A3B8",
    marginTop: 30,
    fontSize: 14,
  },
});

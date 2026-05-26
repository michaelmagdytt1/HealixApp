import { decode as atob } from "base-64";

// متغير عشان نتحكم: هل نشغل المحاكاة ولا الحقيقي؟
const SIMULATION_MODE = false;

let BleManager;
if (!SIMULATION_MODE) {
  // بنستدعي المكتبة الحقيقية بس لو مش في وضع المحاكاة
  const { BleManager: RealBleManager } = require("react-native-ble-plx");
  BleManager = RealBleManager;
}

class BluetoothService {
  constructor() {
    if (!SIMULATION_MODE) {
      this.manager = new BleManager();
    } else {
      console.log("⚠️ Running in Bluetooth Simulation Mode");
    }
  }

  // 1. بحث عن الأجهزة
  scanForDevices(onDeviceFound) {
    if (SIMULATION_MODE) {
      // محاكاة: بنرجع جهاز وهمي بعد ثانية
      setTimeout(() => {
        onDeviceFound({
          id: "SIMULATED-DEVICE-001",
          name: "Healix Smart Band (Simulated)",
        });
      }, 1000);
      return;
    }

    // الكود الحقيقي
    this.manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log("Scan Error:", error);
        return;
      }

      // 👈 التعديل هنا: شلنا الفلتر! كده هيبعت أي جهاز يلقطه سواء ليه اسم أو ملوش
      if (device) {
        onDeviceFound(device);
      }
    });
  }

  stopScan() {
    if (!SIMULATION_MODE) {
      this.manager.stopDeviceScan();
    }
  }

  // 3. الاتصال بالجهاز
  async connectToDevice(deviceId) {
    if (SIMULATION_MODE) {
      console.log("Simulating connection...");
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ name: "Simulated Device" });
          // نبدأ نبعت داتا وهمية فوراً
          this.startSimulatedData();
        }, 1500);
      });
    }

    // الاتصال الحقيقي
    try {
      const device = await this.manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();
      return device;
    } catch (error) {
      console.log("Connection Error:", error);
      throw error;
    }
  }

  // دالة خاصة للمحاكاة بتبعت داتا كل 3 ثواني
  startSimulatedData() {
    setInterval(() => {
      if (this.onDataCallback) {
        const mockData = {
          hr: Math.floor(Math.random() * (100 - 60) + 60), // نبض عشوائي بين 60 و 100
          temp: (Math.random() * (37.5 - 36.0) + 36.0).toFixed(1), // حرارة عشوائية
        };
        this.onDataCallback(mockData);
      }
    }, 3000);
  }

  // 4. مراقبة الداتا
  async monitorDevice(device, onDataReceived) {
    // بنحفظ الدالة عشان نستخدمها في المحاكاة
    this.onDataCallback = onDataReceived;

    if (SIMULATION_MODE) return;

    // الكود الحقيقي (UUIDs)
    const SERVICE_UUID = "4fafc201-1fb5-459e-8fcc-c5c9c331914b";
    const CHAR_UUID = "beb5483e-36e1-4688-b7f5-ea07361b26a8";

    device.monitorCharacteristicForService(
      SERVICE_UUID,
      CHAR_UUID,
      (error, characteristic) => {
        if (error) {
          console.log("Monitor Error:", error);
          return;
        }
        if (characteristic?.value) {
          try {
            const rawString = atob(characteristic.value);
            const sensorData = JSON.parse(rawString);
            onDataReceived(sensorData);
          } catch (e) {
            console.log("Parsing Error:", e);
          }
        }
      },
    );
  }
}

export default new BluetoothService();

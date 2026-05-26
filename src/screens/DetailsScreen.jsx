import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";
import { useCallback, useEffect, useState } from "react";
import {
    ActivityIndicator,
    Dimensions,
    Image,
    Platform,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { LineChart } from "react-native-chart-kit";
import Svg, { Circle } from "react-native-svg";

// 🚀 استدعاء الـ Contexts
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

// 🌟 الـ Tabs الأنيقة
const SegmentedControl = ({ tabs, activeTab, onTabChange, theme }) => (
  <View
    style={[styles.segmentedControl, { backgroundColor: theme.segmentedBg }]}
  >
    {tabs.map((tab) => {
      const isActive = activeTab === tab;
      return (
        <TouchableOpacity
          key={tab}
          onPress={() => onTabChange(tab)}
          style={[
            styles.tabButton,
            isActive && { backgroundColor: theme.accent, elevation: 2 },
          ]}
        >
          <Text
            style={[
              styles.tabText,
              { color: isActive ? "#ffffff" : theme.textSecondary },
            ]}
          >
            {tab}
          </Text>
        </TouchableOpacity>
      );
    })}
  </View>
);

const DetailsScreen = ({ route, navigation }) => {
  const { isDark } = useTheme();
  // 🚀 سحبنا الداتا الحية والـ ID من الـ Context
  const { vitals, patientId } = useData();

  const { title, unit } = route.params || { title: "Heart Rate", unit: "BPM" };

  const [filter, setFilter] = useState("Day");
  const [isLoading, setIsLoading] = useState(false);

  // داتا مبدئية للرسم البياني لحد ما السيرفر يرد
  const [chartData, setChartData] = useState({
    labels: ["Start"],
    datasets: [{ data: [0] }],
  });

  // 🔄 ربط اسم الشاشة بالاسم اللي في الداتابيز
  const vitalKeyMap = {
    "Heart Rate": "hr",
    Temperature: "temp",
    SPO2: "spo2",
    Activity: "steps",
  };
  const currentKey = vitalKeyMap[title];

  // 🔥 الرقم الحي اللي هيتعرض في الدائرة (نفس اللي في الـ Home)
  const liveValue = vitals[currentKey] || 0;

  // 🚀 دالة لجلب بيانات الرسم البياني من الباك إند
  const fetchChartData = useCallback(
    async (range) => {
      if (!patientId) return;
      setIsLoading(true);
      try {
        // ⚠️ تأكد من رفع كود الباك إند اللي تحت عشان اللينك ده يشتغل
        const BACKEND_URL = `https://healixbackend-production.up.railway.app/api/measurements/chart/${patientId}/${currentKey}?range=${range}`;
        const response = await axios.get(BACKEND_URL);

        if (
          response.data &&
          response.data.labels &&
          response.data.labels.length > 0
        ) {
          setChartData({
            labels: response.data.labels,
            datasets: [{ data: response.data.data }],
          });
        } else {
          // لو مفيش داتا نرجع قيم صفرية عشان التطبيق ميعملش كراش
          setChartData({ labels: ["No Data"], datasets: [{ data: [0] }] });
        }
      } catch (error) {
        console.log("Error fetching chart data:", error.message);
        setChartData({ labels: ["Error"], datasets: [{ data: [0] }] });
      } finally {
        setIsLoading(false);
      }
    },
    [patientId, currentKey],
  );

  // تحديث الرسم البياني لما اليوزر يغير الـ Tab
  useEffect(() => {
    fetchChartData(filter);
  }, [filter, fetchChartData]);

  // 🎨 الألوان
  const theme = {
    bg: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    segmentedBg: isDark ? "rgba(255,255,255,0.05)" : "#E2E8F0",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    accent: "#009688",
    shadow: isDark ? "#000000" : "#cbd5e1",
  };

  // حسابات الدائرة
  const radius = 55;
  const circumference = 2 * Math.PI * radius;
  const maxValueMap = { hr: 200, temp: 50, spo2: 100, steps: 10000 };
  const maxValue = maxValueMap[currentKey] || 100;
  const percentage = Math.min((liveValue / maxValue) * 100, 100);
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.bg }]}>
      <StatusBar
        barStyle={isDark ? "light-content" : "dark-content"}
        backgroundColor={theme.bg}
      />

      <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
        <LinearGradient
          colors={[theme.bg, isDark ? "#020617" : "#E0F2F1"]}
          style={StyleSheet.absoluteFillObject}
        />
      </View>

      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={28} color={theme.textPrimary} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          {title}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* === Chart Card === */}
        <View
          style={[
            styles.chartCard,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <SegmentedControl
            tabs={["Day", "Week", "Month"]}
            activeTab={filter}
            onTabChange={setFilter}
            theme={theme}
          />

          {isLoading ? (
            <ActivityIndicator
              size="large"
              color={theme.accent}
              style={{ height: 220, justifyContent: "center" }}
            />
          ) : (
            <LineChart
              data={chartData}
              width={width - 60}
              height={220}
              chartConfig={{
                backgroundColor: theme.card,
                backgroundGradientFrom: theme.card,
                backgroundGradientTo: theme.card,
                decimalPlaces: title === "Temperature" ? 1 : 0,
                color: (opacity = 1) => theme.accent,
                labelColor: (opacity = 1) => theme.textSecondary,
                propsForDots: {
                  r: "5",
                  strokeWidth: "2",
                  stroke: theme.accent,
                  fill: theme.card,
                },
                fillShadowGradientFrom: theme.accent,
                fillShadowGradientTo: theme.accent,
                fillShadowGradientOpacity: 0.2,
              }}
              bezier
              style={styles.chart}
              withInnerLines={false}
              withOuterLines={false}
            />
          )}
        </View>

        {/* === Bottom Summary === */}
        <View style={styles.bottomSection}>
          <View style={styles.circleWrapper}>
            <View
              style={[styles.circleShadow, { shadowColor: theme.accent }]}
            />
            <Svg height="150" width="150" viewBox="0 0 130 130">
              <Circle
                cx="65"
                cy="65"
                r={radius}
                stroke={isDark ? "#334155" : "#E2E8F0"}
                strokeWidth="12"
                fill="none"
              />
              <Circle
                cx="65"
                cy="65"
                r={radius}
                stroke={theme.accent}
                strokeWidth="12"
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                rotation="-90"
                origin="65, 65"
              />
            </Svg>
            <View style={styles.circleTextContainer}>
              {/* 🔥 القراءة الحية هنا */}
              <Text style={[styles.circleValue, { color: theme.textPrimary }]}>
                {liveValue}
              </Text>
              <Text style={[styles.circleUnit, { color: theme.textSecondary }]}>
                {unit}
              </Text>
            </View>
          </View>

          <View style={styles.doctorContainer}>
            <Image
              source={require("../../assets/images/doctor.png")}
              style={styles.illustrationDoctorImg}
              resizeMode="contain"
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "android" ? 40 : 20,
    marginBottom: 20,
  },
  backButton: { marginRight: 15 },
  title: { fontSize: 28, fontWeight: "bold" },
  content: { paddingHorizontal: 20, paddingBottom: 40 },
  segmentedControl: {
    flexDirection: "row",
    padding: 6,
    borderRadius: 18,
    marginBottom: 20,
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  tabText: { fontSize: 14, fontWeight: "600" },
  chartCard: {
    borderRadius: 24,
    padding: 20,
    elevation: 8,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    marginBottom: 30,
  },
  chart: { borderRadius: 16, alignSelf: "center" },
  bottomSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  circleWrapper: {
    position: "relative",
    width: 150,
    height: 150,
    justifyContent: "center",
    alignItems: "center",
  },
  circleShadow: {
    position: "absolute",
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "white",
    elevation: 10,
    shadowOpacity: 0.2,
    shadowRadius: 15,
  },
  circleTextContainer: { position: "absolute", alignItems: "center" },
  circleValue: { fontSize: 32, fontWeight: "bold" },
  circleUnit: { fontSize: 16, fontWeight: "600", marginTop: -2 },
  doctorContainer: { flex: 1, alignItems: "flex-end" },
  illustrationDoctorImg: {
    width: 220,
    height: 220,
    marginRight: -30,
    marginBottom: -20,
  },
});

export default DetailsScreen;

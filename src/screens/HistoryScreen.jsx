import { Ionicons } from "@expo/vector-icons";
import axios from "axios"; // 👈 استدعاء للاتصال بالباك إند
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";

// استيراد الـ Contexts
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

// 🌟 المكون السحري لزحلقة الأرقام 🌟
const AnimatedNumber = ({ value, textStyle }) => {
  const [displayValue, setDisplayValue] = useState(value || 0);
  const prevValue = React.useRef(value || 0);

  useEffect(() => {
    let start = prevValue.current;
    let end = value || 0;
    if (start === end) return;

    let duration = 600;
    let startTime = null;
    let animationFrameId;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 4);
      const current = start + (end - start) * easeOut;

      if (Number.isInteger(end)) {
        setDisplayValue(Math.round(current));
      } else {
        setDisplayValue(parseFloat(current.toFixed(1)));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        setDisplayValue(end);
        prevValue.current = end;
      }
    };

    animationFrameId = requestAnimationFrame(step);
    return () => cancelAnimationFrame(animationFrameId);
  }, [value]);

  return <Text style={textStyle}>{displayValue}</Text>;
};

export default function HistoryScreen() {
  const today = new Date().toISOString().split("T")[0];
  const [selectedDate, setSelectedDate] = useState(today);

  // 👈 متغيرات جديدة للداتا اللي جاية من السيرفر وحالة التحميل
  const [historicalData, setHistoricalData] = useState({
    hr: 0,
    spo2: 0,
    temp: 0,
    steps: 0,
  });
  const [isLoading, setIsLoading] = useState(false);

  const { isDark } = useTheme();
  // 👈 سحبنا الـ patientId من الـ Context عشان نبعته في اللينك
  const { vitals, patientId } = useData();

  // 🚀 دالة لجلب الداتا من الباك إند
  const fetchHistoryData = useCallback(
    async (date) => {
      if (!patientId) return; // لو مفيش مريض، ميعملش حاجة

      setIsLoading(true);
      try {
        const BACKEND_URL = `https://healixbackend-production.up.railway.app/api/measurements/history/${patientId}/${date}`;
        const response = await axios.get(BACKEND_URL);

        if (response.data && response.data.measurements) {
          const data = response.data.measurements;
          setHistoricalData({
            hr: data.hr || 0,
            spo2: data.spo2 || 0,
            temp: data.temp || 0,
            steps: data.steps || 0,
          });
        } else {
          setHistoricalData({ hr: 0, spo2: 0, temp: 0, steps: 0 });
        }
      } catch (error) {
        console.log("No data for this date or error:", error.message);
        setHistoricalData({ hr: 0, spo2: 0, temp: 0, steps: 0 });
      } finally {
        setIsLoading(false);
      }
    },
    [patientId],
  );

  // 🔄 تحديث الداتا كل ما اليوزر يغير التاريخ
  useEffect(() => {
    // لو اختار النهاردة، نعرض الداتا الحية لو موجودة
    if (selectedDate === today && vitals.hr !== 0) {
      setHistoricalData(vitals);
    } else {
      // لو اختار يوم قديم، نجيب الداتا من السيرفر
      fetchHistoryData(selectedDate);
    }
  }, [selectedDate, fetchHistoryData, vitals]);

  const theme = {
    bg: isDark ? "#0F172A" : "#F8FAFC",
    card: isDark ? "#1E293B" : "#FFFFFF",
    textPrimary: isDark ? "#F8FAFC" : "#0F172A",
    textSecondary: isDark ? "#94A3B8" : "#64748B",
    accent: isDark ? "#3B82F6" : "#2563EB",
    shadow: isDark ? "#000000" : "#cbd5e1",
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.bg }]}>
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: theme.textPrimary }]}>
            Patient History
          </Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
            Track your vitals over time
          </Text>
        </View>

        <View
          style={[
            styles.calendarContainer,
            { backgroundColor: theme.card, shadowColor: theme.shadow },
          ]}
        >
          <Calendar
            key={isDark ? "dark" : "light"}
            current={today}
            onDayPress={(day) => setSelectedDate(day.dateString)}
            markedDates={{
              [selectedDate]: {
                selected: true,
                selectedColor: theme.accent,
                disableTouchEvent: true,
              },
            }}
            theme={{
              backgroundColor: theme.card,
              calendarBackground: theme.card,
              textSectionTitleColor: theme.textSecondary,
              selectedDayBackgroundColor: theme.accent,
              selectedDayTextColor: "#ffffff",
              todayTextColor: theme.accent,
              dayTextColor: theme.textPrimary,
              textDisabledColor: isDark ? "#334155" : "#E2E8F0",
              monthTextColor: theme.textPrimary,
              arrowColor: theme.accent,
              textMonthFontWeight: "bold",
            }}
          />
        </View>

        <View style={styles.readingsSection}>
          <View style={styles.dateLabelRow}>
            <Text style={[styles.dateLabel, { color: theme.textPrimary }]}>
              Readings for {selectedDate === today ? "Today" : selectedDate}
            </Text>
            {/* ⏳ علامة التحميل بتظهر وتختفي أوتوماتيك */}
            {isLoading && (
              <ActivityIndicator size="small" color={theme.accent} />
            )}
          </View>

          <View style={styles.grid}>
            {/* Heart Rate */}
            <View
              style={[
                styles.vitalCard,
                { backgroundColor: theme.card, shadowColor: theme.shadow },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(239, 68, 68, 0.15)"
                      : "#FEE2E2",
                  },
                ]}
              >
                <Ionicons name="heart" size={28} color="#EF4444" />
              </View>
              <Text style={[styles.vitalTitle, { color: theme.textSecondary }]}>
                Heart Rate
              </Text>
              <View style={styles.valueRow}>
                <AnimatedNumber
                  value={historicalData.hr}
                  textStyle={[styles.vitalValue, { color: theme.textPrimary }]}
                />
                <Text style={styles.unit}> bpm</Text>
              </View>
            </View>

            {/* SpO2 */}
            <View
              style={[
                styles.vitalCard,
                { backgroundColor: theme.card, shadowColor: theme.shadow },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(6, 182, 212, 0.15)"
                      : "#CFFAFE",
                  },
                ]}
              >
                <Ionicons name="water" size={28} color="#06B6D4" />
              </View>
              <Text style={[styles.vitalTitle, { color: theme.textSecondary }]}>
                SpO2
              </Text>
              <View style={styles.valueRow}>
                <AnimatedNumber
                  value={historicalData.spo2}
                  textStyle={[styles.vitalValue, { color: theme.textPrimary }]}
                />
                <Text style={styles.unit}> %</Text>
              </View>
            </View>

            {/* Temp */}
            <View
              style={[
                styles.vitalCard,
                { backgroundColor: theme.card, shadowColor: theme.shadow },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(245, 158, 11, 0.15)"
                      : "#FEF3C7",
                  },
                ]}
              >
                <Ionicons name="thermometer" size={28} color="#F59E0B" />
              </View>
              <Text style={[styles.vitalTitle, { color: theme.textSecondary }]}>
                Temp
              </Text>
              <View style={styles.valueRow}>
                <AnimatedNumber
                  value={historicalData.temp}
                  textStyle={[styles.vitalValue, { color: theme.textPrimary }]}
                />
                <Text style={styles.unit}> °C</Text>
              </View>
            </View>

            {/* Steps */}
            <View
              style={[
                styles.vitalCard,
                { backgroundColor: theme.card, shadowColor: theme.shadow },
              ]}
            >
              <View
                style={[
                  styles.iconBox,
                  {
                    backgroundColor: isDark
                      ? "rgba(16, 185, 129, 0.15)"
                      : "#D1FAE5",
                  },
                ]}
              >
                <Ionicons name="walk" size={28} color="#10B981" />
              </View>
              <Text style={[styles.vitalTitle, { color: theme.textSecondary }]}>
                Steps
              </Text>
              <View style={styles.valueRow}>
                <AnimatedNumber
                  value={historicalData.steps}
                  textStyle={[styles.vitalValue, { color: theme.textPrimary }]}
                />
                <Text style={styles.unit}> steps</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scrollContainer: { paddingBottom: 120 },
  header: { padding: 24, paddingTop: Platform.OS === "android" ? 40 : 20 },
  title: { fontSize: 32, fontWeight: "bold" },
  subtitle: { fontSize: 16, marginTop: 4 },
  calendarContainer: {
    marginHorizontal: 20,
    marginBottom: 24,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 4,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
  },
  readingsSection: { paddingHorizontal: 24 },
  dateLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  dateLabel: { fontSize: 18, fontWeight: "600" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  vitalCard: {
    width: "47%",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    elevation: 3,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },
  vitalTitle: { fontSize: 14, fontWeight: "600", marginBottom: 6 },
  valueRow: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  vitalValue: { fontSize: 24, fontWeight: "bold" },
  unit: { fontSize: 14, fontWeight: "normal", color: "#94A3B8" },
});

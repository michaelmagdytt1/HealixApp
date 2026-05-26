import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";
import { useData } from "../context/DataContext";
import { useTheme } from "../context/ThemeContext";

const { width } = Dimensions.get("window");

// 🌟 المكون السحري لزحلقة الأرقام بنعومة 🌟
const AnimatedNumber = ({ value }) => {
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

  return <Text style={styles.cardValue}>{displayValue}</Text>;
};

const HomeScreen = ({ navigation }) => {
  const { colors, t, isDark } = useTheme();
  const { vitals, isBluetoothConnected, userName } = useData();

  // 🔥 لوجيك التنبيهات الذكي 🔥
  let alertMessage = "All vitals are stable";
  let alertColor = "#4CAF50";

  if (vitals.fall) {
    alertMessage = "⚠️ FALL DETECTED! Immediate attention needed!";
    alertColor = "#C62828";
  } else if (vitals.temp > 37.5) {
    alertMessage = `Mild temperature fluctuation detected (${vitals.temp}°C)`;
    alertColor = "#FF9800";
  } else if ((vitals.hr > 100 || vitals.hr < 60) && vitals.hr !== 0) {
    alertMessage = "Abnormal Heart Rate detected";
    alertColor = "#FF9800";
  }

  return (
    <View style={styles.mainContainer}>
      <StatusBar barStyle="light-content" backgroundColor="#2ab7ca" />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        overScrollMode="never"
      >
        {/* === Header Section === */}
        <View style={styles.headerWrapper}>
          <View style={styles.headerContent}>
            {/* Greeting Section */}
            <View style={styles.textSection}>
              <Text style={styles.greetingText}>
                Hi, {userName || "مستخدم"}
              </Text>
              <Text style={styles.subGreetingText}>{t.welcome}</Text>

              <TouchableOpacity
                style={styles.chatIconBadge}
                onPress={() => navigation.navigate("Notifications")}
                activeOpacity={0.7}
              >
                <Ionicons name="notifications" size={24} color="white" />
                <View style={styles.redBadge}>
                  <Text style={styles.badgeText}>1</Text>
                </View>
              </TouchableOpacity>
            </View>

            {/* 🚀 التعديل هنا: زرار الشات مع الدكتور بدل البروفايل */}
            <TouchableOpacity
              style={styles.profileContainer}
              onPress={() => navigation.navigate("PatientDoctorChat")} // 👈 بينقله لشاشة الشات اللي لسه عاملينها
              activeOpacity={0.8}
            >
              <View style={styles.profileImageWrapper}>
                <Ionicons name="chatbubbles" size={38} color="#2ab7ca" />
              </View>
              <View style={styles.onlineStatusDot} />
            </TouchableOpacity>
          </View>

          {/* المنحنى السفلي */}
          <View style={styles.curveWrapper} pointerEvents="none">
            <Svg height="50" width={width} viewBox={`0 0 ${width} 50`}>
              <Path
                d={`M0,50 L0,0 C${width * 0.4},30 ${width * 0.6},30 ${width},0 L${width},50 Z`}
                fill={isDark ? colors.background : "white"}
              />
            </Svg>
          </View>
        </View>

        {/* === Body Section === */}
        <View
          style={[
            styles.bodyContainer,
            { backgroundColor: isDark ? colors.background : "white" },
          ]}
        >
          {/* خلفية الـ DNA */}
          <View style={styles.dnaWrapper} pointerEvents="none">
            <MaterialCommunityIcons
              name="dna"
              size={300}
              color={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"}
            />
          </View>

          {/* 🔥 حالة البلوتوث بتتغير أوتوماتيك 🔥 */}
          <TouchableOpacity
            style={[
              styles.connectCard,
              isBluetoothConnected && {
                backgroundColor: "#4CAF50",
                shadowColor: "#4CAF50",
              },
            ]}
            onPress={() => navigation.navigate("DeviceConnection")}
            activeOpacity={0.9}
          >
            <View style={styles.connectContent}>
              <View style={styles.connectIconBg}>
                <Ionicons
                  name={
                    isBluetoothConnected ? "bluetooth" : "bluetooth-outline"
                  }
                  size={24}
                  color="white"
                />
              </View>
              <View style={styles.connectTexts}>
                <Text style={styles.connectTitle}>
                  {isBluetoothConnected
                    ? "Smart Band Connected"
                    : "Connect Smart Band"}
                </Text>
                <Text style={styles.connectSubtitle}>
                  {isBluetoothConnected
                    ? "Real-time sync active"
                    : "Tap to pair your device"}
                </Text>
              </View>
            </View>
            <Ionicons
              name={
                isBluetoothConnected ? "checkmark-circle" : "chevron-forward"
              }
              size={24}
              color="white"
              style={{ opacity: 0.8 }}
            />
          </TouchableOpacity>

          {/* Grid Cards (مربوطة بالداتا الحية) */}
          <View style={styles.staggeredGrid}>
            {/* Left Column */}
            <View style={styles.column}>
              <InfoCard
                title="Heart Rate"
                value={vitals.hr}
                unit="BPM"
                icon="heart-pulse"
                iconType="MCI"
                bgColor="#29B6F6"
                onPress={() =>
                  navigation.navigate("Details", {
                    title: "Heart Rate",
                    value: vitals.hr,
                    unit: "BPM",
                    color: "#29B6F6",
                  })
                }
              />
              <InfoCard
                title="SPO2"
                value={vitals.spo2}
                unit="%"
                icon="water-outline"
                iconType="Ionicons"
                bgColor="#29B6F6"
                onPress={() =>
                  navigation.navigate("Details", {
                    title: "SPO2",
                    value: vitals.spo2,
                    unit: "%",
                    color: "#29B6F6",
                  })
                }
              />
            </View>

            {/* Right Column */}
            <View style={[styles.column, styles.rightColumn]}>
              <InfoCard
                title="Temperature"
                value={vitals.temp}
                unit="°C"
                icon="thermometer"
                iconType="MCI"
                bgColor="#26A69A"
                onPress={() =>
                  navigation.navigate("Details", {
                    title: "Temperature",
                    value: vitals.temp,
                    unit: "°C",
                    color: "#26A69A",
                  })
                }
              />
              <InfoCard
                title="Activity"
                value={vitals.steps}
                unit="Steps"
                icon="chart-line-variant"
                iconType="MCI"
                bgColor="#26A69A"
                onPress={() =>
                  navigation.navigate("Details", {
                    title: "Activity",
                    value: vitals.steps,
                    unit: "Steps",
                    color: "#26A69A",
                  })
                }
              />
            </View>
          </View>

          {/* Alerts الحية */}
          <Text style={[styles.alertTitle, { color: alertColor }]}>
            {t.alerts}
          </Text>
          <View
            style={[
              styles.alertBox,
              { backgroundColor: colors.card, borderColor: alertColor },
            ]}
          >
            <Text style={[styles.alertText, { color: colors.textSub }]}>
              {alertMessage}
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// Card Component
const InfoCard = ({ title, value, unit, icon, iconType, bgColor, onPress }) => (
  <TouchableOpacity
    style={[styles.card, { backgroundColor: bgColor }]}
    onPress={onPress}
    activeOpacity={0.9}
    delayPressIn={50}
  >
    <View style={styles.bgIcon} pointerEvents="none">
      {iconType === "MCI" ? (
        <MaterialCommunityIcons
          name={icon}
          size={90}
          color="rgba(255,255,255,0.2)"
        />
      ) : iconType === "Ionicons" ? (
        <Ionicons name={icon} size={90} color="rgba(255,255,255,0.2)" />
      ) : (
        <FontAwesome5 name={icon} size={80} color="rgba(255,255,255,0.2)" />
      )}
    </View>

    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle}>{title}</Text>
      {iconType === "MCI" ? (
        <MaterialCommunityIcons name={icon} size={24} color="white" />
      ) : iconType === "Ionicons" ? (
        <Ionicons name={icon} size={24} color="white" />
      ) : (
        <FontAwesome5 name={icon} size={20} color="white" />
      )}
    </View>
    <View style={styles.cardBody}>
      <View style={{ flexDirection: "row", alignItems: "baseline" }}>
        <AnimatedNumber value={value} />
        <Text style={styles.cardUnit}> {unit}</Text>
      </View>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: "#2ab7ca" },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 50 },

  // === Header ===
  headerWrapper: {
    backgroundColor: "#2ab7ca",
    paddingTop: 50,
    paddingBottom: 20,
    position: "relative",
  },
  headerContent: {
    paddingHorizontal: 25,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  textSection: { marginTop: 10 },
  greetingText: { color: "white", fontSize: 22, fontWeight: "bold" },
  subGreetingText: { color: "#E0F2F1", fontSize: 13, marginTop: 5, width: 200 },

  chatIconBadge: {
    marginTop: 15,
    position: "relative",
    alignSelf: "flex-start",
    padding: 5,
  },
  redBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    borderRadius: 8,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#2ab7ca",
  },
  badgeText: { color: "white", fontSize: 9, fontWeight: "bold" },

  profileContainer: { position: "relative", marginTop: 5 },
  profileImageWrapper: {
    width: 70,
    height: 70,
    backgroundColor: "white",
    borderRadius: 35,
    justifyContent: "center",
    alignItems: "center",
    elevation: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  onlineStatusDot: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 18,
    height: 18,
    backgroundColor: "#4CAF50",
    borderRadius: 9,
    borderWidth: 3,
    borderColor: "#2ab7ca",
  },

  curveWrapper: { position: "absolute", bottom: -1, width: width, zIndex: 1 },

  // === Body ===
  bodyContainer: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
    minHeight: 600,
  },
  dnaWrapper: {
    position: "absolute",
    right: -80,
    top: 0,
    opacity: 0.5,
    transform: [{ rotate: "-30deg" }],
  },

  // === Bluetooth Button ===
  connectCard: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    padding: 15,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    elevation: 4,
    shadowColor: "#007AFF",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  connectContent: { flexDirection: "row", alignItems: "center" },
  connectIconBg: {
    backgroundColor: "rgba(255,255,255,0.2)",
    width: 45,
    height: 45,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  connectTexts: { justifyContent: "center" },
  connectTitle: { color: "white", fontSize: 16, fontWeight: "bold" },
  connectSubtitle: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 12,
    marginTop: 2,
  },

  // === Grid ===
  staggeredGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  column: { width: "48%" },
  rightColumn: { marginTop: 40 },

  // === Cards ===
  card: {
    height: 150,
    borderRadius: 25,
    padding: 20,
    marginBottom: 15,
    justifyContent: "space-between",
    overflow: "hidden",
    elevation: 3,
  },
  bgIcon: { position: "absolute", right: -15, top: 10 },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  cardTitle: { color: "white", fontSize: 15, fontWeight: "500", width: "70%" },
  cardBody: { justifyContent: "flex-end" },
  cardValue: { color: "white", fontSize: 36, fontWeight: "bold" },
  cardUnit: { color: "white", fontSize: 14, opacity: 0.9 },

  // === Alerts ===
  alertTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
    marginLeft: 5,
  },
  alertBox: {
    padding: 15,
    borderRadius: 20,
    borderWidth: 1,
    minHeight: 60,
    justifyContent: "center",
    marginBottom: 20,
  },
  alertText: { fontSize: 14, fontWeight: "500" },
});

export default HomeScreen;

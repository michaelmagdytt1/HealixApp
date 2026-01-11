import { Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import Svg, { Circle, Defs, LinearGradient, Path, Rect, Stop } from 'react-native-svg';

import { useTheme } from '../context/ThemeContext';

const { width, height } = Dimensions.get('window');

// === البيانات ===
const allHealthData = {
  'Heart Rate': {
    unit: 'BPM', maxValue: 200,
    Day: { labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm"], data: [65, 75, 78, 68, 72, 70], value: "72" },
    Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], data: [70, 72, 75, 71, 74, 73], value: "74" },
    Month: { labels: ["W1", "W2", "W3", "W4"], data: [72, 74, 71, 73], value: "73" }
  },
  'Temperature': {
    unit: '°C', maxValue: 50,
    Day: { labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm"], data: [36.5, 36.6, 36.7, 36.6, 36.5, 36.4], value: "36.6" },
    Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], data: [36.5, 36.6, 36.4, 36.7, 36.5, 36.6], value: "36.5" },
    Month: { labels: ["W1", "W2", "W3", "W4"], data: [36.5, 36.6, 36.5, 36.7], value: "36.6" }
  },
  'SPO2': {
    unit: '%', maxValue: 100,
    Day: { labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm"], data: [98, 97, 99, 98, 98, 99], value: "98" },
    Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], data: [98, 97, 98, 99, 98, 97], value: "98" },
    Month: { labels: ["W1", "W2", "W3", "W4"], data: [98, 97, 98, 99], value: "99" }
  },
  'Activity': {
    unit: 'Steps', maxValue: 10000,
    Day: { labels: ["10am", "12pm", "2pm", "4pm", "6pm", "8pm"], data: [500, 1200, 3000, 1500, 800, 200], value: "5,200" },
    Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri"], data: [4000, 5200, 3000, 6000, 4500, 5000], value: "5,450" },
    Month: { labels: ["W1", "W2", "W3", "W4"], data: [35000, 42000, 38000, 40000], value: "5,300" }
  }
};

const DetailsScreen = ({ route, navigation }) => {

  const { isDark } = useTheme();
  
  const { title, value: initialValue, unit } = route.params || { title: 'Heart Rate', value: '72', unit: 'BPM' };
  
  const mainColor = '#009688'; 
  const secondaryColor = '#4DB6AC'; 
  
  const textColor = isDark ? '#FFFFFF' : '#004D40';
  const subTextColor = isDark ? '#CCCCCC' : '#555';

  const [filter, setFilter] = useState('Day');

  const metricInfo = allHealthData[title];
  const dataset = useMemo(() => {
     return metricInfo ? metricInfo[filter] : { labels: [], data: [0], value: initialValue };
  }, [metricInfo, filter, initialValue]);

  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const numericValue = parseFloat(dataset.value.replace(/,/g, '').replace('%', ''));
  const percentage = Math.min((numericValue / (metricInfo ? metricInfo.maxValue : 100)) * 100, 100); 
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <View style={styles.container}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} backgroundColor="transparent" translucent />
      
      
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
            <Defs>
                <LinearGradient id="pageGrad" x1="0" y1="0" x2="1" y2="1">
                    
                    <Stop offset="0" stopColor={isDark ? "#00251a" : "#E0F2F1"} stopOpacity="1" />
                    <Stop offset="0.5" stopColor={isDark ? "#001510" : "#F0FDFC"} stopOpacity="1" />
                    <Stop offset="1" stopColor={isDark ? "#000000" : "#FFFFFF"} stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#pageGrad)" />
            
            {/* دوائر الخلفية */}
            <Circle cx="0" cy="0" r="150" fill={secondaryColor} opacity={isDark ? 0.1 : 0.05} />
            <Circle cx={width} cy={height * 0.6} r="200" fill={mainColor} opacity={isDark ? 0.05 : 0.03} />
        </Svg>
      </View>

      {/* Top Waves */}
      <View style={styles.topDecoration} pointerEvents="none">
         <Svg height="220" width={width} viewBox={`0 0 ${width} 220`}>
            <Defs>
                <LinearGradient id="gradGreen" x1="0" y1="0" x2="1" y2="0">
                    <Stop offset="0" stopColor={secondaryColor} stopOpacity="0.4" />
                    <Stop offset="1" stopColor={mainColor} stopOpacity="0.6" />
                </LinearGradient>
            </Defs>
            <Path d={`M${width * 0.3},0 Q${width * 0.6},100 ${width},80 L${width},0 Z`} fill="#B2DFDB" opacity="0.5" />
            <Path d={`M${width * 0.5},0 Q${width * 0.8},120 ${width},60 L${width},0 Z`} fill={mainColor} opacity="0.8" />
            <Path d={`M${width * 0.2},0 C${width * 0.5},160 ${width * 0.8},40 ${width},110 L${width},0 Z`} fill="url(#gradGreen)" />
         </Svg>
      </View>

      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
         <Ionicons name="arrow-back" size={28} color={isDark ? 'white' : '#333'} />
      </TouchableOpacity>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        <Text style={[styles.title, { color: textColor }]}>{title}</Text>

        <View style={styles.filterContainer}>
            {['Day', 'Week', 'Month'].map((item) => (
                <TouchableOpacity 
                    key={item} 
                    style={[styles.filterBtn, { 
                        
                        backgroundColor: filter === item ? mainColor : 'transparent',
                        
                        borderWidth: filter === item ? 0 : 1,
                        borderColor: filter === item ? 'transparent' : (isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,150,136,0.3)')
                    }]}
                    onPress={() => setFilter(item)}
                >
                    <Text style={[styles.filterText, { color: filter === item ? 'white' : (isDark ? '#AAA' : mainColor) }]}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>

        <View style={styles.chartContainer}>
            <LineChart
                data={{
                    labels: dataset.labels,
                    datasets: [{ data: dataset.data }]
                }}
                width={width - 40} 
                height={220}
                fromZero={false}
                yAxisInterval={1}
                segments={5} 
                withInnerLines={false}
                withOuterLines={false}
                withVerticalLabels={true}
                withHorizontalLabels={true}
                chartConfig={{
                    backgroundColor: 'transparent',
                    backgroundGradientFromOpacity: 0, 
                    backgroundGradientToOpacity: 0,
                    decimalPlaces: 0,
                    color: (opacity = 1) => mainColor,
                    // لون الأرقام بيتغير مع الدارك مود
                    labelColor: (opacity = 1) => subTextColor,
                    propsForDots: { r: "4", strokeWidth: "2", stroke: isDark ? "#000" : "white" },
                    fillShadowGradientFrom: mainColor,
                    fillShadowGradientTo: mainColor,
                    fillShadowGradientOpacity: 0.2,
                    paddingRight: 30, 
                }}
                bezier
                style={{ borderRadius: 16 }}
            />
        </View>

        <View style={styles.bottomSection}>
            <View style={styles.circleContainer}>
                 
                 <View style={[styles.circleBgGlow, { backgroundColor: isDark ? '#1a1a1a' : 'white', shadowColor: mainColor }]} /> 
                 <Svg height="130" width="130" viewBox="0 0 100 100">
                     <Circle cx="50" cy="50" r={radius} stroke={isDark ? '#333' : "#E0F2F1"} strokeWidth="8" fill="none" />
                     <Circle 
                        cx="50" cy="50" r={radius} 
                        stroke={mainColor} 
                        strokeWidth="8" 
                        fill="none" 
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        rotation="-90"
                        origin="50, 50"
                     />
                 </Svg>
                 
                 <View style={styles.circleTextContainer}>
                     <Text style={[styles.circleValue, { color: textColor }]}>
                         {dataset.value}{title === 'SPO2' && !dataset.value.includes('%') ? '%' : ''}
                     </Text>
                     <Text style={[styles.circleUnit, { color: subTextColor }]}>
                         {title === 'SPO2' ? '' : unit}
                     </Text>
                 </View>
            </View>

            <View style={styles.doctorContainer}>
                 <Image 
                    
                    source={require('../../assets/images/doctor.png')} 
                    style={styles.illustrationDoctorImg}
                    resizeMode="contain"
                 />
            </View>
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 }, 
  topDecoration: { position: 'absolute', top: 0, right: 0, width: width, height: 220, zIndex: 1 },
  backButton: { marginTop: 50, marginLeft: 20, width: 40, height: 40, justifyContent: 'center', zIndex: 10 },
  content: { paddingHorizontal: 20, paddingBottom: 50 },
  title: { fontSize: 32, fontWeight: '800', marginTop: 10, marginBottom: 20, letterSpacing: 0.5 },
  
  filterContainer: { flexDirection: 'row', gap: 10, marginBottom: 30 },
  filterBtn: { paddingVertical: 12, paddingHorizontal: 25, borderRadius: 12 },
  filterText: { fontWeight: '700', fontSize: 14 },
  
  chartContainer: { alignItems: 'center', marginBottom: 20 },
  
  bottomSection: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      alignItems: 'flex-end', 
      marginTop: 20, 
      paddingHorizontal: 10 
  },
  
  circleBgGlow: {
      position: 'absolute',
      width: 100,
      height: 100,
      borderRadius: 50,
      elevation: 5, 
      shadowOpacity: 0.1,
      shadowRadius: 10,
  },
  circleContainer: { 
      position: 'relative', 
      width: 130, 
      height: 130, 
      justifyContent: 'center', 
      alignItems: 'center',
      marginBottom: 120 
  },
  circleTextContainer: { position: 'absolute', justifyContent: 'center', alignItems: 'center' },
  circleValue: { fontSize: 34, fontWeight: 'bold' },
  circleUnit: { fontSize: 14, fontWeight: '600', marginTop: -5 },
  
  doctorContainer: { 
      flex: 1, 
      alignItems: 'flex-end',
  },
  illustrationDoctorImg: { 
      width: 270, 
      height: 270, 
      marginBottom: -10,
      marginRight: -60
  }
});

export default DetailsScreen;
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import WavyHeader from '../components/WavyHeader';
import Colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const screenWidth = Dimensions.get('window').width;


const allMetricsData = {
  'Heart Rate': {
    icon: 'heartbeat',
    iconLib: 'FA5',
    baseColor: Colors.secondaryBlue,
    unit: 'BPM',
    data: {
      Day: { labels: ["6am", "10am", "2pm", "6pm", "10pm"], datasets: [68, 72, 75, 70, 65] },
      Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], datasets: [65, 75, 70, 85, 72, 80, 74] },
      Month: { labels: ["W1", "W2", "W3", "W4"], datasets: [72, 68, 75, 71] }
    }
  },
  'Temperature': {
    icon: 'thermometer-half',
    iconLib: 'FA5',
    baseColor: Colors.primaryTeal,
    unit: '°C',
    data: {
      Day: { labels: ["6am", "10am", "2pm", "6pm", "10pm"], datasets: [36.5, 36.7, 36.8, 36.6, 36.5] },
      Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], datasets: [36.4, 36.5, 36.6, 36.5, 36.7, 36.6, 36.5] },
      Month: { labels: ["W1", "W2", "W3", "W4"], datasets: [36.5, 36.6, 36.5, 36.7] }
    }
  },
  'SPO2': {
    icon: 'water',
    iconLib: 'Ionicons',
    baseColor: '#2980B9',
    unit: '%',
    data: {
      Day: { labels: ["6am", "10am", "2pm", "6pm", "10pm"], datasets: [98, 97, 99, 98, 99] },
      Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], datasets: [98, 97, 96, 99, 98, 97, 98] },
      Month: { labels: ["W1", "W2", "W3", "W4"], datasets: [97, 98, 99, 98] }
    }
  },
  'Activity': {
    icon: 'walk',
    iconLib: 'Ionicons',
    baseColor: '#E67E22',
    unit: 'Steps',
    data: {
      Day: { labels: ["6am", "10am", "2pm", "6pm", "10pm"], datasets: [500, 1200, 3000, 1500, 800] },
      Week: { labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], datasets: [4000, 5200, 3000, 6000, 4500, 5000, 2000] },
      Month: { labels: ["W1", "W2", "W3", "W4"], datasets: [35000, 42000, 38000, 40000] }
    }
  }
};

const HistoryScreen = () => {
  const { colors, isDark } = useTheme(); 
  const [selectedMetric, setSelectedMetric] = useState('Heart Rate');
  const [filter, setFilter] = useState('Week');

  const currentMetricData = allMetricsData[selectedMetric];
  const currentChartData = currentMetricData.data[filter];

  const stats = useMemo(() => {
    const data = currentChartData.datasets;
    const max = Math.max(...data);
    const min = Math.min(...data);
    const sum = data.reduce((a, b) => a + b, 0);
    const avg = (sum / data.length).toFixed(selectedMetric === 'Activity' ? 0 : 1);

    return { max, min, avg };
  }, [currentChartData, selectedMetric]); 

  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <WavyHeader>
          <View style={styles.headerCenter}>
             <Text style={styles.headerTitle}>Health History</Text>
             <Text style={styles.headerSubTitle}>Track your vital trends</Text>
          </View>
      </WavyHeader>
    
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        
        {/* 1. Metric Selector */}
        <View style={styles.metricSelector}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Object.keys(allMetricsData).map((metric) => {
              const item = allMetricsData[metric];
              const isActive = selectedMetric === metric;
              return (
                <TouchableOpacity 
                  key={metric} 
                  style={[
                    styles.metricBtn, 
                    { 
                        backgroundColor: isActive ? item.baseColor : colors.card,
                        borderColor: isDark ? '#333' : '#EEE' 
                    }
                  ]}
                  onPress={() => setSelectedMetric(metric)}
                >
                  {item.iconLib === 'FA5' ? 
                    <FontAwesome5 name={item.icon} size={16} color={isActive ? 'white' : colors.textSub} style={{marginRight: 8}}/> :
                    <Ionicons name={item.icon} size={18} color={isActive ? 'white' : colors.textSub} style={{marginRight: 8}}/>
                  }
                  <Text style={[styles.metricBtnText, { color: isActive ? 'white' : colors.textSub }]}>{metric}</Text>
                </TouchableOpacity>
              )
            })}
          </ScrollView>
        </View>

        {/* 2. Filter */}
        <View style={[styles.filterContainer, { backgroundColor: colors.card }]}>
            {['Day', 'Week', 'Month'].map((item) => (
                <TouchableOpacity 
                    key={item} 
                    style={[styles.filterBtn, filter === item && { backgroundColor: currentMetricData.baseColor }]}
                    onPress={() => setFilter(item)}
                >
                    <Text style={[styles.filterText, { color: filter === item ? 'white' : colors.textSub }]}>{item}</Text>
                </TouchableOpacity>
            ))}
        </View>

        {/* 3. Chart */}
        <Text style={[styles.chartTitle, { color: colors.text }]}>{selectedMetric} ({currentMetricData.unit})</Text>
        <LineChart
            data={{
                labels: currentChartData.labels,
                datasets: [{ data: currentChartData.datasets }]
            }}
            width={screenWidth - 40}
            height={220}
            yAxisSuffix={selectedMetric === 'Temperature' ? '' : ''}
            chartConfig={{
                backgroundColor: colors.card,
                backgroundGradientFrom: colors.card,
                backgroundGradientTo: colors.card,
                decimalPlaces: selectedMetric === 'Activity' ? 0 : 1,
                color: (opacity = 1) => currentMetricData.baseColor,
                labelColor: (opacity = 1) => colors.textSub,
                style: { borderRadius: 16 },
                propsForDots: { r: "5", strokeWidth: "2", stroke: currentMetricData.baseColor },
                fillShadowGradientFrom: currentMetricData.baseColor,
                fillShadowGradientTo: currentMetricData.baseColor,
                fillShadowGradientOpacity: 0.2,
            }}
            bezier
            style={styles.chartStyle}
        />

        {/* 4. Stats */}
        <View style={[styles.summaryCard, { backgroundColor: colors.card }]}>
            <SummaryItem label="Max" value={stats.max} unit={currentMetricData.unit} icon="arrow-up-circle" color={currentMetricData.baseColor} textColor={colors.text} subColor={colors.textSub} />
            <View style={styles.divider}/>
            <SummaryItem label="Min" value={stats.min} unit={currentMetricData.unit} icon="arrow-down-circle" color={colors.textSub} textColor={colors.text} subColor={colors.textSub} />
            <View style={styles.divider}/>
            <SummaryItem label="Average" value={stats.avg} unit={currentMetricData.unit} icon="pulse" color={currentMetricData.baseColor} textColor={colors.text} subColor={colors.textSub} />
        </View>

        <View style={{height: 100}} />

      </ScrollView>
    </View>
  );
};

const SummaryItem = ({ label, value, unit, icon, color, textColor, subColor }) => (
    <View style={styles.summaryItem}>
        <Ionicons name={icon} size={28} color={color} style={{marginBottom: 5}} />
        <Text style={[styles.summaryValue, { color: textColor }]}>{value} <Text style={[styles.unitText, { color: subColor }]}>{unit}</Text></Text>
        <Text style={[styles.summaryLabel, { color: subColor }]}>{label}</Text>
    </View>
)

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headerCenter: { alignItems: 'center', marginTop: 10 },
  headerTitle: { color: Colors.white, fontSize: 24, fontWeight: 'bold' },
  headerSubTitle: { color: '#E0F2F1', fontSize: 14, marginTop: 5 },
  
  scrollContent: { padding: 20, marginTop: -20, paddingBottom: 50 }, 

  metricSelector: { marginBottom: 15, height: 50 },
  metricBtn: { 
    flexDirection: 'row', alignItems: 'center', 
    paddingHorizontal: 15, paddingVertical: 10, 
    borderRadius: 20, marginRight: 10,
    borderWidth: 1,
  },
  metricBtnText: { fontWeight: 'bold' },

  filterContainer: { 
      flexDirection: 'row', 
      borderRadius: 15, 
      padding: 5, 
      marginBottom: 20, 
      elevation: 2,
      justifyContent: 'space-between'
  },
  filterBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  filterText: { fontWeight: '600' },

  chartTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, marginLeft: 5 },
  chartStyle: { marginVertical: 8, borderRadius: 20, alignSelf: 'center' },

  summaryCard: { 
      flexDirection: 'row', 
      borderRadius: 20, 
      padding: 20, 
      marginTop: 20, 
      justifyContent: 'space-between', 
      elevation: 3,
  },
  summaryItem: { alignItems: 'center', flex: 1 },
  summaryValue: { fontSize: 20, fontWeight: 'bold' },
  unitText: { fontSize: 12, fontWeight: 'normal' },
  summaryLabel: { fontSize: 12, marginTop: 2 },
  divider: { width: 1, backgroundColor: '#EEE', height: '100%'}
});

export default HistoryScreen;
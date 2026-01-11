import { FontAwesome5, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const { colors, t, isDark } = useTheme();

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
                    <Text style={styles.greetingText}>Hi, User Name</Text>
                    <Text style={styles.subGreetingText}>{t.welcome}</Text>
                    
                    <TouchableOpacity 
                        style={styles.chatIconBadge}
                        onPress={() => navigation.navigate('Notifications')}
                        activeOpacity={0.7} 
                    >
                        <Ionicons name="chatbubble-ellipses" size={24} color="white" />
                        <View style={styles.redBadge}><Text style={styles.badgeText}>1</Text></View>
                    </TouchableOpacity>
                </View>

                {/* Doctor Profile */}
                <TouchableOpacity 
                    style={styles.profileContainer}
                    activeOpacity={0.8}
                >
                    <View style={styles.profileImageWrapper}>
                        <Image 
                            source={require('../../assets/images/doctor.png')} 
                            style={styles.newDoctorImage}
                        />
                    </View>
                    <View style={styles.onlineStatusDot} />
                </TouchableOpacity>

            </View>

        
            <View style={styles.curveWrapper} pointerEvents="none">
                <Svg height="50" width={width} viewBox={`0 0 ${width} 50`}>
                    <Path
                        d={`M0,50 L0,0 C${width*0.4},30 ${width*0.6},30 ${width},0 L${width},50 Z`}
                        fill={isDark ? colors.background : 'white'} 
                    />
                </Svg>
            </View>
        </View>

        {/* === Body Section === */}
        <View style={[styles.bodyContainer, { backgroundColor: isDark ? colors.background : 'white' }]}>
            
        
            <View style={styles.dnaWrapper} pointerEvents="none">
                 <MaterialCommunityIcons 
                    name="dna" 
                    size={300} 
                    color={isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)"} 
                 />
            </View>

            {/* Grid Cards */}
            <View style={styles.staggeredGrid}>
                {/* Left Column */}
                <View style={styles.column}>
                    <InfoCard 
                        title="Heart Rate" value="72" unit="BPM" 
                        icon="heart-pulse" iconType="MCI" bgColor="#29B6F6"
                        onPress={() => navigation.navigate('Details', { title: 'Heart Rate', value: '72', unit: 'BPM', color: '#29B6F6' })}
                    />
                    <InfoCard 
                        title="SPO2" value="98%" unit="" 
                        icon="water-outline" iconType="Ionicons" bgColor="#29B6F6"
                        onPress={() => navigation.navigate('Details', { title: 'SPO2', value: '98%', unit: '', color: '#29B6F6' })}
                    />
                </View>

                {/* Right Column */}
                <View style={[styles.column, styles.rightColumn]}>
                    <InfoCard 
                        title="Temperature" value="36.6" unit="°C" 
                        icon="thermometer" iconType="MCI" bgColor="#26A69A"
                        onPress={() => navigation.navigate('Details', { title: 'Temperature', value: '36.6', unit: '°C', color: '#26A69A' })}
                    />
                    <InfoCard 
                        title="Activity" value="5,200" unit="Steps" 
                        icon="chart-line-variant" iconType="MCI" bgColor="#26A69A"
                        onPress={() => navigation.navigate('Details', { title: 'Activity', value: '5,200', unit: 'Steps', color: '#26A69A' })}
                    />
                </View>
            </View>

            {/* Alerts */}
            <Text style={[styles.alertTitle, { color: '#C62828' }]}>{t.alerts}</Text>
            <View style={[styles.alertBox, { backgroundColor: colors.card, borderColor: '#29B6F6' }]}>
                <Text style={[styles.alertText, { color: colors.textSub }]}>Mild temperature fluctuation detected</Text>
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
            {iconType === 'MCI' ? <MaterialCommunityIcons name={icon} size={90} color="rgba(255,255,255,0.2)" /> :
             iconType === 'Ionicons' ? <Ionicons name={icon} size={90} color="rgba(255,255,255,0.2)" /> :
             <FontAwesome5 name={icon} size={80} color="rgba(255,255,255,0.2)" />}
        </View>
        
        <View style={styles.cardHeader}>
             <Text style={styles.cardTitle}>{title}</Text>
             {iconType === 'MCI' ? <MaterialCommunityIcons name={icon} size={24} color="white" /> :
              iconType === 'Ionicons' ? <Ionicons name={icon} size={24} color="white" /> :
              <FontAwesome5 name={icon} size={20} color="white" />}
        </View>
        <View style={styles.cardBody}>
            <Text style={styles.cardValue}>{value}</Text>
            <Text style={styles.cardUnit}>{unit}</Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#2ab7ca' },
  scrollView: { flex: 1 },
  scrollContent: { paddingBottom: 50 }, // مساحة سفلية عشان السكرول يوصل للآخر

  // === Header ===
  headerWrapper: { backgroundColor: '#2ab7ca', paddingTop: 50, paddingBottom: 20, position: 'relative' },
  headerContent: { paddingHorizontal: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 },
  textSection: { marginTop: 10 },
  greetingText: { color: 'white', fontSize: 22, fontWeight: 'bold' },
  subGreetingText: { color: '#E0F2F1', fontSize: 13, marginTop: 5, width: 200 },
  
  chatIconBadge: { marginTop: 15, position: 'relative', alignSelf: 'flex-start', padding: 5 },
  redBadge: { position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 8, width: 16, height: 16, justifyContent: 'center', alignItems: 'center', borderWidth: 1.5, borderColor: '#2ab7ca' },
  badgeText: { color: 'white', fontSize: 9, fontWeight: 'bold' },

  profileContainer: { position: 'relative', marginTop: 5 },
  profileImageWrapper: { width: 75, height: 75, backgroundColor: 'white', borderRadius: 22, padding: 3, elevation: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 5 },
  newDoctorImage: { width: '100%', height: '100%', borderRadius: 19, resizeMode: 'cover', backgroundColor: '#F0F0F0' },
  onlineStatusDot: { position: 'absolute', bottom: -2, right: -2, width: 18, height: 18, backgroundColor: '#4CAF50', borderRadius: 9, borderWidth: 3, borderColor: '#2ab7ca' },

  curveWrapper: { position: 'absolute', bottom: -1, width: width, zIndex: 1 },

  // === Body ===
  bodyContainer: { flex: 1, paddingHorizontal: 20, paddingTop: 10, minHeight: 600 },
  dnaWrapper: { position: 'absolute', right: -80, top: 0, opacity: 0.5, transform: [{rotate: '-30deg'}] },
  
  staggeredGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, marginTop: 10 },
  column: { width: '48%' },
  rightColumn: { marginTop: 40 },

  // === Cards ===
  card: { height: 150, borderRadius: 25, padding: 20, marginBottom: 15, justifyContent: 'space-between', overflow: 'hidden', elevation: 3 },
  bgIcon: { position: 'absolute', right: -15, top: 10 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { color: 'white', fontSize: 15, fontWeight: '500', width: '70%' },
  cardBody: { justifyContent: 'flex-end' },
  cardValue: { color: 'white', fontSize: 36, fontWeight: 'bold' },
  cardUnit: { color: 'white', fontSize: 14, marginTop: -5, opacity: 0.9 },

  // === Alerts ===
  alertTitle: { fontSize: 16, fontWeight: 'bold', marginBottom: 8, marginLeft: 5 },
  alertBox: { padding: 15, borderRadius: 20, borderWidth: 1, minHeight: 60, justifyContent: 'center', marginBottom: 20 },
  alertText: { fontSize: 14, fontWeight: '500' }
});

export default HomeScreen;
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Easing, StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, Defs, LinearGradient, Rect, Stop } from 'react-native-svg';

const { width, height } = Dimensions.get('window');


const ICONS = [
  { name: 'heart-pulse', label: 'Checking Heart Rate...' },
  { name: 'thermometer', label: 'Measuring Temperature...' },
  { name: 'run', label: 'Tracking Activity...' },
  { name: 'water-percent', label: 'Analyzing SPO2...' },
];

const CustomLoading = ({ onFinish }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  
  const pulseAnim = useRef(new Animated.Value(1)).current; 
  const fadeAnim = useRef(new Animated.Value(0)).current; 
  const mainOpacity = useRef(new Animated.Value(1)).current; 

  useEffect(() => {
    
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.2,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.ease),
        }),
      ])
    ).start();

    
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    
    const iconInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % ICONS.length);
    }, 1200);

    
    const finishTimer = setTimeout(() => {
      Animated.timing(mainOpacity, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }).start(() => {
        if (onFinish) onFinish();
      });
    }, 5000);

    return () => {
      clearInterval(iconInterval);
      clearTimeout(finishTimer);
    };
    
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); 

  const currentIcon = ICONS[currentIndex];

  return (
    <Animated.View style={[styles.container, { opacity: mainOpacity }]}>
      
      {/* الخلفية */}
      <View style={StyleSheet.absoluteFill}>
        <Svg height="100%" width="100%">
            <Defs>
                <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <Stop offset="0" stopColor="#E0F2F1" stopOpacity="1" />
                    <Stop offset="1" stopColor="#FFFFFF" stopOpacity="1" />
                </LinearGradient>
            </Defs>
            <Rect x="0" y="0" width="100%" height="100%" fill="url(#grad)" />
            <Circle cx={width} cy="0" r="150" fill="#4DB6AC" opacity="0.1" />
            <Circle cx="0" cy={height} r="150" fill="#009688" opacity="0.05" />
        </Svg>
      </View>

      <View style={styles.content}>
        
        {/* الأيقونة المتغيرة */}
        <Animated.View style={{ transform: [{ scale: pulseAnim }] }}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons 
                key={currentIcon.name} 
                name={currentIcon.name} 
                size={70} 
                color="white" 
            />
          </View>
        </Animated.View>

        {/* النصوص المتغيرة */}
        <Animated.View style={{ opacity: fadeAnim, marginTop: 30, alignItems: 'center' }}>
            <Text style={styles.appName}>Healix</Text>
            <Text style={styles.loadingText}>{currentIcon.label}</Text>
            
            <View style={styles.dotsContainer}>
                <View style={styles.dot} />
                <View style={[styles.dot, { opacity: 0.6 }]} />
                <View style={[styles.dot, { opacity: 0.3 }]} />
            </View>
        </Animated.View>

      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  content: { alignItems: 'center', justifyContent: 'center' },
  iconContainer: {
    width: 140, height: 140,
    backgroundColor: '#009688',
    borderRadius: 70,
    justifyContent: 'center', alignItems: 'center',
    elevation: 20, shadowColor: '#009688', shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4, shadowRadius: 20,
    borderWidth: 4, borderColor: 'rgba(255,255,255,0.3)'
  },
  appName: { fontSize: 32, fontWeight: 'bold', color: '#004D40', letterSpacing: 2, marginBottom: 5 },
  loadingText: { fontSize: 16, color: '#009688', fontWeight: '600', marginBottom: 20, minWidth: 200, textAlign: 'center' },
  dotsContainer: { flexDirection: 'row', gap: 8 },
  dot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#009688' }
});

export default CustomLoading;
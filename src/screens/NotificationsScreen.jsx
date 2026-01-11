import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const { width } = Dimensions.get('window');

const NotificationsScreen = ({ navigation }) => {
  const { colors, t, isNotificationsEnabled } = useTheme();

  // لو الإشعارات مقفولة
  if (!isNotificationsEnabled) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, justifyContent: 'center', alignItems: 'center', padding: 30 }]}>
         <Ionicons name="notifications-off-circle" size={100} color={colors.textSub} />
         <Text style={[styles.disabledTitle, { color: colors.text }]}>{t.notifOffTitle}</Text>
         <Text style={[styles.disabledMsg, { color: colors.textSub }]}>{t.notifOffMsg}</Text>
         
         <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={{color: 'white', fontWeight: 'bold'}}>Go to Settings</Text>
         </TouchableOpacity>
      </View>
    );
  }

  // لو مفتوحة
  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]}>
      
      {/* الهيدر */}
      <View style={styles.customHeader}>
         {/* Curve Background needs to match screen background */}
         <View style={[styles.headerCurve, { backgroundColor: colors.background }]} />
         <Image 
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/3774/3774299.png' }} 
            style={styles.doctorImage}
         />
         <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
             <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>
      </View>

      <View style={styles.contentContainer}>
          
          {/* Risk Card */}
          <View style={[styles.riskCard, { backgroundColor: colors.card }]}>
              <Text style={styles.riskHeaderTitle}>{t.riskTitle}</Text>
              <Text style={[styles.riskLevelText, { color: colors.text }]}>{t.riskLevel}</Text>
              <Text style={[styles.riskDescText, { color: colors.textSub }]}>{t.riskDesc}</Text>
          </View>

          {/* Factors */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>{t.factors}</Text>
          
          <View style={styles.factorsRow}>
              {/* Heart Rate */}
              <View style={[styles.factorCard, { backgroundColor: '#2D9CDB' }]}>
                  <FontAwesome5 name="heartbeat" size={24} color="white" />
                  <Text style={styles.factorLabel}>Heart Rate</Text>
                  <Text style={styles.factorStatus}>Stable</Text>
              </View>

              {/* Temperature */}
              <View style={[styles.factorCard, { backgroundColor: '#1A998E' }]}>
                  <FontAwesome5 name="thermometer-half" size={24} color="white" />
                  <Text style={styles.factorLabel}>Temperature</Text>
                  <Text style={styles.factorStatus}>Normal</Text>
              </View>

              {/* SPO2 */}
              <View style={[styles.factorCard, { backgroundColor: '#2D9CDB' }]}>
                  <Ionicons name="water-outline" size={24} color="white" />
                  <Text style={styles.factorLabel}>SPO2</Text>
                  <Text style={styles.factorStatus}>Consistent</Text>
              </View>
          </View>

      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  customHeader: {
      height: 280,
      backgroundColor: Colors.secondaryBlue,
      alignItems: 'center',
      justifyContent: 'flex-end',
      position: 'relative'
  },
  headerCurve: {
      position: 'absolute',
      bottom: -1, 
      width: width,
      height: 60,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 0,
      zIndex: 1
  },
  doctorImage: {
      width: 160,
      height: 160,
      zIndex: 2, 
      bottom: 0
  },
  backBtn: { position: 'absolute', top: 50, left: 20 },
  contentContainer: { padding: 20, paddingTop: 10 },
  riskCard: {
      padding: 25,
      borderRadius: 20,
      elevation: 5,
      shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width:0, height:4},
      marginBottom: 30,
      alignItems: 'flex-start'
  },
  riskHeaderTitle: { fontSize: 18, color: Colors.secondaryBlue, fontWeight: 'bold', marginBottom: 5 },
  riskLevelText: { fontSize: 32, fontWeight: 'bold', marginBottom: 5 },
  riskDescText: { fontSize: 14 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, textAlign: 'center' },
  factorsRow: { flexDirection: 'row', justifyContent: 'space-between' },
  factorCard: {
      width: '30%',
      height: 110,
      borderRadius: 15,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 5
  },
  factorLabel: { color: 'white', fontSize: 12, marginTop: 5 },
  factorStatus: { color: 'white', fontSize: 14, fontWeight: 'bold' },
  disabledTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 20 },
  disabledMsg: { fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 30 },
  settingsBtn: { backgroundColor: Colors.primaryTeal, paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 }
});

export default NotificationsScreen;
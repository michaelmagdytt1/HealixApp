import { Alert, ScrollView, StyleSheet, Switch, Text, TouchableOpacity, View } from 'react-native';
import WavyHeader from '../components/WavyHeader';
import Colors from '../constants/colors';
import { useTheme } from '../context/ThemeContext';

const SettingsScreen = () => {
  
  const { isDark, toggleTheme, language, changeLanguage, colors, t, isNotificationsEnabled, toggleNotifications } = useTheme();
  
  return (
    <View style={[styles.mainContainer, { backgroundColor: colors.background }]}>
      <WavyHeader>
          <View style={styles.headerCenter}>
             <Text style={styles.headerTitle}>{t.settings}</Text>
          </View>
      </WavyHeader>
      
      <ScrollView contentContainerStyle={styles.contentContainer}>
    
        
        {/* === General Section === */}
        <Text style={styles.sectionTitle}>{t.general}</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <Text style={[styles.label, { color: colors.text }]}>{t.language}</Text>
            <TouchableOpacity onPress={changeLanguage} style={styles.inputField}>
                <Text style={[styles.inputText, { color: colors.textSub }]}>{language === 'English' ? 'English' : 'العربية'}</Text>
            </TouchableOpacity>
            <View style={styles.divider} />
            <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>{t.theme}</Text>
                <TouchableOpacity style={styles.themeToggleContainer} onPress={toggleTheme}>
                    <View style={[styles.themeBtn, !isDark && styles.activeThemeBtn]}>
                        <Text style={[styles.themeText, !isDark && styles.activeThemeText]}>Light</Text>
                    </View>
                    <View style={[styles.themeBtn, isDark && styles.activeThemeBtn]}>
                        <Text style={[styles.themeText, isDark && styles.activeThemeText]}>Dark</Text>
                    </View>
                </TouchableOpacity>
            </View>
        </View>

    
        <Text style={styles.sectionTitle}>{t.notifications}</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
            <View style={styles.row}>
                <Text style={[styles.label, { color: colors.text }]}>{t.notifications}</Text>
                <Switch
                    trackColor={{ false: "#767577", true: Colors.primaryTeal }}
                    thumbColor={isNotificationsEnabled ? "#fff" : "#f4f3f4"}
                    onValueChange={toggleNotifications} 
                    value={isNotificationsEnabled}     
                />
            </View>
        </View>

    
        <Text style={styles.sectionTitle}>{t.account}</Text>
        <View style={[styles.card, { backgroundColor: colors.card }]}>
             <TouchableOpacity style={styles.row} onPress={() => Alert.alert(t.logout, "Are you sure?")}>
                <Text style={styles.logoutText}>{t.logout}</Text>
            </TouchableOpacity>
        </View>
        <View style={{height: 100}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1 },
  headerCenter: { alignItems: 'center', marginTop: 10 },
  headerTitle: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  contentContainer: { padding: 20 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: Colors.secondaryBlue, marginTop: 20, marginBottom: 10, marginLeft: 5 },
  card: { borderRadius: 20, padding: 20, elevation: 4, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: {width:0, height:4} },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 5 },
  inputField: { borderBottomWidth: 1, borderBottomColor: Colors.primaryTeal, paddingVertical: 5, marginBottom: 15 },
  inputText: { fontSize: 14 },
  divider: { height: 1, backgroundColor: '#EEE', marginVertical: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 5 },
  themeToggleContainer: { flexDirection: 'row', backgroundColor: '#E0F2F1', borderRadius: 20, padding: 2, width: 120, height: 35 },
  themeBtn: { flex: 1, justifyContent: 'center', alignItems: 'center', borderRadius: 18 },
  activeThemeBtn: { backgroundColor: Colors.primaryTeal },
  themeText: { fontSize: 12, color: '#7B7B7B' },
  activeThemeText: { color: 'white', fontWeight: 'bold' },
  logoutText: { fontSize: 16, fontWeight: 'bold', color: '#E74C3C' }
});

export default SettingsScreen;
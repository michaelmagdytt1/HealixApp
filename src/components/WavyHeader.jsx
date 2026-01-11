import { Dimensions, StyleSheet, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import Colors from '../constants/colors';

const { width } = Dimensions.get('window');
const headerHeight = 220; 

const WavyHeader = ({ children }) => {
  return (
    <View style={styles.container}>
      <View style={styles.svgContainer}>
        <Svg
          height={headerHeight}
          width={width}
          viewBox={`0 0 ${width} ${headerHeight}`}
          style={styles.svg}
        >
          <Defs>
            <LinearGradient id="grad" x1="0" y1="0" x2="1" y2="0">
              <Stop offset="0" stopColor={Colors.secondaryBlue} stopOpacity="1" />
              <Stop offset="1" stopColor={Colors.primaryTeal} stopOpacity="1" />
            </LinearGradient>
          </Defs>
          <Path
            d={`M0,0 L${width},0 L${width},${headerHeight - 50} Q${width * 0.75},${headerHeight} ${width * 0.5},${headerHeight - 30} T0,${headerHeight - 50} Z`}
            fill="url(#grad)"
          />
        </Svg>
      </View>
      <View style={styles.contentContainer}>
        {children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: headerHeight,
    backgroundColor: 'transparent', 
  },
  svgContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    
  },
  contentContainer: {
    flex: 1,
    paddingTop: 50, 
    paddingHorizontal: 20,
  }
});

export default WavyHeader;
import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

interface LayoutMapToggleProps {
  mapType: 'standard' | 'satellite';
  setMapType: React.Dispatch<React.SetStateAction<'standard' | 'satellite'>>;
}

const LayoutMapToggle: React.FC<LayoutMapToggleProps> = ({ mapType, setMapType }) => {
  const toggleMapType = () => {
    setMapType(mapType === 'standard' ? 'satellite' : 'standard');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.toggleButtonContainer} onPress={toggleMapType}>
        <Icon name="map-outline" size={Dimensions.get('window').width * 0.05} color="black" style={styles.icon} />
        <Text style={styles.buttonText}>{mapType === 'standard' ? 'Satellite' : 'Standard'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '7%', // Adjust as needed
    left: '3%', // Adjust as needed
  },
  toggleButtonContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.5)',
    borderRadius: Dimensions.get('window').width * 0.03, // Adjust as needed
    paddingVertical: Dimensions.get('window').height * 0.01, // Adjust as needed
    paddingHorizontal: Dimensions.get('window').width * 0.03, // Adjust as needed
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginRight: Dimensions.get('window').width * 0.02, // Adjust as needed
  },
  buttonText: {
    fontSize: Dimensions.get('window').width * 0.035, // Adjust as needed
    fontWeight: 'bold',
    color: 'black',
  },
});

export default LayoutMapToggle;

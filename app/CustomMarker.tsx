// CustomMarker.js
import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

const CustomMarker = ({ coordinate, image }) => {
  return (
    <View style={styles.container}>
      <Image source={image} style={styles.image} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  image: {
    width: 1, // Adjust the width of the marker image as needed
    height: 1, // Adjust the height of the marker image as needed
    resizeMode: 'contain', // Make sure the image fits within the marker
    marginBottom: 12, // Adjust the bottom margin to position the image correctly
  },
});

export default CustomMarker;

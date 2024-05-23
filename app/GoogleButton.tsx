import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import Animated, { Easing, useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

interface GoogleButtonProps {
  onPress: () => void;
}

const GoogleButton: React.FC<GoogleButtonProps> = ({ onPress }) => {
  const scale = useSharedValue(1);
  const borderWidth = useSharedValue(1);
  const backgroundColor = useSharedValue('white');
  const borderColor = useSharedValue('#357ae8');

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderWidth: borderWidth.value,
    backgroundColor: backgroundColor.value,
    borderColor: borderColor.value,
    borderRadius: 50, // Make the border rounded
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    borderWidth.value = withTiming(3, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    backgroundColor.value = withTiming('#fff', {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    borderColor.value = withTiming('#357ae8', {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    borderWidth.value = withTiming(1, {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    backgroundColor.value = withTiming('#4287f5', {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    borderColor.value = withTiming('#357ae8', {
      duration: 100,
      easing: Easing.out(Easing.quad),
    });
    onPress();
  };

  const { width, height } = Dimensions.get('window');

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      onPress={onPress}
    >
      <Animated.View style={[styles.buttonContainer, animatedStyle]}>
        <Image
          source={require('../assets/picture/google_maps-logo_brandlogos.net_u3ev8.png')} // Ensure the path is correct
          style={[styles.logo, { width: width * 0.11, height: height * 0.05 }]}
        />
      </Animated.View>
    </TouchableOpacity>
  );
};

export default GoogleButton;

const styles = StyleSheet.create({
  buttonContainer: {
    margin: Dimensions.get('window').width * 0.01, // Margin set to 1% of screen width
    alignItems: 'center',
    justifyContent: 'center',
    padding: Dimensions.get('window').width * 0.02, // Padding set to 2% of screen width
    borderRadius: 50, // Make the border rounded
  },
  logo: {
    resizeMode: 'contain',
  },
});

// GoogleButton.tsx
import React from 'react';
import { TouchableOpacity, Image, StyleSheet } from 'react-native';
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
    borderRadius: 100, // Make it a perfect circle by setting borderRadius to half of the width/height
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

  return (
    <Animated.View style={[styles.buttonContainer, animatedStyle]}>
      <TouchableOpacity
        style={styles.touchable}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
      >
        <Image
          source={require('../assets/picture/google_maps-logo_brandlogos.net_u3ev8.png')} // Ensure the path is correct
          style={styles.logo}
        />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 20,
    overflow: 'hidden', // Ensure the content stays within the bounds of the circle
  },
  touchable: {
    padding: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    width: 100, // Adjust the size as needed
    height: 30, // Adjust the size as needed
    resizeMode: 'contain',
  },
});

export default GoogleButton;

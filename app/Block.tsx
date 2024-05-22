import React from "react";
import { TouchableOpacity, Text, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  Easing,
  useSharedValue,
  withTiming,
  useAnimatedStyle,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { GestureHandlerRootView } from "react-native-gesture-handler";

type IconName = keyof typeof Ionicons.glyphMap;

interface BlockProps {
  icon: IconName;
  text: string;
  isSelected: boolean;
  onPress: () => void;
}

const Block: React.FC<BlockProps> = ({ icon, text, isSelected, onPress }) => {
  const scale = useSharedValue(1);
  const borderColor = useSharedValue(isSelected ? "#4CAF50" : "transparent");
  const shadowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: borderColor.value,
    shadowOpacity: shadowOpacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withTiming(0.95, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    });
    shadowOpacity.value = withTiming(0.3, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    });
  };

  const handlePressOut = () => {
    scale.value = withTiming(1, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    });
    shadowOpacity.value = withTiming(0, {
      duration: 100,
      easing: Easing.inOut(Easing.ease),
    });
    onPress();
  };

  return (
    <GestureHandlerRootView>
      <TouchableOpacity
        style={styles.block}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={onPress}
      >
        <Animated.View style={[styles.content, animatedStyle]}>
          <LinearGradient
            colors={isSelected ? ["#4CAF50", "#4CAF50"] : ["#fff", "#fff"]}
            style={[styles.gradient]}
          >
            <Ionicons name={icon} size={28} color={isSelected ? "#fff" : "#000"} />
          </LinearGradient>
          {isSelected && (
            <View style={styles.textContainer}>
              <Text numberOfLines={1} ellipsizeMode="tail" style={styles.blockText}>
                {text}
              </Text>
            </View>
          )}
          {isSelected && <View style={styles.indicator} />}
        </Animated.View>
      </TouchableOpacity>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  block: {
    padding: 12,
    borderRadius: 12,
    marginHorizontal: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0,
    shadowRadius: 4,
    elevation: 3,
  },
  content: {
    alignItems: "center",
  },
  gradient: {
    borderRadius: 12,
    padding: 10,
  },
  textContainer: {
    alignItems: "center",
    position: "absolute",
    bottom: -24, // Adjust this value as needed to position the text
    left: 0,
    right: 0,
  },
  blockText: {
    fontSize: 8.5,
    color: "#000",
    textAlign: "center",
    fontWeight: "bold", // Adding bold font weight
  },

  selectedBlockText: {
    color: "#fff",
    fontWeight: "bold",
  },
  indicator: {
    position: "absolute",
    bottom: -8,
    height: 4,
    width: "100%",
    backgroundColor: "#4CAF50",
    borderRadius: 2,
  },
});

export default Block;
export type { IconName };

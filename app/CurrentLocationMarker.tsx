import React, { useRef, useEffect } from "react";
import { View, Animated, StyleSheet } from "react-native";
import { Marker, AnimatedRegion } from "react-native-maps";
import { MaterialCommunityIcons } from '@expo/vector-icons';

interface Props {
  coordinate: {
    latitude: number;
    longitude: number;
  };
  size?: number;
  markerColor?: string;
  pulseColor?: string;
}

const CurrentLocationMarker: React.FC<Props> = ({ coordinate, size = 30, markerColor = "red", pulseColor = "red" }) => {
  const scaleValue = useRef(new Animated.Value(1)).current;
  const mapZoom = useRef(new AnimatedRegion({
    latitude: coordinate.latitude,
    longitude: coordinate.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  })).current;

  useEffect(() => {
    const pulseAnimation = Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 1.2,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]);

    Animated.loop(pulseAnimation).start();
  }, []);

  useEffect(() => {
    mapZoom.addListener((region) => {
      // Calculate appropriate marker size based on zoom level
      const zoomFactor = Math.min(region.longitudeDelta, region.latitudeDelta);
      const scaledSize = size / zoomFactor;

      // Update the marker size
      scaleValue.setValue(scaledSize);
    });

    return () => {
      mapZoom.removeAllListeners();
    };
  }, []);

  return (
    <Marker coordinate={coordinate}>
      <Animated.View style={[styles.container, { transform: [{ scale: scaleValue }] }]}>
        <MaterialCommunityIcons name="map-marker-radius" size={size} color={markerColor} />
        <View style={[styles.pulse, { backgroundColor: pulseColor, width: size * 0.75, height: size * 0.75, borderRadius: size * 0.375 }]} />
      </Animated.View>
    </Marker>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  pulse: {
    position: "absolute",
    borderWidth: 2,
    borderColor: "white",
  },
});

export default CurrentLocationMarker;

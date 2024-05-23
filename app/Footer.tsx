import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, Animated, TouchableOpacity, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import MapView, { Region } from "react-native-maps";

interface Location {
    latitude: number;
    longitude: number;
}

interface FooterProps {
    setShowFilterForm: React.Dispatch<React.SetStateAction<boolean>>;
    mapRef: React.RefObject<MapView>;
    userLocation: Location | null;
}

const Footer: React.FC<FooterProps> = ({
    setShowFilterForm,
    mapRef,
    userLocation,
}) => {
    const [animation] = useState(new Animated.Value(0));

    const handleButtonPress = (action: string) => {
        if (action === "filter") {
            setShowFilterForm(true);
        } else if (action === "location") {
            if (mapRef.current && userLocation) {
                mapRef.current.animateToRegion(
                    {
                        latitude: userLocation.latitude,
                        longitude: userLocation.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    },
                    1000
                );
            }
        } else {
            console.log("Filter 2");
        }
    };

    const handleButtonAnimation = (toValue: number) => {
        Animated.timing(animation, {
            toValue,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    return (
        <View style={styles.footer}>
            <TouchableOpacity
                onPressIn={() => handleButtonAnimation(1)}
                onPressOut={() => handleButtonAnimation(0)}
                onPress={() => handleButtonPress("filter")}
                style={[styles.footerButton, { opacity: animation, backgroundColor: "#E5E5E5" }]}
            >
                <Ionicons name="options-outline" size={Dimensions.get('window').width * 0.06} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                onPressIn={() => handleButtonAnimation(1)}
                onPressOut={() => handleButtonAnimation(0)}
                onPress={() => handleButtonPress("location")}
                style={[styles.footerButton, { opacity: animation, backgroundColor: "#E5E5E5" }]}
            >
                <Ionicons name="locate-outline" size={Dimensions.get('window').width * 0.06} color="black" />
            </TouchableOpacity>
            <TouchableOpacity
                onPressIn={() => handleButtonAnimation(1)}
                onPressOut={() => handleButtonAnimation(0)}
                onPress={() => handleButtonPress("filter2")}
                style={[styles.footerButton, { opacity: animation, backgroundColor: "#E5E5E5" }]}
            >
                <Ionicons name="options-outline" size={Dimensions.get('window').width * 0.06} color="black" />
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    footer: {
        flexDirection: "row",
        justifyContent: "space-around",
        alignItems: "center",
        paddingHorizontal: Dimensions.get('window').width * 0.03,
        paddingVertical: Dimensions.get('window').height * 0.02,
        backgroundColor: "rgba(255, 255, 255, 0.5)",
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
    },
    footerButton: {
        alignItems: "center",
        justifyContent: "center",
        width: Dimensions.get('window').width * 0.12,
        height: Dimensions.get('window').width * 0.12,
        borderRadius: Dimensions.get('window').width * 0.06,
    },
});

export default Footer;

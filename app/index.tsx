import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  View,
  Button,
  Animated,
  Modal,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import { SafeAreaView } from "react-native-safe-area-context";
import markersData from "./markers.json";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import FilterForm from "./FilterForm";

interface UserLocation {
  latitude: number;
  longitude: number;
}

const App = () => {
  const [markers, setMarkers] = useState<
    Array<{
      id: number;
      coordinate: { latitude: number; longitude: number };
      title: string;
      description: string;
      product: string[];
      other_product: string[];
      service: string[];
      province: string;
      address: string;
      status: string;
      promotion: string[];
      picture?: string;
    }>
  >([]);
  const [region, setRegion] = useState<Region>({
    latitude: 11.570444444444444, // Default latitude
    longitude: 104.90508333333334, // Default longitude
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<number>(0);
  const mapRef = useRef<MapView>(null);
  const pointerPosition = useRef(new Animated.Value(0)).current;
  const [showFilterForm, setShowFilterForm] = useState(false);

  useEffect(() => {
    // Set markers from the JSON data
    setMarkers(
      markersData.STATION.map((station) => ({
        id: station.id,
        coordinate: {
          latitude: station.latitude,
          longitude: station.longitude,
        },
        title: station.title,
        description: station.description.join(", "), // Join array of strings into a single string
        product: station.product,
        other_product: station.other_product,
        service: station.service,
        province: station.province,
        address: station.address,
        status: station.status,
        promotion: station.promotion,
        picture: station.picture,
      }))
    );

  },
  
  
  []);

  useEffect(() => {
    // Start watching user's location
    const startWatchingLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission to access location was denied");
        return;
      }

      await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update location every 5 seconds
          distanceInterval: 0, // Update location regardless of distance
        },
        handleUserLocationChange
      );
    };

    startWatchingLocation();
  }, []);

  const handleUserLocationChange = (location: {
    coords: { latitude: any; longitude: any };
  }) => {
    setUserLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    });
    // Animate pointer
    Animated.timing(pointerPosition, {
      toValue: 1,
      duration: 1000,
      useNativeDriver: false,
    }).start();
  };

  const findMyLocation = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== "granted") {
      console.error("Permission to access location was denied");
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    const newRegion = {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    };

    mapRef.current?.animateToRegion(newRegion, 500); // Adjust the duration as needed (500 milliseconds in this example)
    setRegion(newRegion); // Update the region state immediately
  };

  const handleMarkerPress = (marker: any) => {
    setRegion({
      latitude: marker.coordinate.latitude,
      longitude: marker.coordinate.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    });
    setSelectedMarker(marker);
    setModalVisible(true); // Show the modal when marker is pressed
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const renderBlockContent = () => {
    if (!selectedMarker) return null;

    switch (selectedBlock) {
      case 0:
        return (
          <Text style={styles.modalDescription}>
            Description: {selectedMarker.description}
          </Text>
        );
      case 1:
        return (
          <Text style={styles.modalDescription}>
            Product: {selectedMarker.product.join(", ")}
          </Text>
        );
      case 2:
        return (
          <Text style={styles.modalDescription}>
            Other Product: {selectedMarker.other_product.join(", ")}
          </Text>
        );
      case 3:
        return (
          <Text style={styles.modalDescription}>
            Service: {selectedMarker.service.join(", ")}
          </Text>
        );
      case 4:
        return (
          <Text style={styles.modalDescription}>
            Promotion: {selectedMarker.promotion.join(", ")}
          </Text>
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        // Disable map's ability to follow user's location automatically
        showsUserLocation={false}
      >
        {markers.map((marker) => (
          <Marker
            key={marker.id}
            coordinate={marker.coordinate}
            title={marker.title}
            onPress={() => handleMarkerPress(marker)}
          />
        ))}
        {userLocation && (
          <Marker.Animated
            coordinate={{
              latitude: userLocation.latitude,
              longitude: userLocation.longitude,
            }}
            style={{
              transform: [
                {
                  rotate: pointerPosition.interpolate({
                    inputRange: [0, 1],
                    outputRange: ["0deg", "360deg"],
                  }),
                },
              ],
            }}
            anchor={{ x: 0.5, y: 0.5 }}
            pinColor="blue"
          />
        )}
      </MapView>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          {selectedMarker && (
            <View>
              <View style={styles.header}>
                <TouchableOpacity
                  style={styles.mapButton}
                  onPress={() =>
                    openGoogleMaps(
                      selectedMarker.coordinate.latitude,
                      selectedMarker.coordinate.longitude
                    )
                  }
                >
                  <Ionicons name="logo-google" size={24} color="white" />
                </TouchableOpacity>

                {selectedMarker.picture && (
                  <Image
                    source={{ uri: selectedMarker.picture }}
                    style={styles.customImageStyle} // Merge custom style with existing style
                  />
                )}
                <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
              </View>

              <View style={styles.blocksContainer}>
                {[
                  "Description",
                  "Product",
                  "Other Product",
                  "Service",
                  "Promotion",
                ].map((block, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.block,
                      selectedBlock === index && styles.selectedBlock,
                    ]}
                    onPress={() => setSelectedBlock(index)}
                  >
                    <Text style={styles.blockText}>{block}</Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.blockContent}>{renderBlockContent()}</View>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={handleCloseModal}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </Modal>
      {/* Footer buttons */}
      <View style={styles.footer}>
        <Button title="Filter 1" onPress={() => setShowFilterForm(true)} />
        <Button title="My Location" onPress={findMyLocation} />
        <Button title="Filter 2" onPress={() => console.log("Filter 2")} />
      </View>
    </View>
  );
};

function openGoogleMaps(lat: number, lon: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  Linking.openURL(url);
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  customImageStyle: {
    width: 400, // Customize width as needed
    height: 200, // Customize height as needed
    borderRadius: 20, // Add border radius for rounded corners
  },
  mapButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 120,
    marginBottom: 20,
    alignItems: "center",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: "rgba(255, 255, 255, 1)", // Semi-transparent white background
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20, // Adjust the value as needed
    borderTopRightRadius: 20, // Adjust the value as needed
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  headerImage: {
    width: 100,
    height: 100,
    resizeMode: "cover",
    borderRadius: 50,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
  },
  blocksContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginVertical: 10,
  },
  block: {
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  selectedBlock: {
    borderBottomColor: "#4287f5",
  },
  blockText: {
    fontSize: 16,
  },
  blockContent: {
    padding: 20,
  },
  modalDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    margin: 20,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default App;
function filterMarkersByDescription(filterValue: string) {
    throw new Error("Function not implemented.");
}


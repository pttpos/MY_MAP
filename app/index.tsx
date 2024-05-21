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
  ScrollView,
} from "react-native";
import MapView, { Marker, Region } from "react-native-maps";
import * as Location from "expo-location";
import markersData from "./markers.json";
import { Linking } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import RNPickerSelect from 'react-native-picker-select';

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
      description: string[];
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
  const [filteredMarkers, setFilteredMarkers] = useState<any[]>([]);

  // Filter options
  const [productOptions, setProductOptions] = useState<string[]>([]);
  const [descriptionOptions, setDescriptionOptions] = useState<string[]>([]);
  const [serviceOptions, setServiceOptions] = useState<string[]>([]);
  const [provinceOptions, setProvinceOptions] = useState<string[]>([]);
  const [titleOptions, setTitleOptions] = useState<string[]>([]);

  // Selected filter values
  const [selectedProduct, setSelectedProduct] = useState<string>("");
  const [selectedDescription, setSelectedDescription] = useState<string>("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [selectedProvince, setSelectedProvince] = useState<string>("");
  const [selectedTitle, setSelectedTitle] = useState<string>("");
  // Function to update title options based on selected province
  const updateTitleOptions = (selectedProvince: string) => {
    const filteredTitles = markers
      .filter(marker => marker.province === selectedProvince)
      .flatMap(marker => marker.title);
    const uniqueTitles = Array.from(new Set(filteredTitles));
    setTitleOptions(uniqueTitles);
  };
  useEffect(() => {
    if (selectedProvince) {
      updateTitleOptions(selectedProvince);
    }
  }, [selectedProvince]);

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
        description: station.description,
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

    // Extract unique values for filter options
    const allProducts = markersData.STATION.flatMap(station => station.product);
    const allDescriptions = markersData.STATION.flatMap(station => station.description);
    const allServices = markersData.STATION.flatMap(station => station.service);
    const allProvinces = markersData.STATION.map(station => station.province);
    const allTitle = markersData.STATION.map(station => station.title);
    setProvinceOptions(Array.from(new Set(allProvinces)));
    setProductOptions(Array.from(new Set(allProducts)));
    setDescriptionOptions(Array.from(new Set(allDescriptions)));
    setServiceOptions(Array.from(new Set(allServices)));
    setTitleOptions(Array.from(new Set(allTitle)));
  }, []);

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
  // Function to handle title selection
  const handleTitleSelection = (title: string) => {
    // Find the marker associated with the selected title
    const markerWithTitle = markers.find(marker => marker.title === title);
    if (markerWithTitle) {
      // Get the province of the marker
      const provinceOfTitle = markerWithTitle.province;
      // Find the marker with the same province as the selected title
      const markerInProvince = markers.find(marker => marker.province === provinceOfTitle);
      if (markerInProvince) {
        // Move and zoom the map to the province of the selected title
        mapRef.current?.animateToRegion({
          latitude: markerInProvince.coordinate.latitude,
          longitude: markerInProvince.coordinate.longitude,
          latitudeDelta: 0.5, // Adjust as needed
          longitudeDelta: 0.5, // Adjust as needed
        }, 500); // Adjust the duration as needed (500 milliseconds in this example)
      }
    }
  };


  const applyFilters = () => {
    let filtered = markers;

    if (selectedProduct) {
      filtered = filtered.filter((marker) => marker.product.includes(selectedProduct));
    }

    if (selectedDescription) {
      filtered = filtered.filter((marker) => marker.description.includes(selectedDescription));
    }

    if (selectedService) {
      filtered = filtered.filter((marker) => marker.service.includes(selectedService));
    }

    if (selectedProvince) {
      filtered = filtered.filter((marker) => marker.province === selectedProvince);
    }

    if (selectedTitle) {
      const selectedMarker = markers.find((marker) => marker.title === selectedTitle);
      if (selectedMarker) {
        const provinceOfTitle = selectedMarker.province;
        filtered = filtered.filter((marker) => marker.province === provinceOfTitle);
      }
    }

    // Calculate the bounding region to encompass all markers
    if (filtered.length > 0) {
      const allMarkers = [...filtered, ...markers]; // Include all markers
      const coordinates = allMarkers.map((marker) => marker.coordinate);
      const minLatitude = Math.min(...coordinates.map((coord) => coord.latitude));
      const maxLatitude = Math.max(...coordinates.map((coord) => coord.latitude));
      const minLongitude = Math.min(...coordinates.map((coord) => coord.longitude));
      const maxLongitude = Math.max(...coordinates.map((coord) => coord.longitude));

      const region = {
        latitude: (minLatitude + maxLatitude) / 2,
        longitude: (minLongitude + maxLongitude) / 2,
        latitudeDelta: maxLatitude - minLatitude + 1.1,
        longitudeDelta: maxLongitude - minLongitude + 1.1,
      };

      mapRef.current?.animateToRegion(region, 500);
      setRegion(region); // Update the region state to encompass all markers
    }

    setFilteredMarkers(filtered);
    setShowFilterForm(false);
  };


  useEffect(() => {
    // Zoom in to marker's location when a title is selected
    if (selectedTitle && selectedMarker) {
      const { latitude, longitude } = selectedMarker.coordinate;
      mapRef.current?.animateToRegion({
        latitude,
        longitude,
        latitudeDelta: 0.02, // Adjust as needed
        longitudeDelta: 0.02, // Adjust as needed
      }, 500);
    }
  }, [selectedTitle]);

  useEffect(() => {
    if (selectedProvince) {
      const filteredTitles = markers
        .filter(marker => marker.province === selectedProvince)
        .map(marker => marker.title);
      setTitleOptions(Array.from(new Set(filteredTitles)));
    } else {
      setTitleOptions([]);
    }
  }, [selectedProvince]);


  const renderBlockContent = (): React.ReactNode => {
    switch (selectedBlock) {
      case 0:
        return (
          <ScrollView>
            {selectedMarker && selectedMarker.description.map((desc: string, index: number) => (
              <Text key={index} style={styles.modalDescription}>{desc}</Text>
            ))}
          </ScrollView>
        );
      case 1:
        return (
          <ScrollView>
            {selectedMarker && selectedMarker.product.map((prod: string, index: number) => (
              <Text key={index} style={styles.modalDescription}>{prod}</Text>
            ))}
          </ScrollView>
        );
      case 2:
        return (
          <ScrollView>
            {selectedMarker && selectedMarker.other_product.map((prod: string, index: number) => (
              <Text key={index} style={styles.modalDescription}>{prod}</Text>
            ))}
          </ScrollView>
        );
      case 3:
        return (
          <ScrollView>
            {selectedMarker && selectedMarker.service.map((serv: string, index: number) => (
              <Text key={index} style={styles.modalDescription}>{serv}</Text>
            ))}
          </ScrollView>
        );
      case 4:
        return (
          <ScrollView>
            {selectedMarker && selectedMarker.promotion.map((promo: string, index: number) => (
              <Text key={index} style={styles.modalDescription}>{promo}</Text>
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };


  const markerImage = require('../assets/picture/6.png'); // Use your custom marker image here

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={styles.map}
        region={region}
        // Disable map's ability to follow user's location automatically
        showsUserLocation={false}
      >
        {filteredMarkers.length > 0
          ? filteredMarkers.map((marker) => (
            <Marker key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => handleMarkerPress(marker)}
              anchor={{ x: 0.5, y:0.5 }}
              centerOffset={{ x: 0, y: -20 }} 
            >
              <View style={styles.markerWrapper}>
                <Image source={markerImage} style={styles.markerImage} />
              </View>
            </Marker>
          ))
          : markers.map((marker) => (
            <Marker
              key={marker.id}
              coordinate={marker.coordinate}
              title={marker.title}
              onPress={() => handleMarkerPress(marker)}
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: -20 }} 
            >
              <View style={styles.markerWrapper}>
                <Image source={markerImage} style={styles.markerImage} />
              </View>
            </Marker>
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
                    style={styles.customImageStyle} // Merge custom style with existing styles
                  />
                )}

                <Text style={styles.modalTitle}>{selectedMarker.title}</Text>
              </View>
              <View style={styles.blocksContainer}>
                {["Description", "Product", "Other Product", "Service", "Promotion"].map((block, index) => (
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
                <Ionicons name="close" size={24} color="white" />
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

      {/* Filter Form */}
      {showFilterForm && (
        <View style={styles.filterContainer}>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Province:</Text>
            <RNPickerSelect
              placeholder={{ label: 'Select Province', value: null }}
              value={selectedProvince}
              onValueChange={(value) => setSelectedProvince(value)}
              items={provinceOptions.map(option => ({ label: option, value: option }))}
              style={pickerSelectStyles}
            />
          </View>

          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Title:</Text>
            <RNPickerSelect
              placeholder={{ label: 'Select Title', value: null }}
              value={selectedTitle}
              onValueChange={(value) => {
                setSelectedTitle(value);
                handleTitleSelection(value);
              }}
              items={titleOptions.map(option => ({ label: option, value: option }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Product:</Text>
            <RNPickerSelect
              placeholder={{ label: 'Select Product', value: null }}
              value={selectedProduct}
              onValueChange={(value) => setSelectedProduct(value)}
              items={productOptions.map(option => ({ label: option, value: option }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Description:</Text>
            <RNPickerSelect
              placeholder={{ label: 'Select Description', value: null }}
              value={selectedDescription}
              onValueChange={(value) => setSelectedDescription(value)}
              items={descriptionOptions.map(option => ({ label: option, value: option }))}
              style={pickerSelectStyles}
            />
          </View>
          <View style={styles.filterGroup}>
            <Text style={styles.filterTitle}>Filter by Service:</Text>
            <RNPickerSelect
              placeholder={{ label: 'Select Service', value: null }}
              value={selectedService}
              onValueChange={(value) => setSelectedService(value)}
              items={serviceOptions.map(option => ({ label: option, value: option }))}
              style={pickerSelectStyles}
            />
          </View>
          <TouchableOpacity
            style={styles.filterButton}
            onPress={applyFilters}
          >
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filterCloseButton}
            onPress={() => setShowFilterForm(false)}
          >
            <Text style={styles.filterButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      )}

    </View>
  );
};

function openGoogleMaps(lat: number, lon: number) {
  const url = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lon}`;
  Linking.openURL(url);
}

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    padding: 8,
  },
  inputAndroid: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 20,
    padding: 8,
  },
});

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
  },
  customImageStyle: {
    width: 400,
    height: 200,
    borderRadius: 20,
  },
  markerWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 40, // adjust the size as needed
    height:45, // adjust the size as needed
  },
  markerImage: {
    width: 40, // adjust the size as needed
    height: 45, // adjust the size as needed
    resizeMode: 'contain', // ensure the image is contained within the wrapper
  },
  mapButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 120,
    marginBottom: 20,
    alignItems: "center",
    flexDirection: "row",
  },
  mapButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 50,
    backgroundColor: "rgba(255, 255, 255, 1)",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
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
    flexDirection: "row",
  },
  closeButtonText: {
    color: "#fff",
    fontSize: 16,
    marginLeft: 10,
  },
  filterContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  filterCloseButton: {
    marginTop: 20,
    alignSelf: "flex-end",
    backgroundColor: "#4287f5",
    borderRadius: 20,
    padding: 5,
  },
  filterGroup: {
    marginBottom: 20,
  },
  filterTitle: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 2,
  },
  filterPicker: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    marginBottom: 20,
  },
  filterButton: {
    backgroundColor: "#4287f5",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  filterButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});

export default App;



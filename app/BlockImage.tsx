import React from 'react';
import { View, Text, ScrollView, Image, StyleSheet, TouchableOpacity, Animated, Easing } from 'react-native';

interface BlockImageProps {
  selectedBlock: number;
  selectedMarker: any; // Update the type according to your data structure
}

interface ProductImages {
  [key: string]: any;
  "ULR 91": any;
  "ULG 95": any;
  "HSD": any;
}

interface OtherProductImages {
  [key: string]: any;
  "EV": any;
  "Onion": any;
}

interface PaymentImages {
  [key: string]: any;
  "Cash": any;
  "ABA": any;
  "Fleet card": any;
}

interface DescriptionImages {
  [key: string]: any;
  "EV": any;
  "Onion": any;
}

interface PromotionImages {
  [key: string]: any;
  "EV": any;
  "Onion": any;
}

interface ImageData {
  [key: string]: {
    [key: string]: any;
  };
}

const BlockImage: React.FC<BlockImageProps> = ({ selectedBlock, selectedMarker }) => {
  // Define your image data here
  const productImages: ProductImages = {
    "ULR 91": require("../assets/picture/ULR91.png"),
    "ULG 95": require("../assets/picture/ULG95.png"),
    "HSD": require("../assets/picture/HSD.png"),
  };

  const otherProductImages: OtherProductImages = {
    "EV": require('../assets/picture/ev.png'),
    "Onion": require('../assets/picture/onion.png'),
  };

  const paymentImages: PaymentImages = {
    "Cash": require('../assets/picture/cash.png'),
    "ABA": require('../assets/picture/aba.png'),
    "Fleet card": require('../assets/picture/fleet.png'),
  };

  const descriptionImages: DescriptionImages = {
    "EV": require('../assets/picture/ev.png'),
    "Onion": require('../assets/picture/onion.png'),
  };

  const promotionImages: PromotionImages = {
    "EV": require('../assets/picture/ev.png'),
    "Onion": require('../assets/picture/onion.png'),
  };

  const imageData: ImageData = {
    service: paymentImages,
    description: descriptionImages,
    promotion: promotionImages,
  };

  // Define your styles here
  const styles = StyleSheet.create({
    container: {
      padding: 20,
    },
    blockTitle: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      color: '#333',
    },
    modalDescription: {
      fontSize: 18,
      marginBottom: 5,
      color: '#666',
    },
    productImage: {
      width: 70,
      height: 70,
      marginRight: 10,
      marginBottom: 5,
      resizeMode: 'contain',
      borderRadius: 50,
      borderWidth: 0,
      borderColor: '#ccc',
    },
    otherProductImage: {
      width: 70,
      height: 70,
      marginRight: 0,
      marginBottom: 5,
      resizeMode: 'contain',

    },
    animatedButton: {
      padding: 10,
      backgroundColor: '#007bff',
      borderRadius: 5,
      marginTop: 20,
    },
    animatedButtonText: {
      color: '#fff',
      fontWeight: 'bold',
      textAlign: 'center',
    },
  });

  // Animated button opacity animation
  const buttonOpacity = new Animated.Value(1);

  const handleButtonPress = () => {
    Animated.timing(buttonOpacity, {
      toValue: 0.5,
      duration: 200,
      easing: Easing.linear,
      useNativeDriver: true,
    }).start();
  };

// Render the block content based on the selected block
switch (selectedBlock) {
  case 0:
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.blockTitle}>Product</Text>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {selectedMarker &&
                selectedMarker.product.map((prod: string, index: number) => (
                  <View key={index} style={{ marginRight: 10 }}>
                    <Text style={styles.modalDescription}>{prod}</Text>
                    {productImages[prod] && (
                      <Image
                        source={productImages[prod]}
                        style={styles.productImage}
                      />
                    )}
                  </View>
                ))}
            </View>
          </ScrollView>
          <Text style={styles.blockTitle}>Other Product</Text>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {selectedMarker &&
                selectedMarker.other_product.map((prod: string, index: number) => (
                  <View key={index} style={{ marginRight: 40 }}>
                    <Text style={styles.modalDescription}>{prod}</Text>
                    {otherProductImages[prod] && (
                      <Image
                        source={otherProductImages[prod]}
                        style={styles.otherProductImage}
                      />
                    )}
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  case 1:
  case 2:
  case 3:
    // Assuming service, description, and promotion have images associated with them
    const title = ['Service', 'Description', 'Promotion'][selectedBlock - 1];
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.blockTitle}>{title}</Text>
          <ScrollView horizontal>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {selectedMarker &&
                selectedMarker[title.toLowerCase()].map((item: string, index: number) => (
                  <View key={index} style={{ marginRight: 40 }}>
                    <View style={{ alignItems: 'center' }}>
                      <Text style={styles.modalDescription}>{item}</Text>
                      {imageData[title.toLowerCase()][item] && (
                        <Image
                          source={imageData[title.toLowerCase()][item]}
                          style={styles.otherProductImage}
                        />
                      )}
                    </View>
                  </View>
                ))}
            </View>
          </ScrollView>
        </View>
      </ScrollView>
    );
  case 4:
    return (
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.blockTitle}>Address</Text>
          {selectedMarker && (
            <Text style={styles.modalDescription}>
              {selectedMarker.address}
            </Text>
          )}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.animatedButton}
            onPress={handleButtonPress}>
            <Animated.Text style={[styles.animatedButtonText, { opacity: buttonOpacity }]}>
              Click Me!
            </Animated.Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  default:
    return null;
}




};

export default BlockImage;

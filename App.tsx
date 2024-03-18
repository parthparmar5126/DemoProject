import React, { useRef, useState } from 'react';
import { View, ScrollView, Image, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const ZoomableImage = ({ source }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const [isZoomed, setIsZoomed] = useState(false);
  const scrollViewRef = useRef(null);

  const toggleZoom = () => {
    setIsZoomed(!isZoomed);
    Animated.timing(scale, {
      toValue: isZoomed ? 1 : 2, // You can adjust the zoom level here
      duration: 300, // Adjust animation duration as needed
      useNativeDriver: true,
    }).start();
    
    // Disable scrolling when zoomed in
    if (!isZoomed && scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: false });
    } else if (scrollViewRef.current) {
      scrollViewRef.current.setNativeProps({ scrollEnabled: true });
    }
  };

  return (
    <ScrollView
      ref={scrollViewRef}
      contentContainerStyle={styles.scrollViewContent}
      maximumZoomScale={2} // Allow zooming
      minimumZoomScale={1}
      bouncesZoom={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
    >
      <TouchableOpacity onPress={toggleZoom} activeOpacity={1}>
        <Animated.Image
          source={source}
          style={{
            width: '100%',
            height: 300, // Set initial height
            transform: [{ scale }],
          }}
          resizeMode="contain"
        />
      </TouchableOpacity>
    </ScrollView>
  );
};

const ZoomableScrollView = ({ images }) => {
  return (
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      {images.map((image, index) => (
        <ZoomableImage key={index} source={image} />
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    flexGrow: 1,
  },
});

// Usage
const images = [
  { uri: 'https://fastly.picsum.photos/id/987/200/300.jpg?hmac=JG_lwzlHFo64MDTTkaO_NK_KfCF-FE4ajdvEFqPJ4qY' }
  // Add more images as needed
];

export default function App() {
  return (
    <View style={{ flex: 1 }}>
      <ZoomableScrollView images={images} />
    </View>
  );
}

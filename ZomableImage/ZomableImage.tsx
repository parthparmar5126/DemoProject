import React, { useRef } from 'react';
import { View, Image, StyleSheet, Animated } from 'react-native';
import { PinchGestureHandler, State, GestureHandlerRootView } from 'react-native-gesture-handler';
import { PanGestureHandler } from 'react-native-gesture-handler';
import { useEffect } from 'react';

const ZoomableImage = ({ uri }) => {
  const scale = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(0)).current;
  const lastScale = useRef(1);
  const lastOffset = useRef({ x: 0, y: 0 });

  useEffect(() => {
    scale.addListener(({ value }) => {
      lastScale.current = value;
    });
    translateX.addListener(({ value }) => {
      lastOffset.current.x = value;
    });
    translateY.addListener(({ value }) => {
      lastOffset.current.y = value;
    });

    return () => {
      scale.removeAllListeners();
      translateX.removeAllListeners();
      translateY.removeAllListeners();
    };
  }, []);

  const onPinchGestureEvent = Animated.event(
    [{ nativeEvent: { scale: scale } }],
    { useNativeDriver: true }
  );

  const onPanGestureEvent = Animated.event(
    [
      {
        nativeEvent: {
          translationX: translateX,
          translationY: translateY,
        },
      },
    ],
    { useNativeDriver: true }
  );

  const onPinchHandlerStateChange = (event) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      lastScale.current *= event.nativeEvent.scale;
      scale.setValue(lastScale.current);
      translateX.setOffset(lastOffset.current.x);
      translateX.setValue(0);
      translateY.setOffset(lastOffset.current.y);
      translateY.setValue(0);
    }
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PinchGestureHandler
        onGestureEvent={onPinchGestureEvent}
        onHandlerStateChange={onPinchHandlerStateChange}>
        <Animated.View style={styles.container}>
          <PanGestureHandler onGestureEvent={onPanGestureEvent}>
            <Animated.View style={styles.container}>
              <Animated.Image
                source={{ uri:'https://fastly.picsum.photos/id/393/200/300.jpg?hmac=zh8LVueWlQFz83Gn-9g49laZIMmCg_NC6jLkrQq0h5U' }}
                style={[
                  styles.image,
                  {
                    transform: [
                      { translateX: translateX },
                      { translateY: translateY },
                      { scale: scale },
                    ],
                  },
                ]}
              />
            </Animated.View>
          </PanGestureHandler>
        </Animated.View>
      </PinchGestureHandler>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'contain',
  },
});

export default ZoomableImage;
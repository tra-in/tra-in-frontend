import React, { useEffect, useMemo, useRef, useState } from "react";
import { StyleSheet, View, Image, Text, Animated, Easing } from "react-native";
import { Colors } from "../constants/theme";

const LoadingScreen = () => {
  const messages = useMemo(
    () => [
      "추천 여행지를 불러오고 있어요",
      "잠시만 기다려 주세요",
      "최고의 여행으로 만들어 드리기 위해 노력하고 있어요",
      "좋은 여행 되세요!",
    ],
    []
  );

  const [index, setIndex] = useState(0);
  const translateY = useRef(new Animated.Value(30)).current; // start slightly below
  const opacity = useRef(new Animated.Value(0)).current;

  // Vertical scroll-in/out animation per message
  useEffect(() => {
    // reset position/opacities
    translateY.setValue(30);
    opacity.setValue(0);

    const inAnim = Animated.parallel([
      Animated.timing(translateY, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 350,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const holdDuration = 1600;
    const outAnim = Animated.parallel([
      Animated.timing(translateY, {
        toValue: -20,
        duration: 280,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 280,
        easing: Easing.in(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    inAnim.start(() => {
      const holdTimeout = setTimeout(() => {
        outAnim.start(() => {
          setIndex((i) => (i + 1) % messages.length);
        });
      }, holdDuration);
      // cleanup for hold timeout
      return () => clearTimeout(holdTimeout);
    });
  }, [index, messages, translateY, opacity]);

  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/walking-for-loading.gif")}
        style={styles.loadingGif}
        resizeMode="contain"
      />
      <Animated.View
        style={[styles.textContainer, { transform: [{ translateY }], opacity }]}
      >
        <Text style={styles.message}>{messages[index]}</Text>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingGif: {
    width: "100%",
    height: "100%",
    transform: [{ translateY: -80 }],
  },
  textContainer: {
    position: "absolute",
    bottom: "40%",
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    alignItems: "center",
  },
  message: {
    color: Colors.korailBlue,
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});

export default LoadingScreen;

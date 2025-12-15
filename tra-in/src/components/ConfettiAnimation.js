import React, { useEffect, useRef } from "react";
import { View, StyleSheet, Animated, Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const CONFETTI_COLORS = [
  "#FF6B6B",
  "#4ECDC4",
  "#FFE66D",
  "#95E1D3",
  "#F38181",
  "#AA96DA",
  "#FCBAD3",
  "#A8E6CF",
];

const ConfettiPiece = ({ delay, duration, color, initialX }) => {
  const translateY = useRef(new Animated.Value(-50)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * width * 0.3;
    const randomRotation = Math.random() * 720 - 360;

    Animated.parallel([
      Animated.timing(translateY, {
        toValue: height + 100,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(translateX, {
        toValue: randomX,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(rotate, {
        toValue: randomRotation,
        duration: duration,
        delay: delay,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: duration * 0.8,
        delay: delay + duration * 0.2,
        useNativeDriver: true,
      }),
    ]).start();
  }, [delay, duration]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 360],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.confettiPiece,
        {
          left: initialX,
          backgroundColor: color,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotateInterpolate },
          ],
          opacity,
        },
      ]}
    />
  );
};

const ConfettiAnimation = ({
  duration = 1500,
  pieceCount = 50,
  onComplete,
}) => {
  useEffect(() => {
    if (onComplete) {
      const timer = setTimeout(() => {
        onComplete();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onComplete]);

  return (
    <View style={styles.container} pointerEvents="none">
      {Array.from({ length: pieceCount }).map((_, index) => {
        const color =
          CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)];
        const delay = Math.random() * 200;
        const pieceDuration = duration + Math.random() * 1000;
        const initialX = Math.random() * width;

        return (
          <ConfettiPiece
            key={index}
            delay={delay}
            duration={pieceDuration}
            color={color}
            initialX={initialX}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 99999,
    elevation: 99999,
  },
  confettiPiece: {
    position: "absolute",
    top: -50,
    width: 10,
    height: 10,
    borderRadius: 2,
  },
});

export default ConfettiAnimation;

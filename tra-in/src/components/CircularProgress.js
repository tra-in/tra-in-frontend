import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

/**
 * 원형 프로그레스 바 컴포넌트
 * @param {number} progress - 현재 진행도
 * @param {number} total - 전체 목표치
 * @param {number} [size=80] - 원의 크기 (픽셀)
 */
const CircularProgress = ({ progress, total, color, size = 80 }) => {
  const getColorByProgress = (prog) => {
    if (prog >= 9) return "#005DB3";
    if (prog >= 5) return "#00B6E8";
    return "#FF69B4";
  };

  const progressColor = color || getColorByProgress(progress);
  const percentage = (progress / total) * 100;
  const radius = (size - 12) / 2;
  const strokeWidth = 6;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const center = size / 2;

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      <Svg width={size} height={size} style={styles.svg}>
        {/* Background circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke="#E0E0E0"
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Progress circle */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={progressColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${center}, ${center}`}
        />
      </Svg>
      <View style={[styles.textContainer, { width: size, height: size }]}>
        <Text style={[styles.text, { color: progressColor }]}>
          {progress}/{total}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  svg: {
    position: "absolute",
  },
  textContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    fontSize: 18,
    fontWeight: "700",
  },
});

export default CircularProgress;

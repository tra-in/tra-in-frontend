import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

/**
 * 원형 프로그레스 바 컴포넌트
 * @param {number} progress - 현재 진행도
 * @param {number} total - 전체 목표치
 * @param {number} [size=80] - 원의 크기 (픽셀)
 * @param {boolean} [showCheckmark=false] - 체크마크 표시 여부 (완료시)
 */
const CircularProgress = ({ progress, total, color, size = 80, showCheckmark = false }) => {
  /**
   * 진행률에 따른 색상 결정
   * 70% 이상: 진한 파랑 (#005DB3)
   * 30% ~ 69%: 하늘색 (#00B6E8)
   * 0% ~ 29%: 핑크 (#FF69B4)
   */
  const getColorByPercentage = (prog, tot) => {
    const percent = (prog / tot) * 100;
    
    if (percent >= 70) return "#005DB3"; // 진한 파랑
    if (percent >= 30) return "#00B6E8"; // 하늘색
    return "#FF69B4"; // 핑크
  };

  const progressColor = color || getColorByPercentage(progress, total);
  const percentage = showCheckmark ? 100 : (progress / total) * 100;
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
        {showCheckmark ? (
          <Text style={[styles.checkmark, { color: progressColor, fontSize: size * 0.5 }]}>
            ✓
          </Text>
        ) : (
          <Text style={[styles.text, { color: progressColor }]}>
            {progress}/{total}
          </Text>
        )}
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
  checkmark: {
    fontWeight: "700",
  },
});

export default CircularProgress;

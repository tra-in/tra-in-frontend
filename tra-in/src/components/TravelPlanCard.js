import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "../constants/theme";

const TravelPlanCard = ({
  userName = "홍길동",
  title = "대전 여행을 계획하고 있나요?",
  avatar,
  route = "부산 - 대전",
  date = "2025.12.15 (월)",
  onAiPress = () => {},
  scale = 1,
  cardWidth = 332,
  cardHeight = 188,
  avatarSize = 56,
}) => (
  <View
    style={[
      styles.planCard,
      {
        width: cardWidth,
        height: cardHeight,
        paddingTop: 18 * scale,
        paddingBottom: 18 * scale,
        paddingHorizontal: 20 * scale,
      },
    ]}
  >
    <View style={styles.planCardTextWrap}>
      <Text style={[styles.greeting, { fontSize: 13 * scale }]}>
        {" "}
        {userName}님,{" "}
      </Text>
      <Text style={[styles.planTitle, { fontSize: 20 * scale }]}>
        {" "}
        {title}{" "}
      </Text>
    </View>
    <Image
      source={avatar}
      style={[
        styles.avatar,
        {
          width: avatarSize,
          height: avatarSize,
          borderRadius: avatarSize / 2,
          left: 25 * scale,
          top: 88 * scale,
        },
      ]}
    />
    <View
      style={[
        styles.planInfoWrap,
        { left: 94 * scale, top: 88 * scale, width: 216 * scale },
      ]}
    >
      <Text
        style={[
          styles.planRoute,
          { fontSize: 15 * scale, marginBottom: 2 * scale },
        ]}
      >
        {" "}
        {route}{" "}
      </Text>
      <Text
        style={[
          styles.planDate,
          { fontSize: 13 * scale, marginTop: 0, marginBottom: 2 * scale },
        ]}
      >
        {" "}
        {date}{" "}
      </Text>
      <TouchableOpacity
        style={[
          styles.aiButton,
          {
            flexDirection: "row",
            alignItems: "center",
            borderRadius: 8 * scale,
            paddingHorizontal: 8 * scale,
            paddingVertical: 3 * scale,
            marginTop: 4 * scale,
            marginBottom: 14 * scale,
            alignSelf: "flex-start",
          },
        ]}
        onPress={onAiPress}
      >
        <Text
          style={[
            styles.aiButtonText,
            { fontSize: 13 * scale, marginRight: 2 * scale },
          ]}
        >
          AI 추천 일정
        </Text>
        <MaterialIcons
          name="chevron-right"
          size={18 * scale}
          color="#FF81B9"
          style={{ marginRight: 0 }}
        />
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    flexDirection: "column",
    alignItems: "flex-start",
    position: "relative",
  },
  planCardTextWrap: {
    width: "100%",
    marginBottom: 7,
    paddingLeft: 3,
  },
  greeting: {
    color: Colors.korailGray,
    marginBottom: 2,
    fontWeight: "400",
  },
  planTitle: {
    color: Colors.black,
    fontWeight: "bold",
    textAlign: "left",
  },
  avatar: {
    position: "absolute",
    borderWidth: 1,
    borderColor: Colors.korailSilver,
    backgroundColor: Colors.white,
  },
  planInfoWrap: {
    position: "absolute",
    justifyContent: "flex-start",
    alignItems: "flex-start",
    backgroundColor: "transparent",
  },
  planDate: {
    color: Colors.korailGray,
    textAlign: "center",
    marginBottom: 2,
    fontWeight: "400",
  },
  planRoute: {
    color: Colors.black,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 6,
  },
  aiButton: {
    backgroundColor: "#FFE5EF",
    alignSelf: "center",
    marginTop: 4,
  },
  aiButtonText: {
    color: "#FF81B9",
    fontWeight: "bold",
  },
});

export default TravelPlanCard;

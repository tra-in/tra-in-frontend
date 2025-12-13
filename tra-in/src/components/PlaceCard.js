import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { Colors } from "../constants/theme";

const PlaceCard = ({ place, width, imageHeight, scale }) => (
  <View style={[styles.placeCard, { width, marginRight: 8 * scale }]}>
    <Image
      source={{ uri: place.image }}
      style={[
        styles.placeImage,
        { width, height: imageHeight, borderRadius: 12 * scale },
      ]}
    />
    <Text
      style={[
        styles.placeName,
        { fontSize: 15 * scale, marginLeft: 2 * scale },
      ]}
    >
      {place.name}
    </Text>
    <Text
      style={[
        styles.placeRegion,
        { fontSize: 12 * scale, marginLeft: 2 * scale },
      ]}
    >
      {place.region}
    </Text>
  </View>
);

const styles = StyleSheet.create({
  placeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 6,
    alignItems: "flex-start",
    shadowColor: undefined,
    shadowOffset: undefined,
    shadowOpacity: undefined,
    shadowRadius: undefined,
    elevation: 0,
  },
  placeImage: {
    marginBottom: 3,
    backgroundColor: Colors.korailSilver,
  },
  placeName: {
    fontWeight: "600",
    marginBottom: 1,
  },
  placeRegion: {
    color: Colors.korailGray,
  },
});

export default PlaceCard;

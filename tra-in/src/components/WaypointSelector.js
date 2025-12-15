import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Button,
  ActivityIndicator,
} from "react-native";

export default function WaypointSelector({
  phase,
  searchParams,
  wp1,
  wp2,
  wp3,
  stations,
  wp2Candidates,
  wp3Candidates,
  validatingWaypoints,
  waypointError,
  onSelectFirstWaypoint,
  onSelectSecondWaypoint,
  onSelectThirdWaypoint,
  onConfirmWithOne,
  onConfirmWithTwo,
  onConfirmWithThree,
}) {
  // 첫 번째 경유지 선택
  if (phase === "first") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>1번째 경유지 선택</Text>
        <Text style={styles.subtitle}>
          {searchParams.originName} → (경유1) → {searchParams.destName}
        </Text>

        <ScrollView>
          {stations.map((s) => (
            <Pressable
              key={s.id}
              style={styles.waypointItem}
              onPress={() => onSelectFirstWaypoint(s.name)}
            >
              <Text>{s.name}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {validatingWaypoints && (
          <Text style={styles.loadingText}>가능한 경유 조합을 확인 중...</Text>
        )}
        {waypointError ? (
          <Text style={styles.errorText}>{waypointError}</Text>
        ) : null}
      </View>
    );
  }

  // 두 번째 경유지 선택
  if (phase === "second") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>2번째 경유지 선택</Text>
        <Text style={styles.subtitle}>
          {searchParams.originName} → {wp1} → (경유2) → {searchParams.destName}
        </Text>

        <ScrollView>
          {wp2Candidates.map((name) => (
            <Pressable
              key={name}
              style={[
                styles.waypointItem,
                wp2 === name && styles.waypointItemActive,
              ]}
              onPress={() => onSelectSecondWaypoint(name)}
            >
              <Text
                style={wp2 === name && { color: "#0A84FF", fontWeight: "bold" }}
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {validatingWaypoints && (
          <Text style={styles.loadingText}>가능한 경유 조합을 확인 중...</Text>
        )}
        {waypointError ? (
          <Text style={styles.errorText}>{waypointError}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            title="2번째 경유지 없이 진행 (1개 경유)"
            onPress={onConfirmWithOne}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="선택한 경유지로 진행 (2개 경유)"
            onPress={onConfirmWithTwo}
            disabled={!wp2}
          />
        </View>
      </View>
    );
  }

  // 세 번째 경유지 선택
  if (phase === "third") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>3번째 경유지 선택</Text>
        <Text style={styles.subtitle}>
          {searchParams.originName} → {wp1} → {wp2} → (경유3) →{" "}
          {searchParams.destName}
        </Text>

        <ScrollView>
          {wp3Candidates.map((name) => (
            <Pressable
              key={name}
              style={[
                styles.waypointItem,
                wp3 === name && styles.waypointItemActive,
              ]}
              onPress={() => onSelectThirdWaypoint(name)}
            >
              <Text
                style={wp3 === name && { color: "#0A84FF", fontWeight: "bold" }}
              >
                {name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {waypointError ? (
          <Text style={styles.errorText}>{waypointError}</Text>
        ) : null}

        <View style={styles.buttonContainer}>
          <Button
            title="3번째 경유지 없이 진행 (2개 경유)"
            onPress={onConfirmWithTwo}
          />
          <View style={styles.buttonSpacer} />
          <Button
            title="선택한 경유지로 진행 (3개 경유)"
            onPress={onConfirmWithThree}
            disabled={!wp3}
          />
        </View>
      </View>
    );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    paddingHorizontal: 24,
  },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 8 },
  subtitle: { fontSize: 14, marginBottom: 16, color: "#666" },
  waypointItem: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    marginBottom: 8,
  },
  waypointItemActive: {
    borderColor: "#0A84FF",
    backgroundColor: "#0A84FF11",
  },
  loadingText: {
    marginTop: 8,
  },
  errorText: {
    color: "red",
    marginTop: 8,
  },
  buttonContainer: {
    marginTop: 16,
  },
  buttonSpacer: {
    height: 8,
  },
});

import { StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from "./theme";

/**
 * Common screen layout styles
 * Used across all screen components (HomeScreen, TravelScreen, etc.)
 */
export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  header: {
    backgroundColor: Colors.korailBlue,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    height: 69,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    ...Typography.title,
    color: Colors.white,
    textAlign: "center",
  },
  menuButton: {
    position: "absolute",
    right: Spacing.md,
    padding: Spacing.sm,
  },
  menuText: {
    fontSize: 24,
    color: Colors.white,
  },
  body: {
    paddingHorizontal: 17,
    paddingTop: Spacing.lg,
  },
});

/**
 * Common text styles for screen content
 */
export const contentStyles = StyleSheet.create({
  screenTitle: {
    ...Typography.title,
    color: Colors.korailBlue,
    marginBottom: Spacing.md,
  },
  screenDescription: {
    ...Typography.body.medium,
    color: Colors.korailGray,
  },
});

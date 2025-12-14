import { StyleSheet } from "react-native";
import { Colors, Typography, Spacing } from "./theme";

export const screenStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },

  header: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.korailSilver,
  },
  headerInner: {
    height: 55, // ✅ 로고/버튼이 맞춰질 기준 높이
    paddingHorizontal: Spacing.lg,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  // 로고용 스타일 추가 (Text 대신 Image에 적용)
  headerLogo: {
    height: 34, // 로고 세로 크기 (필요하면 26~34 조절)
    maxWidth: 160, // 너무 길어질 때 대비
    // marginTop: 8,
  },

  backButton: {
    position: "absolute",
    left: Spacing.md,
    top: 0,
    bottom: 0, // ✅ 위/아래 0으로 “진짜 중앙” 고정
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  backButtonText: {
    fontSize: 28,
    color: Colors.korailBlue,
    fontWeight: "300",
  },

  menuButton: {
    position: "absolute",
    right: Spacing.md,
    top: 0,
    bottom: 0, // ✅ 동일
    width: 44,
    justifyContent: "center",
    alignItems: "center",
  },

  menuText: {
    fontSize: 24,
    color: Colors.korailBlue,
  },

  body: {
    paddingHorizontal: 17,
    paddingTop: Spacing.lg,
  },
});

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

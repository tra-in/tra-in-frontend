import React, { useState } from "react";
import { View,  Text,  TextInput,  StyleSheet,  Pressable,  KeyboardAvoidingView,  Platform,  Image,} from "react-native";
import ScreenHeader from "../components/ScreenHeader";

export default function LoginScreen({ onLogin }) {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleKorailLogin = () => {
    const fakeUser = { id: 1, name: "박서훈" };
    onLogin(fakeUser);
  };

  const handleSignUp = () => {
    console.log("회원가입 버튼 클릭");
  };

  return (
    <View style={styles.root}>
      <ScreenHeader title="트레:in(人)" showBackButton={false} />

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.card}>
          <Text style={styles.title}>로그인</Text>

          <Text style={styles.label}>아이디</Text>
          <TextInput
            style={styles.input}
            placeholder="아이디를 입력하세요"
            value={userId}
            onChangeText={setUserId}
            autoCapitalize="none"
          />

          <Text style={styles.label}>비밀번호</Text>
          <TextInput
            style={styles.input}
            placeholder="비밀번호를 입력하세요"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <View style={styles.signupRow}>
            <Pressable onPress={handleSignUp}>
              <Text style={styles.signupText}>회원가입</Text>
            </Pressable>
          </View>

          <View style={styles.korailWrapper}>
            <Pressable style={styles.korailButton} onPress={handleKorailLogin}>
              <Image source={require("../../assets/korail.png")} style={styles.korailImage} />
              <Text style={styles.korailText}>KORAIL</Text>
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  card: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "#fafafa",
    borderWidth: 1,
    borderColor: "#eeeeee",
    elevation: 2,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  label: {
    fontSize: 14,
    color: "#555",
    marginTop: 8,
    marginBottom: 4,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  signupRow: {
    alignItems: "flex-end",
    marginTop: 8,
  },
  signupText: {
    fontSize: 12,
    color: "#0A84FF",
  },
  korailWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
  korailButton: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#0A84FF",
    alignItems: "center",
    justifyContent: "center",
  },
  korailText: {
    color: "#fff",
    fontWeight: "bold",
  },
  korailHint: {
    fontSize: 11,
    color: "#777",
    marginTop: 4,
    textAlign: "center",
  },
   korailImage: {
     width: 60,
     height: 60,
     resizeMode: "contain",
   },
});

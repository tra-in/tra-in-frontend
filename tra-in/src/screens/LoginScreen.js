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

  // 회원가입은 아래 Figma 버튼으로 제공합니다.

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

          <View style={styles.buttonContainerInCard}>
            <Pressable style={styles.figmaBtn} onPress={handleKorailLogin}>
              <Image source={require("../../assets/norm_sign_in_btn.png")} style={styles.buttonImage} />
            </Pressable>

            <Pressable style={styles.figmaBtn} onPress={handleKorailLogin}>
              <Image source={require("../../assets/korail_sign_in_btn.png")} style={styles.buttonImage} />
            </Pressable>

            <Pressable style={styles.figmaBtn} onPress={handleKorailLogin}>
              <Image source={require("../../assets/kakao_sign_in_btn.png")} style={styles.buttonImage} />
            </Pressable>

            <Pressable style={styles.figmaBtn} onPress={handleKorailLogin}>
              <Image source={require("../../assets/norm_sign_up_btn.png")} style={styles.buttonImage} />
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
    alignItems: 'center',
  },
  card: {
    width: '100%',
    padding: 24,
    paddingBottom: 28,
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
    marginTop: 10,
  },
  signupText: {
    fontSize: 12,
    color: "#0A84FF",
  },
  korailWrapper: {
    marginTop: 24,
    alignItems: "center",
  },
   buttonContainerInCard: {
     width: '100%',
     alignItems: 'center',
     marginTop: 20,
   },
   figmaBtn: {
     width: '100%',
     height: 44,
     borderRadius: 20,
     overflow: 'hidden',
     marginVertical: 1,
   },
   buttonImage: {
     width: '100%',
     height: '100%',
     resizeMode: 'contain',
   },
});

import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ImageBackground } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";

const TEMP_CAMERA_IMAGE = require('../../assets/docent_img.png');

const CameraChatScreen = ({ activeTab, setActiveTab, setActiveScreen }) => {
  const [messages, setMessages] = useState([]);
  const [listening, setListening] = useState(false);
  const scrollViewRef = useRef(null);

  useEffect(() => {
    setTimeout(() => {
      setMessages([
        {
          id: 1,
          sender: "ai",
          text: `여기는 대전역 서광장 입구네요!\n대전역은 1905년에 개통된 역사 깊은 교통의 중심지로, KTX와 고속버스를 타고 전국 어디든 쉽게 이동할 수 있어요.\n주변에는 은행동과 소제동 등이 있어요!`,
          time: "오전 10:21"
        }
      ]);
    }, 1500);
  }, []);

  useEffect(() => {
    if (listening) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [listening]);

  useEffect(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const handleVoicePress = () => {
    setListening(true);
    
    setTimeout(() => {
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          sender: "user",
          text: "은행동 맛집 추천해줘!",
          time: "오전 10:22"
        }
      ]);
      setListening(false);
      
      setTimeout(() => {
        setMessages(prev => [
          ...prev,
          {
            id: prev.length + 1,
            sender: "ai",
            text: "좋아요! 소제동은 대전의 중심지에 위치한 동네로 대전역과 가까워 교통이 편리해요! 소제동은 주거지와 상업지가 혼합된 지역으로 다양한 음식점과 카페들이 즐비해 있어요.\n특히 전통적인 시장인 '소제시장'이 유명한데, 여기서는 신선한 농산물과 전통적인 먹거리를 맛볼 수 있어요.",
            time: "오전 10:23"
          }
        ]);
      }, 1500);
    }, 2000);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }} edges={['top']}>
      <ScreenHeader showBackButton={true} onBackPress={() => setActiveScreen(null)} />
      
      <View style={{ flex: 1 }}>
        {/* 1층: 검은 배경 */}
        <View style={styles.layer1_background} />

        {/* 2층: 위쪽 이미지 + 아래쪽 둥근배경 */}
        <ImageBackground
          source={TEMP_CAMERA_IMAGE}
          style={styles.layer2_imageArea}
          resizeMode="cover"
        >
        </ImageBackground>
        
        <View style={styles.layer2_roundedBox} />

        {/* 3층: 툴바 */}
        <View style={styles.layer3_toolbar}>
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="globe-outline" size={24} color="#005DB3" />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="compass-outline" size={24} color="#005DB3" />
          </TouchableOpacity>

          <View style={styles.locationChip}>
            <View style={styles.greenDot} />
            <Text style={styles.locationTxt} numberOfLines={1}>대전광역시 동구 중앙로 215</Text>
          </View>

          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="volume-high-outline" size={24} color="#005DB3" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.toolBtn}>
            <Ionicons name="person-outline" size={24} color="#005DB3" />
          </TouchableOpacity>
        </View>

        {/* 3층: 채팅 */}
        <ScrollView
          ref={scrollViewRef}
          style={styles.layer3_chatContainer}
          contentContainerStyle={styles.chatContentContainer}
          showsVerticalScrollIndicator={false}
        >
          {messages.map((msg) => (
            <View key={msg.id} style={styles.messageContainer}>
              <View 
                style={[
                  styles.messageWrapper,
                  msg.sender === 'user' ? styles.userWrapper : styles.aiWrapper
                ]}
              >
                <View style={[
                  styles.messageBubble,
                  msg.sender === 'user' ? styles.userBubble : styles.aiBubble
                ]}>
                  <Text style={msg.sender === 'user' ? styles.userText : styles.aiText}>
                    {msg.text}
                  </Text>
                </View>
              </View>
              
              <View style={[
                styles.timeAndActionsRow,
                msg.sender === 'user' ? styles.timeAndActionsRowUser : styles.timeAndActionsRowAI
              ]}>
                <Text style={styles.timestamp}>
                  {msg.time}
                </Text>
                
                {msg.sender === 'ai' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity style={styles.actionIcon}>
                      <Ionicons name="refresh-outline" size={18} color="#888" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.actionIcon}>
                      <Ionicons name="copy-outline" size={18} color="#888" />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          ))}

          {listening && (
            <View style={styles.listeningIndicator}>
              <Text style={styles.listeningText}>듣고 있어요</Text>
            </View>
          )}
        </ScrollView>

        {/* 3층: 입력창 */}
        <View style={styles.layer3_inputArea}>
          <View style={styles.inputBar}>
            <Text style={styles.inputPlaceholder}>음성으로 질문해보세요</Text>
            <TouchableOpacity onPress={handleVoicePress} style={styles.micBtn}>
              <Ionicons name="mic" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    <BottomNavigation 
    activeTab={activeTab} 
    setActiveTab={(tab) => {
        setActiveScreen(null);
        setActiveTab(tab);
    }}
    />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layer1_background: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#000',
  },
  layer2_imageArea: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 5,
    borderColor: 'rgba(255, 255, 255, 0.9)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  layer2_roundedBox: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: '50%',
    backgroundColor: '#F3F6FB',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
  },
  layer3_toolbar: {
    position: 'absolute',
    top: '52%',
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    gap: 3,
    zIndex: 10,
  },
  toolBtn: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  locationChip: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eeeeeeff',
    borderRadius: 14,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#00E676',
    marginRight: 8,
  },
  locationTxt: {
    flex: 1,
    fontSize: 13,
    color: '#1C1C1C',
    fontWeight: '500',
  },
  layer3_chatContainer: {
    position: 'absolute',
    top: '60%',
    left: 0,
    right: 0,
    bottom: 100,
    zIndex: 9,
  },
  chatContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 20,
  },
  messageContainer: {
    marginVertical: 6,
  },
  messageWrapper: {
    marginBottom: 0,
  },
  aiWrapper: {
    alignItems: 'flex-start',
  },
  userWrapper: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 16,
    padding: 14,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  userBubble: {
    backgroundColor: '#005DB3',
  },
  aiText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#1C1C1C',
  },
  userText: {
    fontSize: 14,
    lineHeight: 20,
    color: '#FFFFFF',
  },
  timeAndActionsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  timeAndActionsRowAI: {
    justifyContent: 'flex-start',
    marginLeft: 4,
  },
  timeAndActionsRowUser: {
    justifyContent: 'flex-end',
    marginRight: 4,
  },
  timestamp: {
    fontSize: 11,
    color: '#999',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  actionIcon: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listeningIndicator: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0E0E0',
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
    marginTop: 12,
  },
  listeningDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#B0B0B0',
    marginRight: 8,
  },
  listeningText: {
    fontSize: 14,
    color: '#1C1C1C',
    fontWeight: '600',
  },
  layer3_inputArea: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 9,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F5F5F5',
    borderRadius: 24,
    paddingLeft: 18,
    paddingRight: 6,
    paddingVertical: 6,
  },
  inputPlaceholder: {
    flex: 1,
    fontSize: 15,
    color: '#AAAAAA',
  },
  micBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#005DB3',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default CameraChatScreen;
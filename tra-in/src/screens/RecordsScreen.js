import React, { useState, useEffect } from "react";
import { Text, View, StyleSheet, TouchableOpacity, Alert, ActivityIndicator} from "react-native";
// import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import * as Location from 'expo-location';

const RecordsScreen = ({ setActiveTab, setActiveScreen }) => {
  const [address, setAddress] = useState('위치를 가져오는 중...');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // 위치 권한 요청
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('권한 필요', '위치 권한을 허용해주세요');
          setAddress('위치 권한이 거부되었습니다');
          setLoading(false);
          return;
        }

        let location = null;

        // 방법 1: 마지막으로 알려진 위치 먼저 시도
        try {
          location = await Location.getLastKnownPositionAsync({});
          console.log('마지막 위치:', location);
        } catch (e) {
          console.log('마지막 위치 없음');
        }

        // 방법 2: 현재 위치 가져오기 (더 긴 타임아웃)
        if (!location) {
          console.log('현재 위치 가져오는 중...');
          location = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High, // 정확도 낮춤 (더 빠름)
            maximumAge: 10000, // 10초 이내의 캐시된 위치 허용
            timeout: 15000, // 15초 타임아웃
          });
        }

        if (!location) {
          throw new Error('위치를 가져올 수 없습니다');
        }

        console.log('위치 좌표:', location.coords);

        // 역지오코딩으로 주소 변환
        let addressResponse = await Location.reverseGeocodeAsync({
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        });

        console.log('주소 응답:', addressResponse);

        if (addressResponse && addressResponse[0]) {
          const addr = addressResponse[0];
          
          // 주소 구성
          let parts = [];
          if (addr.city) parts.push(addr.city);
          if (addr.district) parts.push(addr.district);
          if (addr.street) parts.push(addr.street);
          if (addr.name) parts.push(addr.name);
          
          const formattedAddress = parts.join(' ').trim();
          
          if (formattedAddress) {
            setAddress(formattedAddress);
          } else {
            // 주소가 없으면 좌표 표시
            setAddress(`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`);
          }
        } else {
          // 역지오코딩 실패하면 좌표 표시
          setAddress(`${location.coords.latitude.toFixed(4)}, ${location.coords.longitude.toFixed(4)}`);
        }

      } catch (error) {
        console.error('위치 가져오기 에러:', error);
        Alert.alert('오류', `위치를 가져올 수 없습니다: ${error.message}`);
        setAddress('위치를 가져올 수 없습니다');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const handleCameraPress = () => {
    // 카메라 버튼을 누르면 CameraChatScreen으로 이동합니다.
    if (typeof setActiveScreen === 'function') {
      setActiveScreen('cameraChat');
    } else {
      Alert.alert('카메라', '화면 전환이 불가능합니다');
    }
  };

  return (
    <View style={styles.safeArea}>
      <ScreenHeader 
        showBackButton={false}
      />

      {/* 전체를 파란색 배경으로 */}
      <View style={styles.blueBackground}>
        {/* 타이틀 */}
        <View style={styles.titleSection}>
          <Text style={styles.titleText}>낯선 곳을 향하는 여행,</Text>
          <Text style={styles.titleText}>준비 되셨나요?</Text>
        </View>

        {/* 서브타이틀 */}
        <Text style={styles.subtitle}>AI 도슨트가 여러분을 안내합니다!</Text>

        {/* 흰색 카드가 파란색 위로 올라옴 */}
        <View style={styles.whiteCard}>
          {/* 현재 위치 */}
          <Text style={styles.locationTitle}>현재 위치</Text>
          <View style={styles.locationBox}>
            {loading ? (
              <ActivityIndicator size="small" color="#005DB3" />
            ) : (
              <Text style={styles.locationText}>{address}</Text>
            )}
          </View>

          {/* 카메라 섹션 */}
          <View style={styles.cameraSection}>
            <TouchableOpacity onPress={handleCameraPress} activeOpacity={0.7}>
              <View style={styles.cameraContainer}>
                {/* 카메라 상단 돌기 */}
                <View style={styles.cameraTop} />
                {/* 카메라 본체 */}
                <View style={styles.cameraBody}>
                  {/* 렌즈 */}
                  <View style={styles.cameraLens}>
                    <View style={styles.cameraLensInner} />
                  </View>
                </View>
              </View>
            </TouchableOpacity>
            <Text style={styles.cameraGuide}>카메라를 클릭하여 실행</Text>
          </View>
        </View>
      </View>

      <BottomNavigation activeTab="records" setActiveTab={setActiveTab} />
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#005DB3',
  },

  blueBackground: {
    flex: 1,
    backgroundColor: '#005DB3'
  },

  titleSection: {
    marginTop: 10,
    marginBottom: 36,
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 38,
  },

  subtitle: {
    color: '#FFF',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 24,
  },

  whiteCard: {
    width: '100%',
    flex: 1,
    backgroundColor: '#F3F6FB',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingTop: 100,
    paddingBottom: 48,
    paddingHorizontal: 24,
    alignItems: 'center'
  },

  locationTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationBox: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    marginBottom: 80,
    borderWidth: 1.5,
    borderColor: '#ECECEC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.16,
    shadowRadius: 12,
    elevation: 6,
    minHeight: 50,
    justifyContent: 'center',
  },
  locationText: {
    fontSize: 17,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
  },

  cameraSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cameraContainer: {
    width: 100,
    height: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  
  cameraTop: {
    width: 32,
    height: 12,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    borderBottomWidth: 0,
    position: 'absolute',
    top: 0,
    zIndex: 2,
  },
  
  cameraBody: {
    width: 80,
    height: 60,
    backgroundColor: '#FFF',
    borderWidth: 4,
    borderColor: '#000',
    borderRadius: 12,
    position: 'absolute',
    top: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cameraLens: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#000',
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  
  cameraLensInner: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#000',
  },
  
  cameraGuide: {
    fontSize: 15,
    color: '#000',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default RecordsScreen;
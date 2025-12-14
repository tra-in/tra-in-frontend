import React, { useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { screenStyles } from "../constants/screenStyles";
import { Spacing, Colors } from "../constants/theme";
import ScreenHeader from "../components/ScreenHeader";
import BottomNavigation from "../navigation/BottomNavigation";
import BadgeCard from "../components/BadgeCard";
import RegionSelector from "../components/RegionSelector";
import RegionPickerModal from "../components/RegionPickerModal";
import BadgeMenuModal from "../components/BadgeMenuModal";
import { generateDummyBadges } from "../data/dummyBadges";
import { getDisplayRegionName, getDateRangeText, getMainRegion } from "../constants/badgeConstants";

const BadgeListScreen = ({ setActiveTab, setSelectedBadge, setActiveScreen }) => {
  const [selectedRegion, setSelectedRegion] = useState("전체");
  const [showRegionPicker, setShowRegionPicker] = useState(false);
  const [showBadgeMenu, setShowBadgeMenu] = useState(false);
  const [selectedBadgeForMenu, setSelectedBadgeForMenu] = useState(null);
  const [menuPosition, setMenuPosition] = useState(null);

  // 더미 뱃지 데이터 (향후 API로 교체)
  const allBadges = generateDummyBadges();

  /**
   * 선택한 지역에 해당하는 뱃지만 필터링
   * 뱃지의 regions 배열에서 하나라도 선택한 지역에 속하면 포함
   */
  const filteredBadges = selectedRegion === "전체"
    ? allBadges
    : allBadges.filter(badge => {
        return badge.regions.some(region => {
          const mainRegion = getMainRegion(region);
          return mainRegion === selectedRegion;
        });
      });

  /**
   * 뱃지 클릭 핸들러
   * 완료된 뱃지는 완료 화면, 진행 중/미시작은 상세 화면
   */
  const handleBadgePress = (badge) => {
    setSelectedBadge(badge);
    if (badge.progress === badge.total) {
      setActiveScreen("badgeCompleted");
    } else {
      setActiveScreen("badgeDetail");
    }
  };

  /**
   * 뱃지 메뉴 버튼 클릭 (⋮)
   */
  const handleBadgeMenuPress = (badge, position) => {
    setMenuPosition(position);
    setSelectedBadgeForMenu(badge);
    setShowBadgeMenu(true);
  };

  /**
   * 뱃지 수정
   */
  const handleEditBadge = () => {
    // TODO: 뱃지 수정 화면으로 이동
    Alert.alert("뱃지 수정", `"${selectedBadgeForMenu?.title}" 수정 기능은 준비 중입니다.`);
  };

  /**
   * 뱃지 삭제
   */
  const handleDeleteBadge = () => {
    Alert.alert(
      "뱃지 삭제",
      `"${selectedBadgeForMenu?.title}" 여행을 삭제하시겠습니까?`,
      [
        { text: "취소", style: "cancel" },
        { 
          text: "삭제", 
          style: "destructive",
          onPress: () => {
            // TODO: 실제 삭제 로직 구현
            Alert.alert("삭제 완료", "여행이 삭제되었습니다.");
          }
        },
      ]
    );
  };

  return (
    <SafeAreaView style={screenStyles.container}>
      <ScreenHeader 
        showBackButton={true}
        onBackPress={() => setActiveTab("profile")}
      />

      <ScrollView
        style={screenStyles.content}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <RegionSelector 
          region={selectedRegion}
          onPress={() => setShowRegionPicker(true)}
        />

        <View style={styles.badgeGrid}>
          {filteredBadges.length > 0 ? (
            filteredBadges.map((badge) => (
              <BadgeCard 
                key={badge.id} 
                badge={badge}
                onPress={() => handleBadgePress(badge)}
                onMenuPress={(position) => handleBadgeMenuPress(badge, position)}
              />
            ))
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🧳</Text>
              <Text style={styles.emptyTitle}>아직 여행하지 않은 지역이에요</Text>
              <Text style={styles.emptyDescription}>
                {selectedRegion}에서의{'\n'}새로운 여행을 시작해보세요!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <BottomNavigation activeTab="profile" setActiveTab={setActiveTab}/>

      {/* 지역 선택 모달 */}
      <RegionPickerModal
        visible={showRegionPicker}
        selectedRegion={selectedRegion}
        onSelect={setSelectedRegion}
        onClose={() => setShowRegionPicker(false)}
      />

      {/* 뱃지 메뉴 팝업 */}
      <BadgeMenuModal
        visible={showBadgeMenu}
        position={menuPosition}
        onEdit={handleEditBadge}
        onDelete={handleDeleteBadge}
        onClose={() => setShowBadgeMenu(false)}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  emptyContainer: {
    width: "100%",
    backgroundColor: "#F3F6FB",
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
    paddingHorizontal: 30,
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 56,
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: "#1E1E22",
    marginBottom: 8,
    textAlign: "center",
    fontFamily: "System",
  },
  emptyDescription: {
    fontSize: 13,
    color: "#6B6B6B",
    textAlign: "center",
    lineHeight: 19,
    fontFamily: "System",
  },
});

export default BadgeListScreen;

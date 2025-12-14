import React, { useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { Colors, Typography, Spacing, BorderRadius } from "../constants/theme";
import {
  HomeIcon,
  HomeIconFill,
  ActivityIcon,
  ActivityIconFill,
  CalendarIcon,
  CalendarIconFill,
  ProfileIcon,
  ProfileIconFill,
} from "../components/Icons";

const BottomNavigation = ({ activeTab, setActiveTab }) => {
  const { width } = useWindowDimensions();
  const tabPositions = useRef([]);

  const tabs = [
    { id: "home", label: "홈", Icon: HomeIcon, IconFill: HomeIconFill },
    {
      id: "travel",
      label: "여행",
      Icon: ActivityIcon,
      IconFill: ActivityIconFill,
    },
    {
      id: "records",
      label: "기록",
      Icon: CalendarIcon,
      IconFill: CalendarIconFill,
    },
    {
      id: "profile",
      label: "나",
      Icon: ProfileIcon,
      IconFill: ProfileIconFill,
    },
  ];

  const getIndicatorPosition = () => {
    const tabIndex = tabs.findIndex((t) => t.id === activeTab);
    const activeTabPosition = tabPositions.current[tabIndex];

    if (!activeTabPosition) {
      const containerPaddingH = Spacing.lg;
      const availableWidth = width - containerPaddingH * 2;
      const tabWidth = availableWidth / tabs.length;
      const tabCenterX = containerPaddingH + (tabIndex + 0.5) * tabWidth;
      return tabCenterX - 35 / 2;
    }

    const indicatorWidth = 35;
    return (
      activeTabPosition.x + activeTabPosition.width / 2 - indicatorWidth / 2
    );
  };

  const handleTabLayout = (index, event) => {
    const { x, width: tabWidth } = event.nativeEvent.layout;
    tabPositions.current[index] = { x, width: tabWidth };
  };

  return (
    <View style={styles.container}>
      <View
        style={[styles.activeIndicator, { left: getIndicatorPosition() }]}
      />

      <View style={styles.navContainer}>
        {tabs.map((tab, index) => {
          const isActive = activeTab === tab.id;
          const IconComponent = isActive ? tab.IconFill : tab.Icon;

          return (
            <TouchableOpacity
              key={tab.id}
              style={styles.navItem}
              onPress={() => setActiveTab(tab.id)}
              onLayout={(event) => handleTabLayout(index, event)}
              activeOpacity={0.85}
            >
              <IconComponent
                size={24}
                color={isActive ? Colors.korailBlue : Colors.korailGray}
              />
              <Text style={[styles.label, isActive && styles.labelActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.korailSilver,
    position: "relative",
    paddingBottom: 0,
  },
  activeIndicator: {
    position: "absolute",
    top: 0,
    height: 4,
    width: 35,
    backgroundColor: Colors.korailBlue,
    borderRadius: BorderRadius.sm,
  },
  navContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start",
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  navItem: {
    alignItems: "center",
    gap: Spacing.xs,
    flex: 1,
  },
  label: {
    ...Typography.caption.semiBold,
    color: Colors.korailGray,
  },
  labelActive: {
    ...Typography.caption.bold,
    color: Colors.korailBlue,
  },
});

export default BottomNavigation;

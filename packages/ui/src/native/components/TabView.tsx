import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { colors, typography, spacing, borderRadius } from "../utils/styling";

interface Tab {
  key: string;
  title: string;
  content: React.ReactNode;
  icon?: string;
  badge?: string | number;
}

interface TabViewProps {
  tabs: Tab[];
  initialTab?: string;
  onTabChange?: (tabKey: string) => void;
  style?: any;
  scrollable?: boolean;
}

export const TabView: React.FC<TabViewProps> = ({
  tabs,
  initialTab,
  onTabChange,
  style,
  scrollable = false,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab || tabs[0]?.key);

  const handleTabPress = (tabKey: string) => {
    setActiveTab(tabKey);
    onTabChange?.(tabKey);
  };

  const activeTabContent = tabs.find(tab => tab.key === activeTab)?.content;

  const TabButton = ({ tab }: { tab: Tab }) => (
    <TouchableOpacity
      style={[
        styles.tabButton,
        activeTab === tab.key && styles.activeTabButton,
      ]}
      onPress={() => handleTabPress(tab.key)}
    >
      <View style={styles.tabContent}>
        {tab.icon && (
          <Text style={styles.tabIcon}>{tab.icon}</Text>
        )}
        <Text
          style={[
            styles.tabTitle,
            activeTab === tab.key && styles.activeTabTitle,
          ]}
        >
          {tab.title}
        </Text>
        {tab.badge && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{tab.badge}</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, style]}>
      {/* Tab Bar */}
      <View style={styles.tabBar}>
        {scrollable ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.scrollableTabBar}
            contentContainerStyle={styles.scrollableTabContent}
          >
            {tabs.map((tab) => (
              <TabButton key={tab.key} tab={tab} />
            ))}
          </ScrollView>
        ) : (
          <View style={styles.fixedTabBar}>
            {tabs.map((tab) => (
              <TabButton key={tab.key} tab={tab} />
            ))}
          </View>
        )}
      </View>

      {/* Tab Content */}
      <View style={styles.contentContainer}>
        {activeTabContent}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  
  tabBar: {
    borderBottomWidth: 1,
    borderBottomColor: colors.gray[200],
  },
  
  scrollableTabBar: {
    flexGrow: 0,
  },
  
  scrollableTabContent: {
    paddingHorizontal: spacing[2],
  },
  
  fixedTabBar: {
    flexDirection: "row",
  },
  
  tabButton: {
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  
  activeTabButton: {
    borderBottomColor: colors.primary[500],
  },
  
  tabContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing[2],
  },
  
  tabIcon: {
    fontSize: 16,
  },
  
  tabTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.medium,
    color: colors.gray[600],
  },
  
  activeTabTitle: {
    color: colors.primary[600],
  },
  
  badge: {
    backgroundColor: colors.error[500],
    borderRadius: borderRadius.full,
    paddingHorizontal: spacing[2],
    paddingVertical: spacing[1],
    minWidth: 20,
    alignItems: "center",
  },
  
  badgeText: {
    fontSize: typography.fontSize.xs,
    color: "#ffffff",
    fontWeight: typography.fontWeight.medium,
  },
  
  contentContainer: {
    flex: 1,
    padding: spacing[4],
  },
});

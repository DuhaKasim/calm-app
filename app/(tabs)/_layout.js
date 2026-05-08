import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import { AppProvider } from "../../context/AppContext";

function TabBarIcon({ name, color, size }) {
  return <Ionicons name={name} size={size ?? 22} color={color} />;
}

export default function TabLayout() {
  return (
    <AppProvider>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: "#2D2D2D",
          tabBarInactiveTintColor: "#999",
          tabBarShowLabel: false,
          tabBarStyle: {
            backgroundColor: "#fff",
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 60,
            borderRadius: 40,
            marginHorizontal: 40,
            marginBottom: 16,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            // pill shadow
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.08,
            shadowRadius: 12,
          },
          tabBarItemStyle: {
            paddingVertical: 8,
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="home-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="notifications"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="notifications-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="upload"
          options={{
            tabBarIcon: ({ color }) => (
              <View style={styles.uploadBtn}>
                <TabBarIcon name="add-outline" color={color} size={24} />
              </View>
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="person-outline" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="settings-outline" color={color} />
            ),
          }}
        />
        {/* Hide feed from tab bar — navigated to programmatically */}
        <Tabs.Screen name="feed" options={{ href: null }} />
      </Tabs>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  uploadBtn: {
    width: 36,
    height: 36,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: "#2D2D2D",
    alignItems: "center",
    justifyContent: "center",
  },
});

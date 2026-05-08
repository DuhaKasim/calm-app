import { Ionicons } from "@expo/vector-icons";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_NOTIFICATIONS } from "../../constants/mockData";
import { useAppContext } from "../../context/AppContext";

function NotificationIcon({ type }) {
  const icons = {
    like: { name: "heart", color: "#E53935" },
    comment: { name: "chatbubble", color: "#7CC83A" },
    follow: { name: "person-add", color: "#7CC83A" },
  };
  const { name, color } = icons[type] || {
    name: "notifications",
    color: "#7CC83A",
  };
  return (
    <View style={[styles.notifIcon, { backgroundColor: color }]}>
      <Ionicons name={name} size={16} color="#fff" />
    </View>
  );
}

export default function NotificationsScreen() {
  const { fontSize, fontFamily } = useAppContext();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Title */}
        <Text style={styles.title}>Notifications</Text>
        <Text style={styles.subtitle}>
          Batched updates • no real time alerts
        </Text>

        {/* Info banner */}
        <View style={styles.infoBanner}>
          <Text
            style={[
              styles.infoBannerTitle,
              { fontSize: fontSize + 1, fontFamily },
            ]}
          >
            Calm Notifications
          </Text>
          <Text style={[styles.infoBannerBody, { fontSize, fontFamily }]}>
            Notifications are batched and delivered at set times. You're in
            control of when you see them.
          </Text>
        </View>

        {/* Notification items */}
        {MOCK_NOTIFICATIONS.map((notif) => (
          <TouchableOpacity
            key={notif.id}
            style={styles.notifCard}
            activeOpacity={0.7}
          >
            <NotificationIcon type={notif.type} />
            <View style={styles.notifContent}>
              <Text style={[styles.notifText, { fontSize, fontFamily }]}>
                <Text style={styles.notifUser}>{notif.user}</Text>{" "}
                {notif.action}
              </Text>
              {notif.preview && (
                <Text style={[styles.notifPreview, { fontSize: fontSize - 1 }]}>
                  {notif.preview}
                </Text>
              )}
              <Text style={styles.notifTime}>{notif.time}</Text>
            </View>
            {notif.unread && <View style={styles.unreadDot} />}
          </TouchableOpacity>
        ))}

        {/* Settings card */}
        <View style={styles.settingsCard}>
          <Text
            style={[
              styles.settingsTitle,
              { fontSize: fontSize + 1, fontFamily },
            ]}
          >
            Notification settings
          </Text>
          <Text style={[styles.settingsSubtitle, { fontSize: fontSize - 1 }]}>
            Control when and how you receive notifications
          </Text>
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsKey, { fontSize, fontFamily }]}>
              Delivery schedule
            </Text>
            <Text style={[styles.settingsValue, { fontSize }]}>
              9am, 2pm, 6pm
            </Text>
          </View>
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsKey, { fontSize, fontFamily }]}>
              Batch notifications
            </Text>
            <Text style={[styles.settingsValueGreen, { fontSize }]}>
              Enabled
            </Text>
          </View>
          <View style={styles.settingsRow}>
            <Text style={[styles.settingsKey, { fontSize, fontFamily }]}>
              Real-time pings
            </Text>
            <Text style={[styles.settingsValueRed, { fontSize }]}>
              Disabled
            </Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 20,
  },
  infoBanner: {
    backgroundColor: "#F5F5F5",
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  infoBannerTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 6,
  },
  infoBannerBody: {
    fontSize: 13,
    color: "#666",
    textAlign: "center",
    lineHeight: 19,
  },
  notifCard: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    padding: 14,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  notifIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  notifContent: { flex: 1 },
  notifText: {
    fontSize: 14,
    color: "#1A1A1A",
    marginBottom: 2,
  },
  notifUser: {
    fontWeight: "600",
  },
  notifPreview: {
    fontSize: 12,
    color: "#888",
    fontStyle: "italic",
    marginBottom: 2,
  },
  notifTime: {
    fontSize: 11,
    color: "#bbb",
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#7CC83A",
    marginLeft: 8,
  },
  settingsCard: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 14,
    padding: 16,
    marginTop: 6,
  },
  settingsTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
    textAlign: "center",
  },
  settingsSubtitle: {
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    marginBottom: 14,
  },
  settingsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  settingsKey: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  settingsValue: {
    fontSize: 13,
    color: "#666",
  },
  settingsValueGreen: {
    fontSize: 13,
    color: "#7CC83A",
    fontWeight: "500",
  },
  settingsValueRed: {
    fontSize: 13,
    color: "#E53935",
    fontWeight: "500",
  },
});

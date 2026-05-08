import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_SESSIONS } from "../../constants/mockData";
import { useAppContext } from "../../context/AppContext";

function StatBox({ value, label }) {
  return (
    <View style={styles.statBox}>
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const {
    fontSize,
    fontFamily,
    dyslexiaMode,
    textSize,
    autoCaptions,
    playbackSpeed,
  } = useAppContext();

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Profile</Text>

        {/* Profile card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={32} color="#aaa" />
          </View>
          <Text
            style={[styles.profileName, { fontSize: fontSize + 4, fontFamily }]}
          >
            Fatima Hafiz
          </Text>
          <Text style={styles.profileHandle}>@fatimahafiz</Text>

          <View style={styles.statsRow}>
            <StatBox value="42" label="Posts" />
            <StatBox value="1248" label="Followers" />
            <StatBox value="327" label="Following" />
          </View>
        </View>

        {/* Accessibility preferences */}
        <View style={styles.card}>
          <Text
            style={[styles.cardTitle, { fontSize: fontSize + 1, fontFamily }]}
          >
            Your Accessibility Preferences
          </Text>

          <View style={styles.prefRow}>
            <Text style={[styles.prefKey, { fontSize, fontFamily }]}>
              Dyslexia-friendly mode
            </Text>
            <Text
              style={[
                styles.prefValue,
                dyslexiaMode ? styles.prefValueGreen : styles.prefValueRed,
                { fontSize },
              ]}
            >
              {dyslexiaMode ? "On" : "Off"}
            </Text>
          </View>

          <View style={styles.prefRow}>
            <Text style={[styles.prefKey, { fontSize, fontFamily }]}>
              Text size
            </Text>
            <Text style={[styles.prefValue, { fontSize }]}>
              {textSize.charAt(0).toUpperCase() + textSize.slice(1)}
            </Text>
          </View>

          <View style={styles.prefRow}>
            <Text style={[styles.prefKey, { fontSize, fontFamily }]}>
              Auto captions
            </Text>
            <Text
              style={[
                styles.prefValue,
                autoCaptions ? styles.prefValueGreen : styles.prefValueRed,
                { fontSize },
              ]}
            >
              {autoCaptions ? "On" : "Off"}
            </Text>
          </View>

          <View style={styles.prefRow}>
            <Text style={[styles.prefKey, { fontSize, fontFamily }]}>
              Playback speed
            </Text>
            <Text style={[styles.prefValue, { fontSize }]}>
              {playbackSpeed}x
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editBtn}
            onPress={() => router.push("/settings")}
            activeOpacity={0.7}
          >
            <Text style={[styles.editBtnText, { fontSize }]}>
              Edit preferences
            </Text>
          </TouchableOpacity>
        </View>

        {/* Recent sessions */}
        <View style={styles.card}>
          <Text
            style={[styles.cardTitle, { fontSize: fontSize + 1, fontFamily }]}
          >
            Recent sessions
          </Text>
          {MOCK_SESSIONS.map((session, index) => (
            <View key={index}>
              <View style={styles.sessionRow}>
                <View>
                  <Text style={[styles.sessionDate, { fontSize, fontFamily }]}>
                    {session.date}
                  </Text>
                  <Text
                    style={[
                      styles.sessionIntention,
                      { fontSize: fontSize - 1 },
                    ]}
                  >
                    {session.intention}
                  </Text>
                </View>
                <View style={{ alignItems: "flex-end" }}>
                  <Text style={[styles.sessionDuration, { fontSize }]}>
                    {session.duration}
                  </Text>
                  <Text
                    style={[styles.sessionPosts, { fontSize: fontSize - 1 }]}
                  >
                    {session.posts} posts
                  </Text>
                </View>
              </View>
              {index < MOCK_SESSIONS.length - 1 && (
                <View style={styles.divider} />
              )}
            </View>
          ))}
        </View>

        {/* Posts grid */}
        <View style={styles.card}>
          <Text
            style={[styles.cardTitle, { fontSize: fontSize + 1, fontFamily }]}
          >
            Your posts
          </Text>
          <View style={styles.postsGrid}>
            {Array.from({ length: 8 }).map((_, i) => (
              <View key={i} style={styles.postThumb} />
            ))}
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
    marginBottom: 16,
  },
  profileCard: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginBottom: 14,
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  profileHandle: {
    fontSize: 13,
    color: "#999",
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
  },
  statBox: {
    borderWidth: 1,
    borderColor: "#E8E8E8",
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: "center",
  },
  statValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#7CC83A",
  },
  statLabel: {
    fontSize: 11,
    color: "#888",
    marginTop: 2,
  },
  card: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 14,
    textAlign: "center",
  },
  prefRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#F5F5F5",
  },
  prefKey: {
    fontSize: 13,
    color: "#1A1A1A",
  },
  prefValue: {
    fontSize: 13,
    color: "#666",
  },
  prefValueGreen: {
    color: "#7CC83A",
    fontWeight: "500",
  },
  prefValueRed: {
    color: "#E53935",
    fontWeight: "500",
  },
  editBtn: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 12,
  },
  editBtnText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  sessionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  sessionDate: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  sessionIntention: {
    fontSize: 12,
    color: "#888",
  },
  sessionDuration: {
    fontSize: 13,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  sessionPosts: {
    fontSize: 12,
    color: "#888",
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
  },
  postsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  postThumb: {
    width: "22%",
    aspectRatio: 1,
    backgroundColor: "#E8E8E8",
    borderRadius: 10,
  },
});

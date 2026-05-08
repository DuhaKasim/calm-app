import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import * as Speech from "expo-speech";
import { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_POSTS } from "../../../constants/mockData";
import { useAppContext } from "../../../context/AppContext";

function Avatar({ name }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();
  const colors = ["#B5D5F5", "#C8E6C9", "#F8BBD0", "#D1C4E9", "#FFE0B2"];
  const color = colors[name.charCodeAt(0) % colors.length];
  return (
    <View style={[styles.avatar, { backgroundColor: color }]}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

const SPEED_OPTIONS = [0.5, 0.75, 1, 1.25];

export default function PostDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { fontSize, fontFamily, playbackSpeed, setPlaybackSpeed, readAloud } =
    useAppContext();

  const post = MOCK_POSTS.find((p) => p.id === id) ?? MOCK_POSTS[0];

  const [isReading, setIsReading] = useState(false);
  const [selectedSpeed, setSelectedSpeed] = useState(playbackSpeed);
  const [videoSpeed, setVideoSpeed] = useState(playbackSpeed);
  const [liked, setLiked] = useState(false);

  // Stop speech when leaving screen
  useEffect(() => {
    return () => {
      Speech.stop();
    };
  }, []);

  async function handleReadAloud() {
    if (isReading) {
      await Speech.stop();
      setIsReading(false);
      return;
    }

    const textToRead = `Post by ${post.user.name}. ${post.content}`;
    setIsReading(true);

    Speech.speak(textToRead, {
      language: "en-GB",
      rate: selectedSpeed,
      onDone: () => setIsReading(false),
      onError: () => {
        setIsReading(false);
        Alert.alert(
          "Read Aloud",
          "Could not read this post aloud on your device.",
        );
      },
    });
  }

  function handleSpeedChange(speed) {
    setSelectedSpeed(speed);
    setPlaybackSpeed(speed);
    // If currently reading, restart at new speed
    if (isReading) {
      Speech.stop();
      const textToRead = `Post by ${post.user.name}. ${post.content}`;
      Speech.speak(textToRead, {
        language: "en-GB",
        rate: speed,
        onDone: () => setIsReading(false),
        onError: () => setIsReading(false),
      });
    }
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => {
            Speech.stop();
            router.back();
          }}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Post</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        {/* Post card */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Avatar name={post.user.name} />
            <View style={styles.cardHeaderText}>
              <Text
                style={[
                  styles.userName,
                  { fontSize: fontSize + 1, fontFamily },
                ]}
              >
                {post.user.name}
              </Text>
              <Text style={styles.userHandle}>{post.user.handle}</Text>
            </View>
            <Text style={styles.timeText}>{post.time}</Text>
          </View>

          {post.hasVideo && (
            <View style={styles.videoPlaceholder}>
              <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
                <Ionicons name="play" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.videoSpeedBadge}>{videoSpeed}x</Text>
            </View>
          )}

          <View style={styles.contentBox}>
            <Text
              style={[
                styles.contentText,
                { fontSize, fontFamily, lineHeight: fontSize * 1.6 },
              ]}
            >
              {post.content}
            </Text>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.actionBtn}
              onPress={() => setLiked((prev) => !prev)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={liked ? "heart" : "heart-outline"}
                size={20}
                color={liked ? "#E53935" : "#666"}
              />
              <Text style={styles.actionCount}>
                {post.likes + (liked ? 1 : 0)}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <Ionicons name="chatbubble-outline" size={20} color="#666" />
              <Text style={styles.actionCount}>{post.comments}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Accessibility controls */}
        <View style={styles.controlCard}>
          <Text style={styles.controlTitle}>Accessibility controls</Text>

          {/* Read aloud button */}
          <TouchableOpacity
            style={[
              styles.readAloudBtn,
              isReading && styles.readAloudBtnActive,
            ]}
            onPress={handleReadAloud}
            activeOpacity={0.8}
          >
            <Ionicons
              name={isReading ? "stop-circle" : "volume-high"}
              size={18}
              color="#fff"
              style={{ marginRight: 8 }}
            />
            <Text style={styles.readAloudText}>
              {isReading ? "Stop reading" : "Read Aloud"}
            </Text>
          </TouchableOpacity>

          {/* Playback speed for speech */}
          <Text style={styles.controlSubLabel}>Playback Speed</Text>
          <View style={styles.speedRow}>
            {SPEED_OPTIONS.map((speed) => (
              <TouchableOpacity
                key={speed}
                style={[
                  styles.speedBtn,
                  selectedSpeed === speed && styles.speedBtnActive,
                ]}
                onPress={() => handleSpeedChange(speed)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.speedBtnText,
                    selectedSpeed === speed && styles.speedBtnTextActive,
                  ]}
                >
                  {speed}x
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Video controls — only shown if post has video */}
        {post.hasVideo && (
          <View style={styles.controlCard}>
            <Text style={styles.controlTitle}>Video controls</Text>

            <View style={styles.videoThumbSmall}>
              <TouchableOpacity style={styles.playBtnSmall} activeOpacity={0.8}>
                <Ionicons name="play" size={18} color="#fff" />
              </TouchableOpacity>
            </View>

            <Text style={styles.controlSubLabel}>Video speed</Text>
            <View style={styles.speedRow}>
              {SPEED_OPTIONS.map((speed) => (
                <TouchableOpacity
                  key={speed}
                  style={[
                    styles.speedBtn,
                    videoSpeed === speed && styles.speedBtnActive,
                  ]}
                  onPress={() => setVideoSpeed(speed)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.speedBtnText,
                      videoSpeed === speed && styles.speedBtnTextActive,
                    ]}
                  >
                    {speed}x
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Caption area */}
            <View style={styles.captionArea}>
              <Text
                style={[
                  styles.captionText,
                  { fontSize: fontSize - 1, fontFamily },
                ]}
              >
                {post.content}
              </Text>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 10,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  container: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    padding: 14,
    marginBottom: 14,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#444",
  },
  cardHeaderText: { flex: 1 },
  userName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  userHandle: {
    fontSize: 12,
    color: "#999",
  },
  timeText: {
    fontSize: 11,
    color: "#bbb",
  },
  videoPlaceholder: {
    height: 150,
    backgroundColor: "#E8F5E9",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    position: "relative",
  },
  playBtn: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#7CC83A",
    alignItems: "center",
    justifyContent: "center",
  },
  videoSpeedBadge: {
    position: "absolute",
    bottom: 8,
    right: 10,
    fontSize: 11,
    color: "#555",
    backgroundColor: "rgba(255,255,255,0.8)",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  contentBox: {
    backgroundColor: "#F8F8F8",
    borderRadius: 10,
    padding: 12,
    marginBottom: 10,
  },
  contentText: {
    fontSize: 14,
    color: "#2D2D2D",
    lineHeight: 22,
  },
  actions: {
    flexDirection: "row",
    gap: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  actionCount: {
    fontSize: 12,
    color: "#888",
  },
  controlCard: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
  },
  controlTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 14,
  },
  readAloudBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#7CC83A",
    borderRadius: 30,
    paddingVertical: 12,
    marginBottom: 14,
  },
  readAloudBtnActive: {
    backgroundColor: "#E53935",
  },
  readAloudText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 15,
  },
  controlSubLabel: {
    fontSize: 13,
    color: "#888",
    marginBottom: 10,
  },
  speedRow: {
    flexDirection: "row",
    gap: 8,
  },
  speedBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 50,
    paddingVertical: 8,
    alignItems: "center",
  },
  speedBtnActive: {
    borderColor: "#2D2D2D",
    backgroundColor: "#F5F5F5",
  },
  speedBtnText: {
    fontSize: 12,
    color: "#888",
  },
  speedBtnTextActive: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
  videoThumbSmall: {
    height: 90,
    backgroundColor: "#E8F5E9",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  playBtnSmall: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#7CC83A",
    alignItems: "center",
    justifyContent: "center",
  },
  captionArea: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
  },
  captionText: {
    fontSize: 12,
    color: "#555",
    lineHeight: 18,
  },
});

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { MOCK_POSTS } from "../../constants/mockData";
import { useAppContext } from "../../context/AppContext";

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

function PostCard({
  post,
  onLike,
  liked,
  fontSize,
  fontFamily,
  readAloud,
  onPress,
}) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={onPress}
      activeOpacity={0.85}
    >
      {/* Header */}
      <View style={styles.cardHeader}>
        <Avatar name={post.user.name} />
        <View style={styles.cardHeaderText}>
          <Text
            style={[styles.userName, { fontSize: fontSize + 1, fontFamily }]}
          >
            {post.user.name}
          </Text>
          <Text style={styles.userHandle}>{post.user.handle}</Text>
        </View>
        <Text style={styles.timeText}>{post.time}</Text>
      </View>

      {/* Video placeholder */}
      {post.hasVideo && (
        <View style={styles.videoPlaceholder}>
          <TouchableOpacity style={styles.playBtn} activeOpacity={0.8}>
            <Ionicons name="play" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      )}

      {/* Content */}
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

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity
          style={styles.actionBtn}
          onPress={() => onLike(post.id)}
          activeOpacity={0.7}
        >
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={20}
            color={liked ? "#E53935" : "#666"}
          />
          <Text style={styles.actionCount}>{post.likes + (liked ? 1 : 0)}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
          <Ionicons name="chatbubble-outline" size={20} color="#666" />
          <Text style={styles.actionCount}>{post.comments}</Text>
        </TouchableOpacity>

        {readAloud && (
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <Ionicons name="volume-medium-outline" size={20} color="#666" />
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

export default function FeedScreen() {
  const router = useRouter();
  const { currentSession, fontSize, fontFamily, readAloud } = useAppContext();
  const [likedPosts, setLikedPosts] = useState({});
  const [showEndModal, setShowEndModal] = useState(false);

  const postCount = currentSession?.postCount ?? 10;
  const tag = currentSession?.tag ?? "browsing";

  // Filter posts by session tag, take postCount
  const sessionPosts = useMemo(() => {
    const filtered = MOCK_POSTS.filter((p) => p.tag === tag);
    // Pad with any posts if not enough
    const all =
      filtered.length >= postCount
        ? filtered
        : [...filtered, ...MOCK_POSTS.filter((p) => p.tag !== tag)];
    return all.slice(0, postCount);
  }, [tag, postCount]);

  const [currentIndex, setCurrentIndex] = useState(0);

  const visiblePosts = sessionPosts.slice(0, currentIndex + 1);
  const progress = (currentIndex + 1) / postCount;
  const isLast = currentIndex + 1 >= postCount;

  function handleScroll(event) {
    const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
    const isAtBottom =
      layoutMeasurement.height + contentOffset.y >= contentSize.height - 40;
    if (isAtBottom && !isLast) {
      setCurrentIndex((prev) => Math.min(prev + 1, postCount - 1));
    }
    if (isAtBottom && isLast) {
      setShowEndModal(true);
    }
  }

  function handleLike(id) {
    setLikedPosts((prev) => ({ ...prev, [id]: !prev[id] }));
  }

  if (!currentSession) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.noSession}>
          <Text style={styles.noSessionText}>No active session.</Text>
          <TouchableOpacity
            onPress={() => router.push("/")}
            style={styles.goBackBtn}
          >
            <Text style={styles.goBackText}>Start a session</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={22} color="#1A1A1A" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Your Feed</Text>
        <Text style={styles.headerCount}>
          {Math.min(currentIndex + 1, postCount)} of {postCount} posts
        </Text>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress * 100}%` }]} />
      </View>

      {/* Session label */}
      <View style={styles.sessionLabel}>
        <View style={styles.sessionDot} />
        <Text style={styles.sessionLabelText}>
          {currentSession.intention} • {currentSession.duration} session
        </Text>
      </View>

      {/* Posts */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        onScroll={handleScroll}
        scrollEventThrottle={200}
        showsVerticalScrollIndicator={false}
      >
        {visiblePosts.map((post) => (
          <PostCard
            key={post.id}
            post={post}
            liked={!!likedPosts[post.id]}
            onLike={handleLike}
            fontSize={fontSize}
            fontFamily={fontFamily}
            readAloud={readAloud}
            onPress={() => router.push(`/post/${post.id}`)}
          />
        ))}

        {isLast && (
          <View style={styles.endCard}>
            <Ionicons
              name="checkmark-circle-outline"
              size={36}
              color="#7CC83A"
            />
            <Text style={styles.endTitle}>You've reached the end!</Text>
            <Text style={styles.endSub}>
              You've viewed all {postCount} posts for this session.
            </Text>
            <TouchableOpacity
              style={styles.newSessionBtn}
              onPress={() => router.push("/")}
              activeOpacity={0.8}
            >
              <Text style={styles.newSessionText}>Start a new session</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Session end modal */}
      <Modal visible={showEndModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Ionicons
              name="leaf"
              size={32}
              color="#7CC83A"
              style={{ marginBottom: 12 }}
            />
            <Text style={styles.modalTitle}>Session complete 🎉</Text>
            <Text style={styles.modalSub}>
              You've browsed mindfully for your {currentSession.duration}{" "}
              session.
            </Text>
            <TouchableOpacity
              style={styles.modalBtn}
              onPress={() => {
                setShowEndModal(false);
                router.push("/");
              }}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnText}>Start a new session</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.modalBtnSecondary}
              onPress={() => setShowEndModal(false)}
              activeOpacity={0.8}
            >
              <Text style={styles.modalBtnSecondaryText}>Keep reading</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
    paddingBottom: 8,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: "#1A1A1A",
  },
  headerCount: {
    fontSize: 13,
    color: "#888",
  },
  progressTrack: {
    height: 5,
    backgroundColor: "#E8E8E8",
    marginHorizontal: 20,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#7CC83A",
    borderRadius: 3,
  },
  sessionLabel: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  sessionDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#7CC83A",
    marginRight: 6,
  },
  sessionLabelText: {
    fontSize: 12,
    color: "#666",
  },
  scroll: { flex: 1 },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
    marginBottom: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 1,
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
    height: 160,
    backgroundColor: "#E8E8E8",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  playBtn: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#7CC83A",
    alignItems: "center",
    justifyContent: "center",
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
    lineHeight: 21,
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
  endCard: {
    alignItems: "center",
    padding: 28,
    marginTop: 8,
  },
  endTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginTop: 10,
    marginBottom: 6,
  },
  endSub: {
    fontSize: 14,
    color: "#888",
    textAlign: "center",
    marginBottom: 20,
  },
  newSessionBtn: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  newSessionText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  noSession: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  noSessionText: { fontSize: 16, color: "#888", marginBottom: 16 },
  goBackBtn: {
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  goBackText: { fontSize: 14, fontWeight: "500", color: "#1A1A1A" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  modalBox: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 28,
    marginHorizontal: 32,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },
  modalSub: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  modalBtn: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: "center",
    marginBottom: 10,
  },
  modalBtnText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
  },
  modalBtnSecondary: {
    paddingVertical: 8,
  },
  modalBtnSecondaryText: {
    fontSize: 13,
    color: "#999",
  },
});

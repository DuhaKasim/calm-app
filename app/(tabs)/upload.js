import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";

export default function UploadScreen() {
  const { fontSize, fontFamily } = useAppContext();
  const [caption, setCaption] = useState("");
  const [video, setVideo] = useState(null);
  const [checking, setChecking] = useState(false);

  async function handleVideoSelect() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library to select a video.",
      );
      return;
    }

    setChecking(true);

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });

    setChecking(false);

    if (result.canceled) return;

    const asset = result.assets[0];
    // expo-image-picker returns duration in milliseconds
    const durationSeconds = asset.duration ? asset.duration / 1000 : 0;

    if (durationSeconds < 10) {
      Alert.alert(
        "Video too short",
        `Your video is ${Math.round(durationSeconds)} second${Math.round(durationSeconds) === 1 ? "" : "s"} long. Please select a video that is at least 10 seconds.`,
        [{ text: "OK" }],
      );
      return;
    }

    setVideo({ uri: asset.uri, duration: durationSeconds });
  }

  function formatDuration(seconds) {
    const m = Math.floor(seconds / 60);
    const s = Math.round(seconds % 60);
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  }

  function handlePost() {
    if (!video && !caption.trim()) {
      Alert.alert(
        "Nothing to post",
        "Please select a video or write a caption.",
      );
      return;
    }
    Alert.alert("Posted!", "Your post has been shared.", [
      {
        text: "Great",
        onPress: () => {
          setCaption("");
          setVideo(null);
        },
      },
    ]);
  }

  const canPost = !!video || caption.trim().length > 0;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>Upload</Text>

        <TouchableOpacity
          style={[styles.videoPicker, video && styles.videoPickerSelected]}
          onPress={handleVideoSelect}
          activeOpacity={0.7}
          disabled={checking}
        >
          {checking ? (
            <ActivityIndicator size="large" color="#7CC83A" />
          ) : video ? (
            <>
              <View style={styles.playBtn}>
                <Ionicons name="play" size={28} color="#fff" />
              </View>
              <Text style={[styles.videoSelectedText, { fontSize }]}>
                Video selected ✓
              </Text>
              <Text style={styles.videoHint}>
                Duration: {formatDuration(video.duration)} • Tap to change
              </Text>
            </>
          ) : (
            <>
              <View style={styles.uploadIcon}>
                <Ionicons
                  name="cloud-upload-outline"
                  size={28}
                  color="#7CC83A"
                />
              </View>
              <Text style={[styles.videoPickerText, { fontSize, fontFamily }]}>
                Tap to select a video
              </Text>
              <Text style={styles.videoHint}>Minimum 10 seconds</Text>
            </>
          )}
        </TouchableOpacity>

        {video && (
          <View style={styles.validRow}>
            <Ionicons name="checkmark-circle" size={16} color="#7CC83A" />
            <Text style={styles.validText}>
              {formatDuration(video.duration)} — meets minimum length
              requirement
            </Text>
          </View>
        )}

        <View style={styles.captionBox}>
          <Text
            style={[
              styles.captionLabel,
              { fontSize: fontSize + 1, fontFamily },
            ]}
          >
            Caption
          </Text>
          <TextInput
            style={[styles.captionInput, { fontSize, fontFamily }]}
            placeholder="Share your thoughts..."
            placeholderTextColor="#bbb"
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={500}
          />
          <Text style={styles.charCount}>{caption.length}/500</Text>
        </View>

        <View style={styles.accessNote}>
          <Ionicons
            name="information-circle-outline"
            size={16}
            color="#7CC83A"
          />
          <Text style={[styles.accessNoteText, { fontSize: fontSize - 1 }]}>
            Auto-captions will be generated for your video to improve
            accessibility.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.postBtn, !canPost && styles.postBtnDisabled]}
          onPress={handlePost}
          activeOpacity={canPost ? 0.8 : 1}
        >
          <Text style={[styles.postBtnText, { fontSize }]}>Post</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: { paddingHorizontal: 20, paddingTop: 20 },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
    marginBottom: 20,
  },
  videoPicker: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderStyle: "dashed",
    borderRadius: 16,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    backgroundColor: "#FAFAFA",
  },
  videoPickerSelected: {
    borderStyle: "solid",
    borderColor: "#7CC83A",
    backgroundColor: "#F0F7E6",
  },
  uploadIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#E8F5E9",
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
    marginBottom: 10,
  },
  videoPickerText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 4,
  },
  videoSelectedText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#7CC83A",
    marginBottom: 4,
  },
  videoHint: { fontSize: 12, color: "#aaa" },
  validRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  validText: { fontSize: 12, color: "#7CC83A" },
  captionBox: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 16,
    padding: 14,
    marginBottom: 14,
    backgroundColor: "#FAFAFA",
  },
  captionLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  captionInput: {
    fontSize: 14,
    color: "#1A1A1A",
    minHeight: 90,
    textAlignVertical: "top",
    lineHeight: 21,
  },
  charCount: { fontSize: 11, color: "#ccc", textAlign: "right", marginTop: 6 },
  accessNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    backgroundColor: "#F0F7E6",
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
  },
  accessNoteText: { flex: 1, fontSize: 12, color: "#555", lineHeight: 17 },
  postBtn: {
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  postBtnDisabled: { opacity: 0.45 },
  postBtnText: { fontSize: 15, fontWeight: "500", color: "#1A1A1A" },
});

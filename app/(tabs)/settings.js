import { Ionicons } from "@expo/vector-icons";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppContext } from "../../context/AppContext";

function SettingRow({ title, description, children }) {
  return (
    <View style={styles.settingRow}>
      <View style={styles.settingInfo}>
        <Text style={styles.settingTitle}>{title}</Text>
        {description ? (
          <Text style={styles.settingDesc}>{description}</Text>
        ) : null}
      </View>
      <View style={styles.settingControl}>{children}</View>
    </View>
  );
}

function ToggleRow({ title, description, value, onValueChange }) {
  return (
    <SettingRow title={title} description={description}>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: "#E0E0E0", true: "#7CC83A" }}
        thumbColor="#fff"
      />
    </SettingRow>
  );
}

export default function SettingsScreen() {
  const {
    dyslexiaMode,
    setDyslexiaMode,
    textSize,
    setTextSize,
    readAloud,
    setReadAloud,
    autoCaptions,
    setAutoCaptions,
    reduceMotion,
    setReduceMotion,
    playbackSpeed,
    setPlaybackSpeed,
    visualSafetyFilter,
    setVisualSafetyFilter,
    fontSize,
    fontFamily,
  } = useAppContext();

  const speedOptions = [0.5, 1.0, 1.75];
  const textSizeOptions = ["small", "medium", "large"];

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.container}
      >
        <Text style={styles.title}>Settings</Text>

        {/* Profile icon */}
        <View style={styles.avatarRow}>
          <View style={styles.avatarCircle}>
            <Ionicons name="person" size={22} color="#aaa" />
          </View>
        </View>

        {/* Dyslexia mode */}
        <View style={styles.card}>
          <ToggleRow
            title="Dyslexia-friendly mode"
            description="Uses OpenDyslexia font; increased letter spacing, and muted background colours."
            value={dyslexiaMode}
            onValueChange={setDyslexiaMode}
          />
        </View>

        {/* Text size */}
        <View style={styles.card}>
          <Text style={[styles.settingTitle, { marginBottom: 12 }]}>
            Text size
          </Text>
          <View style={styles.segmentRow}>
            {textSizeOptions.map((size) => (
              <TouchableOpacity
                key={size}
                style={[
                  styles.segmentBtn,
                  textSize === size && styles.segmentBtnActive,
                ]}
                onPress={() => setTextSize(size)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.segmentText,
                    textSize === size && styles.segmentTextActive,
                  ]}
                >
                  {size.charAt(0).toUpperCase() + size.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Read aloud */}
        <View style={styles.card}>
          <ToggleRow
            title="Read aloud button"
            description="Shows a button on posts to read content out loud."
            value={readAloud}
            onValueChange={setReadAloud}
          />
        </View>

        {/* Auto captions */}
        <View style={styles.card}>
          <ToggleRow
            title="Auto Captions"
            description="Automatically shows captions for video content."
            value={autoCaptions}
            onValueChange={setAutoCaptions}
          />
        </View>

        {/* Reduce motion */}
        <View style={styles.card}>
          <ToggleRow
            title="Reduce Motion"
            description="Minimises animations and transitions."
            value={reduceMotion}
            onValueChange={setReduceMotion}
          />
        </View>

        {/* Playback speed */}
        <View style={styles.card}>
          <Text style={styles.settingTitle}>Playback speed</Text>
          <View style={styles.speedRow}>
            {speedOptions.map((speed) => (
              <Text key={speed} style={styles.speedLabel}>
                {speed}x
              </Text>
            ))}
          </View>
          <View style={styles.sliderTrack}>
            {speedOptions.map((speed, index) => {
              const active = playbackSpeed >= speed;
              return (
                <React.Fragment key={speed}>
                  <TouchableOpacity
                    style={[styles.sliderDot, active && styles.sliderDotActive]}
                    onPress={() => setPlaybackSpeed(speed)}
                    activeOpacity={0.7}
                  />
                  {index < speedOptions.length - 1 && (
                    <View
                      style={[
                        styles.sliderLine,
                        playbackSpeed > speed && styles.sliderLineActive,
                      ]}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </View>
          <Text style={styles.currentSpeed}>Current: {playbackSpeed}x</Text>
        </View>

        {/* Visual safety filter */}
        <View style={styles.card}>
          <ToggleRow
            title="Visual safety filter"
            description="Filters content with flashing lights or rapid movements."
            value={visualSafetyFilter}
            onValueChange={setVisualSafetyFilter}
          />
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
  avatarRow: {
    alignItems: "flex-end",
    marginBottom: 8,
  },
  avatarCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E8E8E8",
    alignItems: "center",
    justifyContent: "center",
  },
  card: {
    borderWidth: 1,
    borderColor: "#F0F0F0",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  settingInfo: {
    flex: 1,
    paddingRight: 12,
  },
  settingTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  settingDesc: {
    fontSize: 12,
    color: "#999",
    lineHeight: 17,
  },
  settingControl: {
    alignItems: "flex-end",
  },
  segmentRow: {
    flexDirection: "row",
    gap: 8,
  },
  segmentBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: "center",
  },
  segmentBtnActive: {
    borderColor: "#2D2D2D",
    backgroundColor: "#F5F5F5",
  },
  segmentText: {
    fontSize: 13,
    color: "#888",
    fontWeight: "400",
  },
  segmentTextActive: {
    color: "#1A1A1A",
    fontWeight: "600",
  },
  speedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 6,
  },
  speedLabel: {
    fontSize: 12,
    color: "#888",
  },
  sliderTrack: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  sliderDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E0E0E0",
    borderWidth: 2,
    borderColor: "#ccc",
  },
  sliderDotActive: {
    backgroundColor: "#7CC83A",
    borderColor: "#7CC83A",
  },
  sliderLine: {
    flex: 1,
    height: 3,
    backgroundColor: "#E0E0E0",
  },
  sliderLineActive: {
    backgroundColor: "#7CC83A",
  },
  currentSpeed: {
    fontSize: 12,
    color: "#999",
    textAlign: "right",
  },
});

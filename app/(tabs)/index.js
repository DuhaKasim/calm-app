import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { DURATION_OPTIONS, SESSION_OPTIONS } from "../../constants/mockData";
import { useAppContext } from "../../context/AppContext";

export default function HomeScreen() {
  const router = useRouter();
  const { setCurrentSession, fontSize } = useAppContext();

  const [selectedIntention, setSelectedIntention] = useState(null);
  const [selectedDuration, setSelectedDuration] = useState(null);

  const canStart = selectedIntention !== null && selectedDuration !== null;

  function handleStart() {
    if (!canStart) return;
    const intention = SESSION_OPTIONS[selectedIntention];
    const duration = DURATION_OPTIONS[selectedDuration];
    setCurrentSession({
      intention: intention.label,
      tag: intention.tag,
      duration: duration.label,
      postCount: duration.postCount,
    });
    router.push("/feed");
  }

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoCircle}>
          <Ionicons name="leaf" size={32} color="#fff" />
        </View>

        {/* Title */}
        <Text style={styles.title}>Welcome to Calm</Text>
        <Text style={styles.subtitle}>
          A mindful social space designed{"\n"}for neurodivergent users.
        </Text>

        {/* Intention */}
        <Text style={[styles.sectionLabel, { fontSize }]}>
          What brings you here?
        </Text>

        {SESSION_OPTIONS.map((option, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.intentionBtn,
              selectedIntention === index && styles.intentionBtnSelected,
            ]}
            onPress={() => setSelectedIntention(index)}
            activeOpacity={0.7}
          >
            <Ionicons
              name={option.icon}
              size={20}
              color="#2D2D2D"
              style={styles.intentionIcon}
            />
            <Text style={[styles.intentionText, { fontSize }]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}

        {/* Duration */}
        <Text style={[styles.sectionLabel, { fontSize }]}>
          How long would you like to browse?
        </Text>

        <View style={styles.durationRow}>
          {DURATION_OPTIONS.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.durationBtn,
                selectedDuration === index && styles.durationBtnSelected,
              ]}
              onPress={() => setSelectedDuration(index)}
              activeOpacity={0.7}
            >
              <Text style={[styles.durationMain, { fontSize }]}>
                {option.label}
              </Text>
              <Text style={[styles.durationSub, { fontSize: fontSize - 2 }]}>
                {option.sublabel}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Start button */}
        <TouchableOpacity
          style={[styles.startBtn, !canStart && styles.startBtnDisabled]}
          onPress={handleStart}
          activeOpacity={canStart ? 0.8 : 1}
        >
          <Text style={[styles.startBtnText, { fontSize }]}>Start session</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 100,
    alignItems: "center",
  },
  logoCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#7CC83A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
    alignSelf: "flex-start",
    marginBottom: 12,
  },
  intentionBtn: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  intentionBtnSelected: {
    backgroundColor: "#F0F0F0",
    borderColor: "#C0C0C0",
  },
  intentionIcon: {
    marginRight: 12,
  },
  intentionText: {
    fontSize: 15,
    color: "#1A1A1A",
  },
  durationRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginBottom: 28,
  },
  durationBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 8,
    alignItems: "center",
    backgroundColor: "#fff",
  },
  durationBtnSelected: {
    backgroundColor: "#F0F0F0",
    borderColor: "#C0C0C0",
  },
  durationMain: {
    fontSize: 14,
    fontWeight: "500",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  durationSub: {
    fontSize: 12,
    color: "#888",
    textAlign: "center",
  },
  startBtn: {
    width: "100%",
    backgroundColor: "#F0F0F0",
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
  },
  startBtnDisabled: {
    opacity: 0.5,
  },
  startBtnText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#1A1A1A",
  },
});

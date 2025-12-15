import { useState } from "react";
import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import {
  LexicalEditor,
  LexicalEditorToolbar,
  useLexicalEditor,
} from "../src/components/lexical-editor";

export default function LexicalEditorScreen() {
  const [content, setContent] = useState<string>("");

  const editor = useLexicalEditor({
    placeholder: "テキストを入力...",
    onContentChange: (json) => {
      setContent(json);
    },
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Lexical Editor",
        }}
      />
      <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← 戻る</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Lexical Rich Text Editor</Text>
          <Text style={styles.subtitle}>React Native Playground</Text>
        </View>

        <View style={styles.editorContainer}>
          <LexicalEditor editor={editor} style={{ flex: 1 }} />
        </View>

        <LexicalEditorToolbar editor={editor} />

        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Editor State (JSON):</Text>
          <ScrollView style={styles.debugScrollView}>
            <Text style={styles.debugText}>
              {content
                ? JSON.stringify(JSON.parse(content), null, 2)
                : "No content yet"}
            </Text>
          </ScrollView>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  headerTop: {
    marginBottom: 8,
  },
  backButton: {
    paddingVertical: 4,
    alignSelf: "flex-start",
  },
  backButtonText: {
    color: "#007AFF",
    fontSize: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 2,
  },
  editorContainer: {
    flex: 1,
    minHeight: 200,
  },
  debugContainer: {
    maxHeight: 150,
    backgroundColor: "#1a1a1a",
    borderTopWidth: 1,
    borderTopColor: "#333",
    padding: 12,
  },
  debugTitle: {
    fontSize: 12,
    fontWeight: "600",
    color: "#888",
    marginBottom: 8,
  },
  debugScrollView: {
    flex: 1,
  },
  debugText: {
    fontSize: 10,
    fontFamily: "monospace",
    color: "#666",
  },
});

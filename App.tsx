import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, ScrollView } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  LexicalEditor,
  LexicalEditorToolbar,
  useLexicalEditor,
} from "./src/components/lexical-editor";

export default function App() {
  const [content, setContent] = useState<string>("");

  const editor = useLexicalEditor({
    placeholder: "テキストを入力...",
    onContentChange: (json) => {
      setContent(json);
    },
  });

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
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
              {content ? JSON.stringify(JSON.parse(content), null, 2) : "No content yet"}
            </Text>
          </ScrollView>
        </View>

        <StatusBar style="light" />
      </SafeAreaView>
    </SafeAreaProvider>
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

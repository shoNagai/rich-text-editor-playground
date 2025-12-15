import { StyleSheet, Text, View, Pressable, KeyboardAvoidingView, Platform, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import {
  LexicalEditor,
  LexicalEditorToolbar,
  useLexicalEditor,
} from "../src/components/lexical-editor";

export default function LexicalEditorScreen() {
  const editor = useLexicalEditor({
    placeholder: "Lexicalエディタで入力",
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Lexical Editor",
        }}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← 戻る</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Lexical Rich Text Editor</Text>
          <Pressable onPress={() => Linking.openURL("https://github.com/facebook/lexical")}>
            <Text style={styles.subtitleLink}>github.com/facebook/lexical</Text>
          </Pressable>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <View style={styles.editorContainer}>
            <LexicalEditor editor={editor} style={{ flex: 1 }} />
          </View>

          <LexicalEditorToolbar editor={editor} />
        </KeyboardAvoidingView>
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
  subtitleLink: {
    fontSize: 14,
    color: "#007AFF",
    marginTop: 2,
    textDecorationLine: "underline",
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

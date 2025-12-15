import { StyleSheet, Text, View, Pressable, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Stack, router } from "expo-router";
import {
  PellEditorComponent,
  PellEditorToolbar,
  usePellEditor,
} from "../src/components/pell-editor";

export default function PellEditorScreen() {
  const editor = usePellEditor({
    placeholder: "Pell Editorで入力",
  });

  return (
    <>
      <Stack.Screen
        options={{
          title: "Pell Editor",
        }}
      />
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable onPress={() => router.back()} style={styles.backButton}>
              <Text style={styles.backButtonText}>← 戻る</Text>
            </Pressable>
          </View>
          <Text style={styles.title}>Pell Rich Text Editor</Text>
          <Text style={styles.subtitle}>React Native Playground</Text>
        </View>

        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1 }}
          keyboardVerticalOffset={0}
        >
          <View style={styles.editorContainer}>
            <PellEditorComponent editor={editor} />
          </View>

          <PellEditorToolbar editor={editor} />
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
  editorContainer: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
});

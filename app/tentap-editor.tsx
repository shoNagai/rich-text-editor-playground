import { StyleSheet, Text, View, Pressable, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import {
  TentapEditorComponent,
  TentapEditorToolbar,
  useTentapEditor,
} from "../src/components/tentap-editor";

export default function TentapEditorScreen() {
  const { editor, state, keyboardHeight, isKeyboardUp } = useTentapEditor({
    placeholder: "10tapエディタで入力",
    autofocus: true,
  });

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>← 戻る</Text>
          </Pressable>
        </View>
        <Text style={styles.title}>10tap Editor</Text>
        <Pressable onPress={() => Linking.openURL("https://github.com/10play/10tap-editor")}>
          <Text style={styles.subtitleLink}>github.com/10play/10tap-editor</Text>
        </Pressable>
      </View>

      <View style={{ flex: 1 }}>
        <TentapEditorComponent editor={editor} />
        <TentapEditorToolbar editor={editor} state={state} />
        {isKeyboardUp && <View style={{ height: keyboardHeight }} />}
      </View>
    </SafeAreaView>
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
});

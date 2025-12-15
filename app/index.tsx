import { Link } from "expo-router";
import { StyleSheet, Text, View, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type EditorItem = {
  name: string;
  href: "/lexical-editor" | string;
  description: string;
};

const EDITORS: EditorItem[] = [
  {
    name: "Lexical Editor",
    href: "/lexical-editor",
    description: "Meta製のリッチテキストエディタ",
  },
];

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <View style={styles.header}>
        <Text style={styles.title}>Rich Text Editor Playground</Text>
        <Text style={styles.subtitle}>
          様々なリッチテキストエディタライブラリを試すことができます
        </Text>
      </View>

      <View style={styles.editorList}>
        <Text style={styles.sectionTitle}>エディタ一覧</Text>
        {EDITORS.map((editor) => (
          <Link key={editor.href} href={editor.href as any} asChild>
            <Pressable style={styles.editorCard}>
              <Text style={styles.editorName}>{editor.name}</Text>
              <Text style={styles.editorDescription}>{editor.description}</Text>
            </Pressable>
          </Link>
        ))}
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
    paddingVertical: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#888",
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  editorList: {
    paddingTop: 24,
  },
  editorCard: {
    backgroundColor: "#1a1a1a",
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  editorName: {
    fontSize: 18,
    fontWeight: "600",
    color: "#fff",
    marginBottom: 4,
  },
  editorDescription: {
    fontSize: 14,
    color: "#888",
  },
});

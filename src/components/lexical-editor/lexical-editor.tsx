import { Pressable, StyleSheet, View } from "react-native";
import { WebView } from "react-native-webview";
import { EDITOR_HTML } from "./editor-html";
import type { useLexicalEditor } from "./use-lexical-editor";
import { Text } from "react-native";
import { pickImage } from "../../utils/image-picker";

type LexicalEditorProps = {
  editor: ReturnType<typeof useLexicalEditor>;
  style?: { flex?: number; height?: number };
};

export const LexicalEditor = ({ editor, style }: LexicalEditorProps) => {
  return (
    <WebView
      ref={editor.webViewRef}
      source={{ html: EDITOR_HTML }}
      style={[styles.webview, style]}
      onMessage={editor.handleMessage}
      scrollEnabled={true}
      bounces={false}
      keyboardDisplayRequiresUserAction={false}
      hideKeyboardAccessoryView={true}
      allowsBackForwardNavigationGestures={false}
      webviewDebuggingEnabled={__DEV__}
    />
  );
};

type ToolbarButtonProps = {
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
  label: string;
};

const ToolbarButton = ({ onPress, isActive, disabled, children, label }: ToolbarButtonProps) => {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.toolbarButton,
        {
          opacity: disabled ? 0.3 : pressed ? 0.5 : 1,
          backgroundColor: isActive ? "rgba(255, 255, 255, 0.1)" : "transparent",
        },
      ]}
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      {children}
    </Pressable>
  );
};

type LexicalEditorToolbarProps = {
  editor: ReturnType<typeof useLexicalEditor>;
};

export const LexicalEditorToolbar = ({ editor }: LexicalEditorToolbarProps) => {
  const { editorState, formatText, formatHeading, formatList, undo, redo, insertImage } = editor;
  const { selection, canUndo, canRedo } = editorState;

  const handleInsertImage = async () => {
    const image = await pickImage();
    if (image) {
      insertImage(image.base64Uri, image.width, image.height);
    }
  };

  return (
    <View style={styles.toolbar}>
      <ToolbarButton onPress={undo} disabled={!canUndo} label="元に戻す">
        <Text style={styles.buttonText}>↩</Text>
      </ToolbarButton>

      <ToolbarButton onPress={redo} disabled={!canRedo} label="やり直す">
        <Text style={styles.buttonText}>↪</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton onPress={handleInsertImage} label="画像">
        <Text style={styles.buttonText}>🖼</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton onPress={() => formatText("bold")} isActive={selection.isBold} label="太字">
        <Text style={[styles.buttonText, styles.bold]}>B</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={() => formatText("italic")}
        isActive={selection.isItalic}
        label="斜体"
      >
        <Text style={[styles.buttonText, styles.italic]}>I</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={() => formatText("underline")}
        isActive={selection.isUnderline}
        label="下線"
      >
        <Text style={[styles.buttonText, styles.underline]}>U</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={() => formatText("strikethrough")}
        isActive={selection.isStrikethrough}
        label="打ち消し線"
      >
        <Text style={[styles.buttonText, styles.strikethrough]}>S</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton
        onPress={() => formatHeading(selection.blockType === "h1" ? "paragraph" : "h1")}
        isActive={selection.blockType === "h1"}
        label="見出し1"
      >
        <Text style={styles.buttonText}>H1</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={() => formatHeading(selection.blockType === "h2" ? "paragraph" : "h2")}
        isActive={selection.blockType === "h2"}
        label="見出し2"
      >
        <Text style={styles.buttonText}>H2</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton
        onPress={() => formatList(selection.blockType === "bullet" ? "none" : "bullet")}
        isActive={selection.blockType === "bullet"}
        label="箇条書き"
      >
        <Text style={styles.buttonText}>•</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={() => formatList(selection.blockType === "number" ? "none" : "number")}
        isActive={selection.blockType === "number"}
        label="番号付きリスト"
      >
        <Text style={styles.buttonText}>1.</Text>
      </ToolbarButton>
    </View>
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: "#141414",
  },
  toolbar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1a1a",
    paddingHorizontal: 8,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  toolbarButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 8,
    minWidth: 36,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "500",
  },
  bold: {
    fontWeight: "bold",
  },
  italic: {
    fontStyle: "italic",
  },
  underline: {
    textDecorationLine: "underline",
  },
  strikethrough: {
    textDecorationLine: "line-through",
  },
  divider: {
    width: 1,
    height: 24,
    backgroundColor: "#444",
    marginHorizontal: 8,
  },
});

import { View, Pressable, StyleSheet, Text, ScrollView } from "react-native";
import { RichEditor } from "react-native-pell-rich-editor";
import type { PellEditor } from "./use-pell-editor";
import { pickImage } from "../../utils/image-picker";

const customCSS = `
  .pell-image-wrapper {
    position: relative;
    display: inline-block;
    max-width: 100%;
    margin: 8px 0;
  }
  .pell-image-wrapper img {
    max-width: 100%;
    height: auto;
    display: block;
    border-radius: 4px;
  }
  .pell-image-delete-button {
    position: absolute;
    top: 8px;
    left: 8px;
    width: 28px;
    height: 28px;
    border-radius: 50%;
    border: none;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    line-height: 1;
    padding: 0;
  }
`;

const customJS = `
  document.addEventListener('click', function(e) {
    if (e.target && e.target.classList.contains('pell-image-delete-button')) {
      e.preventDefault();
      e.stopPropagation();
      var wrapper = e.target.closest('.pell-image-wrapper');
      if (wrapper) {
        wrapper.remove();
      }
    }
  });
`;

type ToolbarButtonProps = {
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
  label: string;
  children: React.ReactNode;
};

const ToolbarButton = ({
  onPress,
  isActive = false,
  disabled = false,
  label,
  children,
}: ToolbarButtonProps) => (
  <Pressable
    onPress={onPress}
    disabled={disabled}
    style={[
      styles.toolbarButton,
      isActive && { backgroundColor: "#333" },
      disabled && { opacity: 0.5 },
    ]}
    accessibilityLabel={label}
  >
    {children}
  </Pressable>
);

type PellEditorComponentProps = {
  editor: PellEditor;
};

export const PellEditorComponent = ({ editor }: PellEditorComponentProps) => {
  const handleEditorInitialized = () => {
    editor.editorRef.current?.injectJavascript(customJS);
  };

  return (
    <ScrollView style={styles.editorScrollView} contentContainerStyle={styles.editorScrollContent}>
      <RichEditor
        ref={editor.editorRef}
        placeholder={editor.placeholder}
        initialContentHTML={editor.initialHtml}
        onChange={editor.handleChange}
        onCursorPosition={editor.handleCursorPosition}
        useContainer={false}
        editorStyle={{
          backgroundColor: "#0a0a0a",
          color: "#FFFFFF",
          placeholderColor: "#6B7280",
          contentCSSText: `
            padding: 16px;
            line-height: 1.6;
            font-size: 16px;
          `,
          cssText: customCSS,
        }}
        style={styles.editor}
        editorInitializedCallback={handleEditorInitialized}
      />
    </ScrollView>
  );
};

type PellEditorToolbarProps = {
  editor: PellEditor;
};

export const PellEditorToolbar = ({ editor }: PellEditorToolbarProps) => {
  const { editorState } = editor;

  const handleInsertImage = async () => {
    const image = await pickImage();
    if (image) {
      editor.insertImage(image.base64Uri);
    }
  };

  return (
    <View style={styles.toolbar}>
      <ToolbarButton onPress={editor.undo} label="元に戻す">
        <Text style={styles.buttonText}>↩</Text>
      </ToolbarButton>

      <ToolbarButton onPress={editor.redo} label="やり直す">
        <Text style={styles.buttonText}>↪</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton onPress={handleInsertImage} label="画像">
        <Text style={styles.buttonText}>🖼</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton onPress={editor.toggleBold} isActive={editorState.isBold} label="太字">
        <Text style={[styles.buttonText, styles.bold]}>B</Text>
      </ToolbarButton>

      <ToolbarButton onPress={editor.toggleItalic} isActive={editorState.isItalic} label="斜体">
        <Text style={[styles.buttonText, styles.italic]}>I</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={editor.toggleUnderline}
        isActive={editorState.isUnderline}
        label="下線"
      >
        <Text style={[styles.buttonText, styles.underline]}>U</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={editor.toggleStrikethrough}
        isActive={editorState.isStrikethrough}
        label="打ち消し線"
      >
        <Text style={[styles.buttonText, styles.strikethrough]}>S</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton onPress={editor.toggleH1} isActive={editorState.isH1} label="見出し1">
        <Text style={styles.buttonText}>H1</Text>
      </ToolbarButton>

      <ToolbarButton onPress={editor.toggleH2} isActive={editorState.isH2} label="見出し2">
        <Text style={styles.buttonText}>H2</Text>
      </ToolbarButton>

      <View style={styles.divider} />

      <ToolbarButton
        onPress={editor.toggleBulletList}
        isActive={editorState.isBulletList}
        label="箇条書き"
      >
        <Text style={styles.buttonText}>•</Text>
      </ToolbarButton>

      <ToolbarButton
        onPress={editor.toggleOrderedList}
        isActive={editorState.isOrderedList}
        label="番号付きリスト"
      >
        <Text style={styles.buttonText}>1.</Text>
      </ToolbarButton>
    </View>
  );
};

const styles = StyleSheet.create({
  editorScrollView: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  editorScrollContent: {
    flexGrow: 1,
  },
  editor: {
    flex: 1,
    minHeight: 300,
    backgroundColor: "#0a0a0a",
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

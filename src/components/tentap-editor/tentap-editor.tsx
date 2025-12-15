import { StyleSheet, Text, View, Pressable, ScrollView } from "react-native";
import { RichText } from "@10play/tentap-editor";
import { pickImage } from "../../utils/image-picker";
import type { TentapEditor, TentapEditorState } from "./use-tentap-editor";

const ICON_COLOR = "#FFFFFF";
const ICON_COLOR_ACTIVE = "#007AFF";

type ToolbarButtonProps = {
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

const ToolbarButton = ({ onPress, isActive, disabled, children }: ToolbarButtonProps) => {
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
    >
      {children}
    </Pressable>
  );
};

const Separator = () => <View style={styles.separator} />;

type TentapEditorToolbarProps = {
  editor: TentapEditor;
  state: TentapEditorState;
};

export const TentapEditorToolbar = ({ editor, state }: TentapEditorToolbarProps) => {
  const handleInsertImage = async () => {
    const image = await pickImage();
    if (image) {
      editor.setImage(image.base64Uri);
    }
  };

  return (
    <View style={styles.toolbarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolbarContent}
      >
        <ToolbarButton onPress={handleInsertImage}>
          <Text style={[styles.toolbarText, { color: ICON_COLOR }]}>🖼</Text>
        </ToolbarButton>

        <Separator />

        <ToolbarButton onPress={() => editor.toggleBold()} isActive={state.isBoldActive}>
          <Text
            style={[
              styles.toolbarText,
              {
                fontWeight: "bold",
                color: state.isBoldActive ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            B
          </Text>
        </ToolbarButton>

        <ToolbarButton onPress={() => editor.toggleItalic()} isActive={state.isItalicActive}>
          <Text
            style={[
              styles.toolbarText,
              {
                fontStyle: "italic",
                color: state.isItalicActive ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            I
          </Text>
        </ToolbarButton>

        <ToolbarButton onPress={() => editor.toggleUnderline()} isActive={state.isUnderlineActive}>
          <Text
            style={[
              styles.toolbarText,
              {
                textDecorationLine: "underline",
                color: state.isUnderlineActive ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            U
          </Text>
        </ToolbarButton>

        <ToolbarButton onPress={() => editor.toggleStrike()} isActive={state.isStrikeActive}>
          <Text
            style={[
              styles.toolbarText,
              {
                textDecorationLine: "line-through",
                color: state.isStrikeActive ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            S
          </Text>
        </ToolbarButton>

        <Separator />

        <ToolbarButton onPress={() => editor.toggleHeading(1)} isActive={state.headingLevel === 1}>
          <Text
            style={[
              styles.toolbarText,
              {
                color: state.headingLevel === 1 ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            H1
          </Text>
        </ToolbarButton>

        <ToolbarButton onPress={() => editor.toggleHeading(2)} isActive={state.headingLevel === 2}>
          <Text
            style={[
              styles.toolbarText,
              {
                color: state.headingLevel === 2 ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            H2
          </Text>
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onPress={() => editor.toggleBulletList()}
          isActive={state.isBulletListActive}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                color: state.isBulletListActive ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            •
          </Text>
        </ToolbarButton>

        <ToolbarButton
          onPress={() => editor.toggleOrderedList()}
          isActive={state.isOrderedListActive}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                color: state.isOrderedListActive ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            1.
          </Text>
        </ToolbarButton>
      </ScrollView>
    </View>
  );
};

type TentapEditorComponentProps = {
  editor: TentapEditor;
};

export const TentapEditorComponent = ({ editor }: TentapEditorComponentProps) => {
  return (
    <View style={styles.editorContainer}>
      <RichText editor={editor} />
    </View>
  );
};

const styles = StyleSheet.create({
  editorContainer: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  toolbarContainer: {
    height: 48,
    backgroundColor: "#1C1C1E",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  toolbarContent: {
    paddingHorizontal: 8,
    alignItems: "center",
  },
  toolbarButton: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
    padding: 8,
  },
  toolbarText: {
    fontSize: 16,
    fontWeight: "600",
  },
  separator: {
    marginHorizontal: 4,
    height: 24,
    width: 2,
    backgroundColor: "#333",
  },
});

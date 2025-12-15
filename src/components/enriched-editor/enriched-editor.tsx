import { View, Pressable, ScrollView, Text, StyleSheet } from "react-native";
import { EnrichedTextInput } from "react-native-enriched";
import type { useEnrichedEditor, HeadingLevel, ListType } from "./use-enriched-editor";

const ICON_COLOR = "#FFFFFF";
const ICON_COLOR_ACTIVE = "#007AFF";
const EDITOR_BACKGROUND_COLOR = "#141414";

type ToolbarButtonProps = {
  onPress: () => void;
  isActive?: boolean;
  disabled?: boolean;
  children: React.ReactNode;
};

const ToolbarButton = ({
  onPress,
  isActive,
  disabled,
  children,
}: ToolbarButtonProps) => {
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

type ToolbarProps = {
  editor: ReturnType<typeof useEnrichedEditor>;
};

const Toolbar = ({ editor }: ToolbarProps) => {
  const {
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikeThrough,
    setHeading,
    setList,
    editorState,
  } = editor;

  return (
    <View style={styles.toolbarContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.toolbarContent}
      >
        <ToolbarButton
          onPress={toggleBold}
          isActive={editorState.styles.isBold}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                fontWeight: "bold",
                color: editorState.styles.isBold ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            B
          </Text>
        </ToolbarButton>

        <ToolbarButton
          onPress={toggleItalic}
          isActive={editorState.styles.isItalic}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                fontStyle: "italic",
                color: editorState.styles.isItalic ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            I
          </Text>
        </ToolbarButton>

        <ToolbarButton
          onPress={toggleUnderline}
          isActive={editorState.styles.isUnderline}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                textDecorationLine: "underline",
                color: editorState.styles.isUnderline ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            U
          </Text>
        </ToolbarButton>

        <ToolbarButton
          onPress={toggleStrikeThrough}
          isActive={editorState.styles.isStrikeThrough}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                textDecorationLine: "line-through",
                color: editorState.styles.isStrikeThrough
                  ? ICON_COLOR_ACTIVE
                  : ICON_COLOR,
              },
            ]}
          >
            S
          </Text>
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onPress={() => setHeading("h1")}
          isActive={editorState.styles.isH1}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                color: editorState.styles.isH1 ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            H1
          </Text>
        </ToolbarButton>

        <ToolbarButton
          onPress={() => setHeading("h2")}
          isActive={editorState.styles.isH2}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                color: editorState.styles.isH2 ? ICON_COLOR_ACTIVE : ICON_COLOR,
              },
            ]}
          >
            H2
          </Text>
        </ToolbarButton>

        <Separator />

        <ToolbarButton
          onPress={() => setList("unordered")}
          isActive={editorState.styles.isUnorderedList}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                color: editorState.styles.isUnorderedList
                  ? ICON_COLOR_ACTIVE
                  : ICON_COLOR,
              },
            ]}
          >
            •
          </Text>
        </ToolbarButton>

        <ToolbarButton
          onPress={() => setList("ordered")}
          isActive={editorState.styles.isOrderedList}
        >
          <Text
            style={[
              styles.toolbarText,
              {
                color: editorState.styles.isOrderedList
                  ? ICON_COLOR_ACTIVE
                  : ICON_COLOR,
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

type EnrichedEditorProps = {
  editor: ReturnType<typeof useEnrichedEditor>;
  style?: { flex?: number; height?: number };
};

export const EnrichedEditor = ({ editor, style }: EnrichedEditorProps) => {
  return (
    <View style={[styles.editorContainer, style]}>
      <EnrichedTextInput
        ref={editor.inputRef}
        {...editor.editorInputProps}
        placeholderTextColor="#6B7280"
        cursorColor={ICON_COLOR_ACTIVE}
        selectionColor={ICON_COLOR_ACTIVE}
        scrollEnabled
        style={styles.editorInput}
      />
    </View>
  );
};

type EnrichedEditorToolbarProps = {
  editor: ReturnType<typeof useEnrichedEditor>;
};

export const EnrichedEditorToolbar = ({ editor }: EnrichedEditorToolbarProps) => {
  return <Toolbar editor={editor} />;
};

const styles = StyleSheet.create({
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
  editorContainer: {
    flex: 1,
    backgroundColor: EDITOR_BACKGROUND_COLOR,
    borderRadius: 8,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  editorInput: {
    flex: 1,
    color: "#FFFFFF",
    fontSize: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    textAlignVertical: "top",
  },
});

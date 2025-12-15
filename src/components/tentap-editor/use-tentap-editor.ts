import { useMemo } from "react";
import {
  useEditorBridge,
  useBridgeState,
  useKeyboard,
  TenTapStartKit,
  PlaceholderBridge,
  CoreBridge,
} from "@10play/tentap-editor";

const EDITOR_BACKGROUND_COLOR = "#0a0a0a";
const EDITOR_TEXT_COLOR = "#FFFFFF";
const PLACEHOLDER_COLOR = "#6B7280";

const editorCSS = `
  * {
    background-color: ${EDITOR_BACKGROUND_COLOR};
    color: ${EDITOR_TEXT_COLOR};
  }
  .tiptap, .ProseMirror {
    padding: 16px;
    font-size: 16px;
    line-height: 1.6;
  }
  .tiptap p, .ProseMirror p {
    margin: 0;
    line-height: 1.6;
  }
  .tiptap p.is-editor-empty:first-child::before {
    color: ${PLACEHOLDER_COLOR};
  }
`;

export type UseTentapEditorOptions = {
  placeholder?: string;
  initialContent?: string;
  autofocus?: boolean;
};

export const useTentapEditor = ({
  placeholder = "",
  initialContent = "",
  autofocus = true,
}: UseTentapEditorOptions = {}) => {
  const { keyboardHeight, isKeyboardUp } = useKeyboard();

  const bridgeExtensions = useMemo(
    () => [
      ...TenTapStartKit.filter((ext) => ext.name !== "placeholder" && ext.name !== "core"),
      PlaceholderBridge.configureExtension({
        placeholder,
      }),
      CoreBridge.configureCSS(editorCSS),
    ],
    [placeholder],
  );

  const editor = useEditorBridge({
    autofocus,
    avoidIosKeyboard: false,
    initialContent,
    bridgeExtensions,
    theme: {
      webview: {
        backgroundColor: EDITOR_BACKGROUND_COLOR,
      },
    },
  });

  const state = useBridgeState(editor);

  return {
    editor,
    state,
    keyboardHeight,
    isKeyboardUp,
  };
};

export type TentapEditorState = ReturnType<typeof useBridgeState>;
export type TentapEditor = ReturnType<typeof useEditorBridge>;

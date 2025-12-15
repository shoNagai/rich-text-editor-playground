import { useCallback, useRef, useState } from "react";
import type { WebView } from "react-native-webview";

export type TextFormat = "bold" | "italic" | "underline" | "strikethrough";
export type BlockType = "paragraph" | "h1" | "h2" | "bullet" | "number";
export type ListType = "bullet" | "number" | "none";
export type ElementFormatType = "left" | "center" | "right" | "justify" | "";

export type SelectionState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  blockType: BlockType;
  textColor: string | null;
  backgroundColor: string | null;
  elementFormat: ElementFormatType;
};

export type LexicalEditorState = {
  isReady: boolean;
  isFocused: boolean;
  selection: SelectionState;
  canUndo: boolean;
  canRedo: boolean;
};

export type UseLexicalEditorOptions = {
  initialContent?: string;
  placeholder?: string;
  onContentChange?: (lexicalJson: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

type WebViewMessage = {
  type: string;
  payload: Record<string, unknown>;
};

const validBlockTypes = new Set<string>(["paragraph", "h1", "h2", "bullet", "number"]);

function isValidBlockType(value: string): value is BlockType {
  return validBlockTypes.has(value);
}

const validElementFormats = new Set<string>(["left", "center", "right", "justify", ""]);

function isValidElementFormat(value: string): value is ElementFormatType {
  return validElementFormats.has(value);
}

const defaultSelection: SelectionState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  blockType: "paragraph",
  textColor: null,
  backgroundColor: null,
  elementFormat: "left",
};

export const useLexicalEditor = ({
  placeholder,
  onContentChange,
  onFocus,
  onBlur,
}: UseLexicalEditorOptions = {}) => {
  const webViewRef = useRef<WebView>(null);
  const [editorState, setEditorState] = useState<LexicalEditorState>({
    isReady: false,
    isFocused: false,
    selection: defaultSelection,
    canUndo: false,
    canRedo: false,
  });

  const sendMessage = useCallback((type: string, payload?: unknown) => {
    webViewRef.current?.injectJavaScript(`
      window.handleMessage(${JSON.stringify({ type, payload })});
      true;
    `);
  }, []);

  const handleMessage = useCallback(
    (event: { nativeEvent: { data: string } }) => {
      try {
        const message: WebViewMessage = JSON.parse(event.nativeEvent.data);

        switch (message.type) {
          case "ready":
            setEditorState((prev) => ({ ...prev, isReady: true }));
            if (placeholder) {
              sendMessage("setPlaceholder", placeholder);
            }
            break;

          case "contentChange":
            if (onContentChange && typeof message.payload.state === "string") {
              onContentChange(message.payload.state);
            }
            break;

          case "selectionChange": {
            const { payload } = message;
            const {
              isBold,
              isItalic,
              isUnderline,
              isStrikethrough,
              blockType,
              textColor,
              backgroundColor,
              elementFormat,
            } = payload;
            if (
              typeof isBold === "boolean" &&
              typeof isItalic === "boolean" &&
              typeof isUnderline === "boolean" &&
              typeof isStrikethrough === "boolean" &&
              typeof blockType === "string" &&
              isValidBlockType(blockType)
            ) {
              setEditorState((prev) => ({
                ...prev,
                selection: {
                  isBold,
                  isItalic,
                  isUnderline,
                  isStrikethrough,
                  blockType,
                  textColor: typeof textColor === "string" ? textColor : null,
                  backgroundColor: typeof backgroundColor === "string" ? backgroundColor : null,
                  elementFormat:
                    typeof elementFormat === "string" && isValidElementFormat(elementFormat)
                      ? elementFormat
                      : "left",
                },
              }));
            }
            break;
          }

          case "focus":
            setEditorState((prev) => ({ ...prev, isFocused: true }));
            onFocus?.();
            break;

          case "blur":
            setEditorState((prev) => ({ ...prev, isFocused: false }));
            onBlur?.();
            break;

          case "canUndoChange": {
            const { canUndo } = message.payload;
            if (typeof canUndo === "boolean") {
              setEditorState((prev) => ({
                ...prev,
                canUndo,
              }));
            }
            break;
          }

          case "canRedoChange": {
            const { canRedo } = message.payload;
            if (typeof canRedo === "boolean") {
              setEditorState((prev) => ({
                ...prev,
                canRedo,
              }));
            }
            break;
          }

          case "error":
            console.error(`[LexicalEditor] ${String(message.payload.message ?? "Error")}`);
            break;
        }
      } catch (error) {
        console.error("LexicalEditor message parse failed", error);
      }
    },
    [placeholder, onContentChange, onFocus, onBlur, sendMessage],
  );

  const focus = useCallback(() => {
    webViewRef.current?.requestFocus();
    sendMessage("focus");
  }, [sendMessage]);

  const blur = useCallback(() => {
    sendMessage("blur");
  }, [sendMessage]);

  const formatText = useCallback(
    (format: TextFormat) => {
      sendMessage("formatText", format);
    },
    [sendMessage],
  );

  const formatHeading = useCallback(
    (tag: "h1" | "h2" | "paragraph") => {
      sendMessage("formatHeading", tag);
    },
    [sendMessage],
  );

  const formatList = useCallback(
    (listType: ListType) => {
      sendMessage("formatList", listType);
    },
    [sendMessage],
  );

  const formatAlign = useCallback(
    (align: ElementFormatType) => {
      sendMessage("formatAlign", align);
    },
    [sendMessage],
  );

  const insertLink = useCallback(
    (url: string | null) => {
      sendMessage("insertLink", url);
    },
    [sendMessage],
  );

  const insertDivider = useCallback(() => {
    sendMessage("insertDivider");
  }, [sendMessage]);

  const insertImage = useCallback(
    (src: string, width?: number, height?: number) => {
      sendMessage("insertImage", { src, width, height });
    },
    [sendMessage],
  );

  const setTextColor = useCallback(
    (color: string | null) => {
      sendMessage("applyStyle", { color: color ?? "" });
    },
    [sendMessage],
  );

  const setBackgroundColor = useCallback(
    (color: string | null) => {
      sendMessage("applyStyle", { "background-color": color ?? "" });
    },
    [sendMessage],
  );

  const undo = useCallback(() => {
    sendMessage("undo");
  }, [sendMessage]);

  const redo = useCallback(() => {
    sendMessage("redo");
  }, [sendMessage]);

  const setContent = useCallback(
    (content: string) => {
      sendMessage("setContent", content);
    },
    [sendMessage],
  );

  const getContent = useCallback(() => {
    sendMessage("getContent");
  }, [sendMessage]);

  return {
    webViewRef,
    editorState,
    handleMessage,
    focus,
    blur,
    formatText,
    formatHeading,
    formatList,
    formatAlign,
    insertLink,
    insertDivider,
    insertImage,
    setTextColor,
    setBackgroundColor,
    undo,
    redo,
    setContent,
    getContent,
  };
};

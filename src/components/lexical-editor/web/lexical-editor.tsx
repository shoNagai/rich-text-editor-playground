/**
 * Lexical Editor for WebView
 *
 * This file is bundled with esbuild and embedded in WebView HTML.
 * It uses Lexical for rich text editing.
 */
import {
  $getRoot,
  $getSelection,
  $isRangeSelection,
  $insertNodes,
  createEditor,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  COMMAND_PRIORITY_NORMAL,
  COMMAND_PRIORITY_EDITOR,
  KEY_ENTER_COMMAND,
  CAN_UNDO_COMMAND,
  CAN_REDO_COMMAND,
  UNDO_COMMAND,
  REDO_COMMAND,
  $createParagraphNode,
  $isElementNode,
  DecoratorNode,
  createCommand,
  type LexicalEditor,
  type TextFormatType,
  type ElementFormatType,
  type SerializedLexicalNode,
  type DOMConversionMap,
  type DOMExportOutput,
  type EditorConfig,
  type LexicalCommand,
} from "lexical";
import { createEmptyHistoryState, registerHistory } from "@lexical/history";
import {
  HeadingNode,
  $createHeadingNode,
  $isHeadingNode,
  registerRichText,
  type HeadingTagType,
} from "@lexical/rich-text";
import {
  ListNode,
  ListItemNode,
  $isListNode,
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  registerList,
} from "@lexical/list";
import { LinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $setBlocksType,
  $patchStyleText,
  $getSelectionStyleValueForProperty,
} from "@lexical/selection";

// ============================================
// DividerNode - 区切り線
// ============================================
export type SerializedDividerNode = SerializedLexicalNode;

export const INSERT_DIVIDER_COMMAND: LexicalCommand<void> = createCommand("INSERT_DIVIDER_COMMAND");

export class DividerNode extends DecoratorNode<null> {
  static getType(): string {
    return "divider";
  }

  static clone(node: DividerNode): DividerNode {
    return new DividerNode(node.__key);
  }

  static importJSON(_serializedNode: SerializedDividerNode): DividerNode {
    return new DividerNode();
  }

  static importDOM(): DOMConversionMap | null {
    return {
      hr: () => ({
        conversion: () => ({ node: new DividerNode() }),
        priority: 0,
      }),
    };
  }

  exportJSON(): SerializedLexicalNode {
    return {
      type: "divider",
      version: 1,
    };
  }

  exportDOM(): DOMExportOutput {
    return { element: document.createElement("hr") };
  }

  createDOM(_config: EditorConfig): HTMLElement {
    const hr = document.createElement("hr");
    hr.className = "lexical-divider";
    return hr;
  }

  getTextContent(): string {
    return "\n";
  }

  updateDOM(): boolean {
    return false;
  }

  decorate(): null {
    return null;
  }
}

// Register DividerPlugin command handler
function registerDividerPlugin(editor: LexicalEditor): () => void {
  return editor.registerCommand(
    INSERT_DIVIDER_COMMAND,
    () => {
      const selection = $getSelection();
      if (!$isRangeSelection(selection)) {
        return false;
      }

      const dividerNode = new DividerNode();
      $insertNodes([dividerNode]);

      const paragraphNode = $createParagraphNode();
      dividerNode.insertAfter(paragraphNode);
      paragraphNode.select();

      return true;
    },
    COMMAND_PRIORITY_EDITOR,
  );
}

// Message types for RN communication
type MessageToRN = {
  type:
    | "ready"
    | "contentChange"
    | "selectionChange"
    | "focus"
    | "blur"
    | "error"
    | "canUndoChange"
    | "canRedoChange";
  payload: Record<string, unknown>;
};

type MessageFromRN = {
  type: string;
  payload?: unknown;
};

// Send message to React Native
function sendMessage(message: MessageToRN): void {
  const webView = (
    window as unknown as {
      ReactNativeWebView?: { postMessage: (msg: string) => void };
    }
  ).ReactNativeWebView;
  if (webView) {
    webView.postMessage(JSON.stringify(message));
  }
}

// Selection state type
type SelectionState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  blockType: "paragraph" | "h1" | "h2" | "bullet" | "number";
  textColor: string | null;
  backgroundColor: string | null;
  elementFormat: ElementFormatType;
};

// Create and initialize the editor
function initEditor(placeholder: string): LexicalEditor {
  const editorElement = document.getElementById("editor");
  if (!editorElement) {
    throw new Error("Editor element not found");
  }

  // Create content editable element
  const contentEditable = document.createElement("div");
  contentEditable.contentEditable = "true";
  contentEditable.className = "editor-input show-placeholder";
  contentEditable.setAttribute("data-placeholder", placeholder);
  contentEditable.setAttribute("spellcheck", "false");
  editorElement.appendChild(contentEditable);

  // Create Lexical editor with theme for text formatting
  const editor = createEditor({
    namespace: "PlaygroundEditor",
    nodes: [HeadingNode, ListNode, ListItemNode, LinkNode, DividerNode],
    theme: {
      text: {
        bold: "text-bold",
        italic: "text-italic",
        underline: "text-underline",
        strikethrough: "text-strikethrough",
        underlineStrikethrough: "text-underline-strikethrough",
      },
    },
    onError: (error: Error) => {
      console.error("Lexical error:", error);
      sendMessage({ type: "error", payload: { message: error.message } });
    },
  });

  // Set root element
  editor.setRootElement(contentEditable);

  // Register rich text support (required for basic text editing)
  registerRichText(editor);

  // Register list support
  registerList(editor);

  // Register plugins
  registerDividerPlugin(editor);

  // Register history plugin for undo/redo
  registerHistory(editor, createEmptyHistoryState(), 1000);

  // Register CAN_UNDO/CAN_REDO listeners
  editor.registerCommand(
    CAN_UNDO_COMMAND,
    (canUndo: boolean) => {
      sendMessage({ type: "canUndoChange", payload: { canUndo } });
      return false;
    },
    COMMAND_PRIORITY_EDITOR,
  );

  editor.registerCommand(
    CAN_REDO_COMMAND,
    (canRedo: boolean) => {
      sendMessage({ type: "canRedoChange", payload: { canRedo } });
      return false;
    },
    COMMAND_PRIORITY_EDITOR,
  );

  // Register update listener
  editor.registerUpdateListener(({ editorState }) => {
    editorState.read(() => {
      const json = editorState.toJSON();
      sendMessage({
        type: "contentChange",
        payload: { state: JSON.stringify(json) },
      });
    });

    // Update placeholder visibility based on content
    updatePlaceholderVisibility(editor);

    // Update selection state
    updateSelectionState(editor);
  });

  // Register selection change listener
  editor.registerCommand(
    KEY_ENTER_COMMAND,
    () => {
      return false;
    },
    COMMAND_PRIORITY_NORMAL,
  );

  // Focus/blur handlers
  contentEditable.addEventListener("focus", () => {
    sendMessage({ type: "focus", payload: {} });
  });

  contentEditable.addEventListener("blur", () => {
    sendMessage({ type: "blur", payload: {} });
  });

  return editor;
}

// Check if editor content is empty and update placeholder visibility
function updatePlaceholderVisibility(editor: LexicalEditor): void {
  const rootElement = editor.getRootElement();
  if (!rootElement) return;

  editor.getEditorState().read(() => {
    const root = $getRoot();
    const textContent = root.getTextContent();
    const children = root.getChildren();

    const isEmpty =
      textContent.trim() === "" &&
      (children.length === 0 ||
        (children.length === 1 &&
          children[0].getType() === "paragraph" &&
          children[0].getTextContent() === ""));

    if (isEmpty) {
      rootElement.classList.add("show-placeholder");
    } else {
      rootElement.classList.remove("show-placeholder");
    }
  });
}

// Update and send selection state
function updateSelectionState(editor: LexicalEditor): void {
  editor.getEditorState().read(() => {
    const selection = $getSelection();

    if (!$isRangeSelection(selection)) {
      return;
    }

    const textColor = $getSelectionStyleValueForProperty(selection, "color", undefined);
    const backgroundColor = $getSelectionStyleValueForProperty(
      selection,
      "background-color",
      undefined,
    );

    const selectionState: SelectionState = {
      isBold: selection.hasFormat("bold"),
      isItalic: selection.hasFormat("italic"),
      isUnderline: selection.hasFormat("underline"),
      isStrikethrough: selection.hasFormat("strikethrough"),
      blockType: "paragraph",
      textColor: textColor || null,
      backgroundColor: backgroundColor || null,
      elementFormat: "left",
    };

    // Get block type and element format
    const anchorNode = selection.anchor.getNode();
    const element =
      anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();

    // Get element format (alignment)
    if ($isElementNode(element)) {
      selectionState.elementFormat = element.getFormatType() || "left";
    }

    if ($isHeadingNode(element)) {
      const tag = element.getTag();
      selectionState.blockType = tag as "h1" | "h2";
    } else if ($isListNode(element)) {
      const listType = element.getListType();
      selectionState.blockType = listType === "bullet" ? "bullet" : "number";
    } else {
      // Check parent for list
      const parent = anchorNode.getParent();
      if (parent) {
        const grandparent = parent.getParent();
        if (grandparent && $isListNode(grandparent)) {
          const listType = grandparent.getListType();
          selectionState.blockType = listType === "bullet" ? "bullet" : "number";
        }
      }
    }

    sendMessage({
      type: "selectionChange",
      payload: selectionState,
    });
  });
}

// Handle messages from React Native
function handleMessage(editor: LexicalEditor, message: MessageFromRN): void {
  switch (message.type) {
    case "setPlaceholder": {
      const rootElement = editor.getRootElement();
      if (rootElement) {
        rootElement.setAttribute("data-placeholder", String(message.payload || ""));
      }
      break;
    }

    case "focus":
      editor.focus();
      break;

    case "blur": {
      const rootElement = editor.getRootElement();
      rootElement?.blur();
      break;
    }

    case "getContent":
      editor.getEditorState().read(() => {
        const json = editor.getEditorState().toJSON();
        sendMessage({
          type: "contentChange",
          payload: { state: JSON.stringify(json) },
        });
      });
      break;

    case "formatText": {
      const format = message.payload as TextFormatType;
      editor.dispatchCommand(FORMAT_TEXT_COMMAND, format);
      break;
    }

    case "formatHeading": {
      const tag = message.payload as HeadingTagType | "paragraph";
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          if (tag === "paragraph") {
            $setBlocksType(selection, () => $createParagraphNode());
          } else {
            $setBlocksType(selection, () => $createHeadingNode(tag));
          }
        }
      });
      break;
    }

    case "formatList": {
      const listType = message.payload as "bullet" | "number" | "none";
      if (listType === "bullet") {
        editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND, undefined);
      } else if (listType === "number") {
        editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND, undefined);
      } else {
        editor.dispatchCommand(REMOVE_LIST_COMMAND, undefined);
      }
      break;
    }

    case "insertLink": {
      const url = message.payload as string;
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, url || null);
      break;
    }

    case "setContent": {
      const content = message.payload as string;
      try {
        const parsedState = editor.parseEditorState(content);
        editor.setEditorState(parsedState);
      } catch (error) {
        console.error("Failed to set content:", error);
      }
      break;
    }

    case "setEditable":
      editor.setEditable(message.payload !== false);
      break;

    case "insertDivider":
      editor.dispatchCommand(INSERT_DIVIDER_COMMAND, undefined);
      break;

    case "applyStyle": {
      const styles = message.payload as Record<string, string>;
      editor.update(() => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          $patchStyleText(selection, styles);
        }
      });
      break;
    }

    case "formatAlign": {
      const align = message.payload as ElementFormatType;
      editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, align);
      break;
    }

    case "undo":
      editor.dispatchCommand(UNDO_COMMAND, undefined);
      break;

    case "redo":
      editor.dispatchCommand(REDO_COMMAND, undefined);
      break;
  }
}

// Initialize on load
function main(): void {
  const editor = initEditor("テキストを入力...");

  // Expose message handler globally
  (
    window as Window & {
      handleMessage?: (data: string | MessageFromRN) => void;
    }
  ).handleMessage = (data: string | MessageFromRN) => {
    try {
      const message = typeof data === "string" ? JSON.parse(data) : data;
      handleMessage(editor, message);
    } catch (error) {
      console.error("Error handling message:", error);
      sendMessage({
        type: "error",
        payload: {
          message: error instanceof Error ? error.message : String(error),
        },
      });
    }
  };

  // Signal ready
  sendMessage({ type: "ready", payload: {} });
}

// Run when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", main);
} else {
  main();
}

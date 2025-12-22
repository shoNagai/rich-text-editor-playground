import { useRef, useCallback, useState } from "react";
import type { RichEditor } from "react-native-pell-rich-editor";

export type UsePellEditorOptions = {
  placeholder?: string;
  initialHtml?: string;
  onHtmlChange?: (html: string) => void;
};

export type PellEditorState = {
  isBold: boolean;
  isItalic: boolean;
  isUnderline: boolean;
  isStrikethrough: boolean;
  isH1: boolean;
  isH2: boolean;
  isBulletList: boolean;
  isOrderedList: boolean;
};

const defaultState: PellEditorState = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikethrough: false,
  isH1: false,
  isH2: false,
  isBulletList: false,
  isOrderedList: false,
};

export const usePellEditor = ({
  placeholder = "",
  initialHtml = "",
  onHtmlChange,
}: UsePellEditorOptions = {}) => {
  const editorRef = useRef<RichEditor>(null);
  const [editorState, setEditorState] = useState<PellEditorState>(defaultState);
  const [canUndo] = useState(false);
  const [canRedo] = useState(false);

  const handleChange = useCallback(
    (html: string) => {
      onHtmlChange?.(html);
    },
    [onHtmlChange],
  );

  const handleCursorPosition = useCallback((_scrollY: number) => {
    // This callback is used for scroll handling if needed
  }, []);

  // Track formatting state based on toolbar selection
  const handleSelectionChange = useCallback((items: string[]) => {
    setEditorState({
      isBold: items.includes("bold"),
      isItalic: items.includes("italic"),
      isUnderline: items.includes("underline"),
      isStrikethrough: items.includes("strikeThrough"),
      isH1: items.includes("heading1"),
      isH2: items.includes("heading2"),
      isBulletList: items.includes("unorderedList"),
      isOrderedList: items.includes("orderedList"),
    });
  }, []);

  // Editor commands
  const toggleBold = useCallback(() => {
    editorRef.current?.sendAction("bold", "result");
  }, []);

  const toggleItalic = useCallback(() => {
    editorRef.current?.sendAction("italic", "result");
  }, []);

  const toggleUnderline = useCallback(() => {
    editorRef.current?.sendAction("underline", "result");
  }, []);

  const toggleStrikethrough = useCallback(() => {
    editorRef.current?.sendAction("strikeThrough", "result");
  }, []);

  const toggleH1 = useCallback(() => {
    editorRef.current?.sendAction("heading1", "result");
  }, []);

  const toggleH2 = useCallback(() => {
    editorRef.current?.sendAction("heading2", "result");
  }, []);

  const toggleBulletList = useCallback(() => {
    editorRef.current?.sendAction("unorderedList", "result");
  }, []);

  const toggleOrderedList = useCallback(() => {
    editorRef.current?.sendAction("orderedList", "result");
  }, []);

  const insertImage = useCallback((url: string, _width?: number, _height?: number) => {
    const imageHtml = `<div class="pell-image-wrapper" contenteditable="false"><img src="${url}" alt="" /><button class="pell-image-delete-button" type="button" tabindex="-1" aria-label="画像を削除">×</button></div><p><br></p>`;
    editorRef.current?.insertHTML(imageHtml);
    setTimeout(() => {
      editorRef.current?.focusContentEditor();
    }, 100);
  }, []);

  const undo = useCallback(() => {
    editorRef.current?.sendAction("undo", "result");
  }, []);

  const redo = useCallback(() => {
    editorRef.current?.sendAction("redo", "result");
  }, []);

  const focus = useCallback(() => {
    editorRef.current?.focusContentEditor();
  }, []);

  const blur = useCallback(() => {
    editorRef.current?.blurContentEditor();
  }, []);

  return {
    editorRef,
    editorState,
    canUndo,
    canRedo,
    placeholder,
    initialHtml,
    handleChange,
    handleCursorPosition,
    handleSelectionChange,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikethrough,
    toggleH1,
    toggleH2,
    toggleBulletList,
    toggleOrderedList,
    insertImage,
    undo,
    redo,
    focus,
    blur,
  };
};

export type PellEditor = ReturnType<typeof usePellEditor>;

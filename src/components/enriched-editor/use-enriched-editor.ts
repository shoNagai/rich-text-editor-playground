import { useCallback, useMemo, useRef, useState } from "react";
import type {
  EnrichedTextInputInstance,
  EnrichedTextInputProps,
  OnChangeHtmlEvent,
  OnChangeSelectionEvent,
  OnChangeStateEvent,
} from "react-native-enriched";
import type { NativeSyntheticEvent } from "react-native";

const defaultStyleState: OnChangeStateEvent = {
  isBold: false,
  isItalic: false,
  isUnderline: false,
  isStrikeThrough: false,
  isInlineCode: false,
  isH1: false,
  isH2: false,
  isH3: false,
  isCodeBlock: false,
  isBlockQuote: false,
  isOrderedList: false,
  isUnorderedList: false,
  isLink: false,
  isImage: false,
  isMention: false,
};

export type EnrichedEditorState = {
  isFocused: boolean;
  styles: OnChangeStateEvent;
  selection: OnChangeSelectionEvent;
  html: string;
};

export type HeadingLevel = "paragraph" | "h1" | "h2" | "h3";
export type ListType = "ordered" | "unordered" | "none";

export type UseEnrichedEditorOptions = {
  placeholder?: string;
  initialHtml?: string;
  onHtmlChange?: (html: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
};

export const useEnrichedEditor = ({
  placeholder,
  initialHtml = "",
  onHtmlChange,
  onFocus,
  onBlur,
}: UseEnrichedEditorOptions = {}) => {
  const inputRef = useRef<EnrichedTextInputInstance>(null);
  const [editorState, setEditorState] = useState<EnrichedEditorState>({
    isFocused: false,
    styles: defaultStyleState,
    selection: { start: 0, end: 0, text: "" },
    html: initialHtml,
  });

  const handleChangeState = useCallback(
    (event: NativeSyntheticEvent<OnChangeStateEvent>) => {
      event.persist?.();
      const styles = { ...event.nativeEvent };
      setEditorState((prev) => ({ ...prev, styles }));
    },
    []
  );

  const handleChangeSelection = useCallback(
    (event: NativeSyntheticEvent<OnChangeSelectionEvent>) => {
      event.persist?.();
      const selection = { ...event.nativeEvent };
      setEditorState((prev) => ({ ...prev, selection }));
    },
    []
  );

  const handleChangeHtml = useCallback(
    (event: NativeSyntheticEvent<OnChangeHtmlEvent>) => {
      event.persist?.();
      const value = event.nativeEvent.value;
      setEditorState((prev) => ({ ...prev, html: value }));
      onHtmlChange?.(value);
    },
    [onHtmlChange]
  );

  const handleFocus = useCallback(() => {
    setEditorState((prev) => ({ ...prev, isFocused: true }));
    onFocus?.();
  }, [onFocus]);

  const handleBlur = useCallback(() => {
    setEditorState((prev) => ({ ...prev, isFocused: false }));
    onBlur?.();
  }, [onBlur]);

  const focus = useCallback(() => {
    inputRef.current?.focus();
  }, []);

  const blur = useCallback(() => {
    inputRef.current?.blur();
  }, []);

  const setContent = useCallback((html: string) => {
    inputRef.current?.setValue(html);
    setEditorState((prev) => ({ ...prev, html }));
  }, []);

  const toggleBold = useCallback(() => inputRef.current?.toggleBold(), []);
  const toggleItalic = useCallback(() => inputRef.current?.toggleItalic(), []);
  const toggleUnderline = useCallback(
    () => inputRef.current?.toggleUnderline(),
    []
  );
  const toggleStrikeThrough = useCallback(
    () => inputRef.current?.toggleStrikeThrough(),
    []
  );

  const setHeading = useCallback(
    (level: HeadingLevel) => {
      const { isH1, isH2, isH3 } = editorState.styles;
      if (level === "paragraph") {
        if (isH1) inputRef.current?.toggleH1();
        if (isH2) inputRef.current?.toggleH2();
        if (isH3) inputRef.current?.toggleH3();
        return;
      }

      if (level === "h1") {
        if (isH2) inputRef.current?.toggleH2();
        if (isH3) inputRef.current?.toggleH3();
        inputRef.current?.toggleH1();
        return;
      }

      if (level === "h2") {
        if (isH1) inputRef.current?.toggleH1();
        if (isH3) inputRef.current?.toggleH3();
        inputRef.current?.toggleH2();
        return;
      }

      if (isH1) inputRef.current?.toggleH1();
      if (isH2) inputRef.current?.toggleH2();
      inputRef.current?.toggleH3();
    },
    [editorState.styles]
  );

  const setList = useCallback(
    (type: ListType) => {
      const { isOrderedList, isUnorderedList } = editorState.styles;
      if (type === "none") {
        if (isOrderedList) inputRef.current?.toggleOrderedList();
        if (isUnorderedList) inputRef.current?.toggleUnorderedList();
        return;
      }
      if (type === "ordered") {
        if (isUnorderedList) inputRef.current?.toggleUnorderedList();
        inputRef.current?.toggleOrderedList();
        return;
      }
      if (isOrderedList) inputRef.current?.toggleOrderedList();
      inputRef.current?.toggleUnorderedList();
    },
    [editorState.styles]
  );

  const editorInputProps: Partial<EnrichedTextInputProps> = useMemo(
    () => ({
      placeholder,
      defaultValue: initialHtml,
      onChangeState: handleChangeState,
      onChangeSelection: handleChangeSelection,
      onChangeHtml: handleChangeHtml,
      onFocus: handleFocus,
      onBlur: handleBlur,
    }),
    [
      handleBlur,
      handleChangeHtml,
      handleChangeSelection,
      handleChangeState,
      handleFocus,
      initialHtml,
      placeholder,
    ]
  );

  return {
    inputRef,
    editorState,
    editorInputProps,
    focus,
    blur,
    setContent,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    toggleStrikeThrough,
    setHeading,
    setList,
  };
};

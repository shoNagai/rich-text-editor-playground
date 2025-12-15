# Rich Text Editor Playground

React Native で様々なリッチテキストエディタライブラリを試すためのプレイグラウンドアプリです。

## 技術スタック

- **Framework**: Expo SDK 54 + React Native 0.81
- **Routing**: expo-router (ファイルベースルーティング)
- **Language**: TypeScript

## 対応エディタ

- [x] **Lexical Editor** - Meta製のリッチテキストエディタ（WebView経由）

## プロジェクト構成

```
├── app/                          # expo-router ページ
│   ├── _layout.tsx               # ルートレイアウト
│   ├── index.tsx                 # トップページ（エディタ一覧）
│   └── lexical-editor.tsx        # Lexical Editor ページ
├── src/
│   └── components/
│       └── lexical-editor/       # Lexical Editor コンポーネント
│           ├── index.ts
│           ├── lexical-editor.tsx
│           ├── use-lexical-editor.ts
│           ├── editor-html.ts
│           └── web/              # WebView用ビルド
│               ├── build.mjs
│               └── editor-template.html
├── app.json                      # Expo設定
├── package.json
└── tsconfig.json
```

## セットアップ

```bash
# 依存パッケージのインストール
pnpm install

# Lexical EditorのWebViewバンドルをビルド
pnpm build:lexical
```

## 開発

```bash
# 開発サーバーの起動
pnpm start

# iOS シミュレータで実行
pnpm ios

# Android エミュレータで実行
pnpm android

# 型チェック
pnpm typecheck
```

## 要件

- Node.js 22.x
- pnpm >= 10
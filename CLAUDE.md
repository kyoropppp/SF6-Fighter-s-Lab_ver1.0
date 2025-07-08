# ストリートファイター6キャラクターデータベース

## プロジェクト概要

ストリートファイター6のキャラクター対策、強い行動、コンボレシピを管理するWebベースのデータベース。

## 技術スタック

- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Storage**: localStorage (自動保存)
- **Data Format**: JSON

## ファイル構成

```
sf6_database_ver2/
├── index.html                   # メインHTML
├── css/
│   └── style.css               # アプリケーションスタイル
├── js/
│   ├── app.js                  # アプリケーション制御
│   ├── character.js            # キャラクター表示
│   ├── data-loader.js          # データ読み込み
│   ├── data.js                 # データ管理・ストレージ統合
│   ├── editor.js               # 編集機能
│   └── storage.js              # データ保存・読み込み
└── data/
    ├── characters.json         # キャラクター基本情報
    ├── counter_strategies.json # 対策データ
    ├── strong_actions.json     # 強い行動データ
    ├── combo_recipes.json      # コンボレシピ
    └── settings.json          # アプリ設定
```

## 主要機能

### キャラクター選択
- 18キャラクターの一覧表示
- キャラクターアイコンクリックで詳細表示

### データ表示モード
1. **対策**: 確定反撃、対空、弱点対処
2. **強い行動**: 主力技、連係、起き攻め
3. **コンボ**: 基本、状況別、ゲージ使用コンボ
4. **データ管理**: 保存・インポート・エクスポート

### データ編集
- 編集モードでリアルタイム編集
- カテゴリ・アイテムの追加・削除
- 自動保存（localStorage）

### データ管理
- JSONファイルからインポート
- データエクスポート
- 設定ファイルからサンプルデータ読み込み

## データ構造

### 統一データフォーマット
全ての項目で統一された構造を使用：
```json
{
  "item_name": "項目名",
  "content": "内容",
  "description": "詳細説明"
}
```

### キャラクターデータ構造
```json
{
  "characterId": "ryu",
  "characterName": "リュウ",
  "categoryNames": {
    "punishes": "確定反撃",
    "antiAir": "対空対策", 
    "user1" : "俺的ワンポイント対策",
  },
  "punishes": [
    {
      "item_name": "波動拳",
      "content": "タイミングを合わせてジャンプ攻撃",
      "description": "中距離から波動拳を撃たれた場合の対処"
    }
  ],
  "antiAir": [
    {
      "item_name": "ジャンプ大K",
      "content": "ジャストパリィ or 屈大P or 昇竜拳",
      "description": "リュウの大Kは長いので、きついと思ったらガードでも全然いい" 
    }
  ],
  "user1" :{
    {
      "item_name": "ラッシュ対策",
      "content": "ラッシュをガン見して、立Pで止める",
      "description": "距離に合わせて小中大を選択" 
    }
  }
  
}
```

## 重要な設計原則

### 1. localStorage統合
- `SF6_DATA` ProxyによりlocalStorageと自動同期
- データ変更時の自動保存
- 手動保存操作不要

### 2. 汎用性
- カテゴリ名の動的表示
- 統一データフォーマット
- 柔軟なデータ構造

### 3. 編集機能
- Web上でのリアルタイム編集
- カテゴリの動的追加・削除
- バリデーション機能

## キーボードショートカット

- `Ctrl+S`: データ保存
- `Ctrl+F`: 検索フォーカス  
- `Ctrl+O`: ファイルインポート
- `ESC`: 検索クリア
- `1-4`: タブ切り替え

## データファイル要件

### categoryNames必須
全データファイルで `categoryNames` オブジェクト必須：
```json
{
  "characterId": "ryu",
  "categoryNames": {
    "punishes": "確定反撃"
  },
  "punishes": [...]
}
```

### インポート対応形式
- ネスト形式: `{ "counterStrategies": { "strategies": [...] } }`
- フラット形式: `{ "strategies": [...] }`

## 開発・運用

### 初回起動
1. JSONファイル選択またはサンプルデータ使用
2. データの自動localStorage保存
3. 以降はlocalStorageから自動読み込み

### データ更新
1. 編集モードでWeb上編集
2. JSONファイルインポート
3. エクスポートファイルで他環境へ移行

### バックアップ
- エクスポート機能で定期バックアップ推奨
- `sf6_database_export.json` ファイル生成
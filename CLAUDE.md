# ストリートファイター6キャラクターデータベース

## プロジェクト概要

ストリートファイター6のキャラクター対策、強い行動、コンボレシピを管理するWebベースのデータベース。汎用的なデータ構造により他の格闘ゲームにも応用可能。

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
    └── data.json              # 全データ統一ファイル（汎用性重視）
```

## 統一ファイル構造の利点

### データ管理の簡素化
- **一元管理**: 全キャラクターデータが1つのファイルに集約
- **整合性保証**: データの一貫性を容易に維持
- **バックアップ効率**: 1ファイルで完全なデータバックアップ

### エクスポート/インポートとの整合性
- **完全互換**: エクスポートしたファイルをそのまま初期データとして利用可能
- **環境移行**: 1ファイルで他の環境へ完全移植
- **データ配布**: コミュニティでのデータ共有が簡単

### 汎用性の実現
- **ゲーム横断対応**: "strategies", "actions", "combos" 構造は格闘ゲーム全般に適用
- **拡張性**: 新カテゴリの追加が容易
- **プラットフォーム移植性**: 他のツールやアプリケーションでの再利用が可能

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
全ての項目（対策・強い行動・コンボ）で統一された構造を使用：
```json
{
  "item_name": "項目名",
  "content": "内容",
  "description": "詳細説明"
}
```

### 対策データ構造 (counter_strategies.json)
```json
{
  "characterId": "ryu",
  "characterName": "リュウ",
  "categoryNames": {
    "punishes": "確定反撃",
    "antiAir": "対空対策",
    "weaknesses": "弱点・対処法",
    "user1": "俺的ワンポイント対策"
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
  "user1": [
    {
      "item_name": "ラッシュ対策",
      "content": "ラッシュをガン見して、立Pで止める",
      "description": "距離に合わせて小中大を選択"
    }
  ]
}
```

### 強い行動データ構造 (strong_actions.json)
```json
{
  "characterId": "ryu",
  "characterName": "リュウ",
  "categoryNames": {
    "strongMoves": "主力技",
    "strongSequences": "強力な連係",
    "okizeme": "起き攻め・セットプレイ",
    "user2": "使える小ネタ"
  },
  "strongMoves": [
    {
      "item_name": "立ち中K",
      "content": "牽制技として優秀",
      "description": "リーチが長く、ヒット時は波動拳でフォロー"
    }
  ],
  "user2": [
    {
      "item_name": "投げ後の起き攻め",
      "content": "前ステップ → 打撃 or 投げ二択",
      "description": "相手のリバーサルを読んだらガードして反撃"
    }
  ]
}
```

### コンボデータ構造 (combo_recipes.json)
```json
{
  "characterId": "ryu",
  "characterName": "リュウ",
  "categoryNames": {
    "basicCombos": "基本コンボ",
    "situationalCombos": "状況別コンボ",
    "meterCombos": "ゲージ使用コンボ",
    "user3": "オリジナルコンボ"
  },
  "basicCombos": [
    {
      "item_name": "屈中K → 波動拳",
      "content": "ダメージ: 240",
      "description": "基本的な確定コンボ。初心者にも簡単"
    }
  ],
  "user3": [
    {
      "item_name": "カウンター限定コンボ",
      "content": "立ち中K(CH) → 前歩き → 屈中P → 昇龍拳",
      "description": "カウンターヒット限定の高ダメージコンボ"
    }
  ]
}
```

### ユーザ作成カテゴリの仕組み

#### カテゴリ作成プロセス
1. 編集モードで「新しいカテゴリを追加」ボタンをクリック
2. ユーザがカテゴリ名を入力（例：「俺的コンボ」）
3. システムが内部キー "user1", "user2", "user3"... を自動割り当て
4. `categoryNames` に追加：
   ```json
   "categoryNames": {
     "punishes": "確定反撃",
     "user1": "俺的コンボ"
   }
   ```
5. 対応するデータ配列を初期化：
   ```json
   "user1": []
   ```

#### アイテム追加プロセス
1. ユーザ作成カテゴリで「新しいアイテムを追加」をクリック
2. 編集フォームが表示：
   - **アイテム名**: 技名やコンボ名など
   - **内容**: 基本的な情報や手順
   - **説明**: 詳細な解説や注意点
3. 保存時に統一フォーマットで配列に追加

### HTMLとJSON連携

#### 動的ヘッダー表示
- `index.html` では静的なキャラクター一覧を定義
- `character.js` の `renderCounterStrategies()` 等がJSONの `categoryNames` を参照
- カテゴリヘッダーはJSONの表示名を動的に表示：
  ```javascript
  Object.entries(categoryNames).forEach(([key, name]) => {
      // name = "確定反撃" や "俺的コンボ" 等のユーザー表示名
      container.innerHTML += `<h3>${name}</h3>`;
  });
  ```

## 重要な設計原則

### 1. データ永続化
- **データ保存**: 編集内容は自動的にブラウザに保存される
- **エクスポート**: 保存されたデータをJSONファイルとして出力
- **インポート**: JSONファイルでブラウザの保存データを更新
- **永続性**: ブラウザを閉じても次回起動時にデータを保持

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

## インポート・エクスポート形式

### 基本仕様
**エクスポートしたJSONファイルはそのままインポート可能**

### エクスポート形式
- **処理ファイル**: editor.js
- **出力ファイル名**: sf6_database_export.json
- **形式**: フラット形式（トップレベルキー配置）

```json
{
  "characters": {
    "characters": [...]
  },
  "strategies": [
    {
      "characterId": "ryu",
      "characterName": "リュウ",
      "categoryNames": {
        "punishes": "確定反撃",
        "antiAir": "対空対策"
      },
      "punishes": [...],
      "antiAir": [...]
    }
  ],
  "actions": [
    {
      "characterId": "ryu",
      "characterName": "リュウ",
      "categoryNames": {
        "strongMoves": "主力技",
        "strongSequences": "強力な連係"
      },
      "strongMoves": [...],
      "strongSequences": [...]
    }
  ],
  "combos": [
    {
      "characterId": "ryu",
      "characterName": "リュウ",
      "categoryNames": {
        "basicCombos": "基本コンボ",
        "situationalCombos": "状況別コンボ"
      },
      "basicCombos": [...],
      "situationalCombos": [...]
    }
  ],
  "settings": {
    "display": {...},
    "characterOrder": [...],
    "userSettings": {...}
  }
}
```

### インポート対応形式
- **処理ファイル**: storage.js
- **対応形式**: フラット形式・ネスト形式の両方

#### フラット形式（エクスポートファイル互換）
```json
{
  "characters": {...},
  "strategies": [...],
  "actions": [...],
  "combos": [...],
  "settings": {...}
}
```

#### ネスト形式（個別JSONファイル）
```json
{
  "characters": {...},
  "counterStrategies": {
    "strategies": [...]
  },
  "strongActions": {
    "actions": [...]
  },
  "comboRecipes": {
    "combos": [...]
  },
  "settings": {...}
}
```

### バリデーション要件
- 全キャラクターデータで `categoryNames` オブジェクト必須
- フラット・ネスト形式問わず同一バリデーション適用
- エラー時は具体的なキャラクターIDとともにエラー出力

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
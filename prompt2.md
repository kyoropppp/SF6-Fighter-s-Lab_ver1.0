### 250708
提案は必要最小限の構成で、日本語で答えること. 
read the whole project then recreate CLAUDE.md

---

think hard; 次の内容をCLAUDE.mdに追加・編集.

- 「### キャラクターデータ構造」の項目は、対策(strategies)のタブの内容と思われる. 
- 強い行動(StrongActions)、コンボ(comborecipes)においても、同じようなJSON形式を要求する.
    - すなわち、要素は下記の構成;
    ```
    {
        "item_name": "項目名",
        "content": "内容",
        "description": "詳細説明"
    }
    ```
- ユーザによって、カテゴリ作成が行われた場合は、
    - "categoryNames" に次を追加.
        - "user〇"(〇は数字)などを内部で割り当て("user2"とする). 
        - 表示名はユーザが入力するカテゴリ名("display_name"とする).
        - すなわち、"categoryNames"に下記が追加される.
        ```
        "categoryNames": {
            "punishes": "確定反撃",
            "antiAir": "対空対策", 
            "user1" : "俺的ワンポイント対策",
            ...
            "user2" : "display_name",
        },
        ``` 
    - カテゴリ作成後、「アイテム名」「内容」「説明」を入力する欄が表示される. 入力後, key に次を追加.
        ```
        "user2": [
            {
                "item_name": "...",
                "content": "...",
                "description": "..."
            }
        ],
        ```
- また、index.htmlでは、JSONからヘッダーの文字列は取得・表示する. 

---

think hard; インポートおよびエクスポートするJSON形式の明記

---

開発者は、CLAUDE.mdを読んで実装を行う. 各JSファイルの役割は明記しつつ、"editor.js:532-538の処理に基づく正確な構造"のように、JSの内容そのものには触れない. 

---

think hard; export時には localStrage の内容を出力し、import時には、localStrageの内容を書き換える、という記述がほしい。それを考えた時、下記は必要？

### 1. localStorage統合
- `SF6_DATA` ProxyによりlocalStorageと自動同期
- データ変更時の自動保存
- 手動保存操作不要

---
ultrathink; I ask you if this structure below is appropriate;
    ├── counter_strategies.json # 対策データ
    ├── strong_actions.json     # 強い行動データ
    ├── combo_recipes.json      # コンボレシピ

データは汎用性が高くなるよう目指しており、すべてまとめて"data.json"としたエクスポートやインポートにも便利では？ あなたの意見は？

---
think hard; read CLAUDE.md again then edit the content with instructions below.
1. このファイルは、変更点の記載ではなく、仕様書としての構成で作成. 
1. 現在の構成と異なる点は修正. 
1. 但し、
#### カテゴリ作成プロセス
#### アイテム追加プロセス
#### 動的ヘッダー表示
をはじめとして、内容自体の簡素化は行わない. あくまで、仕様書としての体裁への変更. 

---
Thanks. 
think; 続いて、下記を明記するにはどのように書けばいいか？
- サンプルデータを枠組みの中に絶対に紛れ込ませたくない！
    - サンプルデータ専用の関数は絶対に作成しない. 
    - サンプルデータを作る場合は、data.jsonへと書き込む。初回起動時、それをインポートすればいい. 

--- 

read whole the project, understand the structure, and plan the layout changes below;  
- 「キャラクター選択」を左側のリストへ移動
- キャラクターを選択したら、選択されたキャラクターの「対策」へ遷移

--- 




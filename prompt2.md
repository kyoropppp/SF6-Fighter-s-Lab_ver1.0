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




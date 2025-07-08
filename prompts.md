data.jsにデータそのものを書くべきでない。

run below;
1. data.jsに現在書かれている具体的な内容をJSONファイルへと書き換え
2. ブラウザでは、JSONをユーザ操作で読み込む（fetchするのに権限がいるため）
3. 読み込みデータを、localStrageに書き込む.

---

give your opinion; ファイルをインポートしても、「対策」「強い行動」「コンボ」などが変更されない.
my idea:
- JSONファイルインポートは成功する.
- インポート後の処理に問題
- localstrageのデータ書き換えができていない？

---

predict; what do you think will be shown in Ryu when importing JSON below:

```
{
  "characters": {
    "characters": [
      {
        "id": "ryu",
        "name": "リュウ",
        "nameEn": "Ryu",
        "icon": "images/characters/ryu.png"
      },
      {
        "id": "chun-li",
        "name": "春麗",
        "nameEn": "Chun-Li",
        "icon": "images/characters/chun-li.png"
      },
      {
        "id": "luke",
        "name": "ルーク",
        "nameEn": "Luke",
        "icon": "images/characters/luke.png"
      },
      {
        "id": "jamie",
        "name": "ジェイミー",
        "nameEn": "Jamie",
        "icon": "images/characters/jamie.png"
      },
      {
        "id": "manon",
        "name": "マノン",
        "nameEn": "Manon",
        "icon": "images/characters/manon.png"
      },
      {
        "id": "kimberly",
        "name": "キンバリー",
        "nameEn": "Kimberly",
        "icon": "images/characters/kimberly.png"
      },
      {
        "id": "marisa",
        "name": "マリーザ",
        "nameEn": "Marisa",
        "icon": "images/characters/marisa.png"
      },
      {
        "id": "jp",
        "name": "JP",
        "nameEn": "JP",
        "icon": "images/characters/jp.png"
      },
      {
        "id": "juri",
        "name": "ジュリ",
        "nameEn": "Juri",
        "icon": "images/characters/juri.png"
      },
      {
        "id": "dee-jay",
        "name": "ディージェイ",
        "nameEn": "Dee Jay",
        "icon": "images/characters/dee-jay.png"
      },
      {
        "id": "cammy",
        "name": "キャミィ",
        "nameEn": "Cammy",
        "icon": "images/characters/cammy.png"
      },
      {
        "id": "lily",
        "name": "リリー",
        "nameEn": "Lily",
        "icon": "images/characters/lily.png"
      },
      {
        "id": "zangief",
        "name": "ザンギエフ",
        "nameEn": "Zangief",
        "icon": "images/characters/zangief.png"
      },
      {
        "id": "ken",
        "name": "ケン",
        "nameEn": "Ken",
        "icon": "images/characters/ken.png"
      },
      {
        "id": "blanka",
        "name": "ブランカ",
        "nameEn": "Blanka",
        "icon": "images/characters/blanka.png"
      },
      {
        "id": "dhalsim",
        "name": "ダルシム",
        "nameEn": "Dhalsim",
        "icon": "images/characters/dhalsim.png"
      },
      {
        "id": "honda",
        "name": "本田",
        "nameEn": "E. Honda",
        "icon": "images/characters/honda.png"
      },
      {
        "id": "guile",
        "name": "ガイル",
        "nameEn": "Guile",
        "icon": "images/characters/guile.png"
      }
    ]
  },
  "settings": {
    "display": {
      "theme": "dark",
      "fontSize": "medium",
      "defaultMode": "counter"
    },
    "characterOrder": [
      "ryu",
      "chun-li",
      "luke",
      "jamie",
      "manon",
      "kimberly",
      "marisa",
      "jp",
      "juri",
      "dee-jay",
      "cammy",
      "lily",
      "zangief",
      "ken",
      "blanka",
      "dhalsim",
      "honda",
      "guile"
    ],
    "userSettings": {
      "favoriteCharacters": [],
      "recentlyViewed": []
    }
  }
}
```

---

fix; しかし、このJSONを読み込んでも、読み込み前と処理が変わらない。プロジェクト全体の「表示されるオブジェクト」の流れを追跡し、原因を探索。

---

change; JSONが部分的であれば、記載のない箇所は既存のデータを使わずに、空にする  

---

problem: JSONがインポートしても、localStrageのデータが表示される.
change; 
- JSONがインポート -> localstrageのデータをJSONで上書き. 

---
show your opinion; 
problem: 「データをエクスポート」-> 下記のJSONが出力される -> 対策・強い行動・コンボに、JSONの内容が反映されていない.

```
{
  "characters": {
    "characters": [
      {
        "id": "ryu",
        "name": "リュウ",
        "nameEn": "Ryu",
        "icon": "images/characters/ryu.png"
      },
      {
        "id": "chun-li",
        "name": "春麗",
        "nameEn": "Chun-Li",
        "icon": "images/characters/chun-li.png"
      },
      {
        "id": "luke",
        "name": "ルーク",
        "nameEn": "Luke",
        "icon": "images/characters/luke.png"
      },
      {
        "id": "jamie",
        "name": "ジェイミー",
        "nameEn": "Jamie",
        "icon": "images/characters/jamie.png"
      },
      {
        "id": "manon",
        "name": "マノン",
        "nameEn": "Manon",
        "icon": "images/characters/manon.png"
      },
      {
        "id": "kimberly",
        "name": "キンバリー",
        "nameEn": "Kimberly",
        "icon": "images/characters/kimberly.png"
      },
      {
        "id": "marisa",
        "name": "マリーザ",
        "nameEn": "Marisa",
        "icon": "images/characters/marisa.png"
      },
      {
        "id": "jp",
        "name": "JP",
        "nameEn": "JP",
        "icon": "images/characters/jp.png"
      },
      {
        "id": "juri",
        "name": "ジュリ",
        "nameEn": "Juri",
        "icon": "images/characters/juri.png"
      },
      {
        "id": "dee-jay",
        "name": "ディージェイ",
        "nameEn": "Dee Jay",
        "icon": "images/characters/dee-jay.png"
      },
      {
        "id": "cammy",
        "name": "キャミィ",
        "nameEn": "Cammy",
        "icon": "images/characters/cammy.png"
      },
      {
        "id": "lily",
        "name": "リリー",
        "nameEn": "Lily",
        "icon": "images/characters/lily.png"
      },
      {
        "id": "zangief",
        "name": "ザンギエフ",
        "nameEn": "Zangief",
        "icon": "images/characters/zangief.png"
      },
      {
        "id": "ken",
        "name": "ケン",
        "nameEn": "Ken",
        "icon": "images/characters/ken.png"
      },
      {
        "id": "blanka",
        "name": "ブランカ",
        "nameEn": "Blanka",
        "icon": "images/characters/blanka.png"
      },
      {
        "id": "dhalsim",
        "name": "ダルシム",
        "nameEn": "Dhalsim",
        "icon": "images/characters/dhalsim.png"
      },
      {
        "id": "honda",
        "name": "本田",
        "nameEn": "E. Honda",
        "icon": "images/characters/honda.png"
      },
      {
        "id": "guile",
        "name": "ガイル",
        "nameEn": "Guile",
        "icon": "images/characters/guile.png"
      }
    ]
  },
  "counterStrategies": {
    "strategies": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "punishes": [],
        "antiAir": [
          {
            "situation": "ジャンプ攻撃",
            "counter": "立ち強P",
            "description": "リュウの昇龍拳が来る前に早めに対空を出す"
          }
        ],
        "weaknesses": [
          {
            "situation": "起き攻め",
            "description": "リバーサル昇龍拳を意識して攻撃とガードを使い分ける"
          },
          {
            "situation": "中距離戦",
            "description": "波動拳に対してはジャンプかダッシュで接近する"
          }
        ],
        "trt": []
      },
      {
        "characterId": "chun-li",
        "characterName": "春麗",
        "punishes": [
          {
            "move": "スピニングバードキック",
            "punish": "投げ",
            "description": "ガード後は投げが確定する"
          },
          {
            "move": "気功拳",
            "punish": "ジャンプ攻撃",
            "description": "遠距離から気功拳を撃たれた場合の対処"
          }
        ],
        "antiAir": [
          {
            "situation": "春麗のジャンプ攻撃",
            "counter": "早めの対空",
            "description": "春麗のジャンプ攻撃は強力なので早めに対空する"
          }
        ],
        "weaknesses": [
          {
            "situation": "足技の後",
            "description": "一部の足技は不利なので反撃のチャンス"
          },
          {
            "situation": "中距離での牽制",
            "description": "間合いを詰めて足技の間合いに入らないようにする"
          }
        ]
      },
      {
        "characterId": "luke",
        "characterName": "ルーク",
        "punishes": [
          {
            "move": "フラッシュナックル",
            "punish": "大ダメージコンボ",
            "description": "ガード後は大幅に不利なので確実に反撃"
          }
        ],
        "antiAir": [
          {
            "situation": "ルークのジャンプ攻撃",
            "counter": "対空技",
            "description": "ルークのジャンプ攻撃は判定が強いので注意"
          }
        ],
        "weaknesses": [
          {
            "situation": "遠距離戦",
            "description": "サンドブラスト対策として間合いを調整する"
          }
        ]
      }
    ]
  },
  "strongActions": {
    "actions": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "strongMoves": [
          {
            "move": "波動拳",
            "type": "飛び道具",
            "description": "基本的な飛び道具。間合いを制御し、相手の動きを制限"
          }
        ],
        "strongSequences": [
          {
            "sequence": "立ち中P → 波動拳",
            "description": "基本的な牽制連係。ガードされても波動拳で安全"
          },
          {
            "sequence": "屈中K → 波動拳",
            "description": "下段からの連係。相手の立ちガードを崩す"
          }
        ],
        "okizeme": [
          {
            "setup": "投げ後",
            "pattern": "前ステップ → 打撃 or 投げ",
            "description": "投げ後は有利な状況。二択攻撃で攻める"
          }
        ]
      },
      {
        "characterId": "chun-li",
        "characterName": "春麗",
        "strongMoves": [
          {
            "move": "立ち中K",
            "type": "牽制技",
            "description": "リーチが長く判定も強い。中距離戦の主力"
          },
          {
            "move": "屈中K",
            "type": "足技",
            "description": "下段攻撃。連続で出すことで相手を押し返す"
          },
          {
            "move": "百裂脚",
            "type": "連続技",
            "description": "削り値が高い。ガードされても有利フレーム"
          }
        ],
        "strongSequences": [
          {
            "sequence": "屈中K → 立ち中K",
            "description": "足技連係。相手を画面端に追い込む"
          },
          {
            "sequence": "ジャンプ中K → 屈中K → 百裂脚",
            "description": "飛び込みからの基本連係"
          }
        ],
        "okizeme": [
          {
            "setup": "気功拳ダウン後",
            "pattern": "前ジャンプ → めくり or 表",
            "description": "気功拳でダウンを奪った後の択攻め"
          }
        ]
      },
      {
        "characterId": "luke",
        "characterName": "ルーク",
        "strongMoves": [
          {
            "move": "立ち中P",
            "type": "牽制技",
            "description": "リーチが長く、ヒット時は追撃可能"
          },
          {
            "move": "サンドブラスト",
            "type": "飛び道具",
            "description": "中距離から相手を牽制する飛び道具"
          },
          {
            "move": "ライジングアッパー",
            "type": "対空技",
            "description": "無敵時間のある対空技"
          }
        ],
        "strongSequences": [
          {
            "sequence": "立ち中P → サンドブラスト",
            "description": "基本的な牽制連係"
          },
          {
            "sequence": "屈中P → フラッシュナックル",
            "description": "中距離からの連係攻撃"
          }
        ],
        "okizeme": [
          {
            "setup": "フラッシュナックル後",
            "pattern": "前ステップ → 中下段択",
            "description": "フラッシュナックル後の攻め継続"
          }
        ]
      }
    ]
  },
  "comboRecipes": {
    "combos": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "basicCombos": [
          {
            "combo": "屈中K → 波動拳",
            "damage": "240",
            "difficulty": "easy",
            "description": "基本的な確定コンボ。初心者にも簡単"
          },
          {
            "combo": "屈中P → 屈中K → 波動拳",
            "damage": "320",
            "difficulty": "easy",
            "description": "3段コンボ。確実に決められるように練習"
          },
          {
            "combo": "ジャンプ中K → 屈中P → 屈中K → 波動拳",
            "damage": "380",
            "difficulty": "medium",
            "description": "飛び込みからの基本コンボ"
          }
        ],
        "situationalCombos": [
          {
            "situation": "対空ヒット",
            "combo": "昇龍拳 → SA1",
            "damage": "450",
            "description": "対空昇龍拳からスーパーアーツに繋ぐ"
          },
          {
            "situation": "カウンターヒット",
            "combo": "立ち中K(CH) → 屈中P → 屈中K → 波動拳",
            "damage": "420",
            "description": "カウンターヒット時の追撃コンボ"
          }
        ],
        "meterCombos": [
          {
            "meterCost": "ODゲージ1本",
            "combo": "屈中K → OD波動拳 → SA1",
            "damage": "580",
            "description": "ODゲージを使った高ダメージコンボ"
          }
        ]
      },
      {
        "characterId": "chun-li",
        "characterName": "春麗",
        "basicCombos": [
          {
            "combo": "屈中K → 立ち中K",
            "damage": "220",
            "difficulty": "easy",
            "description": "基本的な足技連係"
          },
          {
            "combo": "屈中K → 立ち中K → 気功拳",
            "damage": "300",
            "difficulty": "easy",
            "description": "足技から気功拳への連係"
          },
          {
            "combo": "ジャンプ中K → 屈中K → 百裂脚",
            "damage": "350",
            "difficulty": "medium",
            "description": "飛び込みからの基本コンボ"
          }
        ],
        "situationalCombos": [
          {
            "situation": "画面端",
            "combo": "屈中K → 立ち中K → 立ち強K → SA1",
            "damage": "480",
            "description": "画面端での高ダメージコンボ"
          },
          {
            "situation": "対空ヒット",
            "combo": "立ち中P → SA2",
            "damage": "420",
            "description": "対空からスーパーアーツ"
          }
        ],
        "meterCombos": [
          {
            "meterCost": "ODゲージ1本",
            "combo": "屈中K → OD百裂脚 → SA3",
            "damage": "620",
            "description": "ODゲージを使った最大ダメージコンボ"
          }
        ]
      },
      {
        "characterId": "luke",
        "characterName": "ルーク",
        "basicCombos": [
          {
            "combo": "屈中P → フラッシュナックル",
            "damage": "280",
            "difficulty": "easy",
            "description": "基本的な確定コンボ"
          },
          {
            "combo": "立ち中P → 屈中P → フラッシュナックル",
            "damage": "360",
            "difficulty": "medium",
            "description": "中距離からの連係コンボ"
          }
        ],
        "situationalCombos": [
          {
            "situation": "カウンターヒット",
            "combo": "立ち中P(CH) → 前ステップ → 屈中P → フラッシュナックル",
            "damage": "420",
            "description": "カウンターヒット時の追撃"
          }
        ],
        "meterCombos": [
          {
            "meterCost": "ODゲージ1本",
            "combo": "屈中P → ODフラッシュナックル → SA1",
            "damage": "550",
            "description": "ODゲージを使った高ダメージコンボ"
          }
        ]
      }
    ]
  },
  "settings": {
    "display": {
      "theme": "dark",
      "fontSize": "medium",
      "defaultMode": "counter"
    },
    "characterOrder": [
      "ryu",
      "chun-li",
      "luke",
      "jamie",
      "manon",
      "kimberly",
      "marisa",
      "jp",
      "juri",
      "dee-jay",
      "cammy",
      "lily",
      "zangief",
      "ken",
      "blanka",
      "dhalsim",
      "honda",
      "guile"
    ],
    "userSettings": {
      "favoriteCharacters": [],
      "recentlyViewed": []
    }
  }
}
```

---

track; 「データを保存」は具体的に何を行うか？   

---

saveData()では、どこにある、どの値を、localStrageに保存しているか？詳細に   

---

track; 「データをエクスポート」では、何が出力されるか？    

---

saveData()が書き込まれている先と、exportData()によって読み込まれる参照元は"全く"同じ場所か？ 

---

track; 「データをエクスポート」で出力されるのはlocalstrageの値？  

---

ask; SF6_data と localstrage を分ける意味は？ 

---

(change to "plan mode")
show your fixing plans    

---

Is phase 4 necesarry for this changes?   

---

今後、必要最低限の変更を提案すること. show your fixing plans again     

---

SF6_DATAとlocalStrageは統合可能か？  

---

unify SF6_DATA and lcalStrage, then show your fixing plans        

---

think hard; 「ファイルからインポート」後に、F5を押さないと内容が変更されない.

---
# 以下、"plan-mode"
---

fix; エクスポートしたファイルが、「ファイルをインポート」によって読み込める形でない（”無効な形式です”）

---

delete; 「バックアップ・復元」の処理

---

[最適化させたい]
ultrathink; I require optimization of the JS files.
- purpose: simplify these JS files then enable to read more easily
- restrictions: do not delete used functions or params.
- background and problems: We've made this projects adding various functions. It tends to get redundant. You DON'T have to change if the project is structually simple and readable.

---

think hard;

phenomenon 1: 「ファイルからインポート」を選択 -> JSON(A)を選択 -> この時点で「対策」「強い行動」「コンボ」などは変更されていない(F5更新で反映) -> データをエクスポートを選択し、この時のJSONを確認 -> (A)で読み込んだJSONと同じ形式となる.

phenomenon 2: 「ファイルからインポート」を選択 -> JSON(B)を選択 -> 「対策」「強い行動」「コンボ」などは変更されている. 

problem: 同じ処理を経ているにも関わらず、ファイルの中身によって反映されるタイミングが異なる.

my idea: 中身が empty である場合の分岐が影響?

read JS files, then show your analysys and opinion


(A)
```
{
  "characters": {
    "characters": [
      {
        "id": "ryu",
        "name": "リュウ",
        "nameEn": "Ryu",
        "icon": "images/characters/ryu.png"
      },
      {
        "id": "chun-li",
        "name": "春麗",
        "nameEn": "Chun-Li",
        "icon": "images/characters/chun-li.png"
      },
      {
        "id": "luke",
        "name": "ルーク",
        "nameEn": "Luke",
        "icon": "images/characters/luke.png"
      },
      {
        "id": "jamie",
        "name": "ジェイミー",
        "nameEn": "Jamie",
        "icon": "images/characters/jamie.png"
      },
      {
        "id": "manon",
        "name": "マノン",
        "nameEn": "Manon",
        "icon": "images/characters/manon.png"
      },
      {
        "id": "kimberly",
        "name": "キンバリー",
        "nameEn": "Kimberly",
        "icon": "images/characters/kimberly.png"
      },
      {
        "id": "marisa",
        "name": "マリーザ",
        "nameEn": "Marisa",
        "icon": "images/characters/marisa.png"
      },
      {
        "id": "jp",
        "name": "JP",
        "nameEn": "JP",
        "icon": "images/characters/jp.png"
      },
      {
        "id": "juri",
        "name": "ジュリ",
        "nameEn": "Juri",
        "icon": "images/characters/juri.png"
      },
      {
        "id": "dee-jay",
        "name": "ディージェイ",
        "nameEn": "Dee Jay",
        "icon": "images/characters/dee-jay.png"
      },
      {
        "id": "cammy",
        "name": "キャミィ",
        "nameEn": "Cammy",
        "icon": "images/characters/cammy.png"
      },
      {
        "id": "lily",
        "name": "リリー",
        "nameEn": "Lily",
        "icon": "images/characters/lily.png"
      },
      {
        "id": "zangief",
        "name": "ザンギエフ",
        "nameEn": "Zangief",
        "icon": "images/characters/zangief.png"
      },
      {
        "id": "ken",
        "name": "ケン",
        "nameEn": "Ken",
        "icon": "images/characters/ken.png"
      },
      {
        "id": "blanka",
        "name": "ブランカ",
        "nameEn": "Blanka",
        "icon": "images/characters/blanka.png"
      },
      {
        "id": "dhalsim",
        "name": "ダルシム",
        "nameEn": "Dhalsim",
        "icon": "images/characters/dhalsim.png"
      },
      {
        "id": "honda",
        "name": "本田",
        "nameEn": "E. Honda",
        "icon": "images/characters/honda.png"
      },
      {
        "id": "guile",
        "name": "ガイル",
        "nameEn": "Guile",
        "icon": "images/characters/guile.png"
      }
    ]
  },
  "counterStrategies": {
    "strategies": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "punishes": [],
        "antiAir": [
          {
            "situation": "ジャンプ攻撃",
            "counter": "立ち強P",
            "description": "リュウの昇龍拳が来る前に早めに対空を出す"
          }
        ],
        "weaknesses": [
          {
            "situation": "起き攻め",
            "description": "リバーサル昇龍拳を意識して攻撃とガードを使い分ける"
          },
          {
            "situation": "中距離戦",
            "description": "波動拳に対してはジャンプかダッシュで接近する"
          }
        ],
        "trt": []
      },
      {
        "characterId": "chun-li",
        "characterName": "春麗",
        "punishes": [
          {
            "move": "スピニングバードキック",
            "punish": "投げ",
            "description": "ガード後は投げが確定する"
          },
          {
            "move": "気功拳",
            "punish": "ジャンプ攻撃",
            "description": "遠距離から気功拳を撃たれた場合の対処"
          }
        ],
        "antiAir": [
          {
            "situation": "春麗のジャンプ攻撃",
            "counter": "早めの対空",
            "description": "春麗のジャンプ攻撃は強力なので早めに対空する"
          }
        ],
        "weaknesses": [
          {
            "situation": "足技の後",
            "description": "一部の足技は不利なので反撃のチャンス"
          },
          {
            "situation": "中距離での牽制",
            "description": "間合いを詰めて足技の間合いに入らないようにする"
          }
        ]
      },
      {
        "characterId": "luke",
        "characterName": "ルーク",
        "punishes": [
          {
            "move": "フラッシュナックル",
            "punish": "大ダメージコンボ",
            "description": "ガード後は大幅に不利なので確実に反撃"
          }
        ],
        "antiAir": [
          {
            "situation": "ルークのジャンプ攻撃",
            "counter": "対空技",
            "description": "ルークのジャンプ攻撃は判定が強いので注意"
          }
        ],
        "weaknesses": [
          {
            "situation": "遠距離戦",
            "description": "サンドブラスト対策として間合いを調整する"
          }
        ]
      }
    ]
  },
  "strongActions": {
    "actions": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "strongMoves": [
          {
            "move": "波動拳",
            "type": "飛び道具",
            "description": "基本的な飛び道具。間合いを制御し、相手の動きを制限"
          }
        ],
        "strongSequences": [
          {
            "sequence": "立ち中P → 波動拳",
            "description": "基本的な牽制連係。ガードされても波動拳で安全"
          },
          {
            "sequence": "屈中K → 波動拳",
            "description": "下段からの連係。相手の立ちガードを崩す"
          }
        ],
        "okizeme": [
          {
            "setup": "投げ後",
            "pattern": "前ステップ → 打撃 or 投げ",
            "description": "投げ後は有利な状況。二択攻撃で攻める"
          }
        ]
      },
      {
        "characterId": "chun-li",
        "characterName": "春麗",
        "strongMoves": [
          {
            "move": "立ち中K",
            "type": "牽制技",
            "description": "リーチが長く判定も強い。中距離戦の主力"
          },
          {
            "move": "屈中K",
            "type": "足技",
            "description": "下段攻撃。連続で出すことで相手を押し返す"
          },
          {
            "move": "百裂脚",
            "type": "連続技",
            "description": "削り値が高い。ガードされても有利フレーム"
          }
        ],
        "strongSequences": [
          {
            "sequence": "屈中K → 立ち中K",
            "description": "足技連係。相手を画面端に追い込む"
          },
          {
            "sequence": "ジャンプ中K → 屈中K → 百裂脚",
            "description": "飛び込みからの基本連係"
          }
        ],
        "okizeme": [
          {
            "setup": "気功拳ダウン後",
            "pattern": "前ジャンプ → めくり or 表",
            "description": "気功拳でダウンを奪った後の択攻め"
          }
        ]
      },
      {
        "characterId": "luke",
        "characterName": "ルーク",
        "strongMoves": [
          {
            "move": "立ち中P",
            "type": "牽制技",
            "description": "リーチが長く、ヒット時は追撃可能"
          },
          {
            "move": "サンドブラスト",
            "type": "飛び道具",
            "description": "中距離から相手を牽制する飛び道具"
          },
          {
            "move": "ライジングアッパー",
            "type": "対空技",
            "description": "無敵時間のある対空技"
          }
        ],
        "strongSequences": [
          {
            "sequence": "立ち中P → サンドブラスト",
            "description": "基本的な牽制連係"
          },
          {
            "sequence": "屈中P → フラッシュナックル",
            "description": "中距離からの連係攻撃"
          }
        ],
        "okizeme": [
          {
            "setup": "フラッシュナックル後",
            "pattern": "前ステップ → 中下段択",
            "description": "フラッシュナックル後の攻め継続"
          }
        ]
      }
    ]
  },
  "comboRecipes": {
    "combos": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "basicCombos": [
          {
            "combo": "屈中K → 波動拳",
            "damage": "240",
            "difficulty": "easy",
            "description": "基本的な確定コンボ。初心者にも簡単"
          },
          {
            "combo": "屈中P → 屈中K → 波動拳",
            "damage": "320",
            "difficulty": "easy",
            "description": "3段コンボ。確実に決められるように練習"
          },
          {
            "combo": "ジャンプ中K → 屈中P → 屈中K → 波動拳",
            "damage": "380",
            "difficulty": "medium",
            "description": "飛び込みからの基本コンボ"
          }
        ],
        "situationalCombos": [
          {
            "situation": "対空ヒット",
            "combo": "昇龍拳 → SA1",
            "damage": "450",
            "description": "対空昇龍拳からスーパーアーツに繋ぐ"
          },
          {
            "situation": "カウンターヒット",
            "combo": "立ち中K(CH) → 屈中P → 屈中K → 波動拳",
            "damage": "420",
            "description": "カウンターヒット時の追撃コンボ"
          }
        ],
        "meterCombos": [
          {
            "meterCost": "ODゲージ1本",
            "combo": "屈中K → OD波動拳 → SA1",
            "damage": "580",
            "description": "ODゲージを使った高ダメージコンボ"
          }
        ]
      },
      {
        "characterId": "chun-li",
        "characterName": "春麗",
        "basicCombos": [
          {
            "combo": "屈中K → 立ち中K",
            "damage": "220",
            "difficulty": "easy",
            "description": "基本的な足技連係"
          },
          {
            "combo": "屈中K → 立ち中K → 気功拳",
            "damage": "300",
            "difficulty": "easy",
            "description": "足技から気功拳への連係"
          },
          {
            "combo": "ジャンプ中K → 屈中K → 百裂脚",
            "damage": "350",
            "difficulty": "medium",
            "description": "飛び込みからの基本コンボ"
          }
        ],
        "situationalCombos": [
          {
            "situation": "画面端",
            "combo": "屈中K → 立ち中K → 立ち強K → SA1",
            "damage": "480",
            "description": "画面端での高ダメージコンボ"
          },
          {
            "situation": "対空ヒット",
            "combo": "立ち中P → SA2",
            "damage": "420",
            "description": "対空からスーパーアーツ"
          }
        ],
        "meterCombos": [
          {
            "meterCost": "ODゲージ1本",
            "combo": "屈中K → OD百裂脚 → SA3",
            "damage": "620",
            "description": "ODゲージを使った最大ダメージコンボ"
          }
        ]
      },
      {
        "characterId": "luke",
        "characterName": "ルーク",
        "basicCombos": [
          {
            "combo": "屈中P → フラッシュナックル",
            "damage": "280",
            "difficulty": "easy",
            "description": "基本的な確定コンボ"
          },
          {
            "combo": "立ち中P → 屈中P → フラッシュナックル",
            "damage": "360",
            "difficulty": "medium",
            "description": "中距離からの連係コンボ"
          }
        ],
        "situationalCombos": [
          {
            "situation": "カウンターヒット",
            "combo": "立ち中P(CH) → 前ステップ → 屈中P → フラッシュナックル",
            "damage": "420",
            "description": "カウンターヒット時の追撃"
          }
        ],
        "meterCombos": [
          {
            "meterCost": "ODゲージ1本",
            "combo": "屈中P → ODフラッシュナックル → SA1",
            "damage": "550",
            "description": "ODゲージを使った高ダメージコンボ"
          }
        ]
      }
    ]
  },
  "settings": {
    "display": {
      "theme": "dark",
      "fontSize": "medium",
      "defaultMode": "counter"
    },
    "characterOrder": [
      "ryu",
      "chun-li",
      "luke",
      "jamie",
      "manon",
      "kimberly",
      "marisa",
      "jp",
      "juri",
      "dee-jay",
      "cammy",
      "lily",
      "zangief",
      "ken",
      "blanka",
      "dhalsim",
      "honda",
      "guile"
    ],
    "userSettings": {
      "favoriteCharacters": [],
      "recentlyViewed": []
    }
  }
}
```

(B)
```
{
  "characters": {
    "characters": [
      {
        "id": "ryu",
        "name": "リュウ",
        "nameEn": "Ryu",
        "icon": "images/characters/ryu.png"
      },
      {
        "id": "chun-li",
        "name": "春麗",
        "nameEn": "Chun-Li",
        "icon": "images/characters/chun-li.png"
      },
      {
        "id": "luke",
        "name": "ルーク",
        "nameEn": "Luke",
        "icon": "images/characters/luke.png"
      },
      {
        "id": "jamie",
        "name": "ジェイミー",
        "nameEn": "Jamie",
        "icon": "images/characters/jamie.png"
      },
      {
        "id": "manon",
        "name": "マノン",
        "nameEn": "Manon",
        "icon": "images/characters/manon.png"
      },
      {
        "id": "kimberly",
        "name": "キンバリー",
        "nameEn": "Kimberly",
        "icon": "images/characters/kimberly.png"
      },
      {
        "id": "marisa",
        "name": "マリーザ",
        "nameEn": "Marisa",
        "icon": "images/characters/marisa.png"
      },
      {
        "id": "jp",
        "name": "JP",
        "nameEn": "JP",
        "icon": "images/characters/jp.png"
      },
      {
        "id": "juri",
        "name": "ジュリ",
        "nameEn": "Juri",
        "icon": "images/characters/juri.png"
      },
      {
        "id": "dee-jay",
        "name": "ディージェイ",
        "nameEn": "Dee Jay",
        "icon": "images/characters/dee-jay.png"
      },
      {
        "id": "cammy",
        "name": "キャミィ",
        "nameEn": "Cammy",
        "icon": "images/characters/cammy.png"
      },
      {
        "id": "lily",
        "name": "リリー",
        "nameEn": "Lily",
        "icon": "images/characters/lily.png"
      },
      {
        "id": "zangief",
        "name": "ザンギエフ",
        "nameEn": "Zangief",
        "icon": "images/characters/zangief.png"
      },
      {
        "id": "ken",
        "name": "ケン",
        "nameEn": "Ken",
        "icon": "images/characters/ken.png"
      },
      {
        "id": "blanka",
        "name": "ブランカ",
        "nameEn": "Blanka",
        "icon": "images/characters/blanka.png"
      },
      {
        "id": "dhalsim",
        "name": "ダルシム",
        "nameEn": "Dhalsim",
        "icon": "images/characters/dhalsim.png"
      },
      {
        "id": "honda",
        "name": "本田",
        "nameEn": "E. Honda",
        "icon": "images/characters/honda.png"
      },
      {
        "id": "guile",
        "name": "ガイル",
        "nameEn": "Guile",
        "icon": "images/characters/guile.png"
      }
    ]
  },
  "settings": {
    "display": {
      "theme": "dark",
      "fontSize": "medium",
      "defaultMode": "counter"
    },
    "characterOrder": [
      "ryu",
      "chun-li",
      "luke",
      "jamie",
      "manon",
      "kimberly",
      "marisa",
      "jp",
      "juri",
      "dee-jay",
      "cammy",
      "lily",
      "zangief",
      "ken",
      "blanka",
      "dhalsim",
      "honda",
      "guile"
    ],
    "userSettings": {
      "favoriteCharacters": [],
      "recentlyViewed": []
    }
  }
}
```

---

think hard; 空と非空の場合で処理ルートを明確に分ける必要はある？　非空ならそれを即座に反映し、空であれば「空」の状態であることを示す文を即座に反映すればいいだけではないか？

---

phenomenon: 「対策」-> 「確定反撃」「防空対策」「弱点・対処法」など(「category name」と呼称)、初期カテゴリがindex.htmlに記載されている. 
problem: JSON にこれら<h3>に当たる名前も含めるべき. 
think hard; JSONがcategory nameを含むように形式を変更し、変更後のJSONを適切にimport, exportできるように変更. 

---
reconsider your plans; 
- JSON形式はこれでいい.
 ```
 {
    "strategies": [
      {
        "characterId": "ryu",
        "characterName": "リュウ",
        "categoryNames": {
          "punishes": "確定反撃",
          "antiAir": "対空対策",
          "weaknesses": "弱点・対処法"
        },
        "punishes": [...],  // 既存構造そのまま
        "antiAir": [...],   // 既存構造そのまま
        "weaknesses": [...] // 既存構造そのまま
      }
    ]
  }
```
- index.html で <h3 data-category="punishes"></h3> とするのは、"punishes"が含まれることを前提としている. そうではなく、JSONの"categoryNames"を<h3>~</h3>で出力. 

---

reconsider very hard;
誤って、changes have been discarded.  
- 「確定反撃」「対空対策」「弱点・対処法」らを"特別扱い"するのが問題. ユーザ定義されたどのようなカテゴリでも読み込み、表示できる仕組みを整備. 
- 空の場合は、「対策データが見つかりません」「強い行動データが見つかりません」「コンボデータが見つかりません」など、今まで通り表示. 
- もう一度計画を見せて。

---

think; 一つのカテゴリ を次から構成したい. 「（アイテムの）タイトル名」「内容」「説明」. 現在だと、"punishes", "antiAir" で異なる要素を持っているが、"item_name", "content", "description"の三つから構成する. 









ultrathink; 
problem: (A)を読み込むと、「対策」-> "Trt", "TRT1", "TRT2" のみが表示され、他は表示されない.  (C)を読み込むと、「対策」->

Trt
TRT1
TRT2

Weaknesses2
起き攻め
リバーサル昇龍拳を意識して攻撃とガードを使い分ける
中距離戦
波動拳に対してはジャンプかダッシュで接近する

が表示される. 

my analysis: 
1. localstrage(="sf6_database_data") is below; 
{"data":{"characters":{"characters":[{"id":"ryu","name":"リュウ","nameEn":"Ryu","icon":"images/characters/ryu.png"},{"id":"chun-li","name":"春麗","nameEn":"Chun-Li","icon":"images/characters/chun-li.png"},{"id":"luke","name":"ルーク","nameEn":"Luke","icon":"images/characters/luke.png"},{"id":"jamie","name":"ジェイミー","nameEn":"Jamie","icon":"images/characters/jamie.png"},{"id":"manon","name":"マノン","nameEn":"Manon","icon":"images/characters/manon.png"},{"id":"kimberly","name":"キンバリー","nameEn":"Kimberly","icon":"images/characters/kimberly.png"},{"id":"marisa","name":"マリーザ","nameEn":"Marisa","icon":"images/characters/marisa.png"},{"id":"jp","name":"JP","nameEn":"JP","icon":"images/characters/jp.png"},{"id":"juri","name":"ジュリ","nameEn":"Juri","icon":"images/characters/juri.png"},{"id":"dee-jay","name":"ディージェイ","nameEn":"Dee Jay","icon":"images/characters/dee-jay.png"},{"id":"cammy","name":"キャミィ","nameEn":"Cammy","icon":"images/characters/cammy.png"},{"id":"lily","name":"リリー","nameEn":"Lily","icon":"images/characters/lily.png"},{"id":"zangief","name":"ザンギエフ","nameEn":"Zangief","icon":"images/characters/zangief.png"},{"id":"ken","name":"ケン","nameEn":"Ken","icon":"images/characters/ken.png"},{"id":"blanka","name":"ブランカ","nameEn":"Blanka","icon":"images/characters/blanka.png"},{"id":"dhalsim","name":"ダルシム","nameEn":"Dhalsim","icon":"images/characters/dhalsim.png"},{"id":"honda","name":"本田","nameEn":"E. Honda","icon":"images/characters/honda.png"},{"id":"guile","name":"ガイル","nameEn":"Guile","icon":"images/characters/guile.png"}]},"counterStrategies":{"strategies":[{"characterId":"ryu","characterName":"リュウ","punishes":[],"antiAir":[{"situation":"ジャンプ攻撃","counter":"立ち強P","description":"リュウの昇龍拳が来る前に早めに対空を出す"}],"weaknesses":[{"situation":"起き攻め","description":"リバーサル昇龍拳を意識して攻撃とガードを使い分ける"},{"situation":"中距離戦","description":"波動拳に対してはジャンプかダッシュで接近する"}],"trt":[]},{"characterId":"chun-li","characterName":"春麗","punishes":[{"move":"スピニングバードキック","punish":"投げ","description":"ガード後は投げが確定する"},{"move":"気功拳","punish":"ジャンプ攻撃","description":"遠距離から気功拳を撃たれた場合の対処"}],"antiAir":[{"situation":"春麗のジャンプ攻撃","counter":"早めの対空","description":"春麗のジャンプ攻撃は強力なので早めに対空する"}],"weaknesses":[{"situation":"足技の後","description":"一部の足技は不利なので反撃のチャンス"},{"situation":"中距離での牽制","description":"間合いを詰めて足技の間合いに入らないようにする"}]},{"characterId":"luke","characterName":"ルーク","punishes":[{"move":"フラッシュナックル","punish":"大ダメージコンボ","description":"ガード後は大幅に不利なので確実に反撃"}],"antiAir":[{"situation":"ルークのジャンプ攻撃","counter":"対空技","description":"ルークのジャンプ攻撃は判定が強いので注意"}],"weaknesses":[{"situation":"遠距離戦","description":"サンドブラスト対策として間合いを調整する"}]}]},"strongActions":{"actions":[{"characterId":"ryu","characterName":"リュウ","strongMoves":[{"move":"波動拳","type":"飛び道具","description":"基本的な飛び道具。間合いを制御し、相手の動きを制限"}],"strongSequences":[{"sequence":"立ち中P → 波動拳","description":"基本的な牽制連係。ガードされても波動拳で安全"},{"sequence":"屈中K → 波動拳","description":"下段からの連係。相手の立ちガードを崩す"}],"okizeme":[{"setup":"投げ後","pattern":"前ステップ → 打撃 or 投げ","description":"投げ後は有利な状況。二択攻撃で攻める"}]},{"characterId":"chun-li","characterName":"春麗","strongMoves":[{"move":"立ち中K","type":"牽制技","description":"リーチが長く判定も強い。中距離戦の主力"},{"move":"屈中K","type":"足技","description":"下段攻撃。連続で出すことで相手を押し返す"},{"move":"百裂脚","type":"連続技","description":"削り値が高い。ガードされても有利フレーム"}],"strongSequences":[{"sequence":"屈中K → 立ち中K","description":"足技連係。相手を画面端に追い込む"},{"sequence":"ジャンプ中K → 屈中K → 百裂脚","description":"飛び込みからの基本連係"}],"okizeme":[{"setup":"気功拳ダウン後","pattern":"前ジャンプ → めくり or 表","description":"気功拳でダウンを奪った後の択攻め"}]},{"characterId":"luke","characterName":"ルーク","strongMoves":[{"move":"立ち中P","type":"牽制技","description":"リーチが長く、ヒット時は追撃可能"},{"move":"サンドブラスト","type":"飛び道具","description":"中距離から相手を牽制する飛び道具"},{"move":"ライジングアッパー","type":"対空技","description":"無敵時間のある対空技"}],"strongSequences":[{"sequence":"立ち中P → サンドブラスト","description":"基本的な牽制連係"},{"sequence":"屈中P → フラッシュナックル","description":"中距離からの連係攻撃"}],"okizeme":[{"setup":"フラッシュナックル後","pattern":"前ステップ → 中下段択","description":"フラッシュナックル後の攻め継続"}]}]},"comboRecipes":{"combos":[{"characterId":"ryu","characterName":"リュウ","basicCombos":[{"combo":"屈中K → 波動拳","damage":"240","difficulty":"easy","description":"基本的な確定コンボ。初心者にも簡単"},{"combo":"屈中P → 屈中K → 波動拳","damage":"320","difficulty":"easy","description":"3段コンボ。確実に決められるように練習"},{"combo":"ジャンプ中K → 屈中P → 屈中K → 波動拳","damage":"380","difficulty":"medium","description":"飛び込みからの基本コンボ"}],"situationalCombos":[{"situation":"対空ヒット","combo":"昇龍拳 → SA1","damage":"450","description":"対空昇龍拳からスーパーアーツに繋ぐ"},{"situation":"カウンターヒット","combo":"立ち中K(CH) → 屈中P → 屈中K → 波動拳","damage":"420","description":"カウンターヒット時の追撃コンボ"}],"meterCombos":[{"meterCost":"ODゲージ1本","combo":"屈中K → OD波動拳 → SA1","damage":"580","description":"ODゲージを使った高ダメージコンボ"}]},{"characterId":"chun-li","characterName":"春麗","basicCombos":[{"combo":"屈中K → 立ち中K","damage":"220","difficulty":"easy","description":"基本的な足技連係"},{"combo":"屈中K → 立ち中K → 気功拳","damage":"300","difficulty":"easy","description":"足技から気功拳への連係"},{"combo":"ジャンプ中K → 屈中K → 百裂脚","damage":"350","difficulty":"medium","description":"飛び込みからの基本コンボ"}],"situationalCombos":[{"situation":"画面端","combo":"屈中K → 立ち中K → 立ち強K → SA1","damage":"480","description":"画面端での高ダメージコンボ"},{"situation":"対空ヒット","combo":"立ち中P → SA2","damage":"420","description":"対空からスーパーアーツ"}],"meterCombos":[{"meterCost":"ODゲージ1本","combo":"屈中K → OD百裂脚 → SA3","damage":"620","description":"ODゲージを使った最大ダメージコンボ"}]},{"characterId":"luke","characterName":"ルーク","basicCombos":[{"combo":"屈中P → フラッシュナックル","damage":"280","difficulty":"easy","description":"基本的な確定コンボ"},{"combo":"立ち中P → 屈中P → フラッシュナックル","damage":"360","difficulty":"medium","description":"中距離からの連係コンボ"}],"situationalCombos":[{"situation":"カウンターヒット","combo":"立ち中P(CH) → 前ステップ → 屈中P → フラッシュナックル","damage":"420","description":"カウンターヒット時の追撃"}],"meterCombos":[{"meterCost":"ODゲージ1本","combo":"屈中P → ODフラッシュナックル → SA1","damage":"550","description":"ODゲージを使った高ダメージコンボ"}]}]},"settings":{"display":{"theme":"dark","fontSize":"medium","defaultMode":"counter"},"characterOrder":["ryu","chun-li","luke","jamie","manon","kimberly","marisa","jp","juri","dee-jay","cammy","lily","zangief","ken","blanka","dhalsim","honda","guile"],"userSettings":{"favoriteCharacters":[],"recentlyViewed":[]}}},"timestamp":"2025-07-08T01:17:15.318Z","version":"1.0"}

2. localstrage does NOT include "trt", so the problem probably happens when loading JSON. 

3. my idea is, category tag names in JSON are already used, it's not updated at once.


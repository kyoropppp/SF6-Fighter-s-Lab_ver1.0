// Storage functionality for SF6 Database
// データの保存・読み込み機能を担当

class DataStorage {
    constructor() {
        this.storageKey = 'sf6_database_data';
    }

    // データをローカルストレージに保存（Proxyが自動処理するため簡素化）
    saveData() {
        // SF6_DATAのProxyが自動的にlocalStorageに保存するため、
        // ここでは通知のみ表示
        this.showSaveNotification('データが保存されました！');
        return true;
    }

    // ローカルストレージからデータを読み込み（Proxyが自動処理するため簡素化）
    loadData() {
        try {
            const savedDataString = localStorage.getItem(this.storageKey);
            if (!savedDataString) {
                console.log('No saved data found');
                return false;
            }

            // データの存在確認のみ（Proxyが自動的に読み込む）
            const savedData = JSON.parse(savedDataString);
            if (this.validateDataStructure(savedData)) {
                console.log('Data loaded successfully from localStorage');
                console.log('Last saved:', savedData.timestamp);
                this.showSaveNotification('保存されたデータを読み込みました');
                return true;
            } else {
                console.warn('Invalid data structure in saved data');
                return false;
            }
        } catch (error) {
            console.error('Error loading data:', error);
            return false;
        }
    }

    // データ構造を検証
    validateDataStructure(savedData) {
        if (!savedData || !savedData.data) return false;
        
        const requiredKeys = ['characters', 'counterStrategies', 'strongActions', 'comboRecipes', 'settings'];
        return requiredKeys.every(key => savedData.data.hasOwnProperty(key));
    }

    // 保存されたデータの情報を取得
    getSavedDataInfo() {
        try {
            const savedDataString = localStorage.getItem(this.storageKey);
            if (!savedDataString) return null;

            const savedData = JSON.parse(savedDataString);
            return {
                timestamp: savedData.timestamp,
                version: savedData.version || 'unknown',
                size: (savedDataString.length / 1024).toFixed(2) + ' KB'
            };
        } catch (error) {
            console.error('Error getting saved data info:', error);
            return null;
        }
    }

    // 保存されたデータを削除
    clearSavedData() {
        try {
            localStorage.removeItem(this.storageKey);
            console.log('Saved data cleared');
            this.showSaveNotification('保存されたデータを削除しました');
            return true;
        } catch (error) {
            console.error('Error clearing saved data:', error);
            return false;
        }
    }


    // JSONファイルからデータをインポート
    importFromFile(file) {
        return new Promise(async (resolve, reject) => {
            try {
                const importedData = await dataFileLoader.loadJSONFile(file);
                    
                    // インポートデータの構造を検証
                    if (this.validateImportData(importedData)) {
                        console.log('Before import:', JSON.parse(JSON.stringify(SF6_DATA)));
                        console.log('Import data:', importedData);
                        
                        // データをマージまたは置換
                        const shouldReplace = confirm('既存のデータを置き換えますか？\n「はい」: 含まれるデータのみ置き換え、記載なしは空にする\n「いいえ」: データをマージ');
                        
                        if (shouldReplace) {
                            // 完全置換: 記載のないデータは空にする
                            SF6_DATA.characters = importedData.characters || null;
                            
                            // フラット形式とネスト形式の両方に対応
                            if (importedData.strategies) {
                                SF6_DATA.counterStrategies = { strategies: importedData.strategies };
                            } else if (importedData.counterStrategies) {
                                SF6_DATA.counterStrategies = importedData.counterStrategies;
                            } else {
                                SF6_DATA.counterStrategies = null;
                            }
                            
                            if (importedData.actions) {
                                SF6_DATA.strongActions = { actions: importedData.actions };
                            } else if (importedData.strongActions) {
                                SF6_DATA.strongActions = importedData.strongActions;
                            } else {
                                SF6_DATA.strongActions = null;
                            }
                            
                            if (importedData.combos) {
                                SF6_DATA.comboRecipes = { combos: importedData.combos };
                            } else if (importedData.comboRecipes) {
                                SF6_DATA.comboRecipes = importedData.comboRecipes;
                            } else {
                                SF6_DATA.comboRecipes = null;
                            }
                            
                            SF6_DATA.settings = importedData.settings || null;
                        } else {
                            this.mergeData(SF6_DATA, importedData);
                        }
                        
                        console.log('After import:', JSON.parse(JSON.stringify(SF6_DATA)));
                        
                        // データはProxyにより自動的にlocalStorageに保存される
                        
                        // DataLoaderのキャッシュをクリア（getterメソッドがSF6_DATAを直接参照するため代入不要）
                        dataLoader.clearCache();
                        
                        // 現在のキャラクター表示を完全に再初期化
                        if (characterDisplay.currentCharacter) {
                            const currentId = characterDisplay.currentCharacter.id;
                            // 強制的にコンテンツを再描画
                            characterDisplay.currentCharacter = null;
                            characterDisplay.showCharacterDetail(currentId);
                        } else {
                            // キャラクターが選択されていない場合、初期キャラクターを表示
                            characterDisplay.showCharacterDetail('ryu');
                        }
                        
                        this.showSaveNotification('データをインポートしました');
                        resolve(true);
                    } else {
                        reject(new Error('無効なデータ形式です'));
                    }
                } catch (error) {
                    reject(error);
                }
        });
    }

    // インポートデータの構造を検証
    validateImportData(data) {
        if (!data || typeof data !== 'object') {
            console.warn('Invalid import data: not an object');
            return false;
        }
        
        // 最低限必要なキーがあるかチェック
        const hasValidData = (
            data.characters || 
            data.counterStrategies || 
            data.strongActions || 
            data.comboRecipes ||
            data.settings
        );
        
        if (!hasValidData) {
            console.warn('Invalid import data: no valid data keys found');
            return false;
        }
        
        // categoryNames必須チェック（後方互換性排除）
        if (data.counterStrategies) {
            const strategies = data.counterStrategies.strategies || data.counterStrategies;
            if (Array.isArray(strategies)) {
                for (const strategy of strategies) {
                    if (strategy.characterId && !strategy.categoryNames) {
                        throw new Error(`counterStrategies requires categoryNames for character: ${strategy.characterId}`);
                    }
                }
            }
        }
        
        if (data.strongActions) {
            const actions = data.strongActions.actions || data.strongActions;
            if (Array.isArray(actions)) {
                for (const action of actions) {
                    if (action.characterId && !action.categoryNames) {
                        throw new Error(`strongActions requires categoryNames for character: ${action.characterId}`);
                    }
                }
            }
        }
        
        if (data.comboRecipes) {
            const combos = data.comboRecipes.combos || data.comboRecipes;
            if (Array.isArray(combos)) {
                for (const combo of combos) {
                    if (combo.characterId && !combo.categoryNames) {
                        throw new Error(`comboRecipes requires categoryNames for character: ${combo.characterId}`);
                    }
                }
            }
        }
        
        // フラット形式のcategoryNames必須チェック
        if (data.strategies && Array.isArray(data.strategies)) {
            for (const strategy of data.strategies) {
                if (strategy.characterId && !strategy.categoryNames) {
                    throw new Error(`strategies requires categoryNames for character: ${strategy.characterId}`);
                }
            }
        }
        
        if (data.actions && Array.isArray(data.actions)) {
            for (const action of data.actions) {
                if (action.characterId && !action.categoryNames) {
                    throw new Error(`actions requires categoryNames for character: ${action.characterId}`);
                }
            }
        }
        
        if (data.combos && Array.isArray(data.combos)) {
            for (const combo of data.combos) {
                if (combo.characterId && !combo.categoryNames) {
                    throw new Error(`combos requires categoryNames for character: ${combo.characterId}`);
                }
            }
        }
        
        console.log('Import data validation passed for keys:', Object.keys(data));
        return true;
    }

    // データをマージ
    mergeData(target, source) {
        Object.keys(source).forEach(key => {
            if (target[key] && typeof target[key] === 'object' && !Array.isArray(target[key])) {
                this.mergeData(target[key], source[key]);
            } else {
                target[key] = source[key];
            }
        });
    }

    // 保存通知を表示
    showSaveNotification(message, type = 'success') {
        // 既存の通知を削除
        const existingNotification = document.querySelector('.save-notification');
        if (existingNotification) {
            existingNotification.remove();
        }

        // 新しい通知を作成
        const notification = document.createElement('div');
        notification.className = `save-notification ${type}`;
        notification.textContent = message;
        
        // スタイルを設定
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background-color: ${type === 'error' ? 'var(--danger-color)' : 'var(--success-color)'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 4px;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
        `;

        document.body.appendChild(notification);

        // 3秒後に自動削除
        setTimeout(() => {
            if (notification.parentNode) {
                notification.style.animation = 'slideOut 0.3s ease-out';
                setTimeout(() => notification.remove(), 300);
            }
        }, 3000);
    }

    // ファイル選択ダイアログを開く
    openImportDialog() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.style.display = 'none';
        
        input.onchange = async (e) => {
            const file = e.target.files[0];
            if (file) {
                try {
                    await this.importFromFile(file);
                } catch (error) {
                    this.showSaveNotification(error.message, 'error');
                }
            }
            document.body.removeChild(input);
        };
        
        document.body.appendChild(input);
        input.click();
    }

}

// グローバルなDataStorageインスタンスを作成
const dataStorage = new DataStorage();

// CSSアニメーションを追加
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);
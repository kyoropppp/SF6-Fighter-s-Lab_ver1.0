class StorageManager {
    constructor() {
        this.storageKey = 'sf6_database';
        this.timestampKey = 'sf6_database_timestamp';
    }

    saveData(data) {
        try {
            localStorage.setItem(this.storageKey, JSON.stringify(data));
            localStorage.setItem(this.timestampKey, Date.now().toString());
            return true;
        } catch (error) {
            console.error('データの保存に失敗しました:', error);
            return false;
        }
    }

    loadData() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (stored) {
                return JSON.parse(stored);
            }
            return null;
        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
            return null;
        }
    }

    clearData() {
        localStorage.removeItem(this.storageKey);
        localStorage.removeItem(this.timestampKey);
    }

    getLastSaved() {
        const timestamp = localStorage.getItem(this.timestampKey);
        return timestamp ? new Date(parseInt(timestamp)) : null;
    }

    hasStoredData() {
        return localStorage.getItem(this.storageKey) !== null;
    }

    async loadFromFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error('ファイルの解析に失敗しました'));
                }
            };
            reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
            reader.readAsText(file);
        });
    }

    async loadFromUrl(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('URLからのデータ読み込みに失敗しました:', error);
            throw error;
        }
    }

    validateDataStructure(data) {
        const requiredSections = ['characters', 'strategies', 'actions', 'combos'];
        
        for (const section of requiredSections) {
            if (!data[section]) {
                throw new Error(`必須セクション '${section}' が見つかりません`);
            }
        }

        if (!data.characters.characters || !Array.isArray(data.characters.characters)) {
            throw new Error('characters.charactersが配列ではありません');
        }

        ['strategies', 'actions', 'combos'].forEach(section => {
            if (!Array.isArray(data[section])) {
                throw new Error(`${section}が配列ではありません`);
            }
            
            data[section].forEach(characterData => {
                if (!characterData.characterId) {
                    throw new Error(`${section}にcharacterIdが見つかりません`);
                }
                if (!characterData.categoryNames) {
                    throw new Error(`${characterData.characterId}のcategoryNamesが見つかりません`);
                }
            });
        });

        return true;
    }

    normalizeImportData(data) {
        let normalizedData = {};
        
        if (data.characters) {
            normalizedData.characters = data.characters;
        }
        
        if (data.strategies) {
            normalizedData.strategies = data.strategies;
        } else if (data.counterStrategies && data.counterStrategies.strategies) {
            normalizedData.strategies = data.counterStrategies.strategies;
        }
        
        if (data.actions) {
            normalizedData.actions = data.actions;
        } else if (data.strongActions && data.strongActions.actions) {
            normalizedData.actions = data.strongActions.actions;
        }
        
        if (data.combos) {
            normalizedData.combos = data.combos;
        } else if (data.comboRecipes && data.comboRecipes.combos) {
            normalizedData.combos = data.comboRecipes.combos;
        }
        
        if (data.settings) {
            normalizedData.settings = data.settings;
        }
        
        return normalizedData;
    }

    exportData(data, filename = 'sf6_database_export.json') {
        const exportData = {
            characters: data.characters,
            strategies: data.strategies,
            actions: data.actions,
            combos: data.combos,
            settings: data.settings
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    createBackup() {
        const data = this.loadData();
        if (data) {
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            this.exportData(data, `sf6_database_backup_${timestamp}.json`);
        }
    }

    getStorageInfo() {
        const data = this.loadData();
        const lastSaved = this.getLastSaved();
        const dataCount = data ? this.countDataItems(data) : 0;
        
        return {
            hasData: !!data,
            lastSaved: lastSaved,
            dataCount: dataCount,
            storageSize: this.getStorageSize()
        };
    }

    countDataItems(data) {
        let count = 0;
        ['strategies', 'actions', 'combos'].forEach(mode => {
            (data[mode] || []).forEach(characterData => {
                Object.keys(characterData.categoryNames || {}).forEach(categoryKey => {
                    count += (characterData[categoryKey] || []).length;
                });
            });
        });
        return count;
    }

    getStorageSize() {
        const data = localStorage.getItem(this.storageKey);
        return data ? new Blob([data]).size : 0;
    }
}

const storageManager = new StorageManager();
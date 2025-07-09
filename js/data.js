class DataManager {
    constructor() {
        this.data = {
            characters: { characters: [] },
            strategies: [],
            actions: [],
            combos: [],
            settings: {
                display: { theme: 'light', showDescriptions: true },
                characterOrder: [],
                userSettings: { autoSave: true, exportFormat: 'json' }
            }
        };
        this.currentCharacter = null;
        this.currentMode = 'strategies';
        this.isEditMode = false;
    }

    loadData(jsonData) {
        try {
            if (jsonData.characters) {
                this.data.characters = jsonData.characters;
            }
            
            if (jsonData.strategies) {
                this.data.strategies = jsonData.strategies;
            } else if (jsonData.counterStrategies && jsonData.counterStrategies.strategies) {
                this.data.strategies = jsonData.counterStrategies.strategies;
            }
            
            if (jsonData.actions) {
                this.data.actions = jsonData.actions;
            } else if (jsonData.strongActions && jsonData.strongActions.actions) {
                this.data.actions = jsonData.strongActions.actions;
            }
            
            if (jsonData.combos) {
                this.data.combos = jsonData.combos;
            } else if (jsonData.comboRecipes && jsonData.comboRecipes.combos) {
                this.data.combos = jsonData.comboRecipes.combos;
            }
            
            if (jsonData.settings) {
                this.data.settings = { ...this.data.settings, ...jsonData.settings };
            }
            
            this.validateData();
            return true;
        } catch (error) {
            console.error('データの読み込みに失敗しました:', error);
            return false;
        }
    }

    validateData() {
        const requiredSections = ['strategies', 'actions', 'combos'];
        
        requiredSections.forEach(section => {
            if (!this.data[section]) {
                this.data[section] = [];
            }
            
            this.data[section].forEach(characterData => {
                if (!characterData.categoryNames) {
                    throw new Error(`${characterData.characterId}のcategoryNamesが見つかりません`);
                }
            });
        });
    }

    getCharacters() {
        return this.data.characters.characters || [];
    }

    getCharacterData(characterId, mode) {
        const section = this.data[mode] || [];
        return section.find(char => char.characterId === characterId);
    }

    setCurrentCharacter(characterId) {
        this.currentCharacter = characterId;
    }

    getCurrentCharacter() {
        return this.currentCharacter;
    }

    setCurrentMode(mode) {
        this.currentMode = mode;
    }

    getCurrentMode() {
        return this.currentMode;
    }

    setEditMode(isEdit) {
        this.isEditMode = isEdit;
    }

    getEditMode() {
        return this.isEditMode;
    }

    updateCharacterData(characterId, mode, categoryKey, items) {
        const section = this.data[mode];
        let characterData = section.find(char => char.characterId === characterId);
        
        if (!characterData) {
            const character = this.getCharacters().find(c => c.id === characterId);
            characterData = {
                characterId: characterId,
                characterName: character ? character.name : characterId,
                categoryNames: {}
            };
            section.push(characterData);
        }
        
        characterData[categoryKey] = items;
        this.saveToStorage();
    }

    addCategory(characterId, mode, categoryKey, displayName) {
        const section = this.data[mode];
        let characterData = section.find(char => char.characterId === characterId);
        
        if (!characterData) {
            const character = this.getCharacters().find(c => c.id === characterId);
            characterData = {
                characterId: characterId,
                characterName: character ? character.name : characterId,
                categoryNames: {}
            };
            section.push(characterData);
        }
        
        characterData.categoryNames[categoryKey] = displayName;
        characterData[categoryKey] = [];
        this.saveToStorage();
    }

    removeCategory(characterId, mode, categoryKey) {
        const section = this.data[mode];
        const characterData = section.find(char => char.characterId === characterId);
        
        if (characterData) {
            delete characterData.categoryNames[categoryKey];
            delete characterData[categoryKey];
            this.saveToStorage();
        }
    }

    exportData() {
        const exportData = {
            characters: this.data.characters,
            strategies: this.data.strategies,
            actions: this.data.actions,
            combos: this.data.combos,
            settings: this.data.settings
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sf6_database_export.json';
        a.click();
        URL.revokeObjectURL(url);
    }

    saveToStorage() {
        localStorage.setItem('sf6_database', JSON.stringify(this.data));
        localStorage.setItem('sf6_database_timestamp', Date.now().toString());
    }

    loadFromStorage() {
        const stored = localStorage.getItem('sf6_database');
        if (stored) {
            try {
                const data = JSON.parse(stored);
                this.loadData(data);
                return true;
            } catch (error) {
                console.error('ストレージからのデータ読み込みに失敗しました:', error);
                return false;
            }
        }
        return false;
    }

    clearStorage() {
        localStorage.removeItem('sf6_database');
        localStorage.removeItem('sf6_database_timestamp');
        this.data = {
            characters: { characters: [] },
            strategies: [],
            actions: [],
            combos: [],
            settings: {
                display: { theme: 'light', showDescriptions: true },
                characterOrder: [],
                userSettings: { autoSave: true, exportFormat: 'json' }
            }
        };
    }

    getLastSaved() {
        const timestamp = localStorage.getItem('sf6_database_timestamp');
        return timestamp ? new Date(parseInt(timestamp)) : null;
    }

    getDataCount() {
        let count = 0;
        ['strategies', 'actions', 'combos'].forEach(mode => {
            this.data[mode].forEach(characterData => {
                Object.keys(characterData.categoryNames || {}).forEach(categoryKey => {
                    count += (characterData[categoryKey] || []).length;
                });
            });
        });
        return count;
    }

    globalSearch(query) {
        const results = [];
        const modes = ['strategies', 'actions', 'combos'];
        
        modes.forEach(mode => {
            this.data[mode].forEach(characterData => {
                Object.keys(characterData.categoryNames || {}).forEach(categoryKey => {
                    const items = characterData[categoryKey] || [];
                    items.forEach((item, index) => {
                        if (this.matchesQuery(item, query)) {
                            results.push({
                                characterId: characterData.characterId,
                                characterName: characterData.characterName,
                                mode: mode,
                                categoryKey: categoryKey,
                                categoryName: characterData.categoryNames[categoryKey],
                                item: item,
                                itemIndex: index
                            });
                        }
                    });
                });
            });
        });
        
        return results;
    }

    matchesQuery(item, query) {
        const q = query.toLowerCase();
        return item.item_name.toLowerCase().includes(q) ||
               item.content.toLowerCase().includes(q) ||
               (item.description && item.description.toLowerCase().includes(q));
    }
}

const dataManager = new DataManager();
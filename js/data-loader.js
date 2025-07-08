// Data Loader for SF6 Database
// JSONファイルの読み込みとデータ管理を担当

class DataLoader {
    constructor() {
        this.cache = new Map();
    }

    // すべてのデータを非同期で読み込み
    async loadAllData() {
        // データが完全に空の場合のみlocalStorageをチェック
        if (SF6_DATA.characters === undefined && SF6_DATA.counterStrategies === undefined && 
            SF6_DATA.strongActions === undefined && SF6_DATA.comboRecipes === undefined && SF6_DATA.settings === undefined) {
            
            // localStorageからデータを読み込み
            const savedDataLoaded = dataStorage.loadData();
            
            if (!savedDataLoaded) {
                // データ読み込みUIを表示
                dataFileLoader.showDataLoadUI();
                return false;
            }
        }
        
        return true;
    }


    // 汎用データ取得ヘルパー
    _getDataByCharacterId(dataSource, arrayKey, characterId) {
        if (!dataSource) return null;
        return dataSource[arrayKey].find(item => item.characterId === characterId);
    }

    // キャラクターデータの取得
    getCharacterData(characterId = null) {
        if (!SF6_DATA.characters) return null;
        
        if (characterId) {
            return SF6_DATA.characters.characters.find(char => char.id === characterId);
        }
        return SF6_DATA.characters.characters;
    }

    // 対策データの取得
    getCounterStrategies(characterId) {
        return this._getDataByCharacterId(SF6_DATA.counterStrategies, 'strategies', characterId);
    }

    // 強い行動データの取得
    getStrongActions(characterId) {
        return this._getDataByCharacterId(SF6_DATA.strongActions, 'actions', characterId);
    }

    // コンボレシピデータの取得
    getComboRecipes(characterId) {
        return this._getDataByCharacterId(SF6_DATA.comboRecipes, 'combos', characterId);
    }

    // 設定データの取得
    getSettings() {
        return SF6_DATA.settings;
    }

    // キャラクター検索
    searchCharacters(searchTerm) {
        if (!SF6_DATA.characters || !searchTerm) return SF6_DATA.characters?.characters || [];
        
        const term = searchTerm.toLowerCase();
        return SF6_DATA.characters.characters.filter(char => 
            char.name.toLowerCase().includes(term) || 
            char.nameEn.toLowerCase().includes(term) ||
            char.id.toLowerCase().includes(term)
        );
    }

    // データが読み込まれているかチェック
    isDataLoaded() {
        return !!(SF6_DATA.characters && SF6_DATA.counterStrategies && SF6_DATA.strongActions && SF6_DATA.comboRecipes && SF6_DATA.settings);
    }

    // キャッシュをクリア
    clearCache() {
        this.cache.clear();
    }

    // データの再読み込み
    async reloadData() {
        this.clearCache();
        return await this.loadAllData();
    }
}

// グローバルなDataLoaderインスタンスを作成
const dataLoader = new DataLoader();
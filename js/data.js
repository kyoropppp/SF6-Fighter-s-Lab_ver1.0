// SF6 Database - Data Loader  
// JSONファイル読み込み機能を提供

// localStorage統合のためのヘルパー関数
const STORAGE_KEY = 'sf6_database_data';

function getStorageData() {
    try {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            const parsed = JSON.parse(saved);
            return parsed.data || parsed; // 両形式に対応
        }
    } catch (error) {
        console.error('Error reading from localStorage:', error);
    }
    
    // デフォルトデータ
    return {
        characters: null,
        counterStrategies: null,
        strongActions: null,
        comboRecipes: null,
        settings: null
    };
}

function saveStorageData(data) {
    try {
        const wrapper = {
            data: data,
            timestamp: new Date().toISOString(),
            version: '1.0'
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(wrapper));
        console.log('Data automatically saved to localStorage');
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
}

// localStorage統合されたSF6_DATA - Proxyで透過的にlocalStorageと同期
const SF6_DATA = new Proxy({}, {
    get(target, key) {
        if (typeof key === 'string') {
            return getStorageData()[key];
        }
        return target[key];
    },
    
    set(target, key, value) {
        if (typeof key === 'string') {
            const data = getStorageData();
            data[key] = value;
            saveStorageData(data);
        } else {
            target[key] = value;
        }
        return true;
    },
    
    ownKeys(target) {
        return Object.keys(getStorageData());
    },
    
    has(target, key) {
        return key in getStorageData();
    }
});

// データローダークラス
class DataFileLoader {
    constructor() {
        this.loadedFiles = new Set();
    }

    // JSONファイルを読み込む
    async loadJSONFile(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    resolve(data);
                } catch (error) {
                    reject(new Error(`JSONファイルの解析に失敗しました: ${error.message}`));
                }
            };
            
            reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
            reader.readAsText(file);
        });
    }

    // ファイル選択ダイアログを開く
    async openFileDialog(accept = '.json') {
        return new Promise((resolve, reject) => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = accept;
            input.multiple = true;
            input.style.display = 'none';
            
            input.onchange = async (e) => {
                const files = Array.from(e.target.files);
                resolve(files);
                document.body.removeChild(input);
            };
            
            input.oncancel = () => {
                resolve([]);
                document.body.removeChild(input);
            };
            
            document.body.appendChild(input);
            input.click();
        });
    }

    // ファイル名からデータタイプを判定
    getDataTypeFromFilename(filename) {
        const name = filename.toLowerCase();
        if (name.includes('character')) return 'characters';
        if (name.includes('counter') || name.includes('strategy') || name.includes('strategies')) return 'counterStrategies';
        if (name.includes('strong') || name.includes('action')) return 'strongActions';
        if (name.includes('combo') || name.includes('recipe')) return 'comboRecipes';
        if (name.includes('setting')) return 'settings';
        return null;
    }

    // 複数のJSONファイルを読み込む
    async loadMultipleFiles(files) {
        const results = {
            loaded: [],
            errors: []
        };

        for (const file of files) {
            try {
                const data = await this.loadJSONFile(file);
                const dataType = this.getDataTypeFromFilename(file.name);
                
                if (dataType) {
                    SF6_DATA[dataType] = data;
                    this.loadedFiles.add(dataType);
                    results.loaded.push({
                        file: file.name,
                        type: dataType,
                        size: file.size
                    });
                } else {
                    results.errors.push({
                        file: file.name,
                        error: 'ファイル名からデータタイプを判定できませんでした'
                    });
                }
            } catch (error) {
                results.errors.push({
                    file: file.name,
                    error: error.message
                });
            }
        }

        return results;
    }

    // データがすべて読み込まれているかチェック
    isAllDataLoaded() {
        const requiredTypes = ['characters', 'counterStrategies', 'strongActions', 'comboRecipes', 'settings'];
        return requiredTypes.every(type => this.loadedFiles.has(type));
    }

    // 読み込み済みデータタイプを取得
    getLoadedDataTypes() {
        return Array.from(this.loadedFiles);
    }

    // データをリセット
    reset() {
        SF6_DATA = {
            characters: null,
            counterStrategies: null,
            strongActions: null,
            comboRecipes: null,
            settings: null
        };
        this.loadedFiles.clear();
    }

    // データ読み込みUI表示
    showDataLoadUI() {
        const modal = document.createElement('div');
        modal.className = 'data-load-modal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 10000;
        `;

        const content = document.createElement('div');
        content.className = 'data-load-content';
        content.style.cssText = `
            background-color: var(--card-background);
            padding: 2rem;
            border-radius: 8px;
            width: 90%;
            max-width: 600px;
            text-align: center;
        `;

        content.innerHTML = `
            <h2 style="color: var(--accent-color); margin-bottom: 1rem;">データファイルを読み込み</h2>
            <p style="color: var(--text-color); margin-bottom: 2rem;">
                以下のJSONファイルを選択してください：<br>
                • characters.json<br>
                • counter_strategies.json<br>
                • strong_actions.json<br>
                • combo_recipes.json<br>
                • settings.json
            </p>
            <div style="margin-bottom: 2rem;">
                <button id="load-files-btn" style="
                    padding: 1rem 2rem;
                    background-color: var(--accent-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                    margin-right: 1rem;
                ">ファイルを選択</button>
                <button id="use-sample-btn" style="
                    padding: 1rem 2rem;
                    background-color: var(--success-color);
                    color: white;
                    border: none;
                    border-radius: 4px;
                    font-size: 1rem;
                    cursor: pointer;
                ">サンプルデータを使用</button>
            </div>
            <div id="load-status" style="color: var(--text-secondary);">
                読み込み待機中...
            </div>
        `;

        modal.appendChild(content);
        document.body.appendChild(modal);

        // イベントリスナー設定
        const loadFilesBtn = content.querySelector('#load-files-btn');
        const useSampleBtn = content.querySelector('#use-sample-btn');
        const statusDiv = content.querySelector('#load-status');

        loadFilesBtn.addEventListener('click', async () => {
            try {
                const files = await this.openFileDialog('.json');
                if (files.length === 0) return;

                statusDiv.textContent = 'ファイルを読み込み中...';
                const results = await this.loadMultipleFiles(files);

                if (results.loaded.length > 0) {
                    statusDiv.innerHTML = `
                        <div style="color: var(--success-color);">
                            読み込み完了: ${results.loaded.map(r => r.file).join(', ')}
                        </div>
                    `;
                    
                    // DataLoaderに新しいデータを設定
                    if (typeof dataLoader !== 'undefined') {
                        dataLoader.clearCache();
                        dataLoader.characters = SF6_DATA.characters;
                        dataLoader.counterStrategies = SF6_DATA.counterStrategies;
                        dataLoader.strongActions = SF6_DATA.strongActions;
                        dataLoader.comboRecipes = SF6_DATA.comboRecipes;
                        dataLoader.settings = SF6_DATA.settings;
                    }
                    
                    // データはProxyにより自動保存される
                    
                    setTimeout(() => {
                        modal.remove();
                        // アプリを再初期化
                        window.location.reload();
                    }, 2000);
                } else {
                    statusDiv.innerHTML = `
                        <div style="color: var(--danger-color);">
                            読み込みに失敗しました
                        </div>
                    `;
                }
            } catch (error) {
                statusDiv.innerHTML = `
                    <div style="color: var(--danger-color);">
                        エラー: ${error.message}
                    </div>
                `;
            }
        });

        useSampleBtn.addEventListener('click', async () => {
            statusDiv.textContent = 'サンプルデータを読み込み中...';
            
            try {
                // 既存のJSONファイルからサンプルデータを作成
                await this.loadSampleData();
                // データはProxyにより自動保存される
                
                statusDiv.innerHTML = `
                    <div style="color: var(--success-color);">
                        サンプルデータの読み込みが完了しました
                    </div>
                `;
                
                // DataLoaderに新しいデータを設定
                if (typeof dataLoader !== 'undefined') {
                    dataLoader.clearCache();
                    dataLoader.characters = SF6_DATA.characters;
                    dataLoader.counterStrategies = SF6_DATA.counterStrategies;
                    dataLoader.strongActions = SF6_DATA.strongActions;
                    dataLoader.comboRecipes = SF6_DATA.comboRecipes;
                    dataLoader.settings = SF6_DATA.settings;
                }
                
                setTimeout(() => {
                    modal.remove();
                    window.location.reload();
                }, 1000);
            } catch (error) {
                statusDiv.innerHTML = `
                    <div style="color: var(--danger-color);">
                        サンプルデータの読み込みに失敗しました: ${error.message}
                    </div>
                `;
            }
        });

        return modal;
    }

    // サンプルデータを読み込み（既存のJSONファイルから）
    async loadSampleData() {
        try {
            // データディレクトリのJSONファイルからサンプルデータを読み込み
            const files = [
                { name: 'characters.json', type: 'characters' },
                { name: 'counter_strategies.json', type: 'counterStrategies' },
                { name: 'strong_actions.json', type: 'strongActions' },
                { name: 'combo_recipes.json', type: 'comboRecipes' },
                { name: 'settings.json', type: 'settings' }
            ];

            for (const fileInfo of files) {
                try {
                    const response = await fetch(`data/${fileInfo.name}`);
                    if (response.ok) {
                        const data = await response.json();
                        SF6_DATA[fileInfo.type] = data;
                        this.loadedFiles.add(fileInfo.type);
                        console.log(`Loaded sample data: ${fileInfo.name}`);
                    } else {
                        console.warn(`Could not load ${fileInfo.name}: ${response.status}`);
                    }
                } catch (error) {
                    console.warn(`Error loading ${fileInfo.name}:`, error);
                }
            }

            // 最低限のデータが読み込まれているかチェック
            if (this.loadedFiles.size === 0) {
                throw new Error('サンプルデータの読み込みに失敗しました。JSONファイルを手動で選択してください。');
            }

            console.log('Sample data loaded successfully');
        } catch (error) {
            console.error('Error loading sample data:', error);
            throw error;
        }
    }
}

// グローバルインスタンス
const dataFileLoader = new DataFileLoader();
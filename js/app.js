// Main Application Controller for SF6 Database
// アプリケーション全体の制御とメイン処理を担当

class SF6DatabaseApp {
    constructor() {
        this.isInitialized = false;
        this.currentMode = 'counter';
        this.searchTimeout = null;
    }

    // アプリケーションの初期化
    async init() {
        if (this.isInitialized) return;

        console.log('Initializing SF6 Database...');
        
        // ローディング状態を表示
        this.showLoading();

        try {
            // データを読み込み
            const success = await dataLoader.loadAllData();
            
            if (!success) {
                console.log('Data loading failed or requires user action');
                this.hideLoading();
                return; // データ読み込みUIが表示されている場合は処理を中断
            }

            // UI要素を初期化
            this.initializeUI();
            
            // イベントリスナーを設定
            this.setupEventListeners();
            
            // 初期画面を表示（デフォルトでリュウを表示）
            this.showInitialScreen();
            
            // Proxyによる自動保存があるため、手動の自動保存は不要
            
            this.isInitialized = true;
            console.log('SF6 Database initialized successfully');
            
            // localStorageからデータが読み込まれた場合の通知
            const savedInfo = dataStorage.getSavedDataInfo();
            if (savedInfo) {
                dataStorage.showSaveNotification('保存されたデータを読み込みました');
            }
            
        } catch (error) {
            console.error('Initialization failed:', error);
            this.showError('アプリケーションの初期化に失敗しました');
        } finally {
            this.hideLoading();
        }
    }

    // UI要素の初期化
    initializeUI() {
        // 設定を適用
        this.applySettings();
        
        // 静的なキャラクターアイテムにクリックイベントを設定
        this.setupStaticCharacterEvents();
    }

    // イベントリスナーの設定
    setupEventListeners() {
        // タブの切り替え
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const mode = e.target.dataset.mode;
                if (mode) {
                    characterDisplay.switchMode(mode);
                }
            });
        });

        // 検索機能
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                // デバウンス処理
                clearTimeout(this.searchTimeout);
                this.searchTimeout = setTimeout(() => {
                    this.handleSearch(e.target.value);
                }, 300);
            });
        }


        // 編集ボタン
        const editBtn = document.getElementById('edit-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => {
                dataEditor.toggleEditMode();
            });
        }

        // キーボードショートカット
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });

        // ウィンドウリサイズ
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    // キャラクターリストの表示
    renderCharacterList() {
        const characters = dataLoader.getCharacterData();
        if (!characters) {
            console.error('No characters data available');
            return;
        }

        characterDisplay.updateCharacterList(characters);
    }

    // 検索処理
    handleSearch(searchTerm) {
        if (!searchTerm.trim()) {
            // 空の検索の場合、全キャラクターを表示
            this.showAllCharacters();
            return;
        }

        this.filterStaticCharacters(searchTerm);
    }

    // 全キャラクターを表示
    showAllCharacters() {
        document.querySelectorAll('.character-item').forEach(item => {
            item.style.display = 'flex';
        });
    }

    // 静的キャラクターのフィルタリング
    filterStaticCharacters(searchTerm) {
        const term = searchTerm.toLowerCase();
        document.querySelectorAll('.character-item').forEach(item => {
            const characterName = item.querySelector('.character-name').textContent.toLowerCase();
            const characterId = item.dataset.characterId.toLowerCase();
            
            if (characterName.includes(term) || characterId.includes(term)) {
                item.style.display = 'flex';
            } else {
                item.style.display = 'none';
            }
        });
    }

    // キーボードショートカット
    handleKeyboardShortcuts(e) {
        // Ctrl/Cmd + S: データを保存
        if ((e.ctrlKey || e.metaKey) && e.key === 's') {
            e.preventDefault();
            dataStorage.saveData();
        }

        // Ctrl/Cmd + F: 検索フィールドにフォーカス
        if ((e.ctrlKey || e.metaKey) && e.key === 'f') {
            e.preventDefault();
            const searchInput = document.getElementById('search-input');
            if (searchInput) {
                searchInput.focus();
            }
        }

        // Ctrl/Cmd + O: ファイルからインポート
        if ((e.ctrlKey || e.metaKey) && e.key === 'o') {
            e.preventDefault();
            dataStorage.openImportDialog();
        }

        // Escape: 検索をクリア
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search-input');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                this.showAllCharacters();
            }
        }

        // 数字キー: タブ切り替え
        if (e.key >= '1' && e.key <= '4') {
            e.preventDefault();
            const modes = ['counter', 'strong', 'combo', 'data'];
            const mode = modes[parseInt(e.key) - 1];
            if (mode && characterDisplay.currentCharacter) {
                characterDisplay.switchMode(mode);
            }
        }
    }

    // 設定の適用
    applySettings() {
        const settings = dataLoader.getSettings();
        if (!settings) return;

        // テーマの適用
        if (settings.display?.theme) {
            document.documentElement.setAttribute('data-theme', settings.display.theme);
        }

        // フォントサイズの適用
        if (settings.display?.fontSize) {
            document.documentElement.setAttribute('data-font-size', settings.display.fontSize);
        }

        // デフォルトモードの設定
        if (settings.display?.defaultMode) {
            this.currentMode = settings.display.defaultMode;
        }
    }

    // 初期画面の表示
    showInitialScreen() {
        // デフォルトでリュウを表示
        characterDisplay.showCharacterDetail('ryu');
    }

    // ローディング状態の表示
    showLoading() {
        const loadingHTML = `
            <div class="loading-overlay">
                <div class="loading">
                    <div class="loading-spinner"></div>
                    <div class="loading-text">データを読み込み中...</div>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }

    // ローディング状態の非表示
    hideLoading() {
        const loadingOverlay = document.querySelector('.loading-overlay');
        if (loadingOverlay) {
            loadingOverlay.remove();
        }
    }

    // エラー表示
    showError(message) {
        const errorHTML = `
            <div class="error-overlay">
                <div class="error-message">
                    <h3>エラー</h3>
                    <p>${message}</p>
                    <button onclick="location.reload()">再読み込み</button>
                </div>
            </div>
        `;
        
        document.body.insertAdjacentHTML('beforeend', errorHTML);
    }


    // ウィンドウリサイズ処理
    handleResize() {
        // 必要に応じてレイアウトを調整
        // 現在は特に処理なし
    }

    // 静的なキャラクターアイテムのイベント設定
    setupStaticCharacterEvents() {
        document.querySelectorAll('.character-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const characterId = item.dataset.characterId;
                if (characterId) {
                    characterDisplay.showCharacterDetail(characterId);
                }
            });
        });
    }

    // データの再読み込み
    async reloadData() {
        this.showLoading();
        
        try {
            const success = await dataLoader.reloadData();
            if (success) {
                this.renderCharacterList();
                // 現在のキャラクターが表示されている場合は再表示
                if (characterDisplay.currentCharacter) {
                    characterDisplay.showCharacterDetail(characterDisplay.currentCharacter.id);
                }
            } else {
                throw new Error('Data reload failed');
            }
        } catch (error) {
            console.error('Data reload failed:', error);
            this.showError('データの再読み込みに失敗しました');
        } finally {
            this.hideLoading();
        }
    }
}

// アプリケーションインスタンスを作成
const app = new SF6DatabaseApp();

// DOMの読み込み完了後にアプリを初期化
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});

// エラーハンドリング
window.addEventListener('error', (e) => {
    console.error('Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
    console.error('Unhandled promise rejection:', e.reason);
});

// 開発用のグローバル関数
window.sf6db = {
    app: app,
    dataLoader: dataLoader,
    characterDisplay: characterDisplay,
    reloadData: () => app.reloadData()
};
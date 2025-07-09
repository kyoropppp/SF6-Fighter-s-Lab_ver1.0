class App {
    constructor() {
        this.initialized = false;
        this.setupGlobalReferences();
        this.initializeEventListeners();
    }

    setupGlobalReferences() {
        window.app = this;
        window.dataManager = dataManager;
        window.storageManager = storageManager;
        window.dataLoader = dataLoader;
        window.characterRenderer = characterRenderer;
        window.editor = editor;
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupSearch();
            this.setupGlobalKeyboardShortcuts();
        });
    }

    initialize() {
        if (this.initialized) return;
        
        this.setupUI();
        this.updateDataInfo();
        this.initialized = true;
    }

    setupUI() {
        this.setupSearch();
        this.setupDataManagement();
        
        if (window.characterRenderer) {
            window.characterRenderer.refreshDisplay();
        }
        
        if (window.editor) {
            window.editor.updateDataInfo();
        }
    }

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        const searchClear = document.getElementById('searchClear');
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.handleSearch(e.target.value);
            });
            
            searchInput.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleSearch(e.target.value);
                }
            });
        }
        
        if (searchClear) {
            searchClear.addEventListener('click', () => {
                if (searchInput) {
                    searchInput.value = '';
                    this.handleSearch('');
                }
            });
        }
    }

    setupDataManagement() {
        const dataManagementPanel = document.querySelector('.data-management-panel');
        if (dataManagementPanel) {
            this.updateDataInfo();
        }
    }

    setupGlobalKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'h') {
                e.preventDefault();
                this.showHelp();
            }
            
            if (e.ctrlKey && e.key === 'r') {
                e.preventDefault();
                this.refreshApplication();
            }
        });
    }

    handleSearch(query) {
        // 検索状態の管理
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            // 検索入力の視覚的フィードバック
            if (query.trim()) {
                searchInput.classList.add('searching');
            } else {
                searchInput.classList.remove('searching');
            }
        }
        
        // グローバル検索の実行
        if (window.characterRenderer) {
            if (query.trim()) {
                // 検索クエリがある場合は全データベース検索
                window.characterRenderer.searchItems(query);
            } else {
                // 検索クエリが空の場合は通常表示に戻す
                if (dataManager.getCurrentCharacter()) {
                    window.characterRenderer.renderCurrentData();
                }
            }
        }
    }

    updateDataInfo() {
        const lastSaved = dataManager.getLastSaved();
        const dataCount = dataManager.getDataCount();
        
        const lastSavedElement = document.getElementById('lastSaved');
        const dataCountElement = document.getElementById('dataCount');
        
        if (lastSavedElement) {
            lastSavedElement.textContent = lastSaved ? 
                lastSaved.toLocaleString('ja-JP') : 
                '未保存';
        }
        
        if (dataCountElement) {
            dataCountElement.textContent = dataCount + '件';
        }
    }

    showHelp() {
        const helpContent = `
        <h3>キーボードショートカット</h3>
        <ul>
            <li><strong>Ctrl+S</strong>: データ保存</li>
            <li><strong>Ctrl+F</strong>: 検索フォーカス</li>
            <li><strong>Ctrl+O</strong>: ファイルインポート</li>
            <li><strong>Ctrl+H</strong>: ヘルプ表示</li>
            <li><strong>Ctrl+R</strong>: アプリケーション再読み込み</li>
            <li><strong>ESC</strong>: 検索クリア・モーダル閉じる</li>
            <li><strong>1-4</strong>: タブ切り替え</li>
        </ul>
        
        <h3>使用方法</h3>
        <ol>
            <li>キャラクターを選択</li>
            <li>タブで対策・強い行動・コンボを切り替え</li>
            <li>編集モードで内容を編集</li>
            <li>データ管理タブでインポート・エクスポート</li>
        </ol>
        `;
        
        this.showModal('ヘルプ', helpContent);
    }

    showModal(title, content) {
        const modal = document.createElement('div');
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${title}</h3>
                    <button class="close-btn">&times;</button>
                </div>
                <div class="modal-body">
                    ${content}
                </div>
            </div>
        `;
        
        const closeBtn = modal.querySelector('.close-btn');
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.remove();
            }
        });
        
        document.body.appendChild(modal);
    }

    refreshApplication() {
        if (confirm('アプリケーションを再読み込みしますか？未保存のデータは失われます。')) {
            location.reload();
        }
    }

    showMessage(message, type = 'info') {
        const toastElement = document.createElement('div');
        toastElement.className = `toast-popup toast-${type}`;
        toastElement.textContent = message;
        
        document.body.appendChild(toastElement);
        
        setTimeout(() => {
            toastElement.classList.add('toast-fade-out');
            setTimeout(() => {
                if (toastElement.parentNode) {
                    toastElement.remove();
                }
            }, 300);
        }, 3000);
    }

    handleError(error, context = '') {
        console.error(`${context}:`, error);
        this.showMessage(`エラーが発生しました: ${error.message}`, 'error');
    }

    validateCurrentState() {
        const hasCharacters = dataManager.getCharacters().length > 0;
        const hasData = dataManager.getDataCount() > 0;
        
        return {
            hasCharacters,
            hasData,
            isValid: hasCharacters
        };
    }

    getApplicationInfo() {
        return {
            version: '2.0.0',
            name: 'SF6 Fighter\'s Lab',
            lastSaved: dataManager.getLastSaved(),
            dataCount: dataManager.getDataCount(),
            characters: dataManager.getCharacters().length,
            currentCharacter: dataManager.getCurrentCharacter(),
            currentMode: dataManager.getCurrentMode(),
            isEditMode: dataManager.getEditMode()
        };
    }
}

const app = new App();

window.onerror = function(message, source, lineno, colno, error) {
    console.error('Global error:', { message, source, lineno, colno, error });
    if (window.app) {
        window.app.handleError(error || new Error(message), 'Global');
    }
};

window.addEventListener('unhandledrejection', function(event) {
    console.error('Unhandled promise rejection:', event.reason);
    if (window.app) {
        window.app.handleError(event.reason, 'Promise');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    console.log('SF6 Database Application loaded');
});
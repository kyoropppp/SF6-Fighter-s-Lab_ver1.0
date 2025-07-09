class Editor {
    constructor() {
        this.isEditMode = false;
        this.currentEditData = null;
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupEditControls();
            this.setupModal();
            this.setupKeyboardShortcuts();
        });
    }

    setupEditControls() {
        const editToggle = document.getElementById('editToggle');
        const saveData = document.getElementById('saveData');
        const exportData = document.getElementById('exportData');
        const importData = document.getElementById('importData');
        const clearData = document.getElementById('clearData');
        const importInput = document.getElementById('importInput');

        if (editToggle) {
            editToggle.addEventListener('click', () => {
                this.toggleEditMode();
            });
        }

        if (saveData) {
            saveData.addEventListener('click', () => {
                this.saveData();
            });
        }

        if (exportData) {
            exportData.addEventListener('click', () => {
                this.exportData();
            });
        }

        if (importData) {
            importData.addEventListener('click', () => {
                importInput.click();
            });
        }

        if (importInput) {
            importInput.addEventListener('change', (e) => {
                const file = e.target.files[0];
                if (file) {
                    this.importData(file);
                }
            });
        }

        if (clearData) {
            clearData.addEventListener('click', () => {
                this.clearData();
            });
        }
    }

    setupModal() {
        const modal = document.getElementById('editModal');
        const closeBtn = modal.querySelector('.close-btn');
        const cancelBtn = document.getElementById('cancelEdit');
        const form = document.getElementById('editForm');

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }

        if (form) {
            form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem();
            });
        }
    }

    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 's') {
                e.preventDefault();
                this.saveData();
            }
            
            if (e.ctrlKey && e.key === 'o') {
                e.preventDefault();
                document.getElementById('importInput').click();
            }
            
            if (e.key === 'Escape') {
                this.closeModal();
                this.clearSearch();
            }
            
            if (e.ctrlKey && e.key === 'f') {
                e.preventDefault();
                const searchInput = document.getElementById('searchInput');
                if (searchInput) {
                    searchInput.focus();
                }
            }
            
            if (e.ctrlKey && e.key >= '1' && e.key <= '4') {
                e.preventDefault();
                const tabIndex = parseInt(e.key) - 1;
                const tabs = ['strategies', 'actions', 'combos', 'data-management'];
                if (tabs[tabIndex] && window.characterRenderer) {
                    window.characterRenderer.switchTab(tabs[tabIndex]);
                }
            }
        });
    }

    toggleEditMode() {
        // 編集モード終了時の未保存変更確認
        if (this.isEditMode && dataManager.hasUnsavedChanges) {
            if (!confirm('未保存の変更があります。保存せずに編集モードを終了しますか？')) {
                return;
            }
            dataManager.discardChanges();
        }
        
        this.isEditMode = !this.isEditMode;
        dataManager.setEditMode(this.isEditMode);
        
        // 編集モード開始時に一時データ初期化
        if (this.isEditMode) {
            dataManager.startEditMode();
        } else {
            dataManager.exitEditMode();
        }
        
        const editToggle = document.getElementById('editToggle');
        if (editToggle) {
            editToggle.textContent = this.isEditMode ? '表示モード' : '編集モード';
            editToggle.classList.toggle('active', this.isEditMode);
        }
        
        if (window.characterRenderer) {
            window.characterRenderer.renderCurrentData();
        }
        
        this.updateDataInfo();
        
        // UI状態を保存
        dataManager.saveUIState();
    }

    openModal(mode, data) {
        this.currentEditData = { mode, ...data };
        
        const modal = document.getElementById('editModal');
        const modalTitle = document.getElementById('modalTitle');
        const form = document.getElementById('editForm');
        
        if (mode === 'add') {
            modalTitle.textContent = 'アイテム追加';
            form.reset();
        } else if (mode === 'edit') {
            modalTitle.textContent = 'アイテム編集';
            this.populateEditForm(data);
        }
        
        modal.style.display = 'block';
        
        setTimeout(() => {
            const itemNameInput = document.getElementById('itemName');
            if (itemNameInput) {
                itemNameInput.focus();
            }
        }, 100);
    }

    populateEditForm(data) {
        const characterData = dataManager.getCharacterData(dataManager.getCurrentCharacter(), dataManager.getCurrentMode());
        if (!characterData) return;
        
        const items = characterData[data.categoryKey] || [];
        const item = items[data.index];
        
        if (item) {
            document.getElementById('itemName').value = item.item_name || '';
            document.getElementById('itemContent').value = item.content || '';
            document.getElementById('itemDescription').value = item.description || '';
        }
    }

    saveItem() {
        const itemName = document.getElementById('itemName').value.trim();
        const itemContent = document.getElementById('itemContent').value.trim();
        const itemDescription = document.getElementById('itemDescription').value.trim();
        
        if (!itemName || !itemContent) {
            alert('アイテム名と内容は必須です');
            return;
        }
        
        const newItem = {
            item_name: itemName,
            content: itemContent,
            description: itemDescription
        };
        
        const characterId = dataManager.getCurrentCharacter();
        const mode = dataManager.getCurrentMode();
        const categoryKey = this.currentEditData.categoryKey;
        
        const characterData = dataManager.getCharacterData(characterId, mode);
        if (!characterData) return;
        
        const items = characterData[categoryKey] || [];
        
        if (this.currentEditData.mode === 'add') {
            items.push(newItem);
        } else if (this.currentEditData.mode === 'edit') {
            items[this.currentEditData.index] = newItem;
        }
        
        dataManager.updateCharacterData(characterId, mode, categoryKey, items);
        
        this.closeModal();
        
        if (window.characterRenderer) {
            window.characterRenderer.renderCurrentData();
        }
        
        this.updateDataInfo();
    }

    closeModal() {
        const modal = document.getElementById('editModal');
        modal.style.display = 'none';
        this.currentEditData = null;
    }

    saveData() {
        if (dataManager.isEditMode) {
            dataManager.commitChanges();
        } else {
            dataManager.saveToStorage();
        }
        this.updateDataInfo();
        this.showMessage('データを保存しました', 'success');
    }

    exportData() {
        try {
            dataManager.exportData();
            this.showMessage('データをエクスポートしました', 'success');
        } catch (error) {
            this.showMessage('エクスポートに失敗しました: ' + error.message, 'error');
        }
    }

    async importData(file) {
        try {
            const data = await storageManager.loadFromFile(file);
            const normalizedData = storageManager.normalizeImportData(data);
            
            storageManager.validateDataStructure(normalizedData);
            
            if (dataManager.loadDataToTemp(normalizedData)) {
                if (window.characterRenderer) {
                    window.characterRenderer.refreshDisplay();
                }
                
                this.updateDataInfo();
                this.showMessage('データをインポートしました（未保存）', 'success');
            } else {
                throw new Error('データの読み込みに失敗しました');
            }
        } catch (error) {
            this.showMessage('インポートに失敗しました: ' + error.message, 'error');
        }
    }

    clearData() {
        if (confirm('すべてのデータを削除しますか？この操作は取り消せません。')) {
            dataManager.clearStorage();
            this.showMessage('データを削除しました', 'success');
            
            if (window.dataLoader) {
                window.dataLoader.reloadApplication();
            }
        }
    }

    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
            if (window.characterRenderer) {
                window.characterRenderer.searchItems('');
            }
        }
    }

    updateDataInfo() {
        const lastSaved = dataManager.getLastSaved();
        const dataCount = dataManager.getDataCount();
        const hasUnsavedChanges = dataManager.hasUnsavedChanges;
        
        const lastSavedElement = document.getElementById('lastSaved');
        const dataCountElement = document.getElementById('dataCount');
        
        if (lastSavedElement) {
            const timeText = lastSaved ? lastSaved.toLocaleString('ja-JP') : '未保存';
            lastSavedElement.textContent = hasUnsavedChanges ? `${timeText} (未保存の変更あり)` : timeText;
            lastSavedElement.style.color = hasUnsavedChanges ? '#ff6b6b' : '';
        }
        
        if (dataCountElement) {
            dataCountElement.textContent = dataCount + '件';
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
}

const editor = new Editor();
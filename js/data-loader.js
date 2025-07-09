class DataLoader {
    constructor() {
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupLoadingScreen();
        });
    }

    setupLoadingScreen() {
        const loadSampleDataBtn = document.getElementById('loadSampleData');
        const selectFileBtn = document.getElementById('selectFile');
        const fileInput = document.getElementById('fileInput');
        const dataLoader = document.getElementById('dataLoader');
        const mainApp = document.getElementById('mainApp');

        if (storageManager.hasStoredData()) {
            this.loadStoredData();
            return;
        }

        loadSampleDataBtn.addEventListener('click', () => {
            this.loadSampleData();
        });

        selectFileBtn.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                this.loadFromFile(file);
            }
        });
    }

    async loadSampleData() {
        try {
            this.showLoadingMessage('サンプルデータを読み込み中...');
            
            const response = await fetch('data/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (dataManager.loadData(data)) {
                dataManager.saveToStorage();
                this.showMainApp();
                this.showMessage('サンプルデータを読み込みました', 'success');
            } else {
                throw new Error('データの読み込みに失敗しました');
            }
        } catch (error) {
            this.showMessage('サンプルデータの読み込みに失敗しました: ' + error.message, 'error');
        }
    }

    async loadFromFile(file) {
        try {
            this.showLoadingMessage('ファイルを読み込み中...');
            
            const data = await storageManager.loadFromFile(file);
            const normalizedData = storageManager.normalizeImportData(data);
            
            storageManager.validateDataStructure(normalizedData);
            
            if (dataManager.loadData(normalizedData)) {
                dataManager.saveToStorage();
                this.showMainApp();
                this.showMessage('ファイルを読み込みました', 'success');
            } else {
                throw new Error('データの読み込みに失敗しました');
            }
        } catch (error) {
            this.showMessage('ファイルの読み込みに失敗しました: ' + error.message, 'error');
        }
    }

    loadStoredData() {
        try {
            if (dataManager.loadFromStorage()) {
                this.showMainApp();
                this.showMessage('保存されたデータを読み込みました', 'success');
            } else {
                throw new Error('保存されたデータの読み込みに失敗しました');
            }
        } catch (error) {
            this.showMessage('保存されたデータの読み込みに失敗しました: ' + error.message, 'error');
            this.showLoadingScreen();
        }
    }

    showMainApp() {
        const dataLoader = document.getElementById('dataLoader');
        const mainApp = document.getElementById('mainApp');
        
        if (dataLoader) dataLoader.style.display = 'none';
        if (mainApp) mainApp.style.display = 'block';
        
        if (window.app) {
            window.app.initialize();
        }
    }

    showLoadingScreen() {
        const dataLoader = document.getElementById('dataLoader');
        const mainApp = document.getElementById('mainApp');
        
        if (dataLoader) dataLoader.style.display = 'block';
        if (mainApp) mainApp.style.display = 'none';
    }

    showLoadingMessage(message) {
        const loaderContent = document.querySelector('.loader-content');
        if (loaderContent) {
            const messageElement = loaderContent.querySelector('.loading-message');
            if (messageElement) {
                messageElement.textContent = message;
            } else {
                const newMessage = document.createElement('div');
                newMessage.className = 'loading-message';
                newMessage.textContent = message;
                loaderContent.appendChild(newMessage);
            }
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

    reloadApplication() {
        dataManager.clearStorage();
        this.showLoadingScreen();
        this.setupLoadingScreen();
    }
}

const dataLoader = new DataLoader();
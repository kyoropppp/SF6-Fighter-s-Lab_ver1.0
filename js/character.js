class CharacterRenderer {
    constructor() {
        this.currentCharacter = null;
        this.currentMode = 'strategies';
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        document.addEventListener('DOMContentLoaded', () => {
            this.setupCharacterGrid();
            this.setupTabNavigation();
        });
    }

    setupCharacterGrid() {
        const characterGrid = document.getElementById('characterGrid');
        if (!characterGrid) return;

        const characters = dataManager.getCharacters();
        characterGrid.innerHTML = '';

        characters.forEach(character => {
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';
            characterCard.setAttribute('data-character-id', character.id);
            
            characterCard.innerHTML = `
                <div class="character-image">
                    <img src="${character.imageUrl}" alt="${character.name}" onerror="this.style.display='none'">
                </div>
                <div class="character-name">${character.name}</div>
            `;
            
            characterCard.addEventListener('click', () => {
                this.selectCharacter(character.id);
            });
            
            characterGrid.appendChild(characterCard);
        });
        
        // 現在選択中のキャラクターがある場合、選択状態を復元
        if (this.currentCharacter) {
            const selectedCard = document.querySelector(`[data-character-id="${this.currentCharacter}"]`);
            if (selectedCard) {
                selectedCard.classList.add('selected');
            }
        }
    }

    setupTabNavigation() {
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.addEventListener('click', () => {
                const tabName = button.getAttribute('data-tab');
                this.switchTab(tabName);
            });
        });
    }

    selectCharacter(characterId) {
        this.currentCharacter = characterId;
        dataManager.setCurrentCharacter(characterId);
        
        const characterCards = document.querySelectorAll('.character-card');
        characterCards.forEach(card => {
            card.classList.remove('selected');
        });
        
        const selectedCard = document.querySelector(`[data-character-id="${characterId}"]`);
        if (selectedCard) {
            selectedCard.classList.add('selected');
        }
        
        const characterInfo = document.querySelector('.character-info');
        if (characterInfo) {
            characterInfo.classList.remove('hidden');
        }
        
        this.switchTab('strategies');
        this.updateCharacterName();
        this.renderCurrentData();
        
        // UI状態を保存
        dataManager.saveUIState();
    }

    switchTab(tabName) {
        this.currentMode = tabName;
        dataManager.setCurrentMode(tabName);
        
        const tabButtons = document.querySelectorAll('.tab-button');
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-tab="${tabName}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        const tabPanels = document.querySelectorAll('.tab-panel');
        tabPanels.forEach(panel => {
            panel.classList.remove('active');
        });
        
        const activePanel = document.getElementById(tabName);
        if (activePanel) {
            activePanel.classList.add('active');
        }
        
        this.toggleCharacterHeader(tabName);
        this.renderCurrentData();
        
        // UI状態を保存
        dataManager.saveUIState();
    }

    toggleCharacterHeader(tabName) {
        const characterInfo = document.querySelector('.character-info');
        if (characterInfo) {
            if (tabName === 'data-management') {
                characterInfo.classList.add('hidden');
            } else {
                characterInfo.classList.remove('hidden');
            }
        }
    }

    updateCharacterName() {
        const characterNameElement = document.getElementById('selectedCharacterName');
        if (characterNameElement && this.currentCharacter) {
            const character = dataManager.getCharacters().find(c => c.id === this.currentCharacter);
            characterNameElement.textContent = character ? character.name : 'キャラクター';
        }
    }

    renderCurrentData() {
        if (!this.currentCharacter || this.currentMode === 'data-management') return;
        
        const contentElement = document.getElementById(`${this.currentMode}Content`);
        if (!contentElement) return;
        
        const characterData = dataManager.getCharacterData(this.currentCharacter, this.currentMode);
        
        if (!characterData) {
            contentElement.innerHTML = '<p>データがありません</p>';
            return;
        }
        
        this.renderCategoryData(contentElement, characterData);
    }

    renderCategoryData(container, characterData) {
        container.innerHTML = '';
        
        const categoryNames = characterData.categoryNames || {};
        const isEditMode = dataManager.getEditMode();
        
        Object.entries(categoryNames).forEach(([categoryKey, displayName]) => {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            
            // 編集モード時にドラッグ&ドロップを有効化
            if (isEditMode) {
                categorySection.draggable = true;
                categorySection.setAttribute('data-category-key', categoryKey);
            }
            
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'category-header';
            categoryHeader.innerHTML = `
                <h3>${displayName}</h3>
                ${isEditMode ? `
                    <div class="category-controls">
                        <button class="btn btn-small btn-primary" onclick="characterRenderer.addItem('${categoryKey}')">追加</button>
                        <button class="btn btn-small btn-danger" onclick="characterRenderer.removeCategory('${categoryKey}')">カテゴリ削除</button>
                    </div>
                ` : ''}
            `;
            
            const itemsContainer = document.createElement('div');
            itemsContainer.className = 'items-container';
            
            const items = characterData[categoryKey] || [];
            items.forEach((item, index) => {
                const itemElement = this.createItemElement(item, categoryKey, index, isEditMode);
                itemsContainer.appendChild(itemElement);
            });
            
            categorySection.appendChild(categoryHeader);
            categorySection.appendChild(itemsContainer);
            container.appendChild(categorySection);
        });
        
        if (isEditMode) {
            const addCategoryButton = document.createElement('button');
            addCategoryButton.className = 'btn btn-secondary';
            addCategoryButton.textContent = '新しいカテゴリを追加';
            addCategoryButton.onclick = () => this.addCategory();
            container.appendChild(addCategoryButton);
            
            // ドラッグ&ドロップ機能のセットアップ
            setTimeout(() => {
                this.setupDragAndDrop();
            }, 0);
        }
    }

    createItemElement(item, categoryKey, index, isEditMode) {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'data-item';
        
        itemDiv.innerHTML = `
            <div class="item-header">
                <h4>${item.item_name}</h4>
                ${isEditMode ? `
                    <div class="item-controls">
                        <button class="btn btn-small btn-secondary" onclick="characterRenderer.editItem('${categoryKey}', ${index})">編集</button>
                        <button class="btn btn-small btn-danger" onclick="characterRenderer.removeItem('${categoryKey}', ${index})">削除</button>
                    </div>
                ` : ''}
            </div>
            <div class="item-content">${item.content}</div>
            ${item.description ? `<div class="item-description">${item.description}</div>` : ''}
        `;
        
        return itemDiv;
    }

    addCategory() {
        const categoryName = prompt('カテゴリ名を入力してください:');
        if (categoryName && categoryName.trim()) {
            const categoryKey = 'user' + Date.now();
            dataManager.addCategory(this.currentCharacter, this.currentMode, categoryKey, categoryName.trim());
            this.renderCurrentData();
        }
    }

    removeCategory(categoryKey) {
        if (confirm('このカテゴリを削除しますか？')) {
            dataManager.removeCategory(this.currentCharacter, this.currentMode, categoryKey);
            this.renderCurrentData();
        }
    }

    addItem(categoryKey) {
        if (window.editor) {
            window.editor.openModal('add', { categoryKey });
        }
    }

    editItem(categoryKey, index) {
        if (window.editor) {
            window.editor.openModal('edit', { categoryKey, index });
        }
    }

    removeItem(categoryKey, index) {
        if (confirm('このアイテムを削除しますか？')) {
            const characterData = dataManager.getCharacterData(this.currentCharacter, this.currentMode);
            if (characterData && characterData[categoryKey]) {
                characterData[categoryKey].splice(index, 1);
                dataManager.updateCharacterData(this.currentCharacter, this.currentMode, categoryKey, characterData[categoryKey]);
                this.renderCurrentData();
            }
        }
    }

    refreshDisplay() {
        this.setupCharacterGrid();
        this.renderCurrentData();
    }

    searchItems(query) {
        const contentElement = document.getElementById(`${this.currentMode}Content`);
        if (!contentElement || !query) {
            this.renderCurrentData();
            return;
        }
        
        // 全データベース検索
        const globalResults = dataManager.globalSearch(query);
        
        // 検索結果を表示
        this.renderSearchResults(globalResults, query);
    }

    renderSearchResults(results, query) {
        const contentElement = document.getElementById(`${this.currentMode}Content`);
        contentElement.innerHTML = '';
        
        if (results.length === 0) {
            contentElement.innerHTML = `<p>「${query}」の検索結果がありません</p>`;
            return;
        }
        
        const searchResultsContainer = document.createElement('div');
        searchResultsContainer.className = 'search-results';
        
        const searchHeader = document.createElement('div');
        searchHeader.className = 'search-header';
        searchHeader.innerHTML = `<h3>「${query}」の検索結果 (${results.length}件)</h3>`;
        searchResultsContainer.appendChild(searchHeader);
        
        results.forEach(result => {
            const resultElement = this.createSearchResultElement(result);
            searchResultsContainer.appendChild(resultElement);
        });
        
        contentElement.appendChild(searchResultsContainer);
    }

    createSearchResultElement(result) {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        
        const modeDisplayNames = {
            'strategies': '対策',
            'actions': '強い行動',
            'combos': 'コンボ'
        };
        
        div.innerHTML = `
            <div class="result-header">
                <strong>${result.characterName}</strong> - ${modeDisplayNames[result.mode]} - ${result.categoryName}
            </div>
            <div class="result-content">
                <h4>${result.item.item_name}</h4>
                <p>${result.item.content}</p>
                ${result.item.description ? `<p class="description">${result.item.description}</p>` : ''}
            </div>
        `;
        
        // クリックでジャンプ
        div.addEventListener('click', () => {
            this.jumpToResult(result);
        });
        
        return div;
    }

    jumpToResult(result) {
        // キャラクターとモードを切り替え
        this.selectCharacter(result.characterId);
        this.switchTab(result.mode);
        
        // 少し待ってから該当アイテムをハイライト
        setTimeout(() => {
            this.highlightItem(result.categoryKey, result.itemIndex);
        }, 100);
    }

    highlightItem(categoryKey, itemIndex) {
        // 該当カテゴリ内のアイテムを検索
        const categoryElements = document.querySelectorAll('.category-section');
        categoryElements.forEach(categoryElement => {
            const items = categoryElement.querySelectorAll('.data-item');
            items.forEach((item, index) => {
                if (index === itemIndex) {
                    item.classList.add('highlighted');
                    item.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    
                    // 3秒後にハイライト解除
                    setTimeout(() => {
                        item.classList.remove('highlighted');
                    }, 3000);
                }
            });
        });
    }

    setupDragAndDrop() {
        // ドラッグ&ドロップ機能のセットアップ
        // renderCategoryData内で各カテゴリセクションに対して呼び出される
        const categorySections = document.querySelectorAll('.category-section[draggable="true"]');
        
        categorySections.forEach((section, index) => {
            section.addEventListener('dragstart', (e) => {
                this.handleDragStart(e, index);
            });
            
            section.addEventListener('dragover', (e) => {
                this.handleDragOver(e);
            });
            
            section.addEventListener('drop', (e) => {
                this.handleDrop(e, index);
            });
            
            section.addEventListener('dragleave', (e) => {
                this.handleDragLeave(e);
            });
            
            section.addEventListener('dragend', (e) => {
                this.handleDragEnd(e);
            });
        });
    }

    handleDragStart(e, categoryIndex) {
        this.draggedCategoryIndex = categoryIndex;
        e.target.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/html', e.target.outerHTML);
    }

    handleDragOver(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        
        const targetSection = e.currentTarget;
        if (!targetSection.classList.contains('dragging')) {
            targetSection.classList.add('drag-over');
        }
    }

    handleDragLeave(e) {
        e.currentTarget.classList.remove('drag-over');
    }

    handleDrop(e, targetIndex) {
        e.preventDefault();
        
        const targetSection = e.currentTarget;
        targetSection.classList.remove('drag-over');
        
        if (this.draggedCategoryIndex !== undefined && this.draggedCategoryIndex !== targetIndex) {
            // カテゴリの順序を変更
            dataManager.reorderCategories(
                this.currentCharacter,
                this.currentMode,
                this.draggedCategoryIndex,
                targetIndex
            );
            
            // 画面を再描画
            this.renderCurrentData();
            
            // UI状態を保存
            dataManager.saveUIState();
        }
        
        this.draggedCategoryIndex = undefined;
    }

    handleDragEnd(e) {
        e.target.classList.remove('dragging');
        
        // 全てのドラッグオーバー状態をクリア
        document.querySelectorAll('.category-section').forEach(section => {
            section.classList.remove('drag-over');
        });
        
        this.draggedCategoryIndex = undefined;
    }
}

const characterRenderer = new CharacterRenderer();
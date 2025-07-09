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
        
        this.switchTab('strategies');
        this.updateCharacterName();
        this.renderCurrentData();
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
        
        this.renderCurrentData();
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
        
        const characterData = dataManager.getCharacterData(this.currentCharacter, this.currentMode);
        if (!characterData) return;
        
        const filteredData = { ...characterData };
        Object.keys(characterData.categoryNames || {}).forEach(categoryKey => {
            const items = characterData[categoryKey] || [];
            filteredData[categoryKey] = items.filter(item => 
                item.item_name.toLowerCase().includes(query.toLowerCase()) ||
                item.content.toLowerCase().includes(query.toLowerCase()) ||
                (item.description && item.description.toLowerCase().includes(query.toLowerCase()))
            );
        });
        
        this.renderCategoryData(contentElement, filteredData);
    }
}

const characterRenderer = new CharacterRenderer();
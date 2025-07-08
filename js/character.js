// Character handling for SF6 Database
// キャラクター詳細情報の表示とUI生成を担当

class CharacterDisplay {
    constructor() {
        this.currentCharacter = null;
        this.currentMode = 'counter';
    }

    // キャラクター詳細画面の表示
    showCharacterDetail(characterId) {
        // まずJSONデータからキャラクター情報を取得
        let characterData = dataLoader.getCharacterData(characterId);
        
        // JSONデータにない場合は、HTMLから基本情報を取得
        if (!characterData) {
            const characterItem = document.querySelector(`[data-character-id="${characterId}"]`);
            if (characterItem) {
                const characterName = characterItem.querySelector('.character-name').textContent;
                characterData = {
                    id: characterId,
                    name: characterName,
                    nameEn: characterId.charAt(0).toUpperCase() + characterId.slice(1),
                    icon: `images/characters/${characterId}.png`
                };
            } else {
                console.error('Character not found:', characterId);
                return;
            }
        }

        this.currentCharacter = characterData;
        
        // キャラクター名を表示
        document.getElementById('character-name').textContent = characterData.name;
        
        // 現在のモードに応じてコンテンツを表示
        this.switchMode(this.currentMode);
        
        // サイドバーのアクティブ状態を更新
        this.updateSidebarActiveState(characterId);
    }

    // 表示モードの切り替え
    switchMode(mode) {
        this.currentMode = mode;
        
        // すべてのタブとコンテンツを非表示
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.content-section').forEach(section => section.style.display = 'none');
        
        // 選択されたタブとコンテンツを表示
        document.getElementById(`${mode}-tab`).classList.add('active');
        document.getElementById(`${mode}-content`).style.display = 'grid';
        
        // コンテンツを更新
        this.updateContent(mode);
    }

    // コンテンツの更新
    updateContent(mode) {
        if (!this.currentCharacter) return;
        
        const characterId = this.currentCharacter.id;
        
        switch (mode) {
            case 'counter':
                this.renderCounterStrategies(characterId);
                break;
            case 'strong':
                this.renderStrongActions(characterId);
                break;
            case 'combo':
                this.renderComboRecipes(characterId);
                break;
            case 'data':
                this.renderDataManagement();
                break;
        }
    }

    // 対策情報の表示
    renderCounterStrategies(characterId) {
        const strategies = dataLoader.getCounterStrategies(characterId);
        const container = document.getElementById('counter-content');
        
        if (!strategies) {
            this.showEmptyState('counter-content', '対策データが見つかりません');
            return;
        }

        // コンテナをクリア
        container.innerHTML = '';

        // ALL カテゴリを汎用処理（特別扱いなし）
        const categoryNames = strategies.categoryNames || {};
        Object.entries(categoryNames).forEach(([key, name]) => {
            if (strategies[key] && Array.isArray(strategies[key])) {
                this.createCategorySection(container, key, name, strategies[key]);
            }
        });
    }

    // 強い行動情報の表示
    renderStrongActions(characterId) {
        const actions = dataLoader.getStrongActions(characterId);
        const container = document.getElementById('strong-content');
        
        if (!actions) {
            this.showEmptyState('strong-content', '強い行動データが見つかりません');
            return;
        }

        // コンテナをクリア
        container.innerHTML = '';

        // ALL カテゴリを汎用処理（特別扱いなし）
        const categoryNames = actions.categoryNames || {};
        Object.entries(categoryNames).forEach(([key, name]) => {
            if (actions[key] && Array.isArray(actions[key])) {
                this.createCategorySection(container, key, name, actions[key]);
            }
        });
    }

    // コンボレシピ情報の表示
    renderComboRecipes(characterId) {
        const combos = dataLoader.getComboRecipes(characterId);
        const container = document.getElementById('combo-content');
        
        if (!combos) {
            this.showEmptyState('combo-content', 'コンボデータが見つかりません');
            return;
        }

        // コンテナをクリア
        container.innerHTML = '';

        // ALL カテゴリを汎用処理（特別扱いなし）
        const categoryNames = combos.categoryNames || {};
        Object.entries(categoryNames).forEach(([key, name]) => {
            if (combos[key] && Array.isArray(combos[key])) {
                this.createCategorySection(container, key, name, combos[key]);
            }
        });
    }

    // 汎用カテゴリセクション作成
    createCategorySection(container, key, name, data) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'content-category';
        categoryDiv.innerHTML = `
            <h3>${name}</h3>
            <div id="${key}-list" class="data-list"></div>
        `;
        container.appendChild(categoryDiv);
        
        // 統一フォーマッター（item_name, content, description）
        this.renderDataList(`${key}-list`, data, (item) => ({
            title: item.item_name || item.title || item.name || item.move || item.sequence || item.setup || item.combo || Object.values(item)[0] || '',
            content: item.content || item.description || item.punish || item.counter || item.type || item.pattern || (item.damage ? `ダメージ: ${item.damage}` : '') || (item.situation ? `${item.situation}` : '') || Object.values(item)[1] || '',
            description: item.description !== (item.content || item.description || item.punish || item.counter || item.type || item.pattern) ? item.description : null,
            meta: item.difficulty ? [{ text: item.difficulty, class: `difficulty-${item.difficulty}` }] : (item.meterCost ? [{ text: `ゲージ: ${item.meterCost}`, class: 'meter-cost' }] : [])
        }));
    }

    // データリストの汎用レンダリング
    renderDataList(elementId, data, formatter) {
        const element = document.getElementById(elementId);
        if (!element) return;

        if (!data || data.length === 0) {
            element.innerHTML = '<div class="empty-state">データがありません</div>';
            return;
        }

        const html = data.map(item => {
            const formatted = formatter(item);
            return this.createDataItemHTML(formatted);
        }).join('');

        element.innerHTML = html;
    }

    // データアイテムのHTMLを生成
    createDataItemHTML(item) {
        const metaHTML = item.meta ? item.meta.map(meta => 
            `<span class="meta-tag ${meta.class || ''}">${meta.text}</span>`
        ).join('') : '';

        return `
            <div class="data-item">
                <div class="data-item-title">${item.title}</div>
                <div class="data-item-content">${item.content}</div>
                ${item.description ? `<div class="data-item-content">${item.description}</div>` : ''}
                ${metaHTML ? `<div class="data-item-meta">${metaHTML}</div>` : ''}
            </div>
        `;
    }

    // 空の状態を表示
    showEmptyState(containerId, message) {
        const container = document.getElementById(containerId);
        if (container) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>${message}</h3>
                    <p>データが追加されるまでお待ちください</p>
                </div>
            `;
        }
    }

    // サイドバーのアクティブ状態を更新
    updateSidebarActiveState(characterId) {
        document.querySelectorAll('.character-item').forEach(item => {
            item.classList.remove('active');
        });
        
        const activeItem = document.querySelector(`.character-item[data-character-id="${characterId}"]`);
        if (activeItem) {
            activeItem.classList.add('active');
        }
    }


    // キャラクター情報の検索・フィルタ
    filterCharacterData(searchTerm) {
        const characters = dataLoader.searchCharacters(searchTerm);
        this.updateCharacterList(characters);
    }

    // キャラクターリストの更新
    updateCharacterList(characters) {
        const characterList = document.getElementById('character-list');
        if (!characterList) return;

        if (!characters || characters.length === 0) {
            characterList.innerHTML = '<div class="empty-state">キャラクターが見つかりません</div>';
            return;
        }

        const html = characters.map(character => `
            <div class="character-item" data-character-id="${character.id}">
                <img src="${character.icon}" alt="${character.name}" class="character-icon" 
                     onerror="this.style.display='none'">
                <div class="character-name">${character.name}</div>
            </div>
        `).join('');

        characterList.innerHTML = html;

        // イベントリスナーを再設定
        this.setupCharacterItemEvents();
    }



    // データ管理タブの表示
    renderDataManagement() {
        // データ情報を更新
        this.updateDataInfo();
        
        // イベントリスナーを設定
        this.setupDataManagementEvents();
    }

    // データ情報を更新
    updateDataInfo() {
        const savedInfo = dataStorage.getSavedDataInfo();
        
        // 保存状態
        const saveStatusElement = document.getElementById('save-status');
        const lastSavedElement = document.getElementById('last-saved');
        const dataSizeElement = document.getElementById('data-size');
        
        if (savedInfo) {
            saveStatusElement.textContent = '保存済み';
            saveStatusElement.className = 'info-value success';
            lastSavedElement.textContent = new Date(savedInfo.timestamp).toLocaleString('ja-JP');
            dataSizeElement.textContent = savedInfo.size;
        } else {
            saveStatusElement.textContent = '未保存';
            saveStatusElement.className = 'info-value warning';
            lastSavedElement.textContent = '未保存';
            dataSizeElement.textContent = '不明';
        }

    }

    // データ管理のイベントリスナーを設定
    setupDataManagementEvents() {
        // 各ボタンのイベントリスナーを設定（重複を避けるため一度削除）
        const buttons = [
            { id: 'save-data-btn', action: () => dataStorage.saveData() },
            { id: 'import-data-btn', action: () => dataStorage.openImportDialog() },
            { id: 'export-data-btn', action: () => dataEditor.exportData() },
            { id: 'clear-data-btn', action: () => {
                if (confirm('保存されたデータを削除しますか？この操作は取り消せません。')) {
                    dataStorage.clearSavedData();
                    setTimeout(() => this.updateDataInfo(), 100);
                }
            }},
        ];

        buttons.forEach(({ id, action }) => {
            const button = document.getElementById(id);
            if (button) {
                // 既存のイベントリスナーを削除
                const newButton = button.cloneNode(true);
                button.parentNode.replaceChild(newButton, button);
                
                // 新しいイベントリスナーを追加
                newButton.addEventListener('click', () => {
                    action();
                    // データ情報を更新
                    setTimeout(() => this.updateDataInfo(), 500);
                });
            }
        });
    }

    // キャラクターアイテムのイベントリスナー設定
    setupCharacterItemEvents() {
        document.querySelectorAll('.character-item').forEach(item => {
            item.addEventListener('click', (e) => {
                const characterId = item.dataset.characterId;
                this.showCharacterDetail(characterId);
            });
        });
    }
}

// グローバルなCharacterDisplayインスタンスを作成
const characterDisplay = new CharacterDisplay();
// Editor functionality for SF6 Database
// Web上でのデータ編集機能を担当

class DataEditor {
    constructor() {
        this.isEditMode = false;
        this.currentEditData = null;
        this.currentEditType = null;
        this.currentEditIndex = null;
    }

    // 編集モードの切り替え
    toggleEditMode() {
        this.isEditMode = !this.isEditMode;
        
        const editBtn = document.getElementById('edit-btn');
        const characterContent = document.querySelector('.character-content');
        
        if (this.isEditMode) {
            editBtn.textContent = '表示モード';
            editBtn.classList.add('active');
            characterContent.classList.add('edit-mode');
            this.addEditControls();
        } else {
            editBtn.textContent = '編集モード';
            editBtn.classList.remove('active');
            characterContent.classList.remove('edit-mode');
            this.removeEditControls();
        }
    }

    // 編集コントロールを追加
    addEditControls() {
        // 各データアイテムに編集・削除ボタンを追加
        document.querySelectorAll('.data-item').forEach((item, index) => {
            if (!item.querySelector('.edit-controls')) {
                const controls = document.createElement('div');
                controls.className = 'edit-controls';
                controls.innerHTML = `
                    <button class="edit-btn-small" onclick="dataEditor.editItem(this)">編集</button>
                    <button class="delete-btn-small" onclick="dataEditor.deleteItem(this)">削除</button>
                `;
                item.appendChild(controls);
                
                // データタイプとインデックスを保存
                const categoryElement = item.closest('.content-category');
                if (categoryElement) {
                    const categoryTitle = categoryElement.querySelector('h3').textContent;
                    item.dataset.editType = this.getCategoryType(categoryTitle);
                    item.dataset.editIndex = index;
                }
            }
        });

        // 各カテゴリに「追加」ボタンを追加
        document.querySelectorAll('.data-list').forEach(list => {
            if (!list.querySelector('.add-item-btn')) {
                const addBtn = document.createElement('button');
                addBtn.className = 'add-item-btn';
                addBtn.textContent = '+ 新しいアイテムを追加';
                
                const categoryElement = list.closest('.content-category');
                const categoryTitle = categoryElement.querySelector('h3').textContent;
                const dataType = this.getCategoryType(categoryTitle);
                
                addBtn.onclick = () => this.addNewItem(dataType, list);
                list.appendChild(addBtn);
            }
        });

        // 新しいカテゴリを追加するボタンを各セクションに追加（データ管理タブを除く）
        document.querySelectorAll('.content-section').forEach(section => {
            // データ管理タブのセクションはスキップ
            if (section.id === 'data-content') return;
            
            if (!section.querySelector('.add-category-btn')) {
                const addCategoryBtn = document.createElement('button');
                addCategoryBtn.className = 'add-category-btn';
                addCategoryBtn.textContent = '+ 新しいカテゴリを追加';
                addCategoryBtn.onclick = () => this.addNewCategory(section);
                section.appendChild(addCategoryBtn);
            }
        });
    }

    // 編集コントロールを削除
    removeEditControls() {
        document.querySelectorAll('.edit-controls').forEach(control => control.remove());
        document.querySelectorAll('.add-item-btn').forEach(btn => btn.remove());
        document.querySelectorAll('.add-category-btn').forEach(btn => btn.remove());
        document.querySelectorAll('.category-controls').forEach(control => control.remove());
    }

    // カテゴリタイトルからデータタイプを取得
    getCategoryType(categoryTitle) {
        const typeMap = {
            '確定反撃': 'punishes',
            '対空対策': 'antiAir',
            '弱点・対処法': 'weaknesses',
            '主力技': 'strongMoves',
            '強力な連係': 'strongSequences',
            '起き攻め・セットプレイ': 'okizeme',
            '基本コンボ': 'basicCombos',
            '状況別コンボ': 'situationalCombos',
            'ゲージ使用コンボ': 'meterCombos'
        };
        return typeMap[categoryTitle] || 'unknown';
    }

    // アイテムの編集
    editItem(button) {
        const item = button.closest('.data-item');
        const dataType = item.dataset.editType;
        const dataIndex = parseInt(item.dataset.editIndex);
        
        const currentData = this.getCurrentItemData(item);
        if (currentData) {
            this.showEditModal(currentData, dataType, dataIndex, false);
        }
    }

    // アイテムの削除
    deleteItem(button) {
        if (confirm('このアイテムを削除しますか？')) {
            const item = button.closest('.data-item');
            const dataType = item.dataset.editType;
            
            // データから削除
            this.removeItemFromData(dataType, item);
            
            // DOMから削除
            item.remove();
            
            // データはProxyにより自動保存される
            
            console.log(`Deleted item from ${dataType}`);
        }
    }

    // 新しいアイテムの追加
    addNewItem(dataType, listElement) {
        const emptyData = this.createEmptyItemData(dataType);
        this.showEditModal(emptyData, dataType, -1, true);
    }

    // 新しいカテゴリの追加
    addNewCategory(sectionElement) {
        const categoryName = prompt('新しいカテゴリ名を入力してください:');
        if (!categoryName || categoryName.trim() === '') return;

        const categoryTitle = categoryName.trim();
        const categoryKey = this.generateCategoryKey(categoryTitle);
        
        // 新しいカテゴリをDOMに追加
        const newCategory = this.createCategoryElement(categoryTitle, categoryKey);
        
        // 「新しいカテゴリを追加」ボタンの前に挿入
        const addCategoryBtn = sectionElement.querySelector('.add-category-btn');
        sectionElement.insertBefore(newCategory, addCategoryBtn);
        
        // データ構造に新しいカテゴリを追加
        this.addCategoryToData(categoryKey, categoryTitle);
        
        // 編集モードの場合、新しいカテゴリにも編集コントロールを追加
        if (this.isEditMode) {
            this.addEditControlsToCategory(newCategory);
        }
    }

    // カテゴリキーを生成
    generateCategoryKey(categoryTitle) {
        return categoryTitle
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[^\w]/g, '')
            .substring(0, 20);
    }

    // カテゴリ要素を作成
    createCategoryElement(categoryTitle, categoryKey) {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'content-category';
        categoryDiv.innerHTML = `
            <h3>${categoryTitle}</h3>
            <div id="${categoryKey}-list" class="data-list"></div>
        `;
        return categoryDiv;
    }

    // データ構造に新しいカテゴリを追加
    addCategoryToData(categoryKey, categoryTitle) {
        if (!characterDisplay.currentCharacter) return;
        
        const characterId = characterDisplay.currentCharacter.id;
        const mode = characterDisplay.currentMode;
        
        let targetData = null;
        
        if (mode === 'counter') {
            targetData = SF6_DATA.counterStrategies.strategies.find(s => s.characterId === characterId);
            if (!targetData) {
                targetData = { 
                    characterId: characterId, 
                    characterName: characterDisplay.currentCharacter.name,
                    categoryNames: {}
                };
                SF6_DATA.counterStrategies.strategies.push(targetData);
            }
        } else if (mode === 'strong') {
            targetData = SF6_DATA.strongActions.actions.find(a => a.characterId === characterId);
            if (!targetData) {
                targetData = { 
                    characterId: characterId, 
                    characterName: characterDisplay.currentCharacter.name,
                    categoryNames: {}
                };
                SF6_DATA.strongActions.actions.push(targetData);
            }
        } else if (mode === 'combo') {
            targetData = SF6_DATA.comboRecipes.combos.find(c => c.characterId === characterId);
            if (!targetData) {
                targetData = { 
                    characterId: characterId, 
                    characterName: characterDisplay.currentCharacter.name,
                    categoryNames: {}
                };
                SF6_DATA.comboRecipes.combos.push(targetData);
            }
        }
        
        if (targetData) {
            // categoryNamesが存在しない場合は初期化
            if (!targetData.categoryNames) {
                targetData.categoryNames = {};
            }
            
            // categoryNamesにカテゴリを追加
            targetData.categoryNames[categoryKey] = categoryTitle;
            
            // データ配列を追加
            if (!targetData[categoryKey]) {
                targetData[categoryKey] = [];
            }
        }
    }

    // カテゴリに編集コントロールを追加
    addEditControlsToCategory(categoryElement) {
        const dataList = categoryElement.querySelector('.data-list');
        const categoryTitle = categoryElement.querySelector('h3').textContent;
        const dataType = this.getCategoryType(categoryTitle) || this.generateCategoryKey(categoryTitle);
        
        // カテゴリ削除ボタンを追加
        if (!categoryElement.querySelector('.category-controls')) {
            const categoryControls = document.createElement('div');
            categoryControls.className = 'category-controls';
            categoryControls.innerHTML = `
                <button class="delete-category-btn" onclick="dataEditor.deleteCategory(this)">カテゴリ削除</button>
            `;
            categoryElement.querySelector('h3').appendChild(categoryControls);
        }
        
        // アイテム追加ボタンを追加
        if (!dataList.querySelector('.add-item-btn')) {
            const addBtn = document.createElement('button');
            addBtn.className = 'add-item-btn';
            addBtn.textContent = '+ 新しいアイテムを追加';
            addBtn.onclick = () => this.addNewItem(dataType, dataList);
            dataList.appendChild(addBtn);
        }
    }

    // カテゴリを削除
    deleteCategory(button) {
        if (confirm('このカテゴリとすべてのデータを削除しますか？')) {
            const categoryElement = button.closest('.content-category');
            const categoryTitle = categoryElement.querySelector('h3').textContent;
            const categoryKey = this.generateCategoryKey(categoryTitle);
            
            // データから削除
            this.removeCategoryFromData(categoryKey);
            
            // DOMから削除
            categoryElement.remove();
            
            // データはProxyにより自動保存される
            
            console.log(`Deleted category: ${categoryTitle}`);
        }
    }

    // データからカテゴリを削除
    removeCategoryFromData(categoryKey) {
        if (!characterDisplay.currentCharacter) return;
        
        const characterId = characterDisplay.currentCharacter.id;
        const mode = characterDisplay.currentMode;
        
        let targetData = null;
        
        if (mode === 'counter') {
            targetData = SF6_DATA.counterStrategies.strategies.find(s => s.characterId === characterId);
        } else if (mode === 'strong') {
            targetData = SF6_DATA.strongActions.actions.find(a => a.characterId === characterId);
        } else if (mode === 'combo') {
            targetData = SF6_DATA.comboRecipes.combos.find(c => c.characterId === characterId);
        }
        
        if (targetData) {
            // データ配列を削除
            if (targetData[categoryKey]) {
                delete targetData[categoryKey];
            }
            // categoryNamesからも削除
            if (targetData.categoryNames && targetData.categoryNames[categoryKey]) {
                delete targetData.categoryNames[categoryKey];
            }
        }
    }

    // 現在のアイテムデータを取得（統一構造）
    getCurrentItemData(item) {
        const item_name = item.querySelector('.data-item-title')?.textContent || '';
        const content = item.querySelector('.data-item-content')?.textContent || '';
        const description = item.querySelectorAll('.data-item-content')[1]?.textContent || '';
        
        return { item_name: item_name, content: content, description: description };
    }

    // 空のアイテムデータを作成（統一構造）
    createEmptyItemData(dataType) {
        return { item_name: '', content: '', description: '' };
    }

    // 編集モーダルを表示
    showEditModal(data, dataType, dataIndex, isNew) {
        this.currentEditData = data;
        this.currentEditType = dataType;
        this.currentEditIndex = dataIndex;
        
        const modal = this.createEditModal(data, dataType, isNew);
        document.body.appendChild(modal);
    }

    // 編集モーダルを作成
    createEditModal(data, dataType, isNew) {
        const modal = document.createElement('div');
        modal.className = 'edit-modal';
        
        const modalContent = document.createElement('div');
        modalContent.className = 'edit-modal-content';
        
        modalContent.innerHTML = `
            <h3>${isNew ? '新しいアイテムを追加' : 'アイテムを編集'}</h3>
            <form class="edit-form" id="edit-form">
                ${this.generateFormFields(data, dataType)}
                <div class="edit-form-actions">
                    <button type="button" class="cancel-btn" onclick="dataEditor.closeEditModal()">キャンセル</button>
                    <button type="button" class="save-btn" onclick="dataEditor.saveEdit(${isNew})">${isNew ? '追加' : '保存'}</button>
                </div>
            </form>
        `;
        
        modal.appendChild(modalContent);
        
        // モーダル外をクリックで閉じる
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closeEditModal();
            }
        });
        
        return modal;
    }

    // フォームフィールドを生成（統一構造）
    generateFormFields(data, dataType) {
        return `
            <div>
                <label for="item_name">${this.getFieldLabel('item_name')}:</label>
                <input type="text" id="item_name" name="item_name" value="${data.item_name || ''}" placeholder="${this.getFieldLabel('item_name')}を入力">
            </div>
            <div>
                <label for="content">${this.getFieldLabel('content')}:</label>
                <input type="text" id="content" name="content" value="${data.content || ''}" placeholder="${this.getFieldLabel('content')}を入力">
            </div>
            <div>
                <label for="description">${this.getFieldLabel('description')}:</label>
                <textarea id="description" name="description" placeholder="${this.getFieldLabel('description')}を入力">${data.description || ''}</textarea>
            </div>
        `;
    }

    // フィールドラベルを取得（統一構造）
    getFieldLabel(fieldName) {
        const labelMap = {
            item_name: 'アイテム名',
            content: '内容',
            description: '説明'
        };
        return labelMap[fieldName] || fieldName;
    }

    // 編集を保存
    saveEdit(isNew) {
        const form = document.getElementById('edit-form');
        const formData = new FormData(form);
        const updatedData = {};
        
        for (let [key, value] of formData.entries()) {
            updatedData[key] = value;
        }
        
        console.log('Saving data:', updatedData);
        
        // データを更新
        this.updateData(updatedData, isNew);
        
        // 表示を更新
        characterDisplay.updateContent(characterDisplay.currentMode);
        
        this.closeEditModal();
        
        // データはProxyにより自動保存される
        
        // 編集モードを維持
        if (this.isEditMode) {
            this.removeEditControls();
            setTimeout(() => this.addEditControls(), 100);
        }
    }

    // データを更新
    updateData(updatedData, isNew) {
        if (!characterDisplay.currentCharacter) return;
        
        const characterId = characterDisplay.currentCharacter.id;
        const mode = characterDisplay.currentMode;
        
        // SF6_DATAを直接更新
        let targetData = null;
        let targetArray = null;
        
        if (mode === 'counter') {
            targetData = SF6_DATA.counterStrategies.strategies.find(s => s.characterId === characterId);
            if (!targetData) {
                targetData = { 
                    characterId: characterId, 
                    characterName: characterDisplay.currentCharacter.name, 
                    categoryNames: {}
                };
                SF6_DATA.counterStrategies.strategies.push(targetData);
            }
            targetArray = targetData[this.currentEditType];
        } else if (mode === 'strong') {
            targetData = SF6_DATA.strongActions.actions.find(a => a.characterId === characterId);
            if (!targetData) {
                targetData = { 
                    characterId: characterId, 
                    characterName: characterDisplay.currentCharacter.name, 
                    categoryNames: {}
                };
                SF6_DATA.strongActions.actions.push(targetData);
            }
            targetArray = targetData[this.currentEditType];
        } else if (mode === 'combo') {
            targetData = SF6_DATA.comboRecipes.combos.find(c => c.characterId === characterId);
            if (!targetData) {
                targetData = { 
                    characterId: characterId, 
                    characterName: characterDisplay.currentCharacter.name, 
                    categoryNames: {}
                };
                SF6_DATA.comboRecipes.combos.push(targetData);
            }
            targetArray = targetData[this.currentEditType];
        }
        
        if (targetArray) {
            if (isNew) {
                targetArray.push(updatedData);
            } else if (this.currentEditIndex >= 0 && this.currentEditIndex < targetArray.length) {
                targetArray[this.currentEditIndex] = updatedData;
            }
        }
    }

    // アイテムをデータから削除
    removeItemFromData(dataType, item) {
        if (!characterDisplay.currentCharacter) return;
        
        const characterId = characterDisplay.currentCharacter.id;
        const mode = characterDisplay.currentMode;
        
        let targetData = null;
        let targetArray = null;
        
        if (mode === 'counter') {
            targetData = SF6_DATA.counterStrategies.strategies.find(s => s.characterId === characterId);
            if (targetData) targetArray = targetData[dataType];
        } else if (mode === 'strong') {
            targetData = SF6_DATA.strongActions.actions.find(a => a.characterId === characterId);
            if (targetData) targetArray = targetData[dataType];
        } else if (mode === 'combo') {
            targetData = SF6_DATA.comboRecipes.combos.find(c => c.characterId === characterId);
            if (targetData) targetArray = targetData[dataType];
        }
        
        if (targetArray) {
            const itemIndex = parseInt(item.dataset.editIndex);
            if (itemIndex >= 0 && itemIndex < targetArray.length) {
                targetArray.splice(itemIndex, 1);
            }
        }
    }

    // 編集モーダルを閉じる
    closeEditModal() {
        const modal = document.querySelector('.edit-modal');
        if (modal) {
            modal.remove();
        }
        this.currentEditData = null;
        this.currentEditType = null;
        this.currentEditIndex = null;
    }

    // データをJSONとしてエクスポート
    exportData() {
        try {
            // フラット形式でエクスポート
            const exportData = {
                characters: SF6_DATA.characters,
                strategies: SF6_DATA.counterStrategies?.strategies || [],
                actions: SF6_DATA.strongActions?.actions || [],
                combos: SF6_DATA.comboRecipes?.combos || [],
                settings: SF6_DATA.settings
            };
            
            // JSON文字列化時にエラーが発生しないよう検証
            const dataStr = JSON.stringify(exportData, null, 2);
            
            // JSON文字列の妥当性を検証
            JSON.parse(dataStr);
            
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = 'sf6_database_export.json';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            console.log('Export completed successfully');
            dataStorage.showSaveNotification('データをエクスポートしました');
        } catch (error) {
            console.error('Export failed:', error);
            dataStorage.showSaveNotification('エクスポートに失敗しました: ' + error.message, 'error');
        }
    }

    // エクスポート用にデータをクリーンアップ
    cleanDataForExport(data) {
        if (data === null || data === undefined) {
            return null;
        }
        
        if (typeof data === 'function') {
            return undefined;
        }
        
        if (Array.isArray(data)) {
            return data.map(item => this.cleanDataForExport(item)).filter(item => item !== undefined);
        }
        
        if (typeof data === 'object') {
            const cleaned = {};
            for (const [key, value] of Object.entries(data)) {
                const cleanedValue = this.cleanDataForExport(value);
                if (cleanedValue !== undefined) {
                    cleaned[key] = cleanedValue;
                }
            }
            return cleaned;
        }
        
        // プリミティブ値はそのまま返す
        return data;
    }
}

// グローバルなDataEditorインスタンスを作成
const dataEditor = new DataEditor();
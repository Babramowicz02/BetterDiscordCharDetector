/**
 * @name UnusualCharsDetector
 * @author qsek
 * @version 2.0.0
 * @description Detects unusual characters and AI watermarks with customizable settings
 */

const defaultConfig = {
    enableDetection: true,
    highlightColor: "#ff4444",
    highlightOpacity: "0.3",
    categories: {
        invisible: true,
        spaces: true,
        dashes: true,
        punctuation: true,
        math: true,
        currency: true,
        fractions: true,
        arrows: true,
        geometric: true,
        phonetic: true,
        russianLookalike: true,
        custom: true
    }
};

module.exports = class UnusualCharsDetector {
    constructor() {
        this.settings = defaultConfig;
        this.unusualChars = [];
        this.initializeSettings();
    }

    initializeSettings() {
        this.settings = Object.assign({}, defaultConfig, BdApi.Plugins.get("UnusualCharsDetector")?.instance?.settings);
        this.unusualChars = this.generateCharacterList();
    }

    generateCharacterList() {
        const chars = [];
        
        if (this.settings.categories.invisible) {
            chars.push(
                { char: '\u200B', name: 'Zero Width Space (ZWSP)', category: 'invisible' },
                { char: '\u200C', name: 'Zero Width Non-Joiner (ZWNJ)', category: 'invisible' },
                { char: '\u200D', name: 'Zero Width Joiner (ZWJ)', category: 'invisible' },
                { char: '\u2060', name: 'Word Joiner (WJ)', category: 'invisible' },
                { char: '\uFEFF', name: 'Zero Width No-Break Space (BOM)', category: 'invisible' }
            );
        }

        if (this.settings.categories.spaces) {
            chars.push(
                { char: '\u202F', name: 'Narrow No-Break Space (NNBSP)', category: 'spaces' },
                { char: '\u2009', name: 'Thin Space (THSP)', category: 'spaces' },
                { char: '\u2002', name: 'En Space', category: 'spaces' },
                { char: '\u2003', name: 'Em Space', category: 'spaces' },
                { char: '\u205F', name: 'Medium Mathematical Space', category: 'spaces' }
            );
        }

        if (this.settings.categories.dashes) {
            chars.push(
                { char: '–', name: 'En Dash', category: 'dashes' },
                { char: '—', name: 'Em Dash', category: 'dashes' },
                { char: '‒', name: 'Figure Dash', category: 'dashes' },
                { char: '‐', name: 'Hyphen', category: 'dashes' }
            );
        }

        if (this.settings.categories.punctuation) {
            chars.push(
                { char: '·', name: 'Middle Dot', category: 'punctuation' },
                { char: '•', name: 'Bullet', category: 'punctuation' },
                { char: '†', name: 'Dagger', category: 'punctuation' },
                { char: '‡', name: 'Double Dagger', category: 'punctuation' },
                { char: '§', name: 'Section Sign', category: 'punctuation' },
                { char: '¶', name: 'Pilcrow', category: 'punctuation' }
            );
        }

        if (this.settings.categories.math) {
            chars.push(
                { char: '∀', name: 'For All', category: 'math' },
                { char: '∃', name: 'There Exists', category: 'math' },
                { char: '∈', name: 'Element Of', category: 'math' },
                { char: '∉', name: 'Not an Element Of', category: 'math' },
                { char: '∞', name: 'Infinity', category: 'math' },
                { char: '∑', name: 'N-Ary Summation', category: 'math' }
            );
        }

        if (this.settings.categories.currency) {
            chars.push(
                { char: '₿', name: 'Bitcoin Sign', category: 'currency' },
                { char: '℠', name: 'Service Mark', category: 'currency' },
                { char: '™', name: 'Trade Mark', category: 'currency' }
            );
        }

        if (this.settings.categories.fractions) {
            chars.push(
                { char: '⅓', name: 'Vulgar Fraction One Third', category: 'fractions' },
                { char: '⅔', name: 'Vulgar Fraction Two Thirds', category: 'fractions' },
                { char: '½', name: 'Vulgar Fraction One Half', category: 'fractions' },
                { char: '¼', name: 'Vulgar Fraction One Quarter', category: 'fractions' }
            );
        }

        if (this.settings.categories.arrows) {
            chars.push(
                { char: '↞', name: 'Leftwards Two Headed Arrow', category: 'arrows' },
                { char: '↠', name: 'Rightwards Two Headed Arrow', category: 'arrows' },
                { char: '↡', name: 'Downwards Two Headed Arrow', category: 'arrows' }
            );
        }

        if (this.settings.categories.geometric) {
            chars.push(
                { char: '◊', name: 'Lozenge', category: 'geometric' },
                { char: '♢', name: 'White Diamond Suit', category: 'geometric' },
                { char: '♡', name: 'White Heart Suit', category: 'geometric' }
            );
        }

        if (this.settings.categories.phonetic) {
            chars.push(
                { char: 'ʘ', name: 'Bilabial Click', category: 'phonetic' },
                { char: 'ǀ', name: 'Dental Click', category: 'phonetic' },
                { char: 'ǁ', name: 'Lateral Click', category: 'phonetic' }
            );
        }

        // russian stuff
        if (this.settings.categories.russianLookalike) {
            chars.push(
                { char: 'А', name: 'Cyrillic A (looks like A)', category: 'russianLookalike' },
                { char: 'В', name: 'Cyrillic Ve (looks like B)', category: 'russianLookalike' },
                { char: 'Е', name: 'Cyrillic Ye (looks like E)', category: 'russianLookalike' },
                { char: 'З', name: 'Cyrillic Ze (looks like 3)', category: 'russianLookalike' },
                { char: 'І', name: 'Cyrillic Byelorussian-Ukrainian I (looks like I)', category: 'russianLookalike' },
                { char: 'К', name: 'Cyrillic Ka (looks like K)', category: 'russianLookalike' },
                { char: 'М', name: 'Cyrillic Em (looks like M)', category: 'russianLookalike' },
                { char: 'Н', name: 'Cyrillic En (looks like H)', category: 'russianLookalike' },
                { char: 'О', name: 'Cyrillic O (looks like O)', category: 'russianLookalike' },
                { char: 'Р', name: 'Cyrillic Er (looks like P)', category: 'russianLookalike' },
                { char: 'С', name: 'Cyrillic Es (looks like C)', category: 'russianLookalike' },
                { char: 'Т', name: 'Cyrillic Te (looks like T)', category: 'russianLookalike' },
                { char: 'У', name: 'Cyrillic U (looks like Y)', category: 'russianLookalike' },
                { char: 'Х', name: 'Cyrillic Ha (looks like X)', category: 'russianLookalike' },
                { char: 'а', name: 'Cyrillic a (looks like a)', category: 'russianLookalike' },
                { char: 'е', name: 'Cyrillic e (looks like e)', category: 'russianLookalike' },
                { char: 'і', name: 'Cyrillic i (looks like i)', category: 'russianLookalike' },
                { char: 'о', name: 'Cyrillic o (looks like o)', category: 'russianLookalike' },
                { char: 'р', name: 'Cyrillic p (looks like p)', category: 'russianLookalike' },
                { char: 'с', name: 'Cyrillic c (looks like c)', category: 'russianLookalike' },
                { char: 'у', name: 'Cyrillic y (looks like y)', category: 'russianLookalike' },
                { char: 'х', name: 'Cyrillic x (looks like x)', category: 'russianLookalike' }
            );
        }

        if (this.settings.categories.custom) {
            chars.push(
                { char: '※', name: 'Reference Mark', category: 'custom' },
                { char: '℅', name: 'Care Of', category: 'custom' },
                { char: '…', name: 'Ellipsis', category: 'custom' }
            );
        }

        return chars;
    }

    getSettingsPanel() {
        return this.createSettingsPanel();
    }

    createSettingsPanel() {
        const panel = document.createElement('div');
        panel.style.padding = '20px';
        panel.style.color = '#ffffff';
        panel.style.fontFamily = 'Whitney, Helvetica Neue, Helvetica, Arial, sans-serif';
        panel.style.background = '#36393f';
        panel.style.minHeight = '100vh';

        panel.innerHTML = `
            <style>
                .ucd-settings {
                    color: #ffffff !important;
                    font-family: Whitney, Helvetica Neue, Helvetica, Arial, sans-serif !important;
                }
                .ucd-settings h2 {
                    color: #ffffff !important;
                    margin-bottom: 20px !important;
                    font-weight: 600 !important;
                    font-size: 20px !important;
                }
                .ucd-settings h3 {
                    color: #ffffff !important;
                    margin: 20px 0 10px 0 !important;
                    font-weight: 600 !important;
                    font-size: 16px !important;
                }
                .ucd-settings label {
                    color: #ffffff !important;
                    display: flex !important;
                    align-items: center !important;
                    margin-bottom: 8px !important;
                    cursor: pointer !important;
                    font-size: 14px !important;
                }
                .ucd-settings input[type="checkbox"] {
                    margin-right: 8px !important;
                    accent-color: #5865f2 !important;
                    transform: scale(1.1) !important;
                }
                .ucd-settings input[type="color"] {
                    background: #40444b !important;
                    border: 1px solid #4f545c !important;
                    border-radius: 3px !important;
                    padding: 2px !important;
                    width: 60px !important;
                    height: 30px !important;
                }
                .ucd-settings input[type="range"] {
                    background: #40444b !important;
                    border-radius: 3px !important;
                    height: 6px !important;
                    width: 100% !important;
                }
                .ucd-settings input[type="range"]::-webkit-slider-thumb {
                    background: #5865f2 !important;
                    border-radius: 50% !important;
                    width: 16px !important;
                    height: 16px !important;
                    cursor: pointer !important;
                }
                .ucd-settings button {
                    background: #5865f2 !important;
                    color: #ffffff !important;
                    border: none !important;
                    border-radius: 3px !important;
                    padding: 10px 16px !important;
                    cursor: pointer !important;
                    font-weight: 500 !important;
                    transition: background-color 0.2s !important;
                    font-size: 14px !important;
                }
                .ucd-settings button:hover {
                    background: #4752c4 !important;
                }
                .ucd-settings #resetSettings {
                    background: #4f545c !important;
                    color: #ffffff !important;
                    border: 1px solid #5d6269 !important;
                }
                .ucd-settings #resetSettings:hover {
                    background: #5d6269 !important;
                }
                .ucd-setting-group {
                    background: #2f3136 !important;
                    border-radius: 5px !important;
                    padding: 15px !important;
                    margin-bottom: 15px !important;
                    border: 1px solid #40444b !important;
                }
                .ucd-category-group {
                    display: grid !important;
                    grid-template-columns: 1fr 1fr !important;
                    gap: 10px !important;
                    margin-top: 10px !important;
                }
                .ucd-info-box {
                    background: #40444b !important;
                    border-radius: 5px !important;
                    padding: 12px !important;
                    margin-top: 20px !important;
                    font-size: 12px !important;
                    color: #b9bbbe !important;
                    border-left: 3px solid #5865f2 !important;
                }
                @media (max-width: 600px) {
                    .ucd-category-group {
                        grid-template-columns: 1fr !important;
                    }
                }
            </style>

            <div class="ucd-settings">
                <h2>🎯 UnusualCharsDetector Settings</h2>
                
                <div class="ucd-setting-group">
                    <h3>General Settings</h3>
                    <label>
                        <input type="checkbox" id="enableDetection" ${this.settings.enableDetection ? 'checked' : ''}>
                        Enable Character Detection
                    </label>
                    
                    <div style="margin-top: 15px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #ffffff;">Highlight Color:</label>
                        <input type="color" id="highlightColor" value="${this.settings.highlightColor}">
                    </div>

                    <div style="margin-top: 15px;">
                        <label style="display: block; margin-bottom: 8px; font-weight: 500; color: #ffffff;">Highlight Opacity: 
                            <span id="opacityValue" style="font-weight: 600; margin-left: 5px; color: #ffffff;">${this.settings.highlightOpacity}</span>
                        </label>
                        <input type="range" id="highlightOpacity" min="0.1" max="1.0" step="0.1" value="${this.settings.highlightOpacity}" style="width: 100%;">
                    </div>
                </div>

                <div class="ucd-setting-group">
                    <h3>Detection Categories</h3>
                    <div class="ucd-category-group">
                        ${Object.entries(this.settings.categories).map(([key, value]) => `
                            <label style="color: #ffffff !important;">
                                <input type="checkbox" class="category" data-category="${key}" ${value ? 'checked' : ''}>
                                ${this.formatCategoryName(key)}
                            </label>
                        `).join('')}
                    </div>
                </div>

                <div style="display: flex; gap: 10px; margin-top: 20px;">
                    <button id="saveSettings">
                        💾 Save Settings
                    </button>

                    <button id="resetSettings">
                        🔄 Reset to Default
                    </button>
                </div>

                <div class="ucd-info-box">
                    <strong>ℹ️ Info:</strong> Changes take effect immediately. Russian lookalike characters include Cyrillic letters that visually resemble Latin characters.
                </div>
            </div>
        `;

        // Event listeners
        panel.querySelector('#highlightOpacity').addEventListener('input', (e) => {
            panel.querySelector('#opacityValue').textContent = e.target.value;
        });

        panel.querySelector('#saveSettings').addEventListener('click', () => {
            this.saveSettings(panel);
        });

        panel.querySelector('#resetSettings').addEventListener('click', () => {
            this.resetSettings(panel);
        });

        return panel;
    }

    formatCategoryName(key) {
        const names = {
            invisible: "Invisible Characters",
            spaces: "Special Spaces", 
            dashes: "Dashes & Hyphens",
            punctuation: "Punctuation",
            math: "Mathematical Symbols",
            currency: "Currency Symbols",
            fractions: "Fractions",
            arrows: "Arrows",
            geometric: "Geometric Shapes",
            phonetic: "Phonetic Symbols",
            russianLookalike: "Russian Lookalike Characters",
            custom: "Other Symbols"
        };
        return names[key] || key;
    }

    saveSettings(panel) {
        this.settings.enableDetection = panel.querySelector('#enableDetection').checked;
        this.settings.highlightColor = panel.querySelector('#highlightColor').value;
        this.settings.highlightOpacity = panel.querySelector('#highlightOpacity').value;

        // Update categories
        panel.querySelectorAll('.category').forEach(checkbox => {
            const category = checkbox.getAttribute('data-category');
            this.settings.categories[category] = checkbox.checked;
        });

        // Regenerate character list
        this.unusualChars = this.generateCharacterList();
        
        // Update styles
        this.updateStyles();
        
        // Re-process messages
        this.reprocessAllMessages();
        
        // Save settings
        this.saveToConfig();
        
        BdApi.showToast('Settings saved successfully!', { type: 'success' });
    }

    resetSettings(panel) {
        this.settings = Object.assign({}, defaultConfig);
        this.unusualChars = this.generateCharacterList();
        this.updateStyles();
        this.reprocessAllMessages();
        this.saveToConfig();
        
        // Refresh panel
        const newPanel = this.createSettingsPanel();
        panel.innerHTML = newPanel.innerHTML;
        
        BdApi.showToast('Settings reset to default!', { type: 'info' });
    }

    saveToConfig() {
        // Save settings via BD API
        if (BdApi.Plugins.get("UnusualCharsDetector")?.instance) {
            BdApi.Plugins.get("UnusualCharsDetector").instance.settings = this.settings;
        }
    }

    start() {
        this.injectStyles();
        this.observeMessages();
        console.log('UnusualCharsDetector started with config support');
    }

    stop() {
        document.querySelectorAll('.unusual-chars-highlight').forEach(el => {
            el.outerHTML = el.innerHTML;
        });
        document.querySelectorAll('.ucd-processed').forEach(el => {
            el.classList.remove('ucd-processed');
        });
        document.querySelector('#unusual-chars-styles')?.remove();
    }

    injectStyles() {
        const style = document.createElement('style');
        style.id = 'unusual-chars-styles';
        this.updateStyleElement(style);
        document.head.appendChild(style);
    }

    updateStyles() {
        let style = document.querySelector('#unusual-chars-styles');
        if (!style) {
            style = document.createElement('style');
            style.id = 'unusual-chars-styles';
            document.head.appendChild(style);
        }
        this.updateStyleElement(style);
    }

    updateStyleElement(styleElement) {
        const opacityHex = Math.round(this.settings.highlightOpacity * 255).toString(16).padStart(2, '0');
        styleElement.textContent = `
            .unusual-chars-highlight {
                background: ${this.settings.highlightColor}${opacityHex} !important;
                border-bottom: 2px dotted ${this.settings.highlightColor};
                cursor: help;
                position: relative;
            }
            
            .unusual-chars-tooltip {
                position: absolute;
                background: #18191c !important;
                border: 1px solid #4f545c !important;
                border-radius: 4px;
                padding: 8px;
                z-index: 10000;
                max-width: 300px;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.8);
                font-size: 12px;
                color: #ffffff !important;
                top: 100%;
                left: 0;
                margin-top: 5px;
                font-family: Whitney, Helvetica Neue, Helvetica, Arial, sans-serif !important;
            }
            
            .unusual-chars-tooltip strong {
                color: #ffffff !important;
            }
            
            .category-indicator {
                font-size: 10px;
                opacity: 0.7;
                margin-left: 5px;
                color: #ffffff !important;
            }
        `;
    }

    observeMessages() {
        const observer = new MutationObserver((mutations) => {
            if (!this.settings.enableDetection) return;
            
            mutations.forEach((mutation) => {
                mutation.addedNodes.forEach((node) => {
                    if (node.nodeType === 1) {
                        if (node.querySelector?.('[class*="messageContent"]')) {
                            this.processMessage(node);
                        } else if (node.classList?.toString().includes('messageContent')) {
                            this.processMessage(node);
                        }
                    }
                });
            });
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        setTimeout(() => {
            if (this.settings.enableDetection) {
                document.querySelectorAll('[class*="messageContent"]').forEach(message => {
                    this.processMessage(message);
                });
            }
        }, 1000);
    }

    processMessage(messageElement) {
        if (!this.settings.enableDetection || this.unusualChars.length === 0) return;
        
        const contentElements = messageElement.querySelectorAll ? 
            messageElement.querySelectorAll('[class*="messageContent"]') : [messageElement];
        
        contentElements.forEach(element => {
            if (!element.innerHTML || element.classList.contains('ucd-processed')) return;
            
            let modifiedHtml = element.innerHTML;
            let foundAny = false;

            // check for everyone only once
            this.unusualChars.forEach(charInfo => {
                if (modifiedHtml.includes(charInfo.char)) {
                    foundAny = true;
                    modifiedHtml = this.safeReplace(modifiedHtml, charInfo.char, charInfo);
                }
            });

            if (foundAny && modifiedHtml !== element.innerHTML) {
                element.innerHTML = modifiedHtml;
                element.classList.add('ucd-processed');
                
                element.querySelectorAll('.unusual-chars-highlight').forEach(highlight => {
                    highlight.addEventListener('mouseenter', this.showTooltip.bind(this));
                    highlight.addEventListener('mouseleave', this.hideTooltip.bind(this));
                });
            }
        });
    }

    // new method
    safeReplace(html, char, charInfo) {
        const parts = html.split(char);
        const result = [];
        
        for (let i = 0; i < parts.length; i++) {
            result.push(parts[i]);
            if (i < parts.length - 1) {
                result.push(`<span class="unusual-chars-highlight" title="${charInfo.name} (${charInfo.category})" data-char="${char}" data-category="${charInfo.category}">${char}<span class="category-indicator">[${charInfo.category[0]}]</span></span>`);
            }
        }
        
        return result.join('');
    }

    reprocessAllMessages() {
        document.querySelectorAll('.unusual-chars-highlight').forEach(el => {
            el.outerHTML = el.textContent.replace(/\[.\]/, '');
        });
        
    // cff2
        document.querySelectorAll('.ucd-processed').forEach(el => {
            el.classList.remove('ucd-processed');
        });
        
        setTimeout(() => {
            document.querySelectorAll('[class*="messageContent"]').forEach(message => {
                this.processMessage(message);
            });
        }, 100);
    }

    showTooltip(event) {
        const element = event.target.closest('.unusual-chars-highlight');
        if (!element) return;
        
        const char = element.getAttribute('data-char');
        const category = element.getAttribute('data-category');
        const charInfo = this.unusualChars.find(c => c.char === char);
        
        if (!charInfo) return;

        const tooltip = document.createElement('div');
        tooltip.className = 'unusual-chars-tooltip';
        tooltip.innerHTML = `
            <strong>${charInfo.name}</strong><br>
            Category: ${this.formatCategoryName(charInfo.category)}<br>
            Character: "${char}"<br>
            Unicode: U+${char.charCodeAt(0).toString(16).toUpperCase().padStart(4, '0')}
        `;

        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = rect.left + 'px';
        tooltip.style.top = (rect.bottom + 5) + 'px';
        
        tooltip.setAttribute('data-tooltip-id', 'unusual-chars');
        document.body.appendChild(tooltip);
    }

    hideTooltip() {
        document.querySelectorAll('[data-tooltip-id="unusual-chars"]').forEach(tooltip => {
            tooltip.remove();
        });
    }

    escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};
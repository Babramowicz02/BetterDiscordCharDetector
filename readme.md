# UnusualCharsDetector - BetterDiscord Plugin

The script is for BetterDiscord. If you want to start it just put the files in the `BetterDiscord/plugins` folder and enable it in Discord settings.

## 📸 Screenshots

### Before Detection
![Normal View](screenshots/notshowchar.png)
*Normal message view without detection*

### After Detection  
![Detection View](screenshots/showchar.png)
*Same message with unusual characters highlighted*

## 🔍 Features

The script detects and highlights all unusual 148+ characters:

- **Invisible characters & spaces** - ZWSP, ZWNJ, ZWJ, BOM
- **Special spaces** - Thin Space, Em Space, En Space  
- **Dashes & Hyphens** - Em Dash, En Dash, Figure Dash
- **Punctuation & List Marks** - Bullets, Daggers, Section Signs
- **Mathematical Symbols** - ∀ ∃ ∈ ∞ ∑
- **Currency & Commercial** - ₿ ™ © ℠
- **Letter-like Symbols** - Alef, Bet, Hebrew letters, Russian lookalikes
- **Arrows** - Various directional arrows
- **Geometric Shapes** - Lozenge, Diamond, Heart suits
- **Phonetic Symbols** - Click consonants

## 📊 Character Information

For each detected unusual character, the plugin displays:
- **Character name** and classification
- **Visual representation** of the symbol  
- **Unicode code point** (U+XXXX format)
- **Character category** and usage information

## 🛡️ Use Cases

- **Identifies potential AI-generated text markers**
- **Finds watermarks and characters used often by AI**
- **Helps identify copy-pasted content from special sources** 
- **Reveals hidden characters that could be used for tracking**
- **Exposes potential zero-day exploit attempts using special characters**
- **Identifies text containing encoding anomalies**
- **Detects Cyrillic lookalikes in phishing attempts**

## ⚙️ Installation

1. Download both files:
   - `UnusualCharsDetector.plugin.js`
   - `UnusualCharsDetector.config.js`
2. Place them in your `BetterDiscord/plugins` folder
3. Enable the plugin in Discord Settings → Plugins
4. Configure settings by clicking the gear icon ⚙️

## 🎨 Customization

- Change highlight colors
- Adjust opacity levels  
- Enable/disable specific character categories
- Toggle detection on/off
module.exports = {
    main: "UnusualCharsDetector.plugin.js", 
    name: "UnusualCharsDetector",
    author: "qsek1",
    version: "2.0.0",
    description: "Detects unusual characters and AI watermarks with customizable settings",
    
    defaultConfig: {
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
    }
};
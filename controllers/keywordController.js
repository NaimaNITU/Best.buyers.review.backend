const Keyword = require('../models/Keyword');

const keywordController = {
  // Add new keyword
  createKeyword: async (req, res) => {
    try {
      const { word, url, description, caseSensitive } = req.body;

      console.log('📝 Creating keyword:', { word, url, description });

      // Basic validation
      if (!word || !url) {
        return res.status(400).json({
          success: false,
          message: 'Word and URL are required'
        });
      }

      const keyword = new Keyword({
        word: word.trim().toLowerCase(),
        url: url.trim(),
        description: description || '',
        caseSensitive: caseSensitive || false
      });

      await keyword.save();

      console.log('✅ Keyword created successfully:', keyword.word);

      res.json({
        success: true,
        message: 'Keyword added successfully',
        keyword
      });
    } catch (error) {
      console.error('❌ Create keyword error:', error);
      
      if (error.code === 11000) {
        return res.status(400).json({
          success: false,
          message: 'This keyword already exists'
        });
      }
      
      res.status(500).json({
        success: false,
        message: 'Error creating keyword'
      });
    }
  },

  // Get all keywords
  getAllKeywords: async (req, res) => {
    try {
      console.log('📋 Fetching all keywords');
      
      const keywords = await Keyword.find({ isActive: true }).sort({ word: 1 });
      
      console.log(`✅ Found ${keywords.length} keywords`);
      
      res.json({
        success: true,
        keywords
      });
    } catch (error) {
      console.error('❌ Get keywords error:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching keywords'
      });
    }
  },

  // Process text and auto-link keywords
  processText: async (req, res) => {
    try {
      const { text } = req.body;
      
      console.log('🔤 Processing text for auto-linking');

      if (!text || typeof text !== 'string') {
        return res.json({
          success: true,
          processedText: text || '',
          keywordsFound: []
        });
      }

      // Get all active keywords
      const keywords = await Keyword.find({ isActive: true });
      let processedText = text;
      const keywordsFound = [];

      console.log(`🔍 Scanning text with ${keywords.length} keywords`);

      // Sort by word length (longer words first to avoid partial matches)
      keywords.sort((a, b) => b.word.length - a.word.length);

      // Replace each keyword with link
      keywords.forEach(keyword => {
        const word = keyword.word;
        // Create regex to match whole words only
        const regex = new RegExp(`\\b${word}\\b`, keyword.caseSensitive ? 'g' : 'gi');
        
        if (regex.test(processedText)) {
          keywordsFound.push({
            word: keyword.word,
            url: keyword.url,
            description: keyword.description
          });
          
          processedText = processedText.replace(
            regex, 
            `<a href="${keyword.url}" class="auto-keyword-link" title="${keyword.description}" style="color: #1a0dab; text-decoration: underline; cursor: pointer;">$&</a>`
          );
          
          console.log(`🔗 Linked keyword: "${keyword.word}" -> "${keyword.url}"`);
        }
      });

      console.log(`✅ Processed text, found ${keywordsFound.length} keywords`);

      res.json({
        success: true,
        processedText,
        keywordsFound,
        originalText: text
      });
    } catch (error) {
      console.error('❌ Process text error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing text'
      });
    }
  },

  // Bulk process multiple texts
  bulkProcessTexts: async (req, res) => {
    try {
      const { texts } = req.body;
      
      console.log('📦 Bulk processing texts:', texts?.length);

      if (!Array.isArray(texts)) {
        return res.status(400).json({
          success: false,
          message: 'Texts must be an array'
        });
      }

      // Get all keywords once
      const keywords = await Keyword.find({ isActive: true });
      const results = [];

      console.log(`🔍 Using ${keywords.length} keywords for bulk processing`);

      // Process each text
      for (const text of texts) {
        let processedText = text;
        const keywordsFound = [];

        keywords.sort((a, b) => b.word.length - a.word.length);

        keywords.forEach(keyword => {
          const regex = new RegExp(`\\b${keyword.word}\\b`, 'gi');
          if (regex.test(processedText)) {
            keywordsFound.push(keyword.word);
            processedText = processedText.replace(
              regex,
              `<a href="${keyword.url}" class="auto-keyword-link" style="color: #1a0dab; text-decoration: underline;">$&</a>`
            );
          }
        });

        results.push({
          original: text,
          processed: processedText,
          keywordsFound
        });
      }

      console.log(`✅ Bulk processed ${results.length} texts`);

      res.json({
        success: true,
        results
      });
    } catch (error) {
      console.error('❌ Bulk process error:', error);
      res.status(500).json({
        success: false,
        message: 'Error processing texts'
      });
    }
  }
};

module.exports = keywordController;
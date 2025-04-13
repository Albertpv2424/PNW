const fs = require('fs');
const path = require('path');

// Path to i18n directory
const i18nDir = path.join(__dirname, 'src', 'assets', 'i18n');

// Get all JSON files in the directory
const files = fs.readdirSync(i18nDir).filter(file => file.endsWith('.json'));

files.forEach(file => {
  const filePath = path.join(i18nDir, file);
  
  // Read the file
  const content = fs.readFileSync(filePath, 'utf8');
  
  try {
    // Parse JSON
    const json = JSON.parse(content);
    
    // Sort top-level keys alphabetically
    const sortedJson = {};
    Object.keys(json).sort().forEach(key => {
      sortedJson[key] = json[key];
    });
    
    // Write back to file with pretty formatting
    fs.writeFileSync(
      filePath, 
      JSON.stringify(sortedJson, null, 2),
      'utf8'
    );
    
    console.log(`✅ Sorted ${file} successfully`);
  } catch (error) {
    console.error(`❌ Error processing ${file}:`, error);
  }
});

console.log('All translation files have been sorted alphabetically by top-level keys.');
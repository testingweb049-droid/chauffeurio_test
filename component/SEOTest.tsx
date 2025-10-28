// src/utils/testSEO.ts

import { seoConfig } from "@/lib/seoConfig";

export function testAllSEO() {
  console.log('🧪 Testing All SEO Configurations:');
  
  Object.entries(seoConfig).forEach(([path, config]) => {
    console.log(`\n📄 ${path}:`);
    console.log('   Title:', config.title);
    console.log('   Description:', config.description?.length || 0, 'chars');
    console.log('   Canonical:', config.canonicalUrl);
    console.log('   Schema:', config.schemaMarkup ? '✅' : '❌');
  });
}

// Run in browser console or component
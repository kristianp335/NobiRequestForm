#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('Building NOBI Form Client Extension...');

try {
  // Clean build directory
  if (fs.existsSync('build')) {
    fs.rmSync('build', { recursive: true, force: true });
  }
  fs.mkdirSync('build', { recursive: true });

  // Run Vite build
  console.log('Building JavaScript bundle...');
  execSync('npx vite build --config vite.client-extension.config.ts', { stdio: 'inherit' });

  // Copy CSS file
  console.log('Copying CSS files...');
  fs.copyFileSync('src/nobi-form.css', 'build/nobi-form.css');

  // Verify build files exist
  const requiredFiles = ['build/nobi-form.js', 'build/nobi-form.css'];
  const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
  
  if (missingFiles.length > 0) {
    throw new Error(`Missing build files: ${missingFiles.join(', ')}`);
  }

  console.log('✓ Build completed successfully!');
  console.log('✓ Files ready for Liferay deployment:');
  console.log('  - client-extension.yaml');
  console.log('  - build/nobi-form.js');
  console.log('  - build/nobi-form.css');
  
} catch (error) {
  console.error('Build failed:', error.message);
  process.exit(1);
}
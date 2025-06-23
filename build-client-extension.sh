#!/bin/bash

echo "Building NOBI Form Client Extension..."

# Clean build directory
rm -rf build
mkdir -p build

# Build with Vite
echo "Building JavaScript bundle..."
npx vite build --config vite.client-extension.config.ts

# Copy CSS file
echo "Copying CSS files..."
cp src/nobi-form.css build/

# Verify files exist
if [ -f "build/nobi-form.js" ] && [ -f "build/nobi-form.css" ]; then
    echo "✓ Build completed successfully!"
    echo "✓ Files ready for Liferay deployment:"
    echo "  - client-extension.yaml"
    echo "  - build/nobi-form.js ($(du -h build/nobi-form.js | cut -f1))"
    echo "  - build/nobi-form.css"
    echo ""
    echo "To deploy to Liferay:"
    echo "1. Copy the entire project folder to your Liferay workspace"
    echo "2. Run: blade gw deploy"
    echo "3. Add <nobi-form></nobi-form> to any page"
else
    echo "✗ Build failed - missing output files"
    exit 1
fi
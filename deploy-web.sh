#!/bin/bash
#to run the script ./deploy-web.sh
echo "🔄 Exporting web build from main branch..."
git checkout main || exit 1
npx expo export:web || { echo "❌ Expo export failed"; exit 1; }

echo "🚀 Switching to web-deploy..."
git checkout web-deploy || git checkout -b web-deploy

echo "🧹 Cleaning web-deploy..."
find . -mindepth 1 -maxdepth 1 ! -name 'web-build' ! -name 'netlify.toml' ! -name '.git' -exec rm -rf {} \;

echo "📦 Copying web-build and netlify.toml from main..."
git checkout main -- web-build netlify.toml

echo "✅ Committing and pushing to web-deploy..."
git add -A
git commit -m "Deploy updated web-build to Netlify"
git push origin web-deploy --force

echo "🎉 Done! Your site is deployed to Netlify!"
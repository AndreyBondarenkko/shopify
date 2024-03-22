# Copy files from the starter theme
git clone ssh://git@git.qix.sx:2299/unilime/shopify/dev/starter-theme.git ./tmp
cd ./tmp
cp .gitignore .shopifyignore .npmrc .env.example .env.develop.example package.json package-lock.json README.md ../
cd ../
rm -rf ./tmp
echo "Files copied successfully.\n"
sleep 2
# Initialize Git
git init
git branch -m master
git add .
echo "Git repo created successfully.\n"


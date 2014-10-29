# ##############################################################################
#
# Builds mofowallet web edition and publishes the result on mofowallet.com
#
# ##############################################################################

echo "start building mofowallet"
grunt build
echo "mofowallet build"

# copy over all code to git/mofo
MOFO_FILES="dist/fonts dist/images dist/partials dist/plugins dist/scripts dist/styles dist/favicon.ico dist/index.html"
cp -r -p $MOFO_FILES ~/git/mofo
echo "copied files to mofo repo"

cd ~/git/mofo
bundle exec jekyll build
echo "done jekyll build"

git add --all
git commit -am 'Update mofo'
git push origin gh-pages
#!/bin/zsh

git checkout devupload
git merge dev
yarn build:dev
git add .
git commit -m 'upload test version'
git push origin devupload
git checkout dev

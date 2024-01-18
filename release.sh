#!/bin/zsh

git checkout release
git merge dev
yarn build
git add .
git commit -m '发布'
git push origin release
git checkout dev

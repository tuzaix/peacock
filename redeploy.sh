#!/bin/bash

# Peacock 项目一键重新部署脚本

echo "开始重新部署 Peacock..."

# 1. 拉取最新代码
echo "正在拉取最新代码..."
git pull

# 2. 安装依赖
echo "正在安装依赖..."
npm install

# 3. 执行构建
echo "正在执行构建..."
npm run build

echo "部署完成！构建产物已更新至 dist 目录。"

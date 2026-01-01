#!/bin/bash

# Kalimba Online Docker 更新脚本
# 用于在代码修改后重新构建和部署 Docker 容器

set -e  # 遇到错误立即退出

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# 打印带颜色的消息
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# 检查是否在项目目录
if [ ! -f "docker-compose.yml" ]; then
    print_error "未找到 docker-compose.yml 文件，请确保在项目目录中运行此脚本"
    exit 1
fi

print_info "=========================================="
print_info "  Kalimba Online Docker 更新脚本"
print_info "=========================================="
echo ""

# 询问是否清除构建缓存
read -p "是否清除构建缓存？(y/n，推荐 y): " clear_cache
if [ "$clear_cache" = "y" ] || [ "$clear_cache" = "Y" ]; then
    BUILD_ARGS="--no-cache"
    print_warning "将使用 --no-cache 参数重新构建"
else
    BUILD_ARGS=""
    print_info "将使用缓存构建（可能不会包含最新修改）"
fi

echo ""

# 步骤 1: 停止容器
print_info "步骤 1/4: 停止容器..."
docker-compose down
echo ""

# 步骤 2: 重新构建镜像
print_info "步骤 2/4: 重新构建镜像..."
docker-compose build $BUILD_ARGS
echo ""

# 步骤 3: 启动容器
print_info "步骤 3/4: 启动容器..."
docker-compose up -d
echo ""

# 步骤 4: 检查容器状态
print_info "步骤 4/4: 检查容器状态..."
sleep 2
if docker ps | grep -q kalimba-online; then
    print_info "容器运行正常！"
    echo ""
    echo "容器信息："
    docker ps | grep kalimba-online
    echo ""
    print_info "=========================================="
    print_info "  更新完成！"
    print_info "=========================================="
    echo ""
    print_info "访问地址: http://你的服务器IP:9999"
    echo ""
    print_warning "提示: 如果修改了 CSS 或 JS 文件，请在浏览器中按 Ctrl+F5 强制刷新"
else
    print_error "容器启动失败！"
    echo ""
    print_info "查看日志: docker logs kalimba-online"
    exit 1
fi
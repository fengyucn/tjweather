#!/bin/bash

# 天机气象CLI工具全局安装脚本

set -e

echo "🚀 天机气象CLI工具安装程序"
echo "=============================="

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误: 未找到Node.js"
    echo "请先安装Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误: 未找到npm"
    exit 1
fi

echo "✅ npm版本: $(npm --version)"

# 进入CLI工具目录
cd "$(dirname "$0")/tjweather-cli"

echo ""
echo "📦 安装依赖..."
npm install

echo ""
echo "🔨 构建项目..."
npm run build

echo ""
echo "🔗 创建全局链接..."

# 尝试使用npm link（开发模式）
if npm link 2>/dev/null; then
    echo "✅ 通过npm link创建全局命令"
    echo ""
    echo "🎉 安装完成！现在可以使用 'tjweather' 命令"
    echo ""
    echo "测试命令:"
    echo "  tjweather --help"
    echo "  tjweather version"
    echo "  tjweather config"
else
    echo "⚠️  npm link失败，尝试全局安装..."

    # 备用方案：全局安装
    if npm install -g .; then
        echo "✅ 全局安装成功"
        echo ""
        echo "🎉 安装完成！现在可以使用 'tjweather' 命令"
        echo ""
        echo "测试命令:"
        echo "  tjweather --help"
        echo "  tjweather version"
        echo "  tjweather config"
    else
        echo "❌ 全局安装失败"
        echo ""
        echo "💡 可以手动使用："
        echo "  cd $(pwd)"
        echo "  ./dist/index.js --help"
        exit 1
    fi
fi

echo ""
echo "📝 下一步:"
echo "1. 初始化配置: tjweather init"
echo "2. 编辑API密钥: ~/.config/tjweather/.env"
echo "3. 查看配置: tjweather config"
echo "4. 查询天气: tjweather query -l \"116.23128,40.22077\" -f t2m"
echo ""
echo "📚 更多信息请查看 README.md"
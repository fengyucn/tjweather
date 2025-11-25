#!/bin/bash

# 天机气象CLI工具卸载脚本

set -e

echo "🗑️  天机气象CLI工具卸载程序"
echo "=============================="

# 检查是否已安装
if ! command -v tjweather &> /dev/null; then
    echo "❌ 未找到tjweather命令"
    exit 1
fi

echo "✅ 找到tjweather命令: $(which tjweather)"

# 进入CLI工具目录
cd "$(dirname "$0")/tjweather-cli"

echo ""
echo "🔗 移除全局链接..."

# 移除npm link
if npm unlink -g tjweather 2>/dev/null; then
    echo "✅ 成功移除全局链接"
else
    echo "⚠️  移除全局链接失败，尝试其他方法..."

    # 备用方案
    if npm uninstall -g tjweather 2>/dev/null; then
        echo "✅ 成功全局卸载"
    else
        echo "⚠️  无法自动卸载，请手动检查npm全局包"
    fi
fi

echo ""
echo "🧹 清理本地链接..."

# 清理本地链接
rm -rf node_modules/.bin/tjweather 2>/dev/null || true

echo ""
echo "🔍 验证卸载结果..."

if ! command -v tjweather &> /dev/null; then
    echo "✅ 卸载成功！tjweather命令已移除"
else
    echo "⚠️  tjweather命令仍然存在，可能需要手动清理"
    echo "   请检查: $(which tjweather)"
fi

echo ""
echo "📁 可选清理（保留用户配置和API密钥）："
echo "  用户配置目录: ~/.config/tjweather/"
echo "  如需完全清理请手动删除此目录"
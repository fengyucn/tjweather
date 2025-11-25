#!/bin/bash

# tjweather npm发布脚本
# 发布tjweather-cli和tjweather-mcp到npm

set -e

echo "🚀 开始发布tjweather工具到npm..."
echo "================================"

# 颜色定义
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# 函数定义
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_header() {
    echo -e "${BLUE}📦 $1${NC}"
    echo "================================"
}

# 检查npm登录状态
print_header "检查npm登录状态"
if ! npm whoami > /dev/null 2>&1; then
    print_error "未登录npm，请先执行: npm login"
    print_info "登录命令: npm adduser"
    exit 1
fi

USER=$(npm whoami)
print_success "npm登录成功，当前用户: $USER"

# 检查包名可用性
print_header "检查包名可用性"
check_package_availability() {
    local package_name=$1
    if npm view "$package_name" > /dev/null 2>&1; then
        print_warning "包名 '$package_name' 已被占用"
        return 1
    else
        print_success "包名 '$package_name' 可用"
        return 0
    fi
}

CLI_AVAILABLE=true
MCP_AVAILABLE=true

check_package_availability "tjweather-cli" || CLI_AVAILABLE=false
check_package_availability "tjweather-mcp" || MCP_AVAILABLE=false

if [ "$CLI_AVAILABLE" = false ] || [ "$MCP_AVAILABLE" = false ]; then
    print_error "存在包名冲突，请先解决"
    exit 1
fi

# 构建项目
print_header "构建项目"

# 构建CLI
print_info "构建 tjweather-cli..."
cd /home/fengyu/devhome/tjweather/tjweather-cli
npm run build
print_success "tjweather-cli 构建完成"

# 构建MCP
print_info "构建 tjweather-mcp..."
cd ../tjweather-mcp
npm run build
print_success "tjweather-mcp 构建完成"

# 检查发布内容
print_header "检查发布内容"

check_publish_content() {
    local package_path=$1
    local package_name=$2

    cd "$package_path"
    print_info "检查 $package_name 发布内容..."

    if npm pack --dry-run > /dev/null 2>&1; then
        local pack_size=$(npm pack --dry-run 2>&1 | grep "unpacked size" | awk '{print $NF}')
        print_success "$package_name 包内容正常 (解包后大小: $pack_size)"

        # 删除临时文件
        rm -f *.tgz
    else
        print_error "$package_name 包内容检查失败"
        return 1
    fi
}

check_publish_content "/home/fengyu/devhome/tjweather/tjweather-cli" "tjweather-cli"
check_publish_content "/home/fengyu/devhome/tjweather/tjweather-mcp" "tjweather-mcp"

# 用户确认
print_header "发布确认"
echo "即将发布以下包:"
echo "  - tjweather-cli: 天机气象API命令行工具"
echo "  - tjweather-mcp: 天机气象API MCP服务器"
echo

read -p "是否继续发布? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_warning "用户取消发布"
    exit 0
fi

# 发布tjweather-cli
print_header "发布 tjweather-cli"
cd /home/fengyu/devhome/tjweather/tjweather-cli
print_info "正在发布 tjweather-cli..."
if npm publish; then
    print_success "tjweather-cli 发布成功!"

    # 验证发布
    sleep 2
    if npm view tjweather-cli > /dev/null 2>&1; then
        VERSION=$(npm view tjweather-cli version)
        print_success "发布验证成功: tjweather-cli@$VERSION"
    else
        print_warning "发布验证可能需要等待npm同步"
    fi
else
    print_error "tjweather-cli 发布失败"
    exit 1
fi

# 发布tjweather-mcp
print_header "发布 tjweather-mcp"
cd ../tjweather-mcp
print_info "正在发布 tjweather-mcp..."
if npm publish; then
    print_success "tjweather-mcp 发布成功!"

    # 验证发布
    sleep 2
    if npm view tjweather-mcp > /dev/null 2>&1; then
        VERSION=$(npm view tjweather-mcp version)
        print_success "发布验证成功: tjweather-mcp@$VERSION"
    else
        print_warning "发布验证可能需要等待npm同步"
    fi
else
    print_error "tjweather-mcp 发布失败"
    exit 1
fi

# 发布总结
print_header "发布完成"
print_success "🎉 两个包都已成功发布到npm!"

echo ""
print_info "用户安装命令:"
echo "  CLI工具: npm install -g tjweather-cli"
echo "  MCP服务器: npx tjweather-mcp"
echo "  或项目依赖: npm install tjweather-cli tjweather-mcp"

echo ""
print_info "使用示例:"
echo "  # CLI工具"
echo "  tjweather --help"
echo "  tjweather query -l \"116.23128,40.22077\" -f t2m -d 3"
echo ""
echo "  # MCP配置 (Claude Code)"
echo "  {"
echo "    \"mcpServers\": {"
echo "      \"tjweather\": {"
echo "        \"command\": \"npx\","
echo "        \"args\": [\"tjweather-mcp\"]"
echo "      }"
echo "    }"
echo "  }"

echo ""
print_success "🌟 tjweather工具已准备好为全球开发者服务!"

# 清理临时文件
cd /home/fengyu/devhome/tjweather/tjweather-cli
rm -f *.tgz
cd ../tjweather-mcp
rm -f *.tgz

echo ""
print_info "📋 发布后维护建议:"
echo "  1. 监控下载量: npm view tjweather-cli"
echo "  2. 收集用户反馈"
echo "  3. 定期更新文档"
echo "  4. 处理issue和PR"
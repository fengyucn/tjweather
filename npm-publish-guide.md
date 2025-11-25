# 📦 npm发布指南 - tjweather CLI & MCP

## 🎯 发布目标

将两个独立包发布到npm：
- `tjweather-cli` - 天机气象CLI工具
- `tjweather-mcp` - 天机气象MCP服务器

## 📋 发布前检查清单

### ✅ 准备工作

1. **npm账号准备**
   ```bash
   # 检查是否已登录npm
   npm whoami

   # 如果未登录，执行登录
   npm login
   ```

2. **包名可用性检查**
   ```bash
   # 检查包名是否被占用
   npm view tjweather-cli
   npm view tjweather-mcp
   ```

3. **代码质量检查**
   ```bash
   # tjweather-cli
   cd tjweather-cli
   npm run build
   npm test

   # tjweather-mcp
   cd ../tjweather-mcp
   npm run build
   ```

## 📦 tjweather-cli 发布流程

### 1. 进入CLI目录
```bash
cd /home/fengyu/devhome/tjweather/tjweather-cli
```

### 2. 验证package.json配置
```bash
cat package.json
```

确认关键配置：
```json
{
  "name": "tjweather-cli",
  "version": "1.0.0",
  "description": "天机气象API命令行工具",
  "main": "dist/index.js",
  "bin": {
    "tjweather": "dist/index.js"
  },
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE"
  ],
  "keywords": [
    "weather",
    "cli",
    "meteorology",
    "tianji",
    "api"
  ],
  "engines": {
    "node": ">=16.0.0"
  }
}
```

### 3. 构建项目
```bash
npm run build
```

### 4. 检查发布内容
```bash
# 查看将要发布的内容
npm pack --dry-run

# 验证包大小和文件
ls -la *.tgz
```

### 5. 发布包
```bash
# 正式发布到npm
npm publish

# 或者发布beta版本
npm publish --tag beta
```

## 📦 tjweather-mcp 发布流程

### 1. 进入MCP目录
```bash
cd /home/fengyu/devhome/tjweather/tjweather-mcp
```

### 2. 验证package.json配置
```bash
cat package.json
```

确认关键配置：
```json
{
  "name": "tjweather-mcp",
  "version": "1.0.0",
  "description": "天机气象API MCP服务器",
  "main": "dist/index.js",
  "bin": {
    "tjweather-mcp": "dist/index.js"
  },
  "files": [
    "dist/**/*",
    "README.md",
    "LICENSE",
    "MCP_CLIENT_GUIDE.md"
  ],
  "keywords": [
    "mcp",
    "weather",
    "api",
    "meteorology",
    "tianji",
    "ai-tools",
    "claude-code"
  ]
}
```

### 3. 构建项目
```bash
npm run build
```

### 4. 检查发布内容
```bash
npm pack --dry-run
```

### 5. 发布包
```bash
npm publish
```

## 🔄 批量发布脚本

### 创建批量发布脚本
```bash
#!/bin/bash
# publish-all.sh

set -e

echo "🚀 开始发布tjweather工具到npm..."
echo "================================"

# 检查npm登录状态
if ! npm whoami > /dev/null 2>&1; then
    echo "❌ 未登录npm，请先执行: npm login"
    exit 1
fi

echo "✅ npm登录状态正常"

# 发布tjweather-cli
echo ""
echo "📦 发布 tjweather-cli..."
cd /home/fengyu/devhome/tjweather/tjweather-cli

npm run build
echo "✅ tjweather-cli 构建完成"

npm pack --dry-run
echo "📋 tjweather-cli 包内容检查完成"

read -p "是否继续发布 tjweather-cli? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm publish
    echo "🎉 tjweather-cli 发布成功!"
else
    echo "⏭️ 跳过 tjweather-cli 发布"
fi

# 发布tjweather-mcp
echo ""
echo "📦 发布 tjweather-mcp..."
cd /home/fengyu/devhome/tjweather/tjweather-mcp

npm run build
echo "✅ tjweather-mcp 构建完成"

npm pack --dry-run
echo "📋 tjweather-mcp 包内容检查完成"

read -p "是否继续发布 tjweather-mcp? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    npm publish
    echo "🎉 tjweather-mcp 发布成功!"
else
    echo "⏭️ 跳过 tjweather-mcp 发布"
fi

echo ""
echo "✨ 发布流程完成!"
echo "用户安装命令:"
echo "  CLI: npm install -g tjweather-cli"
echo "  MCP: npx tjweather-mcp"
```

### 执行批量发布
```bash
chmod +x publish-all.sh
./publish-all.sh
```

## 🧪 发布后验证

### 1. 安装测试
```bash
# 全局安装CLI
npm install -g tjweather-cli

# 测试CLI命令
tjweather --help
tjweather version

# 测试MCP
npx tjweather-mcp --help

# 或者临时测试
npx tjweather-cli version
```

### 2. 功能测试
```bash
# 测试CLI功能
tjweather init
tjweather query -l "116.23128,40.22077" -f t2m -d 1

# 测试MCP功能
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | npx tjweather-mcp
```

### 3. 验证包信息
```bash
# 查看发布的包信息
npm view tjweather-cli
npm view tjweather-mcp

# 检查下载量（发布一段时间后）
npm view tjweather-cli --json | jq '.downloads'
```

## 📋 版本管理策略

### 语义化版本控制
- **主版本 (x.0.0)**: 不兼容的API修改
- **次版本 (x.y.0)**: 向下兼容的功能新增
- **修订版本 (x.y.z)**: 向下兼容的问题修复

### 版本更新流程
```bash
# 更新版本号
npm version patch    # 1.0.0 -> 1.0.1
npm version minor    # 1.0.0 -> 1.1.0
npm version major    # 1.0.0 -> 2.0.0

# 自动发布新版本
npm publish
```

### Tag管理
```bash
# 稳定版本
npm publish

# 预发布版本
npm publish --tag beta

# 最新版本
npm publish --tag latest
```

## 🛠️ 开发环境设置

### .npmignore 文件
为每个包创建 `.npmignore`:

**tjweather-cli/.npmignore**:
```
src/
tsconfig.json
.eslintrc*
.prettierrc*
.vscode/
.idea/
node_modules/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.env.*
coverage/
.nyc_output/
.cache/
```

**tjweather-mcp/.npmignore**:
```
src/
tsconfig.json
.eslintrc*
.prettierrc*
.vscode/
.idea/
node_modules/
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.env
.env.*
test-*.js
coverage/
.nyc_output/
.cache/
```

### GitHub Actions自动化发布
创建 `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  push:
    tags:
      - 'v*'

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'

      - name: Publish CLI
        run: |
          cd tjweather-cli
          npm ci
          npm run build
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}

      - name: Publish MCP
        run: |
          cd tjweather-mcp
          npm ci
          npm run build
          npm publish
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📊 发布后维护

### 监控下载量
```bash
# 查看下载统计
npm view tjweather-cli
npm view tjweather-mcp

# 持续监控
npm view tjweather-cli --json | jq '.downloads'
```

### 处理问题
```bash
# 撤销发布（紧急情况）
npm unpublish tjweather-cli@1.0.0

# 废弃旧版本
npm deprecate tjweather-cli@1.0.1 "请升级到1.0.2"
```

## 🎯 推广策略

### 1. README优化
- 清晰的安装说明
- 使用示例和截图
- 功能特性列表

### 2. 社区推广
- 在相关技术社区分享
- 发布技术博客
- 创建示例项目

### 3. SEO优化
- 合理的包描述和关键词
- 分类标签
- 版本更新日志

## ⚠️ 注意事项

1. **包名唯一性**: 确保包名在npm上唯一
2. **版本冲突**: 避免版本号重复
3. **依赖安全**: 定期检查依赖安全性
4. **测试覆盖**: 确保核心功能经过测试
5. **文档维护**: 及时更新README和文档

## 🎉 发布完成标志

发布成功后，用户可以通过以下命令安装：

```bash
# CLI工具
npm install -g tjweather-cli

# MCP服务器
npx tjweather-mcp

# 或项目依赖
npm install tjweather-cli tjweather-mcp
```

---

**🚀 准备好将您的工具分享给全球开发者！**
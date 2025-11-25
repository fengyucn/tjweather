# 📦 发布到npm指南

## 发布前检查清单

- [x] 代码已构建 (`npm run build`)
- [x] package.json信息完整
- [x] README.md详细说明
- [x] LICENSE文件存在
- [x] .npmignore配置正确
- [ ] 测试通过
- [ ] 版本号更新
- [ ] npm账号已登录

## 发布步骤

### 1. 准备发布
```bash
# 确保项目是最新的
git status
git add .
git commit -m "准备发布v1.0.0"

# 登录npm账号（首次）
npm login
```

### 2. 检查包信息
```bash
# 检查包内容（不实际打包）
npm pack --dry-run

# 预览包信息
npm view tjweather-mcp  # 如果已发布过
```

### 3. 发布包
```bash
# 发布到公共npm
npm publish

# 发布beta版本
npm publish --tag beta

# 发布到私有scope（如果有）
npm publish --access private
```

### 4. 验证发布
```bash
# 查看已发布的版本
npm view tjweather-mcp versions --json

# 测试安装
npm install -g tjweather-mcp

# 测试npx运行
npx tjweather-mcp --version
```

## 版本管理

### 语义化版本控制
- **主版本号**: 不兼容的API修改
- **次版本号**: 向下兼容的功能性新增
- **修订号**: 向下兼容的问题修正

### 发布新版本
```bash
# 更新版本号
npm version patch  # 1.0.0 -> 1.0.1
npm version minor  # 1.0.0 -> 1.1.0
npm version major  # 1.0.0 -> 2.0.0

# 自动提交并打tag
npm publish
```

### 测试版本
```bash
# 发布alpha/beta版本
npm version prerelease --preid alpha  # 1.0.0 -> 1.0.1-alpha.0
npm publish --tag alpha
```

## 用户使用方式

### 全局安装
```bash
npm install -g tjweather-mcp
tjweather-mcp
```

### npx直接运行
```bash
npx tjweather-mcp
```

### 项目依赖
```bash
npm install tjweather-mcp
# 在MCP配置中使用
./node_modules/.bin/tjweather-mcp
```

## 发布注意事项

1. **包名唯一性**: `tjweather-mcp` 在npm上必须是唯一的
2. **版本号规则**: 遵循语义化版本控制
3. **发布频率**: 避免频繁发布，建议积累重要更新
4. **文档维护**: 每次发布都要更新文档
5. **测试覆盖**: 确保核心功能经过测试

## 故障排除

### 常见发布错误
- `401 Unauthorized`: npm未登录或权限不足
- `403 Forbidden`: 包名已被占用
- `404 Not Found`: 包配置错误
- `409 Conflict`: 版本号已存在

### 解决方案
```bash
# 重新登录
npm logout
npm login

# 检查包名是否可用
npm view tjweather-mcp

# 强制发布（谨慎使用）
npm publish --force
```
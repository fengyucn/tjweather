# 🔧 tjweather-mcp 环境变量配置指南

## 📋 概述

`tjweather-mcp` 支持多种配置方式，其中**环境变量具有最高优先级**，提供了灵活的配置选项。

## 🏆 配置优先级（从高到低）

1. **环境变量** (最高优先级) ⭐
2. **当前目录 `.env` 文件**
3. **用户配置 `~/.config/tjweather/.env` 文件**

## 🔧 支持的环境变量

### 必需变量

| 变量名 | 描述 | 示例值 | 默认值 |
|--------|------|--------|--------|
| `API_KEY` | 天机气象API密钥 | `AOK202511050953A8A0A28484CC74095E40E9D4005BD1EC` | 无 |

### 可选变量

| 变量名 | 描述 | 示例值 | 默认值 |
|--------|------|--------|--------|
| `JSON_ENDPOINT` | JSON API端点 | `https://api.tjweather.com/beta` | `https://api.tjweather.com/beta` |
| `NC_ENDPOINT` | NetCDF API端点 | `https://api.tjweather.com/nc/beta` | `https://api.tjweather.com/nc/beta` |
| `NODE_ENV` | Node.js运行环境 | `production` | 无 |

## 🚀 使用方法

### 方法1: 直接设置环境变量

#### Linux/macOS
```bash
export API_KEY=your_api_key_here
export JSON_ENDPOINT=https://api.tjweather.com/beta
tjweather-mcp
```

#### Windows (PowerShell)
```powershell
$env:API_KEY="your_api_key_here"
$env:JSON_ENDPOINT="https://api.tjweather.com/beta"
tjweather-mcp
```

#### Windows (CMD)
```cmd
set API_KEY=your_api_key_here
set JSON_ENDPOINT=https://api.tjweather.com/beta
tjweather-mcp
```

### 方法2: 在MCP配置中设置

#### Claude Code 配置文件
```json
{
  "mcpServers": {
    "tjweather": {
      "command": "npx",
      "args": ["tjweather-mcp"],
      "env": {
        "API_KEY": "your_api_key_here",
        "JSON_ENDPOINT": "https://api.tjweather.com/beta"
      }
    }
  }
}
```

#### 其他MCP客户端配置
```json
{
  "command": "node",
  "args": ["/path/to/tjweather-mcp/dist/index.js"],
  "env": {
    "API_KEY": "your_api_key_here",
    "JSON_ENDPOINT": "https://api.tjweather.com/beta"
  }
}
```

### 方法3: 使用 .env 文件

#### 项目根目录 .env
```env
# 项目级别配置（会覆盖用户配置）
API_KEY=your_project_api_key
JSON_ENDPOINT=https://api.tjweather.com/beta
```

#### 用户配置文件 ~/.config/tjweather/.env
```env
# 用户级别配置（最低优先级）
API_KEY=your_user_api_key
NC_ENDPOINT=https://api.tjweather.com/nc/beta
```

## 🔍 配置验证

### 1. 查看配置加载过程
```bash
# 启动时会显示配置加载详情
tjweather-mcp
```

输出示例：
```
🔧 开始加载配置文件...
✅ 已加载用户配置: /home/user/.config/tjweather/.env
   - API_KEY: 已设置
✅ 已从环境变量加载API_KEY
📋 最终配置:
   - API_KEY: 已设置
   - JSON_ENDPOINT: https://api.tjweather.com/beta
```

### 2. 测试配置是否生效
```bash
# 使用环境变量测试
API_KEY=your_test_key tjweather-mcp
```

### 3. 检查环境变量
```bash
# Linux/macOS
echo $API_KEY
echo $JSON_ENDPOINT

# Windows
echo %API_KEY%
echo %JSON_ENDPOINT%
```

## 📋 最佳实践

### 1. 安全性考虑
- ✅ **推荐**: 使用环境变量或用户配置文件
- ⚠️ **避免**: 在代码或配置文件中硬编码API密钥
- 🛡️ **保护**: 不要将API密钥提交到版本控制系统

### 2. 环境隔离
```bash
# 开发环境
export API_KEY=dev_api_key
export JSON_ENDPOINT=https://dev-api.tjweather.com/beta

# 生产环境
export API_KEY=prod_api_key
export JSON_ENDPOINT=https://api.tjweather.com/beta
```

### 3. Docker 容器化
```dockerfile
FROM node:18-alpine
ENV API_KEY=${API_KEY}
ENV JSON_ENDPOINT=${JSON_ENDPOINT:-https://api.tjweather.com/beta}
COPY . /app
WORKDIR /app
CMD ["node", "dist/index.js"]
```

```yaml
# docker-compose.yml
version: '3.8'
services:
  tjweather-mcp:
    image: tjweather-mcp
    environment:
      - API_KEY=${TJWEATHER_API_KEY}
      - JSON_ENDPOINT=${TJWEATHER_ENDPOINT:-https://api.tjweather.com/beta}
```

### 4. CI/CD 集成
```yaml
# GitHub Actions示例
- name: Run MCP Server
  env:
    API_KEY: ${{ secrets.TJWEATHER_API_KEY }}
    JSON_ENDPOINT: ${{ secrets.TJWEATHER_ENDPOINT }}
  run: tjweather-mcp
```

## 🔄 动态配置更新

### 环境变量实时生效
```bash
# 设置新值
export API_KEY=new_api_key

# 重启MCP服务器后自动生效
tjweather-mcp
```

### 配置文件需要重启
```bash
# 修改 .env 文件后需要重启服务
nano .env
pkill tjweather-mcp
tjweather-mcp
```

## 🐛 故障排除

### 常见问题

1. **环境变量未生效**
   ```bash
   # 检查环境变量是否设置
   env | grep TJWEATHER
   # 确保变量名正确：API_KEY 而不是 TWEATHER_API_KEY
   ```

2. **配置优先级混淆**
   ```bash
   # 清除环境变量测试其他配置
   unset API_KEY
   tjweather-mcp
   ```

3. **权限问题**
   ```bash
   # 检查用户配置目录权限
   ls -la ~/.config/tjweather/
   chmod 600 ~/.config/tjweather/.env
   ```

### 调试模式
```bash
# 启用详细日志
export DEBUG=tjweather
tjweather-mcp
```

## 💡 推荐配置策略

### 开发环境
- 使用项目根目录的 `.env` 文件
- 便于团队协作和配置管理

### 生产环境
- 使用环境变量或容器化环境变量
- 提高安全性和部署灵活性

### CI/CD环境
- 使用平台提供的Secrets管理
- 避免敏感信息泄露

---

**总结**: `tjweather-mcp` 完全支持环境变量配置，并提供灵活的优先级管理。推荐根据使用场景选择最适合的配置方式。
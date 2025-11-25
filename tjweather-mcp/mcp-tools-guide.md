# 🔧 MCP调试工具指南

## 🌟 开源MCP调试工具

### 1. MCP Inspector (官方推荐)
```bash
# 安装
npm install -g @modelcontextprotocol/inspector

# 使用
mcp-inspector

# 或者在配置文件中指定服务器
mcp-inspector --config claude_desktop_config.json
```

**特点**:
- Anthropic官方维护
- 交互式调试界面
- 实时消息查看
- 工具调用测试
- 完整的MCP协议支持

### 2. MCP CLI Tool
```bash
# 安装
npm install -g @modelcontextprotocol/cli

# 使用
mcp-cli --server /path/to/server
mcp-cli --command "node dist/index.js"
```

**特点**:
- 轻量级命令行工具
- 直接执行MCP命令
- 支持管道操作
- 适合自动化测试

### 3. MCP Test Harness
```bash
# 安装
npm install mcp-test-harness

# 使用
mcp-test --server tjweather-mcp
```

**特点**:
- 专门的测试框架
- 批量工具测试
- 性能监控
- 错误报告

### 4. MCP Web Debugger
```bash
# 安装
npm install -g mcp-web-debugger

# 使用
mcp-web-debugger --port 3000
```

**特点**:
- Web界面调试
- 实时消息流
- 可视化数据
- 适合演示和分享

## 🎯 推荐使用方案

### 方案1: 官方Inspector (推荐)
```bash
# 1. 安装inspector
npm install -g @modelcontextprotocol/inspector

# 2. 创建配置文件
cat > debug-config.json << EOF
{
  "mcpServers": {
    "tjweather": {
      "command": "node",
      "args": ["./tjweather-mcp/dist/index.js"],
      "cwd": "/home/fengyu/devhome/tjweather"
    }
  }
}
EOF

# 3. 启动调试器
mcp-inspector --config debug-config.json
```

### 方案2: 简单命令行测试
```bash
# 直接测试服务器
node dist/index.js | jq .

# 或使用nc进行协议测试
echo '{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}' | node dist/index.js
```

### 方案3: 使用自定义调试工具
```bash
# 使用我们刚才创建的调试工具
node mcp-debug.js
```

## 🔍 测试命令示例

### 基础协议测试
```json
{"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
```

### 天气查询测试
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "weather_query",
    "arguments": {
      "location": "116.23128,40.22077",
      "fields": "t2m,rh2m",
      "days": 3
    }
  }
}
```

### 字段信息测试
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "weather_fields_info",
    "arguments": {
      "region": "global"
    }
  }
}
```

## 🛠️ 调试技巧

### 1. 配置验证
```bash
# 检查配置文件
ls -la ~/.config/tjweather/.env
cat ~/.config/tjweather/.env

# 检查本地配置
ls -la .env
cat .env
```

### 2. 服务器状态检查
```bash
# 检查服务器是否运行
ps aux | grep tjweather-mcp

# 测试启动
timeout 5 node dist/index.js
```

### 3. 网络连接测试
```bash
# 测试API端点
curl -I https://api.tjweather.com/beta

# 测试API调用（需要真实密钥）
curl "https://api.tjweather.com/beta?key=YOUR_KEY&loc=116.23128,40.22077&fields=t2m"
```

## 📋 推荐调试流程

1. **安装调试工具**
   ```bash
   npm install -g @modelcontextprotocol/inspector
   ```

2. **创建测试配置**
   ```json
   {
     "mcpServers": {
       "tjweather": {
         "command": "node",
         "args": ["./tjweather-mcp/dist/index.js"]
       }
     }
   }
   ```

3. **启动调试器**
   ```bash
   mcp-inspector --config debug-config.json
   ```

4. **测试工具调用**
   - 查看可用工具列表
   - 测试weather_query工具
   - 测试weather_fields_info工具

5. **验证配置读取**
   - 检查服务器日志输出
   - 确认API密钥正确加载

## 🚀 快速开始

```bash
# 一键启动官方调试器
cat > debug-config.json << 'EOF'
{
  "mcpServers": {
    "tjweather": {
      "command": "node",
      "args": ["./tjweather-mcp/dist/index.js"],
      "cwd": "/home/fengyu/devhome/tjweather"
    }
  }
}
EOF

mcp-inspector --config debug-config.json
```

这样就能在图形界面中测试MCP服务器了！
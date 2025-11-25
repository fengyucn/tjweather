# tjweather-mcp

[![npm version](https://badge.fury.io/js/tjweather-mcp.svg)](https://badge.fury.io/js/tjweather-mcp)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen)](https://nodejs.org/)

天机气象API MCP服务器 - 基于Model Context Protocol的气象数据服务，支持与Claude Code等AI工具集成。

## 🚀 快速安装

### 方法1: 全局安装（推荐）
```bash
npm install -g tjweather-mcp
```

### 方法2: 使用npx（无需安装）
```bash
npx tjweather-mcp
```

### 方法3: 本地开发
```bash
git clone https://github.com/yourusername/tjweather.git
cd tjweather/tjweather-mcp
npm install
npm run build
```

## ⚙️ 配置

### 1. 设置环境变量

创建 `~/.config/tjweather/.env` 文件：

```env
# 天机气象API密钥（必需）
API_KEY=your_api_key_here

# API端点地址（可选，有默认值）
JSON_ENDPOINT=https://api.tjweather.com/beta
```

### 2. 配置MCP客户端

在Claude Code中添加到配置文件：

```json
{
  "mcpServers": {
    "tjweather": {
      "command": "tjweather-mcp",
      "args": []
    }
  }
}
```

或者使用npx：
```json
{
  "mcpServers": {
    "tjweather": {
      "command": "npx",
      "args": ["tjweather-mcp"]
    }
  }
}
```

## 可用工具

### weather_query
查询天机气象预报数据

参数：
- `location` (必需): 经纬度坐标，如 "116.23128,40.22077"
- `fields`: 气象要素，如 "ws100m,t2m,rh2m"
- `days`: 预报天数 (1-45)
- `hours`: 预报小时数
- `resolution`: 时间分辨率 ("15min" 或 "1h")
- `timezone`: 时区 (-12 到 12)
- `grid`: 网格大小 ("1", "3", "5", "7")

### weather_fields_info
获取支持的气象要素信息

参数：
- `region`: 区域类型 ("global" 或 "china")

## 使用示例

```javascript
// 查询北京天气
{
  "tool": "weather_query",
  "arguments": {
    "location": "116.23128,40.22077",
    "fields": "ws100m,t2m,rh2m",
    "days": 3
  }
}

// 获取全球要素信息
{
  "tool": "weather_fields_info",
  "arguments": {
    "region": "global"
  }
}
```
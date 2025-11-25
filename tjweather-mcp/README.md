# 天机气象MCP服务器

基于Model Context Protocol的天机气象API服务器，支持与Claude Code等AI工具集成。

## 安装

```bash
npm install
npm run build
```

## 启动

```bash
npm start
```

## 配置MCP客户端

在Claude Code中添加：

```json
{
  "mcpServers": {
    "tjweather": {
      "command": "/path/to/tjweather-mcp/dist/index.js",
      "args": []
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
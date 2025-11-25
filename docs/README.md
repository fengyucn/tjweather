# 天机气象API工具集

基于天机气象API的CLI工具和MCP服务器，支持全球气象数据查询。

## 功能特性

- **160+气象要素**：风速、温度、湿度、气压、云量等
- **全球覆盖**：支持全球任意经纬度查询
- **灵活预报**：支持45天内预报，15分钟/1小时分辨率
- **多种格式**：JSON、表格、CSV输出
- **MCP集成**：支持Claude Code等AI工具

## 项目结构

```
tjweather/
├── .env                 # 环境配置
├── .env.example         # 配置模板
├── tjweather-cli/       # CLI命令行工具
│   ├── src/
│   │   ├── api/         # API客户端
│   │   ├── commands/    # 命令实现
│   │   ├── utils/       # 工具函数
│   │   └── types/       # 类型定义
│   └── package.json
└── tjweather-mcp/       # MCP服务器
    ├── src/
    │   └── index.ts     # 服务器实现
    └── package.json
```

## 快速开始

### 1. 配置API密钥

复制配置模板并填入API密钥：

```bash
cp .env.example .env
# 编辑 .env 文件，填入实际的API_KEY
```

或使用用户配置：

```bash
# CLI会自动读取 ~/.config/tjweather/.env
mkdir -p ~/.config/tjweather
echo "API_KEY=你的API密钥" > ~/.config/tjweather/.env
```

### 2. 安装依赖

```bash
# 安装CLI工具
cd tjweather-cli
npm install
npm run build

# 安装MCP服务器
cd ../tjweather-mcp
npm install
npm run build
```

## CLI工具使用

### 基本查询

```bash
# 查询北京未来3天的100米风速
./tjweather-cli/dist/index.js query -l "116.23128,40.22077" -f ws100m -d 3

# 查询多个气象要素
./tjweather-cli/dist/index.js query -l "116.23128,40.22077" -f "ws100m,t2m,rh2m,tp" -d 7

# 高分辨率预报（15分钟）
./tjweather-cli/dist/index.js query -l "116.23128,40.22077" -f ws100m -r 15min -d 1

# 输出为JSON格式
./tjweather-cli/dist/index.js query -l "116.23128,40.22077" -f ws100m --format json

# 保存到CSV文件
./tjweather-cli/dist/index.js query -l "116.23128,40.22077" -f ws100m --format csv -o weather.csv
```

### 命令参数

- `-l, --location <coordinates>`: 经纬度坐标（必填）
- `-f, --fields <fields>`: 气象要素，多个用逗号分隔
- `-d, --days <days>`: 预报天数（默认3）
- `-h, --hours <hours>`: 预报小时数（默认0）
- `-r, --resolution <resolution>`: 时间分辨率（15min|1h）
- `--format <format>`: 输出格式（json|table|csv）
- `-o, --output <file>`: 输出文件路径
- `-v, --verbose`: 详细输出

### 配置管理

```bash
# 初始化配置文件
./tjweather-cli/dist/index.js init

# 查看当前配置
./tjweather-cli/dist/index.js config

# 查看完整配置（包括API密钥）
./tjweather-cli/dist/index.js config --show-secret
```

## MCP服务器使用

### 启动服务器

```bash
cd tjweather-mcp
npm start
```

### 配置Claude Code

在Claude Code中添加MCP服务器：

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

### 可用工具

1. **weather_query**: 查询天气数据
   - location: 经纬度坐标
   - fields: 气象要素（如：ws100m,t2m,rh2m）
   - days: 预报天数
   - resolution: 时间分辨率

2. **weather_fields_info**: 获取气象要素信息
   - region: 区域类型（global|china）

## 支持的气象要素

### 常用全球要素
- `ws100m`: 100米风速 (m/s)
- `t2m`: 2米温度 (°C)
- `rh2m`: 2米相对湿度 (%)
- `tp`: 降水 (mm/hr)
- `ssrd`: 辐照度 (W/㎡)
- `slp`: 海平面气压 (mb)
- `cldt`: 总云量 (0-1)

### 中国特有要素
- `ws30m`: 30米风速 (m/s)
- `ws50m`: 50米风速 (m/s)
- `ws70m`: 70米风速 (m/s)

## 坐标格式

- 经度范围：[-180, 180] 或 [0, 360]
- 纬度范围：[-90, 90]
- 格式：经度,纬度（如：116.23128,40.22077）

## 错误处理

CLI工具提供友好的错误信息：
- 坐标格式验证
- 气象要素验证
- API响应错误处理
- 配置文件错误提示

## 开发说明

### 项目依赖
- Node.js >= 16.0.0
- TypeScript
- axios (HTTP客户端)
- commander (命令行解析)
- @modelcontextprotocol/sdk (MCP支持)

### 构建和测试
```bash
# 构建CLI工具
cd tjweather-cli
npm run build

# 构建MCP服务器
cd ../tjweather-mcp
npm run build
```

## 许可证

MIT License

## 支持

如有问题请查看API文档或联系天机气象运营团队。
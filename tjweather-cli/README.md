# 天机气象CLI工具

强大的命令行工具，用于查询天机气象API数据，支持标准的命令行格式。

## 安装

```bash
npm install
npm run build
```

## 命令格式

```bash
tjweather [全局选项] <子命令> [子命令选项]
```

## 全局选项

- `-v, --verbose`: 详细输出模式，显示执行过程
- `-c, --config <path>`: 指定自定义配置文件路径
- `--no-color`: 禁用彩色输出
- `-h, --help`: 显示帮助信息

## 子命令

### 1. query - 查询天气数据

```bash
tjweather query [选项]
```

**必需参数：**
- `-l, --location <coordinates>`: 经纬度坐标，格式: 经度,纬度 (如: 116.23128,40.22077)

**可选参数：**
- `-f, --fields <fields>`: 气象要素，多个用逗号分隔 (默认: t2m)
- `-d, --days <days>`: 预报天数 (默认: 3)
- `-h, --hours <hours>`: 预报小时数 (默认: 0)
- `-r, --resolution <resolution>`: 时间分辨率 (15min|1h, 默认: 1h)
- `-t, --timezone <timezone>`: 时区 (-12 到 12, 默认: 8)
- `-g, --grid <grid>`: 网格大小 (1|3|5|7, 默认: 1)
- `--format <format>`: 输出格式 (json|table|csv, 默认: table)
- `-o, --output <file>`: 输出文件路径

### 2. download - 下载NetCDF格式数据

```bash
tjweather download [选项]
```

**必需参数：**
- `-l, --location <coordinates>`: 经纬度坐标，格式: 经度,纬度 (如: 116.23128,40.22077)

**可选参数：**
- `-f, --fields <fields>`: 气象要素，多个用逗号分隔 (默认: t2m)
- `-d, --days <days>`: 预报天数 (默认: 3)
- `-h, --hours <hours>`: 预报小时数 (默认: 0)
- `-r, --resolution <resolution>`: 时间分辨率 (15min|1h, 默认: 1h)
- `-t, --timezone <timezone>`: 时区 (-12 到 12, 默认: 8)
- `-g, --grid <grid>`: 网格大小 (1|3|5|7, 默认: 1)
- `-o, --output <file>`: 输出文件路径 (默认: 自动生成)
- `--filename <filename>`: 指定下载文件名

**示例：**
```bash
# 基本查询
tjweather query -l "116.23128,40.22077" -f t2m -d 3

# 多要素查询
tjweather query -l "116.23128,40.22077" -f "t2m,rh2m" -d 1

# 高分辨率预报
tjweather query -l "116.23128,40.22077" -f t2m -d 0 -h 24 -r 15min

# JSON格式输出
tjweather query -l "116.23128,40.22077" -f t2m --format json

# 保存到CSV文件
tjweather query -l "116.23128,40.22077" -f t2m --format csv -o data.csv

# 详细模式
tjweather --verbose query -l "116.23128,40.22077" -f t2m -d 1

# NetCDF下载示例
tjweather download -l "116.23128,40.22077" -f t2m -d 3 -o weather.nc
tjweather download -l "116.23128,40.22077" -f "t2m,rh2m" -d 0 -h 24 -r 15min -o highres.nc
tjweather --verbose download -l "116.23128,40.22077" -f t2m -d 7
```

### 2. init - 初始化配置文件

```bash
tjweather init [选项]
```

**选项：**
- `-f, --force`: 强制覆盖现有配置

**示例：**
```bash
# 基本初始化
tjweather init

# 详细初始化
tjweather --verbose init
```

### 3. config - 显示当前配置

```bash
tjweather config [选项]
```

**选项：**
- `-s, --show-secret`: 显示敏感信息（API密钥）

**示例：**
```bash
# 查看配置
tjweather config

# 显示API密钥
tjweather config --show-secret

# 详细配置信息
tjweather --verbose config
```

### 4. version - 显示版本信息

```bash
tjweather version
```

**示例：**
```bash
tjweather version
```

## 配置管理

工具支持多层级配置读取：

1. **当前目录 `.env`** - 项目级配置
2. **用户配置 `~/.config/tjweather/.env`** - 用户级配置
3. **环境变量** - 系统级配置

配置文件格式：
```env
# 天机气象API配置文件
API_KEY=YOUR_API_KEY_HERE
NC_ENDPOINT=https://api.tjweather.com/nc/beta
JSON_ENDPOINT=https://api.tjweather.com/beta
```

## 常用气象要素

- `t2m`: 2米温度 (°C)
- `rh2m`: 2米相对湿度 (%)
- `ws100m`: 100米风速 (m/s) - 需要订阅
- `ssrd`: 辐照度 (W/㎡) - 需要订阅
- `slp`: 海平面气压 (mb) - 需要订阅

## 坐标格式

- 经度范围：[-180, 180] 或 [0, 360]
- 纬度范围：[-90, 90]
- 格式：经度,纬度（如：116.23128,40.22077）

## 输出格式

### 表格格式（默认）
彩色表格显示，易于阅读

### JSON格式
完整的API响应，包含元数据

### CSV格式
标准CSV格式，适合数据分析

## 错误处理

工具提供友好的错误信息：
- 坐标格式验证
- 气象要素验证
- API响应错误处理
- 配置文件错误提示

## 使用技巧

1. **首次使用**：先运行 `tjweather init` 初始化配置
2. **调试问题**：使用 `--verbose` 选项查看详细执行过程
3. **批量查询**：结合shell脚本进行批量天气查询
4. **数据分析**：使用CSV输出格式进行数据分析

## 完整使用示例

```bash
# 1. 初始化配置
tjweather init

# 2. 配置API密钥（编辑 ~/.config/tjweather/.env）

# 3. 验证配置
tjweather config

# 4. 查询天气数据
tjweather --verbose query -l "116.23128,40.22077" -f "t2m,rh2m" -d 7 --format json

# 5. 保存数据
tjweather query -l "116.23128,40.22077" -f t2m --format csv -o weather_data.csv

# 6. 下载NetCDF文件
tjweather download -l "116.23128,40.22077" -f "t2m,rh2m" -d 7 -o weather_data.nc
tjweather --verbose download -l "116.23128,40.22077" -f t2m -d 0 -h 24 -r 15min -o highres_weather.nc
```

## 技术支持

- 支持全球任意经纬度查询
- 多种时间分辨率（15分钟、1小时）
- 灵活的预报时长（1-45天）
- 完整的错误处理机制
- TypeScript类型安全
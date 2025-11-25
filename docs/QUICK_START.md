# ⚡ 快速开始

## 🚀 5分钟上手指南

### 1. 安装
```bash
git clone <repository-url>
cd tjweather
./tjweather-cli/install.sh
```

### 2. 配置
```bash
tjweather init
# 编辑 ~/.config/tjweather/.env 添加API密钥
```

### 3. 使用
```bash
# 查询北京温度
tjweather query -l "116.23128,40.22077" -f t2m -d 3

# 下载NetCDF文件
tjweather download -l "116.23128,40.22077" -f t2m -d 3
```

## 🔑 常用命令速查

| 功能 | 命令 | 示例 |
|------|------|------|
| 查询天气 | `tjweather query` | `-l "经度,纬度" -f t2m -d 3` |
| 下载文件 | `tjweather download` | `-l "经度,纬度" -f t2m -o weather.nc` |
| 配置管理 | `tjweather config` | `--show-secret` |
| 帮助信息 | `tjweather --help` |  |

## 📚 完整文档

- [详细文档](./index.md) - 完整的使用指南
- [用户指南](./user-guide/) - 深入使用说明
- [API文档](./api/) - 接口详细说明

开始探索天机气象数据的强大功能！
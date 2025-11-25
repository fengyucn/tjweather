# 安装指南

## 快速安装

### 方法1：使用安装脚本（推荐）

```bash
# 克隆项目
git clone <repository-url>
cd tjweather

# 运行安装脚本
./install.sh
```

安装脚本会自动：
- 检查Node.js和npm环境
- 安装项目依赖
- 构建TypeScript代码
- 创建全局`npm link`链接

### 方法2：手动安装

```bash
# 进入CLI工具目录
cd tjweather-cli

# 安装依赖
npm install

# 构建项目
npm run build

# 创建全局链接
npm link
```

### 方法3：全局安装

```bash
# 进入CLI工具目录
cd tjweather-cli

# 全局安装
npm install -g .
```

## 验证安装

安装完成后，测试命令：

```bash
# 查看帮助
tjweather --help

# 查看版本
tjweather version

# 查看配置
tjweather config
```

## 首次使用

1. **初始化配置**
   ```bash
   tjweather init
   ```

2. **配置API密钥**
   ```bash
   # 编辑配置文件
   nano ~/.config/tjweather/.env

   # 或者查看配置
   tjweather config --show-secret
   ```

3. **测试查询**
   ```bash
   # 查询北京天气
   tjweather query -l "116.23128,40.22077" -f t2m -d 1
   ```

## 卸载

使用卸载脚本：

```bash
./uninstall.sh
```

## 系统要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- 支持的系统：Linux, macOS, Windows(WSL)

## 配置文件位置

- 用户配置：`~/.config/tjweather/.env`
- 项目配置：`./.env`（项目根目录）
- 环境变量：`TJWEATHER_*`

## 故障排除

### 命令找不到
```bash
# 检查npm全局路径
npm config get prefix

# 添加到PATH（如果需要）
export PATH=$PATH:$(npm config get prefix)/bin
```

### 权限问题
```bash
# 如果遇到权限错误，可能需要sudo
sudo npm link
```

### 重新安装
```bash
# 先卸载
./uninstall.sh

# 重新安装
./install.sh
```
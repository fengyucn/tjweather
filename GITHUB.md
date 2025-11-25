# GitHub 仓库设置指南

## 仓库信息

仓库名称建议：`tjweather` 或 `tianji-weather-tools`

## 推荐的GitHub设置

### 1. 仓库描述
```
天机气象API工具集 - CLI工具和MCP服务器，支持JSON和NetCDF格式气象数据获取
```

### 2. 主题标签
```
weather, cli, mcp, meteorology, api, typescript, nodejs, netcdf, forecast
```

### 3. README.md 优化
仓库的根目录 README.md 已经包含了：
- ✅ 项目概述
- ✅ 安装指南
- ✅ 使用示例
- ✅ 项目结构
- ✅ 技术支持信息

### 4. GitHub Pages (可选)
如果需要部署文档网站，可以启用 GitHub Pages 并从 main 分支构建。

## 推送到GitHub的步骤

### 1. 创建GitHub仓库
```bash
# 在GitHub网站上创建新仓库，然后运行：
git remote add origin https://github.com/yourusername/tjweather.git
```

### 2. 推送代码
```bash
git push -u origin main
```

## 分支策略

### 主要分支
- `main` - 主分支，稳定版本
- `develop` - 开发分支（如果需要）

### 功能分支
- `feature/xxx` - 新功能开发
- `bugfix/xxx` - 错误修复
- `hotfix/xxx` - 紧急修复

## 发布标签

### 版本命名规范
- `v1.0.0` - 主要版本
- `v1.1.0` - 次要版本
- `v1.1.1` - 补丁版本

### 创建标签
```bash
git tag -a v1.0.0 -m "发布初始版本"
git push origin v1.0.0
```

## CI/CD 建议设置

### GitHub Actions 工作流
可以创建以下工作流：

1. **代码质量检查**
   - TypeScript 编译
   - ESLint 检查
   - 代码格式化

2. **自动化测试**
   - 单元测试
   - 集成测试

3. **构建和发布**
   - 自动构建 npm 包
   - 发布到 npm registry

## 安全设置

### 1. 依赖安全扫描
启用 GitHub Dependabot 进行依赖安全扫描。

### 2. 敏感信息
- ✅ 已在 .gitignore 中排除 .env 文件
- ✅ API密钥通过环境变量管理
- ✅ 配置模板提供 (.env.example)

### 3. 访问控制
- 设置适当的分支保护规则
- 配置代码审查流程
- 管理协作者权限

## 社区和贡献

### 1. 贡献指南
项目已包含：
- ✅ 详细的安装说明
- ✅ 完整的使用文档
- ✅ 项目结构说明
- ✅ 技术支持信息

### 2. Issue 模板
可以创建以下 Issue 模板：
- Bug 报告
- 功能请求
- 文档改进
- 使用问题

### 3. Pull Request 模板
确保 PR 包含：
- 变更描述
- 测试结果
- 文档更新

## 许可证
- ✅ 已采用 MIT 许可证
- ✅ 允许商业使用
- ✅ 支持二次开发

## 部署建议

### CLI工具发布
```bash
# 发布到npm
npm publish

# 全局安装测试
npm install -g .
```

### MCP服务器部署
- 通过 npm 包分发
- 提供详细的安装文档
- 支持 Docker 容器化部署

## 监控和维护

### 1. 使用统计
- GitHub Stars 数量
- npm 下载量
- Issue 和 PR 活动

### 2. 反馈渠道
- GitHub Issues
- 邮件联系
- 社区讨论

### 3. 版本发布
- 定期更新依赖
- 修复 reported bugs
- 添加新功能

## 备份策略
- GitHub 仓库作为主要备份
- 定期创建本地备份
- 考虑镜像到其他平台

仓库已准备好发布到GitHub！
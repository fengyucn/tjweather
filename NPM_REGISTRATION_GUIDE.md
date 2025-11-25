# 📝 npm账号注册指南

## 🎯 注册npm账号

### 🌐 访问npm官网

打开浏览器访问：[https://www.npmjs.com](https://www.npmjs.com)

点击右上角的 **"Sign Up"** 按钮。

## 📋 注册流程

### 1. 基本信息填写

| 字段 | 说明 | 示例 |
|------|------|------|
| **Username** | 用户名，将成为您的唯一标识 | `your-username` |
| **Email** | 邮箱地址，用于账号验证和通知 | `your.email@example.com` |
| **Password** | 密码，至少8个字符，包含字母和数字 | `YourSecurePass123` |
| **Confirm Password** | 确认密码 | `YourSecurePass123` |

### 2. 账号验证

注册后会发送验证邮件到您的邮箱，需要：
1. 打开邮箱
2. 查找来自npm的验证邮件
3. 点击邮件中的验证链接
4. 完成邮箱验证

## 🔧 命令行注册 (推荐开发者)

如果您更喜欢使用命令行：

### 安装npm
```bash
# 检查是否已安装npm
npm --version

# 如果未安装，安装Node.js (会包含npm)
# 访问 https://nodejs.org 下载安装
```

### 使用命令行注册
```bash
# 注册npm账号
npm adduser

# 按提示输入：
# Username: your-username
# Password: your-password
# Email: your-email@example.com
```

### 示例输出
```
Username: tjweather-developer
Password: ********
Email: developer@example.com
Logged in as tjweather-developer on https://registry.npmjs.org/.
```

## 🔒 账号登录和认证

### 验证登录状态
```bash
# 检查当前登录状态
npm whoami
```

### 如果忘记密码
```bash
# 重置密码
npm profile reset-password
```

## 🛡️ 安全最佳实践

### 密码安全
- 使用强密码（至少8个字符）
- 包含大写字母、小写字母、数字和特殊字符
- 不要使用在其他网站使用的相同密码
- 定期更换密码

### 双因素认证 (2FA)
- 启用双因素认证增强安全性
- 使用认证器应用（如Google Authenticator, Authy）
- 保存备用恢复码

### API密钥管理
- 妥善保管npm账号的API密钥
- 定期轮换API密钥
- 不要在代码中硬编码密钥

## 🔧 发布前准备

### 1. 设置个人资料
访问 [npm Profile](https://www.npmjs.com/settings) 设置：
- 个人信息
- 公司信息（如果适用）
- 联系信息

### 2. 设置两步验证
```
设置路径: Account Settings → Two-Factor Authentication
```

### 3. 设置组织（可选）
如果代表公司或组织发布包：
- 创建组织账号
- 添加团队成员
- 配置包权限

## 🏢 组织账号（可选）

### 创建组织
```bash
# 使用CLI创建组织
npm org create your-organization
```

### 包的命名空间
```json
{
  "name": "@your-username/tjweather-cli"
}
```

## 🎯 发布配置验证

### 检查发布权限
```bash
# 验证可以发布包
npm access list your-username
```

### 如果遇到权限问题
```bash
# 请求组织权限（如果是在组织下）
# 需要联系组织管理员
```

## 📞 常见问题

### Q: 注册时遇到 "Username is already taken"
**A**: 选择不同的用户名，npm用户名是全局唯一的

### Q: 邮箱验证邮件没有收到
**A**:
- 检查垃圾邮件文件夹
- 确认邮箱地址正确
- 重新发送验证邮件

### Q: 忘记密码
**A**: 使用密码重置功能：`npm profile reset-password`

### Q: 账号被限制
**A**: 联系npm客服团队寻求帮助

### Q: 发布包时权限被拒绝
**A**:
- 确认账号状态正常
- 检查包名是否被占用
- 如果是组织包，确认组织权限

## 🔄 账号类型对比

| 特性 | 个人账号 | 组织账号 |
|------|----------|----------|
| **成本** | 免费 | 付费（但某些功能免费） |
| **命名** | 包名全局唯一 | 组织命名空间 |
| **协作** | 个人使用 | 团队协作 |
| **私有包** | 需要付费 | 可以设置私有包 |
| **成员管理** | N/A | 完整的权限管理 |
| **SLA** | 基础支持 | 高级SLA支持 |

## 🎯 推荐策略

### 个人开发者
- 使用个人账号
- 以用户名命名空间发布
- 考虑未来可能的商业化需求

### 企业/团队
- 使用组织账号
- 创建组织命名空间
- 配置团队成员权限
- 设置私有包策略

## 🔗 有用链接

- **npm官网**: [https://www.npmjs.com](https://www.npmjs.com)
- **npm文档**: [https://docs.npmjs.com](https://docs.npmjs.com/)
- **npm博客**: [https://blog.npmjs.com/](https://blog.npmjs.com/)
- **npm支持**: [https://www.npmjs.com/support](https://www.npmjs.com/support)

## 📋 注册后步骤

1. ✅ **完成注册** - 按照上述流程完成账号注册
2. ✅ **验证邮箱** - 激活npm账号
3. ✅ **配置2FA** - 增强账号安全性
4. ✅ **测试登录** - 使用 `npm whoami` 验证
5. ✅ **准备发布** - 开始发布您的包

## 🎉 完成注册后

注册成功后，您就可以：
- 📦 发布包到npm公共仓库
- 🔧 使用命令行工具管理包
- 👥 参与开源社区
- 📈 跟踪包的下载和使用统计

---

**注册完成后，就可以开始发布您的 tjweather 工具了！** 🚀

**下一步**: 运行 `./publish.sh` 开始发布流程。
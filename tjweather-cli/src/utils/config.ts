import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import dotenv from 'dotenv';

export interface Config {
  API_KEY: string;
  NC_ENDPOINT: string;
  JSON_ENDPOINT: string;
  [key: string]: string | undefined;
}

export class ConfigManager {
  private static instance: ConfigManager;
  private config: Config;

  private constructor() {
    this.config = this.loadConfig();
  }

  public static getInstance(): ConfigManager {
    if (!ConfigManager.instance) {
      ConfigManager.instance = new ConfigManager();
    }
    return ConfigManager.instance;
  }

  /**
   * 按优先级加载配置：
   * 1. 当前目录的 .env
   * 2. 用户配置目录 ~/.config/tjweather/.env
   * 3. 环境变量
   */
  private loadConfig(): Config {
    let config: Config = {
      API_KEY: '',
      NC_ENDPOINT: 'https://api.tjweather.com/nc/beta',
      JSON_ENDPOINT: 'https://api.tjweather.com/beta'
    };

    // 1. 尝试加载用户配置目录的 .env
    const userConfigPath = path.join(os.homedir(), '.config', 'tjweather', '.env');
    this.loadEnvFile(userConfigPath, config);

    // 2. 尝试加载当前目录的 .env（覆盖用户配置）
    const localConfigPath = path.join(process.cwd(), '.env');
    this.loadEnvFile(localConfigPath, config);

    // 3. 环境变量（覆盖所有文件配置）
    config.API_KEY = process.env.API_KEY || config.API_KEY;
    config.NC_ENDPOINT = process.env.NC_ENDPOINT || config.NC_ENDPOINT;
    config.JSON_ENDPOINT = process.env.JSON_ENDPOINT || config.JSON_ENDPOINT;

    return config;
  }

  /**
   * 加载指定的 .env 文件
   */
  private loadEnvFile(filePath: string, config: Config): void {
    try {
      if (fs.existsSync(filePath)) {
        const result = dotenv.config({ path: filePath });
        if (result.parsed) {
          Object.assign(config, result.parsed);
        }
      }
    } catch (error) {
      console.warn(`警告: 无法加载配置文件 ${filePath}: ${error}`);
    }
  }

  /**
   * 获取配置值
   */
  public get(key: keyof Config): string {
    return this.config[key] || '';
  }

  /**
   * 获取所有配置
   */
  public getAll(): Config {
    return { ...this.config };
  }

  /**
   * 验证必需的配置
   */
  public validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!this.config.API_KEY) {
      errors.push('API_KEY 未配置，请设置环境变量或在 .env 文件中配置');
    }

    if (!this.config.NC_ENDPOINT) {
      errors.push('NC_ENDPOINT 未配置');
    }

    if (!this.config.JSON_ENDPOINT) {
      errors.push('JSON_ENDPOINT 未配置');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * 创建用户配置目录和示例文件
   */
  public static createUserConfig(): void {
    const configDir = path.join(os.homedir(), '.config', 'tjweather');
    const configPath = path.join(configDir, '.env');

    try {
      // 创建配置目录
      if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir, { recursive: true });
      }

      // 如果配置文件不存在，创建示例文件
      if (!fs.existsSync(configPath)) {
        const exampleConfig = `# 天津天气API配置文件
# 请填入您的实际API密钥

# API密钥 (必填)
API_KEY=YOUR_API_KEY_HERE

# NC格式数据端点
NC_ENDPOINT=https://api.tjweather.com/nc/beta

# JSON格式数据端点
JSON_ENDPOINT=https://api.tjweather.com/beta
`;
        fs.writeFileSync(configPath, exampleConfig, 'utf8');
        console.log(`已创建用户配置文件: ${configPath}`);
        console.log('请编辑此文件并填入您的API密钥');
      }
    } catch (error) {
      console.error(`创建用户配置文件失败: ${error}`);
    }
  }

  /**
   * 重新加载配置
   */
  public reload(): void {
    this.config = this.loadConfig();
  }
}
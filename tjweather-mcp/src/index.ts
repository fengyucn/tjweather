#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';
import dotenv from 'dotenv';

// 配置管理
class ConfigManager {
  private config: any = {};

  constructor() {
    this.loadConfig();
  }

  private loadConfig() {
    console.error('🔧 开始加载配置文件...');

    // 1. 用户配置目录
    const userConfigPath = path.join(os.homedir(), '.config', 'tjweather', '.env');
    if (fs.existsSync(userConfigPath)) {
      try {
        // 使用dotenv.parse直接解析，避免全局状态污染
        const userConfigContent = fs.readFileSync(userConfigPath, 'utf8');
        const userParsed = dotenv.parse(userConfigContent);
        Object.assign(this.config, userParsed);
        console.error(`✅ 已加载用户配置: ${userConfigPath}`);
        console.error(`   - API_KEY: ${userParsed.API_KEY ? '已设置' : '未设置'}`);
        console.error(`   - JSON_ENDPOINT: ${userParsed.JSON_ENDPOINT || '使用默认'}`);
      } catch (error) {
        console.error(`⚠️ 用户配置文件读取失败: ${userConfigPath}`, error);
      }
    } else {
      console.error(`ℹ️ 用户配置文件不存在: ${userConfigPath}`);
    }

    // 2. 当前目录 .env（覆盖用户配置）
    const localConfigPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(localConfigPath)) {
      try {
        // 使用dotenv.parse直接解析
        const localConfigContent = fs.readFileSync(localConfigPath, 'utf8');
        const localParsed = dotenv.parse(localConfigContent);
        Object.assign(this.config, localParsed);
        console.error(`✅ 已加载本地配置: ${localConfigPath}`);
        console.error(`   - API_KEY: ${localParsed.API_KEY ? '已覆盖' : '未设置'}`);
        console.error(`   - JSON_ENDPOINT: ${localParsed.JSON_ENDPOINT ? '已覆盖' : '使用用户配置'}`);
      } catch (error) {
        console.error(`⚠️ 本地配置文件读取失败: ${localConfigPath}`, error);
      }
    } else {
      console.error(`ℹ️ 本地配置文件不存在: ${localConfigPath}`);
    }

    // 3. 环境变量（最高优先级）
    const envApiKey = process.env.API_KEY;
    const envJsonEndpoint = process.env.JSON_ENDPOINT;
    const envNcEndpoint = process.env.NC_ENDPOINT;

    if (envApiKey) {
      this.config.API_KEY = envApiKey;
      console.error(`✅ 已从环境变量加载API_KEY`);
    }
    if (envJsonEndpoint) {
      this.config.JSON_ENDPOINT = envJsonEndpoint;
      console.error(`✅ 已从环境变量加载JSON_ENDPOINT`);
    }
    if (envNcEndpoint) {
      this.config.NC_ENDPOINT = envNcEndpoint;
      console.error(`✅ 已从环境变量加载NC_ENDPOINT`);
    }

    // 设置默认值
    if (!this.config.JSON_ENDPOINT) {
      this.config.JSON_ENDPOINT = 'https://api.tjweather.com/beta';
    }
    if (!this.config.NC_ENDPOINT) {
      this.config.NC_ENDPOINT = 'https://api.tjweather.com/nc/beta';
    }

    console.error(`📋 最终配置:`);
    console.error(`   - API_KEY: ${this.config.API_KEY ? '已设置' : '❌ 未设置'}`);
    console.error(`   - JSON_ENDPOINT: ${this.config.JSON_ENDPOINT}`);
    console.error(`   - NC_ENDPOINT: ${this.config.NC_ENDPOINT}`);
  }

  // 获取所有配置（用于调试）
  getAllConfig(): any {
    return { ...this.config };
  }

  // 获取配置加载路径（用于调试）
  getConfigPaths(): { user: string; local: string } {
    return {
      user: path.join(os.homedir(), '.config', 'tjweather', '.env'),
      local: path.join(process.cwd(), '.env')
    };
  }

  get(key: string): string {
    return this.config[key] || '';
  }

  validate(): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!this.config.API_KEY) errors.push('API_KEY 未配置');
    return { valid: errors.length === 0, errors };
  }
}

// 天气API客户端
class WeatherAPI {
  private config: ConfigManager;
  private client = axios.create({ timeout: 30000 });

  constructor() {
    this.config = new ConfigManager();
  }

  async queryWeather(params: any) {
    const validation = this.config.validate();
    if (!validation.valid) {
      throw new Error(`配置错误: ${validation.errors.join(', ')}`);
    }

    try {
      const response = await this.client.get(this.config.get('JSON_ENDPOINT'), {
        params: { key: this.config.get('API_KEY'), ...params }
      });
      return response.data;
    } catch (error: any) {
      if (error.response) return error.response.data;
      throw error;
    }
  }

  validateLocation(loc: string): boolean {
    const [lon, lat] = loc.split(',').map(parseFloat);
    return (
      !isNaN(lon) && !isNaN(lat) &&
      ((lon >= -180 && lon <= 180) || (lon >= 0 && lon <= 360)) &&
      (lat >= -90 && lat <= 90)
    );
  }

  validateFields(fields: string[]): { valid: boolean; invalid: string[] } {
    const validFields = [
      'u10m', 'v10m', 'ws10m', 'wd10m',
      'u100m', 'v100m', 'ws100m', 'wd100m',
      't2m', 'cldt', 'cldl', 'psz', 'rh2m',
      'tp', 'pres', 'prer', 'ssrd', 'slp',
      'u30m', 'v30m', 'ws30m', 'wd30m',
      'u50m', 'v50m', 'ws50m', 'wd50m',
      'u70m', 'v70m', 'ws70m', 'wd70m'
    ];
    const invalid = fields.filter(field => !validFields.includes(field));
    return { valid: invalid.length === 0, invalid };
  }
}

// 创建服务器
const server = new Server(
  {
    name: 'tjweather-mcp',
    version: '1.0.0',
  }
);

const weatherAPI = new WeatherAPI();

// 列出工具
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'weather_query',
        description: '查询天机气象预报数据',
        inputSchema: {
          type: 'object',
          properties: {
            location: {
              type: 'string',
              description: '经纬度坐标，格式: 经度,纬度 (如: 116.23128,40.22077)',
            },
            fields: {
              type: 'string',
              description: '气象要素，多个用逗号分隔。免费字段: t2m(温度°C), rh2m(湿度%), tp(降水mm/hr), ssrd(辐射W/m²), slp(气压mb), cldt(云量)。高级字段需订阅: ws100m(100米风速m/s)等',
              default: 't2m',
            },
            days: {
              type: 'number',
              description: '预报天数 (0-45)',
              default: 3,
            },
            hours: {
              type: 'number',
              description: '预报小时数',
              default: 0,
            },
            resolution: {
              type: 'string',
              description: '时间分辨率',
              enum: ['15min', '1h'],
              default: '1h',
            },
            timezone: {
              type: 'number',
              description: '时区 (-12 到 12)',
              default: 8,
            },
            grid: {
              type: 'string',
              description: '网格大小',
              enum: ['1', '3', '5', '7'],
              default: '1',
            },
          },
          required: ['location'],
        },
      },
      {
        name: 'weather_fields_info',
        description: '获取支持的气象要素信息',
        inputSchema: {
          type: 'object',
          properties: {
            region: {
              type: 'string',
              description: '区域类型',
              enum: ['global', 'china'],
              default: 'global',
            },
          },
        },
      },
    ],
  };
});

// 处理工具调用
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    if (name === 'weather_query') {
      // 验证坐标
      const argsTyped = args as any;
      if (!weatherAPI.validateLocation(argsTyped.location)) {
        throw new Error('坐标格式不正确，正确格式: 经度,纬度 (如: 116.23128,40.22077)');
      }

      // 验证字段
      const fields = (argsTyped.fields || 'ws100m').split(',');
      const fieldValidation = weatherAPI.validateFields(fields);
      if (!fieldValidation.valid) {
        throw new Error(`不支持的字段: ${fieldValidation.invalid.join(', ')}`);
      }

      // 构建查询参数
      const params = {
        loc: argsTyped.location,
        fields: fields.join(','),
        fcst_days: parseInt(argsTyped.days?.toString() || '3'),
        fcst_hours: parseInt(argsTyped.hours?.toString() || '0'),
        t_res: argsTyped.resolution || '1h',
        tz: parseInt(argsTyped.timezone?.toString() || '8'),
        grid: argsTyped.grid || '1',
      };

      const response = await weatherAPI.queryWeather(params);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(response, null, 2),
          },
        ],
      };
    }

    if (name === 'weather_fields_info') {
      const fields = {
        global: {
          // 基础免费字段 (已验证可用)
          't2m': { description: '2米气温', unit: '°C', maxDays: '10/15/30/45', subscription: 'free', status: 'available' },
          'rh2m': { description: '2米相对湿度', unit: '%', maxDays: '10/15/30/45', subscription: 'free', status: 'available' },
          'tp': { description: '降水量', unit: 'mm/hr', maxDays: '10/15/30/45', subscription: 'free', status: 'available' },

          // 基础字段 (需要订阅)
          'ssrd': { description: '总太阳辐射', unit: 'W/㎡', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'slp': { description: '海平面气压', unit: 'mb', maxDays: '10/15/30', subscription: 'premium', status: 'subscription_required' },
          'cldt': { description: '总云量', unit: '0-1', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },

          // 风速风向字段
          'ws10m': { description: '10米风速', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'available' },
          'wd10m': { description: '10米风向', unit: '度', maxDays: '10/15/30/45', subscription: 'premium', status: 'available' },
          'ws100m': { description: '100米风速', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'wd100m': { description: '100米风向', unit: '度', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },

          // 分量风场 (需要订阅)
          'u10m': { description: '10米纬向风', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'v10m': { description: '10米经向风', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'u100m': { description: '100米纬向风', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'v100m': { description: '100米经向风', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },

          // 其他字段
          'gust': { description: '阵风', unit: 'm/s', maxDays: '10', subscription: 'premium', status: 'not_supported' },
          'cldl': { description: '低云量', unit: '0-1', maxDays: '10/15/30/45', subscription: 'premium', status: 'unknown' },
          'psz': { description: '降水类型', unit: '-', maxDays: '10/15/30/45', subscription: 'premium', status: 'unknown' },
          'pres': { description: '气压', unit: 'mb', maxDays: '10/15/30/45', subscription: 'premium', status: 'unknown' },
          'prer': { description: '降水率', unit: 'mm/hr', maxDays: '10/15/30/45', subscription: 'premium', status: 'unknown' },
        },
        china: {
          // 中国区域专用字段 (需要订阅)
          'ws30m': { description: '30米风速', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'ws50m': { description: '50米风速', unit: 'm/s', maxDays: '10/15/30', subscription: 'premium', status: 'subscription_required' },
          'ws70m': { description: '70米风速', unit: 'm/s', maxDays: '10', subscription: 'premium', status: 'subscription_required' },
          'u30m': { description: '30米纬向风', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
          'v30m': { description: '30米经向风', unit: 'm/s', maxDays: '10/15/30/45', subscription: 'premium', status: 'subscription_required' },
        }
      };

      const argsTyped = args as any;
      const region = argsTyped?.region || 'global';
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify((fields as any)[region] || fields.global, null, 2),
          },
        ],
      };
    }

    throw new Error(`未知工具: ${name}`);
  } catch (error: any) {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({
            error: true,
            message: error.message,
          }, null, 2),
        },
      ],
      isError: true,
    };
  }
});

// 启动服务器
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('天机气象 MCP 服务器已启动');
}

if (require.main === module) {
  main().catch(console.error);
}
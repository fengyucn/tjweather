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
    // 1. 用户配置目录
    const userConfigPath = path.join(os.homedir(), '.config', 'tjweather', '.env');
    if (fs.existsSync(userConfigPath)) {
      const userConfig = dotenv.config({ path: userConfigPath });
      if (userConfig.parsed) Object.assign(this.config, userConfig.parsed);
    }

    // 2. 当前目录 .env
    const localConfigPath = path.join(process.cwd(), '.env');
    if (fs.existsSync(localConfigPath)) {
      const localConfig = dotenv.config({ path: localConfigPath });
      if (localConfig.parsed) Object.assign(this.config, localConfig.parsed);
    }

    // 3. 环境变量
    this.config.API_KEY = process.env.API_KEY || this.config.API_KEY;
    this.config.JSON_ENDPOINT = process.env.JSON_ENDPOINT || this.config.JSON_ENDPOINT || 'https://api.tjweather.com/beta';
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
              description: '气象要素，多个用逗号分隔 (如: ws100m,t2m,rh2m)。常用字段: ws100m(100米风速), t2m(2米温度), rh2m(2米湿度), tp(降水), ssrd(辐照度)',
              default: 'ws100m',
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
          'ws100m': { description: '100米风速', unit: 'm/s', maxDays: '10/15/30/45' },
          't2m': { description: '2米温度', unit: '°C', maxDays: '10/15/30/45' },
          'rh2m': { description: '2米相对湿度', unit: '%', maxDays: '10/15/30/45' },
          'tp': { description: '降水', unit: 'mm/hr', maxDays: '10/15/30/45' },
          'ssrd': { description: '辐照度', unit: 'W/㎡', maxDays: '10/15/30/45' },
          'slp': { description: '海平面气压', unit: 'mb', maxDays: '10/15/30' },
          'cldt': { description: '总云量', unit: '1', maxDays: '10/15/30/45' },
          'gust': { description: '阵风', unit: 'm/s', maxDays: '10' },
        },
        china: {
          'ws30m': { description: '30米风速', unit: 'm/s', maxDays: '10/15/30/45' },
          'ws50m': { description: '50米风速', unit: 'm/s', maxDays: '10/15/30' },
          'ws70m': { description: '70米风速', unit: 'm/s', maxDays: '10' },
          'u30m': { description: '30米纬向风', unit: 'm/s', maxDays: '10/15/30/45' },
          'v30m': { description: '30米经向风', unit: 'm/s', maxDays: '10/15/30/45' },
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
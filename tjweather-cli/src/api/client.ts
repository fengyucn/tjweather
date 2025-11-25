import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ConfigManager } from '../utils/config';
import { APIParams, WeatherResponse, WeatherFieldInfo } from '../types/weather';

export class WeatherAPIClient {
  private client: AxiosInstance;
  private config: ConfigManager;

  constructor() {
    this.config = ConfigManager.getInstance();
    const validation = this.config.validate();

    if (!validation.valid) {
      throw new Error(`配置错误: ${validation.errors.join(', ')}`);
    }

    this.client = axios.create({
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'tjweather-cli/1.0.0'
      }
    });
  }

  /**
   * 查询天气数据（JSON格式）
   */
  async queryWeather(params: Omit<APIParams, 'key'>): Promise<WeatherResponse> {
    try {
      const response: AxiosResponse<WeatherResponse> = await this.client.get(
        this.config.get('JSON_ENDPOINT'),
        {
          params: {
            key: this.config.get('API_KEY'),
            ...params
          }
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        return error.response.data;
      }
      throw error;
    }
  }

  /**
   * 下载NetCDF文件
   */
  async downloadNetCDF(params: Omit<APIParams, 'key'> & { download?: boolean; filename?: string }): Promise<Buffer> {
    try {
      const response = await this.client.get(
        this.config.get('NC_ENDPOINT'),
        {
          params: {
            key: this.config.get('API_KEY'),
            download: true,
            ...params
          },
          responseType: 'arraybuffer'
        }
      );
      return response.data;
    } catch (error: any) {
      if (error.response) {
        throw new Error(`NetCDF下载失败: ${error.response.data?.message || error.message}`);
      }
      throw error;
    }
  }

  /**
   * 验证坐标范围
   */
  validateLocation(loc: string): boolean {
    const [lon, lat] = loc.split(',').map(parseFloat);
    return (
      !isNaN(lon) && !isNaN(lat) &&
      ((lon >= -180 && lon <= 180) || (lon >= 0 && lon <= 360)) &&
      (lat >= -90 && lat <= 90)
    );
  }

  /**
   * 验证字段编码
   */
  validateFields(fields: string[]): { valid: boolean; invalid: string[] } {
    const validFields = this.getAllValidFields();
    const invalid = fields.filter(field => !validFields.includes(field));
    return { valid: invalid.length === 0, invalid };
  }

  /**
   * 获取所有有效的字段编码
   */
  getAllValidFields(): string[] {
    // 返回常用的气象字段编码
    return [
      // 全球字段
      'u10m', 'v10m', 'ws10m', 'wd10m',
      'u100m', 'v100m', 'ws100m', 'wd100m',
      't2m', 'cldt', 'cldl', 'psz', 'rh2m',
      'tp', 'pres', 'prer', 'ssrd',
      'slp', 'gust', 'cape',
      // 中国特有字段
      'u30m', 'v30m', 'ws30m', 'wd30m',
      'u50m', 'v50m', 'ws50m', 'wd50m',
      'u70m', 'v70m', 'ws70m', 'wd70m',
      'u100m', 'v100m', 'ws100m', 'wd100m'
    ];
  }
}
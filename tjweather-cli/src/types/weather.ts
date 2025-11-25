/**
 * 天气数据类型定义
 */

export interface WeatherField {
  [key: string]: string | number;
  time: string;
}

export interface WeatherResponse {
  code: number;
  message: string;
  data?: WeatherData | null;
}

export interface WeatherData {
  units: {
    [field: string]: string;
  };
  data: WeatherField[];
  time_init: string;
}

export interface APIParams {
  key: string;
  loc: string;
  t_res?: '15min' | '1h';
  fcst_days?: number;
  fcst_hours?: number;
  fields?: string;
  tz?: number;
  grid?: string;
}

export interface Location {
  longitude: number;
  latitude: number;
}

export interface WeatherFieldInfo {
  code: string;
  description: string;
  unit: string;
  maxDays: number;
  region?: 'global' | 'china';
}

export interface CLIOptions {
  location: string;
  fields?: string;
  days?: number;
  hours?: number;
  resolution?: '15min' | '1h';
  timezone?: number;
  grid?: string;
  format?: 'json' | 'table' | 'csv';
  output?: string;
  verbose?: boolean;
}

export interface ErrorResponse {
  code: number;
  message: string;
  data: null;
}
import Table from 'cli-table3';
import { WeatherData, WeatherResponse } from '../types/weather';
import chalk from 'chalk';

export function formatTable(data: WeatherData): string {
  const table = new Table({
    head: ['时间', ...Object.keys(data.units)].map(h => chalk.cyan(h)),
    colWidths: [20, ...Object.values(data.units).map(() => 12)]
  });

  data.data.forEach(row => {
    const values = Object.keys(data.units).map(field => {
      const value = row[field];
      if (typeof value === 'number') {
        return value.toFixed(2);
      }
      return value?.toString() || '-';
    });
    table.push([row.time, ...values]);
  });

  const header = chalk.yellow(`天气数据 (起报时间: ${data.time_init})`);
  const unitsInfo = chalk.gray(`单位: ${JSON.stringify(data.units, null, 2)}`);

  return `${header}\n${unitsInfo}\n${table.toString()}`;
}

export function formatJSON(response: WeatherResponse): string {
  return JSON.stringify(response, null, 2);
}

export function formatCSV(data: WeatherData): string {
  const headers = ['时间', ...Object.keys(data.units)];
  const rows = data.data.map(row => {
    return [row.time, ...Object.keys(data.units).map(field => {
      const value = row[field];
      return typeof value === 'number' ? value.toFixed(2) : (value?.toString() || '');
    })];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return `# 天气数据 (起报时间: ${data.time_init})\n# 单位: ${JSON.stringify(data.units)}\n${csvContent}`;
}
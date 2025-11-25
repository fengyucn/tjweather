#!/usr/bin/env node

import { Command } from 'commander';
import chalk from 'chalk';
import { ConfigManager } from './utils/config';
import { WeatherAPIClient } from './api/client';
import { formatTable, formatJSON, formatCSV } from './utils/formatter';

const program = new Command();

program
  .name('tjweather')
  .description('天机气象API命令行工具')
  .version('1.0.0');

// 全局选项
program
  .option('-v, --verbose', '详细输出')
  .option('-c, --config <path>', '指定配置文件路径')
  .option('--no-color', '禁用彩色输出');

// 查询子命令
program
  .command('query')
  .description('查询天气数据')
  .requiredOption('-l, --location <coordinates>', '经纬度坐标，格式: 经度,纬度 (如: 116.23128,40.22077)')
  .option('-f, --fields <fields>', '气象要素，多个用逗号分隔 (如: ws100m,t2m,rh2m)', 't2m')
  .option('-d, --days <days>', '预报天数', '3')
  .option('-h, --hours <hours>', '预报小时数', '0')
  .option('-r, --resolution <resolution>', '时间分辨率 (15min|1h)', '1h')
  .option('-t, --timezone <timezone>', '时区 (-12 到 12)', '8')
  .option('-g, --grid <grid>', '网格大小 (1|3|5|7)', '1')
  .option('--format <format>', '输出格式 (json|table|csv)', 'table')
  .option('-o, --output <file>', '输出文件路径')
  .action(async (options, command) => {
    try {
      const globalOptions = command.parent?.opts() || {};
      const verbose = globalOptions.verbose || options.verbose;

      const client = new WeatherAPIClient();

      // 验证坐标
      if (!client.validateLocation(options.location)) {
        console.error(chalk.red('错误: 坐标格式不正确'));
        console.error(chalk.yellow('正确格式: 经度,纬度 (如: 116.23128,40.22077)'));
        console.error(chalk.yellow('经度范围: [-180,180] 或 [0,360]'));
        console.error(chalk.yellow('纬度范围: [-90,90]'));
        process.exit(1);
      }

      // 验证字段
      const fields = options.fields?.split(',') || ['t2m'];
      const fieldValidation = client.validateFields(fields);
      if (!fieldValidation.valid) {
        console.error(chalk.red(`错误: 不支持的字段: ${fieldValidation.invalid.join(', ')}`));
        console.log(chalk.blue('支持的部分常用字段: ws100m, t2m, rh2m, tp, ssrd'));
        process.exit(1);
      }

      if (verbose) {
        console.log(chalk.blue('查询参数:'));
        console.log(`  位置: ${options.location}`);
        console.log(`  字段: ${fields.join(', ')}`);
        console.log(`  预报天数: ${options.days}`);
        console.log(`  预报小时: ${options.hours}`);
        console.log(`  时间分辨率: ${options.resolution}`);
        console.log(`  输出格式: ${options.format}`);
        console.log('');
      }

      // 构建查询参数
      const params = {
        loc: options.location,
        fields: fields.join(','),
        fcst_days: parseInt(options.days?.toString() || '3'),
        fcst_hours: parseInt(options.hours?.toString() || '0'),
        t_res: options.resolution as '15min' | '1h',
        tz: parseInt(options.timezone?.toString() || '8'),
        grid: options.grid || '1',
      };

      // 发送请求
      console.log(chalk.blue('正在查询天气数据...'));
      const response = await client.queryWeather(params);

      if (response.code !== 200) {
        console.error(chalk.red(`查询失败 (${response.code}): ${response.message}`));
        process.exit(1);
      }

      const data = response.data;
      if (!data || !data.data || data.data.length === 0) {
        console.log(chalk.yellow('没有找到数据'));
        process.exit(0);
      }

      // 格式化输出
      let output: string;
      switch (options.format) {
        case 'json':
          output = formatJSON(response);
          break;
        case 'csv':
          output = formatCSV(data);
          break;
        case 'table':
        default:
          output = formatTable(data);
          break;
      }

      // 输出结果
      if (options.output) {
        const fs = require('fs');
        fs.writeFileSync(options.output, output, 'utf8');
        console.log(chalk.green(`结果已保存到: ${options.output}`));
      } else {
        console.log(output);
      }

    } catch (error: any) {
      console.error(chalk.red(`错误: ${error.message}`));
      if (program.opts().verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

// 初始化配置子命令
program
  .command('init')
  .description('初始化配置文件')
  .option('-f, --force', '强制覆盖现有配置')
  .action((options) => {
    try {
      const verbose = program.opts().verbose;

      if (verbose) {
        console.log(chalk.blue('正在初始化配置文件...'));
      }

      ConfigManager.createUserConfig();
      console.log(chalk.green('✓ 配置文件初始化完成'));
      console.log(chalk.blue('请编辑 ~/.config/tjweather/.env 文件并填入您的API密钥'));

      if (verbose) {
        console.log(chalk.gray('配置文件位置: ~/.config/tjweather/.env'));
      }
    } catch (error: any) {
      console.error(chalk.red(`✗ 初始化失败: ${error.message}`));
      process.exit(1);
    }
  });

// 显示配置子命令
program
  .command('config')
  .description('显示当前配置')
  .option('-s, --show-secret', '显示敏感信息（API密钥）')
  .action((options) => {
    try {
      const verbose = program.opts().verbose;

      if (verbose) {
        console.log(chalk.blue('正在读取配置信息...'));
      }

      const config = ConfigManager.getInstance().getAll();
      const configManager = ConfigManager.getInstance();
      const validation = configManager.validate();

      console.log(chalk.blue('📍 当前配置:'));
      console.log(`  NC_ENDPOINT: ${config.NC_ENDPOINT}`);
      console.log(`  JSON_ENDPOINT: ${config.JSON_ENDPOINT}`);

      if (options.show_secret || options.showSecret) {
        console.log(`  API_KEY: ${config.API_KEY}`);
      } else {
        console.log(`  API_KEY: ${config.API_KEY ? '***已设置***' : '未设置'}`);
      }

      if (validation && !validation.valid) {
        console.log('');
        console.log(chalk.red('❌ 配置问题:'));
        validation.errors.forEach((error: string) => {
          console.log(chalk.red(`  - ${error}`));
        });
      } else {
        console.log('');
        console.log(chalk.green('✅ 配置验证通过'));
      }

      if (verbose) {
        console.log(chalk.gray('配置优先级: 当前目录.env → 用户配置目录 → 环境变量'));
      }
    } catch (error: any) {
      console.error(chalk.red(`错误: ${error.message}`));
      process.exit(1);
    }
  });

// NC格式下载子命令
program
  .command('download')
  .description('下载NetCDF格式气象数据')
  .requiredOption('-l, --location <coordinates>', '经纬度坐标，格式: 经度,纬度 (如: 116.23128,40.22077)')
  .option('-f, --fields <fields>', '气象要素，多个用逗号分隔 (如: ws100m,t2m,rh2m)', 't2m')
  .option('-d, --days <days>', '预报天数', '3')
  .option('-h, --hours <hours>', '预报小时数', '0')
  .option('-r, --resolution <resolution>', '时间分辨率 (15min|1h)', '1h')
  .option('-t, --timezone <timezone>', '时区 (-12 到 12)', '8')
  .option('-g, --grid <grid>', '网格大小 (1|3|5|7)', '1')
  .option('-o, --output <file>', '输出文件路径 (默认: 自动生成)')
  .option('--filename <filename>', '指定下载文件名')
  .action(async (options, command) => {
    try {
      const globalOptions = command.parent?.opts() || {};
      const verbose = globalOptions.verbose || options.verbose;

      const client = new WeatherAPIClient();

      // 验证坐标
      if (!client.validateLocation(options.location)) {
        console.error(chalk.red('错误: 坐标格式不正确'));
        console.error(chalk.yellow('正确格式: 经度,纬度 (如: 116.23128,40.22077)'));
        console.error(chalk.yellow('经度范围: [-180,180] 或 [0,360]'));
        console.error(chalk.yellow('纬度范围: [-90,90]'));
        process.exit(1);
      }

      // 验证字段
      const fields = options.fields?.split(',') || ['t2m'];
      const fieldValidation = client.validateFields(fields);
      if (!fieldValidation.valid) {
        console.error(chalk.red(`错误: 不支持的字段: ${fieldValidation.invalid.join(', ')}`));
        console.log(chalk.blue('支持的部分常用字段: ws100m, t2m, rh2m, tp, ssrd'));
        process.exit(1);
      }

      if (verbose) {
        console.log(chalk.blue('NetCDF下载参数:'));
        console.log(`  位置: ${options.location}`);
        console.log(`  字段: ${fields.join(', ')}`);
        console.log(`  预报天数: ${options.days}`);
        console.log(`  预报小时: ${options.hours}`);
        console.log(`  时间分辨率: ${options.resolution}`);
        console.log(`  网格大小: ${options.grid}`);
        console.log('');
      }

      // 构建查询参数
      const params = {
        loc: options.location,
        fields: fields.join(','),
        fcst_days: parseInt(options.days?.toString() || '3'),
        fcst_hours: parseInt(options.hours?.toString() || '0'),
        t_res: options.resolution as '15min' | '1h',
        tz: parseInt(options.timezone?.toString() || '8'),
        grid: options.grid || '1',
        download: true,
        filename: options.filename || undefined
      };

      // 生成默认文件名
      let outputFile = options.output;
      if (!outputFile) {
        const [lon, lat] = options.location.split(',');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        outputFile = `weather_${lon}_${lat}_d${options.days}_h${options.hours}_${timestamp}.nc`;
      }

      // 下载NC数据
      console.log(chalk.blue('正在下载NetCDF数据...'));
      const ncData = await client.downloadNetCDF(params);

      // 保存到文件
      const fs = require('fs');
      fs.writeFileSync(outputFile, ncData);

      const fileSize = (ncData.length / 1024 / 1024).toFixed(2);
      console.log(chalk.green(`✅ NetCDF文件下载完成: ${outputFile}`));
      console.log(chalk.blue(`文件大小: ${fileSize} MB`));

      if (verbose) {
        console.log(chalk.gray(`字段: ${fields.join(', ')}`));
        console.log(chalk.gray(`时间范围: ${params.fcst_days}天 ${params.fcst_hours}小时`));
        console.log(chalk.gray(`时间分辨率: ${params.t_res}`));
      }

    } catch (error: any) {
      console.error(chalk.red(`错误: ${error.message}`));
      if (program.opts().verbose) {
        console.error(error.stack);
      }
      process.exit(1);
    }
  });

// 版本信息子命令
program
  .command('version')
  .description('显示版本信息')
  .action(() => {
    console.log(chalk.blue('tjweather'));
    console.log(`版本: ${program.version()}`);
    console.log('描述: 天机气象API命令行工具');
    console.log('主页: https://github.com/fengyu/tjweather');
  });

// 错误处理
program.on('command:*', (operands) => {
  console.error(chalk.red(`错误: 未知命令 '${operands[0]}'`));
  console.log(chalk.blue('可用命令: init, config, query, download, version'));
  console.log(chalk.blue('使用 "tjweather --help" 查看完整帮助'));
  process.exit(1);
});

// 全局错误处理
process.on('uncaughtException', (error) => {
  console.error(chalk.red('未捕获的异常:'), error.message);
  process.exit(1);
});

process.on('unhandledRejection', (reason) => {
  console.error(chalk.red('未处理的Promise拒绝:'), reason);
  process.exit(1);
});

// 运行程序
program.parse();
import { Injectable } from '@nestjs/common';
import { parse } from 'dotenv';
import { readFileSync } from 'fs';

@Injectable()
export class ConfigService {
  private static _instance: ConfigService;

  private readonly env_config: { [key: string]: string | undefined };

  private constructor(file_path: string) {
    this.env_config = parse(readFileSync(file_path));
  }

  static getInstance() {
    if (ConfigService._instance == null) {
      if (process.env.NODE_ENV == null) {
        throw new Error(`env var NODE_ENV cannot be null.`);
      }
      ConfigService._instance = new ConfigService(
        `${process.env.NODE_ENV}.env`,
      );
    }
    return ConfigService._instance;
  }

  get(key: string): string {
    const val = this.env_config[key];
    if (val != null) {
      return val;
    } else if (process.env[key] != null) {
      this.env_config[key] = process.env[key];
      // TODO: figure out a better way to convince TS that this isn't nullable
      return this.env_config[key] as string;
    } else {
      throw new Error(`env var ${key} is undefined.`);
    }
  }
}

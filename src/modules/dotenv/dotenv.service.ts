import * as dotenv from 'dotenv';
import * as fs from 'fs';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DotenvService {
  private readonly envConfig: Record<string, string>;

  constructor(filePath: string) {
    this.envConfig = dotenv.parse(fs.readFileSync(filePath));
  }

  public get(key: string): string {
    return this.envConfig[key];
  }
}

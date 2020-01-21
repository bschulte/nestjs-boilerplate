import moment from 'moment';
import * as winston from 'winston';
import chalk from 'chalk';
import { Logger } from '@nestjs/common';

import { REQUEST_ID, SESSION_USER } from '../../shared/constants';
import { SessionMiddleware } from 'src/middleware/session.middleware';
import { User } from '../user/user.entity';

const customFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp(),
  winston.format.prettyPrint(),
  winston.format.printf(info => formatter(info)),
);

const formatter = info => {
  const requestId = SessionMiddleware.get(REQUEST_ID) || '-';
  const user: User = SessionMiddleware.get(SESSION_USER);
  const email = user ? user.email : '-';

  return `${moment(info.timestamp).format(
    'YYYY/MM/DD - hh:mm:ss.SSS A',
  )} ${chalk.magentaBright(requestId)} ${email} [${info.level}] [${chalk.green(
    info.context,
  )}] ${info.message}`;
};

export class BackendLogger extends Logger {
  public static winstonLogger = winston.createLogger({
    level: 'silly',
    format: customFormat,
    transports: [
      new winston.transports.File({
        filename: 'logs/server.tail.log',
        tailable: true,
        level: 'verbose',
        maxFiles: 2,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/serverAll.tail.log',
        tailable: true,
        level: 'silly',
        maxFiles: 2,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/server.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false,
        level: 'verbose',
        maxFiles: 30,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
      new winston.transports.File({
        filename: 'logs/serverAll.log',
        format: winston.format.combine(winston.format.uncolorize()),
        tailable: false,
        level: 'silly',
        maxFiles: 30,
        maxsize: 5 * 1024 * 1024, // 5 MB
      }),
    ],
  });

  private ctx: string;

  constructor(context: string) {
    super(context);

    this.ctx = context;
  }

  public silly(message: string) {
    this.winstonLog(message, 'silly');
    super.log(message);
  }

  public debug(message: string) {
    this.winstonLog(message, 'debug');
    super.log(message);
  }

  public log(message: string) {
    this.winstonLog(message, 'verbose');
    super.log(message);
  }

  public warn(message: string) {
    this.winstonLog(message, 'warn');
    super.warn(message);
  }

  public error(message: string, trace: string = '') {
    if (trace) {
      this.winstonLog(message, 'error', trace);
      super.error(message, trace);
    } else {
      this.winstonLog(message, 'error');
      super.error(message);
    }
  }

  private winstonLog(
    message: string,
    level: 'silly' | 'verbose' | 'debug' | 'warn' | 'error',
    trace?: string,
  ) {
    BackendLogger.winstonLogger.log({
      level,
      message,
      trace,
      context: this.ctx,
    });
  }
}

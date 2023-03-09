import dateFormat from 'util/date';
import winston from 'winston';

class LoggerService {
  logger: winston.Logger;

  route: string;

  constructor(route: string) {
    this.route = route;
    const logger = winston.createLogger({
      level: 'info',
      format: winston.format.printf((info) => {
        let message = `${dateFormat()} | ${info.level.toUpperCase()} | ${
          info.message
        } | `;
        message = info.obj
          ? message + `data ${JSON.stringify(info.obj)} | `
          : message;
        return message;
      }),
      transports: [
        new winston.transports.Console(),
        new winston.transports.File({
          filename: `${process.env.LOG_FILE_PATH} /${route}.log`,
        }),
      ],
    });
    this.logger = logger;
  }

  async info(message: string) {
    this.logger.log(`info`, message);
  }

  async infoObject(message: string, obj: unknown) {
    this.logger.log(`info`, message, { obj });
  }
}

export default LoggerService;

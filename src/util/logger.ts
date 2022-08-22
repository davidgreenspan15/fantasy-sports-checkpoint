import { createLogger, transports, format } from 'winston';

const logger = createLogger({
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    format.cli(),
    format.printf(
      info => `${info.level}: ${info.message.trim()} at ${info.timestamp} `
    )
  ),
  level: 'silly',
  transports: [new transports.Console()],
});

export default logger;

import logger from './logger';

import morgan from 'morgan';

logger.stream = {
  //@ts-ignore
  write: (message: string) =>
    logger.info(message.substring(0, message.lastIndexOf('\n'))),
};

export default morgan(
  ':method :url :status :response-time ms - :res[content-length]',
  { stream: logger.stream }
);

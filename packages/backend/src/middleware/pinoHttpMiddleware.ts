import pinoHttp from 'pino-http';
import logger from '../utils/logger';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { HttpStatusCode } from '../utils/httpErrors';

const SERVER_ERROR_MESSAGE = 'Request completed with server error status:';
const CLIENT_ERROR_MESSAGE = 'Request completed with client error status:';
const SUCCESS_MESSAGE = 'Request completed successfully with status:';

const pinoHttpMiddleware = pinoHttp({
  logger: logger,
  genReqId: (req: Request, res: Response) => {
    const requestId = (req.headers['x-request-id'] as string) || uuidv4();
    req.id = requestId;
    res.setHeader('X-Request-Id', requestId);
    return requestId;
  },
  customProps: (req: Request, res: Response) => ({
    ipAddress: req.ip,
    requestId: req.id,
  }),
  customSuccessMessage: (req: Request, res: Response) => {
    if (res.statusCode >= HttpStatusCode.BAD_REQUEST && res.statusCode < HttpStatusCode.INTERNAL_SERVER_ERROR) {
      return CLIENT_ERROR_MESSAGE + res.statusCode;
    }
    if (res.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR) {
      return SERVER_ERROR_MESSAGE + res.statusCode;
    }
    return SUCCESS_MESSAGE + res.statusCode;
  },
  customLogLevel: function (req: Request, res: Response, error?: Error) {
    if (res.statusCode >= HttpStatusCode.BAD_REQUEST && res.statusCode < HttpStatusCode.INTERNAL_SERVER_ERROR) {
      return 'warn';
    }
    if (res.statusCode >= HttpStatusCode.INTERNAL_SERVER_ERROR || error) {
      return 'error';
    }
    return 'info';
  },
  customReceivedMessage: function (req: Request, res: Response) {
    return `Received a ${req.method} request for ${req.url}`;
  },
});

export default pinoHttpMiddleware;
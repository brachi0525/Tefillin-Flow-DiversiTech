import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';
import { HttpStatusCode, errorMessages } from '../utils/httpErrors';
import { resolveErrorDetails } from '../utils/resolveStatusCode'; 
import { formatZodErrors } from '../utils/formatZodErrors';
import { ZodError } from 'zod';

const errorHandlerMiddleware = (err: any, req: Request, res: Response, next: NextFunction) => {
  const currentLogger = req.log || logger;

  const { statusCode, errorKey } = resolveErrorDetails(err); 
  const logLevel = statusCode >= 400 && statusCode < 500 ? 'warn' : 'error';
  const logMessagePrefix = HttpStatusCode[statusCode];

  let responseMessage =
    err.message && statusCode < 500
      ? `${logMessagePrefix}: ${err.message}`
      : errorMessages.INTERNAL_SERVER_ERROR;

  if (err instanceof ZodError) {
    responseMessage = formatZodErrors(err);
  }

  currentLogger[logLevel](
    {
      err,
      statusCode,
      errorKey,
      errorMessage: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    },
    `${logMessagePrefix} ${err.message || 'An unexpected error occurred'}`
  );

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    error: errorKey,
    message: responseMessage,
    requestId: req.id,
  });
};

export default errorHandlerMiddleware;

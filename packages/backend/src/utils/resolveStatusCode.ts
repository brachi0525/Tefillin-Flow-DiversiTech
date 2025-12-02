import { ZodError } from 'zod';
import { HttpStatusCode, errorMessages } from './httpErrors';

interface ErrorResolution {
  statusCode: HttpStatusCode;
  errorKey: errorMessages;
}

export const resolveErrorDetails = (err: any): ErrorResolution => {
  if (err.statusCode && Object.values(HttpStatusCode).includes(err.statusCode)) {
    return { statusCode: err.statusCode, errorKey: errorMessages.UNKNOWN_ERROR };
  }

  if (err instanceof ZodError) {
    return { statusCode: HttpStatusCode.BAD_REQUEST, errorKey: errorMessages.VALIDATION_FAILED };
  }

  if (typeof err.code === 'string') {
    switch (err.code) {
      case '23505':
        return { statusCode: HttpStatusCode.CONFLICT, errorKey: errorMessages.DUPLICATE_ENTRY };
      case 'PGRST204':
        return { statusCode: HttpStatusCode.NO_CONTENT, errorKey: errorMessages.UNKNOWN_ERROR };
    }

    if (err.code.startsWith('23')) {
      return { statusCode: HttpStatusCode.BAD_REQUEST, errorKey: errorMessages.DATABASE_ERROR };
    }

    if (err.code.startsWith('42')) {
      return { statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR, errorKey: errorMessages.DATABASE_ERROR };
    }
  }

  if (err.isAxiosError && err.response?.status) {
    return { statusCode: err.response.status, errorKey: errorMessages.THIRD_PARTY_SERVICE_FAILURE };
  }

  if (typeof err.message === 'string') {
    const msg = err.message.toLowerCase();

    const mappings: { substrings: string[]; result: ErrorResolution }[] = [
      { substrings: ['not found','does not exist'], result: { statusCode: HttpStatusCode.NOT_FOUND, errorKey: errorMessages.NOT_FOUND } },
      { substrings: ['already exists', 'duplicate'], result: { statusCode: HttpStatusCode.CONFLICT, errorKey: errorMessages.DUPLICATE_ENTRY } },
      { substrings: ['unauthorized'], result: { statusCode: HttpStatusCode.UNAUTHORIZED, errorKey: errorMessages.UNAUTHORIZED } },
      { substrings: ['forbidden'], result: { statusCode: HttpStatusCode.FORBIDDEN, errorKey: errorMessages.FORBIDDEN } },
      { substrings: ['timeout'], result: { statusCode: HttpStatusCode.GATEWAY_TIMEOUT, errorKey: errorMessages.SERVICE_UNAVAILABLE } },
      { substrings: ['service unavailable', 'failed to fetch'], result: { statusCode: HttpStatusCode.SERVICE_UNAVAILABLE, errorKey: errorMessages.SERVICE_UNAVAILABLE } },
      {
        substrings: ['required', 'invalid', 'bad request', 'validation error', 'syntax error', 'violates', 'constraint', 'cannot read', 'undefined','too large', 'unsupported file type'],
        result: { statusCode: HttpStatusCode.BAD_REQUEST, errorKey: errorMessages.VALIDATION_FAILED }
      },
    ];

    for (const { substrings, result } of mappings) {
      if (substrings.some((s) => msg.includes(s))) {
        return result;
      }
    }
  }

  return { statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR, errorKey: errorMessages.INTERNAL_SERVER_ERROR };
};

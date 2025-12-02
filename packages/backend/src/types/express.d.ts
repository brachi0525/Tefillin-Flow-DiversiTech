declare namespace Express {
  export interface Request {
    log: import('pino').Logger; 
    id: string; 
  }
}


import { Request, NextFunction, Response } from "express";

const rateLimitWindow = 1 * 60 * 1000;
const rateLimitMax = 10;
const tokens: { [key: string]: ClientToken } = {};

interface ClientToken {
  clientId: string;
  tokens: number;
  lastRefill: number;
}

export const rateLimiterMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const clientIdentifier: string | undefined = req.ip;
  const identifier = clientIdentifier as string;

  if (!tokens[identifier]) {
    tokens[identifier] = {
      clientId: identifier,
      tokens: rateLimitMax,
      lastRefill: Date.now(),
    };
  }

  const currentTimestamp = Date.now();
  const elapsedTime = currentTimestamp - tokens[identifier].lastRefill;
  const tokensToRefill = Math.floor(elapsedTime / rateLimitWindow);
  tokens[identifier].tokens = Math.min(
    tokens[identifier].tokens + tokensToRefill,
    rateLimitMax
  );
  tokens[identifier].lastRefill += tokensToRefill * rateLimitWindow;

  const remainingTokens = tokens[identifier].tokens;
  if (remainingTokens > 0) {
    tokens[identifier].tokens -= 1;
    next();
  } else {
    res.status(429).json({
      message: "Exceeded the rate limit. Please try again later.",
    });
  }
};

// rate limiter control of traffic flow to a service or server by restricting the number of requests that can be made within a certain time frame

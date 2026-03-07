export const authMiddleware = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const authToken = req.headers['authorization'];

  if (process.env.REQUIRE_AUTH === 'true') {
    if (!apiKey && !authToken) {
      return res.status(401).json({
        success: false,
        message: 'Authentication required',
      });
    }

    if (apiKey && apiKey === process.env.API_KEY) {
      return next();
    }

    if (authToken && authToken.startsWith('Bearer ')) {
      const token = authToken.substring(7);
      if (token === process.env.AUTH_TOKEN) {
        return next();
      }
    }

    return res.status(403).json({
      success: false,
      message: 'Invalid authentication credentials',
    });
  }

  next();
};

export const optionalAuth = (req, res, next) => {
  const apiKey = req.headers['x-api-key'];
  const authToken = req.headers['authorization'];

  if (apiKey) {
    req.authenticated = apiKey === process.env.API_KEY;
  } else if (authToken && authToken.startsWith('Bearer ')) {
    const token = authToken.substring(7);
    req.authenticated = token === process.env.AUTH_TOKEN;
  } else {
    req.authenticated = false;
  }

  next();
};

export const rateLimiter = (maxRequests = 100, windowMs = 60000) => {
  const requests = new Map();

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();

    if (!requests.has(key)) {
      requests.set(key, []);
    }

    const userRequests = requests.get(key);
    const recentRequests = userRequests.filter(time => now - time < windowMs);

    if (recentRequests.length >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests, please try again later',
      });
    }

    recentRequests.push(now);
    requests.set(key, recentRequests);

    next();
  };
};

/**
 * CORS Configuration
 * Securely configure Cross-Origin Resource Sharing
 */

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman)
    if (!origin) return callback(null, true);
    
    const allowedOrigins = [
      process.env.CLIENT_URL,
      'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174'
    ].filter(Boolean);

    const isAllowed = allowedOrigins.includes(origin) || 
                      origin.endsWith('.onrender.com') || 
                      // Allow same-origin requests (where origin matches current protocol + host)
                      (process.env.NODE_ENV === 'production' && origin.startsWith('https://'));

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

export default corsOptions;
// Standardized API response handler
export const successResponse = (res, data = null, message = 'Success', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString()
  });
};

export const errorResponse = (res, message = 'Internal Server Error', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    errors,
    timestamp: new Date().toISOString()
  });
};

export const paginatedResponse = (res, data, pagination, message = 'Success') => {
  return res.status(200).json({
    success: true,
    message,
    data,
    pagination: {
      currentPage: pagination.page,
      totalPages: Math.ceil(pagination.total / pagination.limit),
      totalItems: pagination.total,
      itemsPerPage: pagination.limit,
      hasNextPage: pagination.page < Math.ceil(pagination.total / pagination.limit),
      hasPrevPage: pagination.page > 1
    },
    timestamp: new Date().toISOString()
  });
};

// Global error handler middleware
export const globalErrorHandler = (err, req, res, next) => {
  console.error('Global Error:', err);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map(e => e.message);
    return errorResponse(res, 'Validation Error', 400, errors);
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return errorResponse(res, 'Invalid token', 401);
  }

  if (err.name === 'TokenExpiredError') {
    return errorResponse(res, 'Token expired', 401);
  }

  // MySQL errors
  if (err.code === 'ER_DUP_ENTRY') {
    return errorResponse(res, 'Data already exists', 409);
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return errorResponse(res, 'Referenced data not found', 400);
  }

  // Default error
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';
  
  return errorResponse(res, message, statusCode);
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
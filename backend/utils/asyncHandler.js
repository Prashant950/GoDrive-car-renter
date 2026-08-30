/**
 * Wraps async route handlers so thrown errors flow to the error middleware
 * without repetitive try/catch blocks.
 */
const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;

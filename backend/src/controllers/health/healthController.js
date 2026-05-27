/**
 * Health check endpoint to verify the API is running.
 * 
 * @param {Object} req - The Express request object.
 * @param {Object} res - The Express response object.
 */
export const healthCheck = (req, res) => {
  res.status(200).json({
    success: true,
    message: "Stock Trading Simulator API Running",
  });
};

export const isAdmin = async (req, res, next) => {
  try {
    if (req.user && req.user.role !== "admin") {
      return res.status(403).json({
        status: 403,
        message: "Un-Authorized Access",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in admin middleware...",
      success: false,
      error: error.stack,
    });
  }
};

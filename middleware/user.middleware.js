export const isUser = async (req, res, next) => {
  try {
    if (req.user && req.user.role !== "student") {
      return res.status(403).json({
        status: 403,
        message: "Un-Authorized Access only Students can login ",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in user middleware...",
      success: false,
      error: error.message,
    });
  }
};

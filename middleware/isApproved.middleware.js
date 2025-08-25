export const isApproved = (req, res, next) => {
  try {
    if (req.user.status !== "approved") {
      return res.status(403).json({
        status: 403,
        message: "Approval From Admin is Pending",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Is Approved middleware ",
      success: false,
      error: error.message,
    });
  }
};

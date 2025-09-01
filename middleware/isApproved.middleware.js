export const isApproved = async (req, res, next) => {
  try {
    if (req.user.status !== "approved") {
      return res.status(403).json({
        status: 403,
        message: "Approval From Admin is Pending",
        success: false,
      });
    }
    if (req.user.status === "rejected") {
      return res.status(409).json({
        status: 409,
        message: " Rejected bt the admin Try After 24 hours",
        success: false,
      });
    }
    next();
  } catch (error) {
    res.status(500).json({
      status: 500,
      message: "Error in Is Approved middleware ",
      success: false,
      error: error.stack,
    });
  }
};

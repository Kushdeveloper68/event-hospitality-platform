const AdminService = require("../services/adminServices");

const getAdminStats = async (req, res) => {
  try {
    const stats = await AdminService.getPlatformStats();
    return res.status(200).json({
      success: true,
      stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Error fetching admin stats: " + error.message,
    });
  }
};

module.exports = {
  getAdminStats,
};
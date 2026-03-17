const overviewServices = require("../services/overViewServices");

const handleGetOverview = async (req, res) => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      return res.status(400).json({ success: false, message: "eventId is required" });
    }

    const [metrics, recentActivity] = await Promise.all([
      overviewServices.getOverviewMetrics(eventId),
      overviewServices.getRecentActivity(eventId)
    ]);

    res.status(200).json({
      success: true,
      metrics,
      recentActivity
    });
  } catch (error) {
    console.error("Error fetching overview data:", error);
    res.status(500).json({ success: false, message: "Server Error", error: error.message });
  }
};

module.exports = {
  handleGetOverview
};

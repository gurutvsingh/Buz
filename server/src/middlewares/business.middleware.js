const db = require("../config/db");

const verifyBusinessOwnership =
async (req, res, next) => {

  try {

    const businessId =
      req.params.businessId ||
      req.body.business_id;

    if (!businessId) {
      return res.status(400).json({
        success: false,
        message:
          "Business ID is required",
      });
    }

    const [rows] =
      await db.execute(
        `
        SELECT *
        FROM businesses
        WHERE id = ?
        AND owner_id = ?
        `,
        [
          businessId,
          req.user.id,
        ]
      );

    if (rows.length === 0) {
      return res.status(403).json({
        success: false,
        message:
          "Access denied",
      });
    }

    req.business = rows[0];

    next();

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};

module.exports = {
  verifyBusinessOwnership,
};
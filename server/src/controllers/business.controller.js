const businessService = require(
  "../services/business.service"
);

const createBusiness = async (req, res) => {
  try {
    const result =
      await businessService.createBusiness({
        owner_id: req.user.id,
        name: req.body.name,
        business_type: req.body.business_type,
        description: req.body.description,
      });

    return res.status(201).json({
      success: true,
      message: "Business created successfully",
      businessId: result.insertId,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};
const getBusinesses = async (req, res) => {
  try {
    const businesses =
      await businessService.getBusinesses(
        req.user.id
      );

    return res.status(200).json({
      success: true,
      data: businesses,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
const getBusiness = async (
  req,
  res
) => {
  try {
    const business =
      await businessService.getBusiness(
        req.params.id,
        req.user.id
      );

    return res.json({
      success: true,
      data: business,
    });
  } catch (error) {
    return res.status(404).json({
      success: false,
      message: error.message,
    });
  }
};

const updateBusiness = async (
  req,
  res
) => {
  try {
    await businessService.updateBusiness(
      req.params.id,
      req.user.id,
      req.body
    );

    return res.json({
      success: true,
      message:
        "Business updated successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteBusiness = async (
  req,
  res
) => {
  try {
    await businessService.deleteBusiness(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message:
        "Business deleted successfully",
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createBusiness,
   getBusinesses,
   getBusiness,
  updateBusiness,
  deleteBusiness,
};
const businessRepository = require(
  "../repositories/business.repository"
);

const createBusiness = async (data) => {
  if (!data.name) {
    throw new Error("Business name is required");
  }

  return await businessRepository.createBusiness(data);
};
const getBusinesses = async (ownerId) => {
  return await businessRepository.getBusinessesByOwner(
    ownerId
  );
};
const getBusiness = async (
  id,
  ownerId
) => {
  const business =
    await businessRepository.getBusinessById(
      id,
      ownerId
    );

  if (!business) {
    throw new Error(
      "Business not found"
    );
  }

  return business;
};

const updateBusiness = async (
  id,
  ownerId,
  data
) => {
  return await businessRepository.updateBusiness(
    id,
    ownerId,
    data.name,
    data.business_type,
    data.description
  );
};

const deleteBusiness = async (
  id,
  ownerId
) => {
  return await businessRepository.deleteBusiness(
    id,
    ownerId
  );
};

module.exports = {
  createBusiness,
  getBusinesses,
  getBusiness,
  updateBusiness,
  deleteBusiness,
};
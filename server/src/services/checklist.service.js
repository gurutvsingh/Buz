const checklistRepository =
require(
 "../repositories/checklist.repository"
);

const createChecklist =
async (data) => {

  return await checklistRepository
    .createChecklist(
      data.business_id,
      data.title,
      data.description,
      data.frequency
    );
};

const getChecklists =
async (businessId) => {

  return await checklistRepository
    .getChecklists(
      businessId
    );
};

module.exports = {
  createChecklist,
  getChecklists,
};
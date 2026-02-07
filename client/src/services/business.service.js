import api from "./api";

export const getBusinesses = async () => {
  const response = await api.get(
    "/businesses"
  );

  return response.data;
};

export const createBusiness =
async (data) => {

  const response =
    await api.post(
      "/businesses",
      data
    );

  return response.data;
};
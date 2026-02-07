import api from "./api";

export const getDashboard = async (businessId) => {
  const response = await api.get(`/dashboard/${businessId}`);
  return response.data;
};

export const createIncome = async (data) => {
  const response = await api.post("/income", data);
  return response.data;
};

export const getIncome = async (businessId) => {
  const response = await api.get(`/income/${businessId}`);
  return response.data;
};

export const createExpense = async (data) => {
  const response = await api.post("/expenses", data);
  return response.data;
};

export const getExpenses = async (businessId) => {
  const response = await api.get(`/expenses/${businessId}`);
  return response.data;
};

export const createCustomer = async (data) => {
  const response = await api.post("/customers", data);
  return response.data;
};

export const createEmployee = async (data) => {
  const response = await api.post("/employees", data);
  return response.data;
};

export const getEmployees = async (businessId) => {
  const response = await api.get(`/employees/${businessId}`);
  return response.data;
};

export const updateEmployee = async (id, data) => {
  const response = await api.put(`/employees/${id}`, data);
  return response.data;
};

export const deleteEmployee = async (id, businessId) => {
  const response = await api.delete(`/employees/${id}`, {
    data: { business_id: businessId },
  });
  return response.data;
};

export const createReminder = async (data) => {
  const response = await api.post("/reminders", data);
  return response.data;
};

export const getReminders = async (businessId) => {
  const response = await api.get(`/reminders/${businessId}`);
  return response.data;
};

export const updateReminder = async (id, data) => {
  const response = await api.put(`/reminders/${id}`, data);
  return response.data;
};

export const updateReminderStatus = async (id, businessId, status) => {
  const response = await api.patch(`/reminders/${id}/status`, {
    business_id: businessId,
    status,
  });
  return response.data;
};

export const deleteReminder = async (id, businessId) => {
  const response = await api.delete(`/reminders/${id}`, {
    data: { business_id: businessId },
  });
  return response.data;
};

export const createChecklist = async (data) => {
  const response = await api.post("/checklists", data);
  return response.data;
};

export const getChecklists = async (businessId) => {
  const response = await api.get(`/checklists/${businessId}`);
  return response.data;
};

export const createBill = async (data) => {
  const response = await api.post("/bills", data);
  return response.data;
};

export const getBills = async (businessId) => {
  const response = await api.get(`/bills/${businessId}`);
  return response.data;
};

export const getBill = async (businessId, id) => {
  const response = await api.get(`/bills/${businessId}/${id}`);
  return response.data;
};

export const updateBill = async (id, data) => {
  const response = await api.put(`/bills/${id}`, data);
  return response.data;
};

export const deleteBill = async (id, businessId) => {
  const response = await api.delete(`/bills/${id}`, {
    data: { business_id: businessId },
  });
  return response.data;
};
export const getCustomers =
async (businessId) => {

  const response =
    await api.get(
      `/customers/${businessId}`
    );

  return response.data;

};

export const getCustomer =
async (customerId) => {

  const response =
    await api.get(
      `/customers/single/${customerId}`
    );

  return response.data;

};

export const updateCustomer =
async (
  customerId,
  data
) => {

  const response =
    await api.put(
      `/customers/${customerId}`,
      data
    );

  return response.data;

};

export const deleteCustomer =
async (customerId) => {

  const response =
    await api.delete(
      `/customers/${customerId}`
    );

  return response.data;

};

export const getRealAnalytics = async (businessId) => {
  const response = await api.get(`/analytics/${businessId}`);
  return response.data;
};

export const getKhataSummary = async (businessId) => {
  const response = await api.get(`/khata/business/${businessId}`);
  return response.data;
};

export const createLedgerEntry = async (data) => {
  const response = await api.post("/khata", data);
  return response.data;
};

export const updateLedgerEntry = async (id, data) => {
  const response = await api.put(`/khata/${id}`, data);
  return response.data;
};

export const deleteLedgerEntry = async (id, businessId) => {
  const response = await api.delete(`/khata/${id}`, {
    data: { business_id: businessId },
  });
  return response.data;
};

export const getMyNotifications = async () => {
  const response = await api.get("/notifications/me");
  return response.data;
};

export const markNotificationRead = async (id) => {
  const response = await api.patch(`/notifications/${id}/read`);
  return response.data;
};

export const markAllNotificationsRead = async () => {
  const response = await api.patch("/notifications/read-all");
  return response.data;
};

export const deleteNotification = async (id) => {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
};

export const getInvoicePdfData = async (billId) => {
  const response = await api.get(`/invoices/${billId}/pdf-data`);
  return response.data;
};

export const getInventoryItems = async (businessId) => {
  const response = await api.get(`/inventory/${businessId}`);
  return response.data;
};

export const createInventoryItem = async (data) => {
  const response = await api.post("/inventory", data);
  return response.data;
};

export const updateInventoryItem = async (id, data) => {
  const response = await api.put(`/inventory/${id}`, data);
  return response.data;
};

export const deleteInventoryItem = async (id, businessId) => {
  const response = await api.delete(`/inventory/${id}`, {
    data: { business_id: businessId },
  });
  return response.data;
};

export const askAiAssistant = async (
  businessId,
  question
) => {
  const response = await api.post(
    `/ai-assistant/${businessId}/ask`,
    {
      question,
    }
  );

  return response.data;
};
export const getInventoryForBilling =
async (businessId) => {

  const response =
    await api.get(
      `/bills/${businessId}/inventory`
    );

  return response.data;
};
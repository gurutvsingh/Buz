import { createContext, useCallback, useEffect, useMemo, useState } from "react";
import { getBusinesses } from "../services/business.service";

export const BusinessContext = createContext();

export const BusinessProvider = ({ children }) => {
  const [businesses, setBusinesses] = useState([]);
  const [currentBusiness, setCurrentBusiness] = useState(null);
  const [loadingBusinesses, setLoadingBusinesses] = useState(false);

  const loadBusinesses = useCallback(async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      setBusinesses([]);
      setCurrentBusiness(null);
      return;
    }

    setLoadingBusinesses(true);

    try {
      const response = await getBusinesses();
      const nextBusinesses = response.data || [];
      const savedId = localStorage.getItem("currentBusinessId");
      const savedBusiness = nextBusinesses.find(
        (business) => String(business.id) === String(savedId)
      );

      setBusinesses(nextBusinesses);
      setCurrentBusiness(savedBusiness || nextBusinesses[0] || null);
    } catch {
      setBusinesses([]);
      setCurrentBusiness(null);
    } finally {
      setLoadingBusinesses(false);
    }
  }, []);

  const selectBusiness = useCallback((businessId) => {
    const business = businesses.find(
      (item) => String(item.id) === String(businessId)
    );

    if (business) {
      localStorage.setItem("currentBusinessId", business.id);
      setCurrentBusiness(business);
    }
  }, [businesses]);

  useEffect(() => {
    loadBusinesses();
  }, [loadBusinesses]);

  const value = useMemo(
    () => ({
      businesses,
      currentBusiness,
      loadingBusinesses,
      loadBusinesses,
      selectBusiness,
    }),
    [businesses, currentBusiness, loadingBusinesses, loadBusinesses, selectBusiness]
  );

  return (
    <BusinessContext.Provider value={value}>
      {children}
    </BusinessContext.Provider>
  );
};

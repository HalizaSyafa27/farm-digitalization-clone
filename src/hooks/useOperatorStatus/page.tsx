import { useState, useEffect } from "react";
import Cookies from "js-cookie";

interface OperatorStatus {
  isOperator: boolean;
  assignedFarm: string | null;
}

const useOperatorStatus = () => {
  const [operatorStatus, setOperatorStatus] = useState<OperatorStatus>({
    isOperator: false,
    assignedFarm: null,
  });

  useEffect(() => {
    const isOperator = Cookies.get("isOperator") === "true";
    const assignedFarm = Cookies.get("assignedFarm") || null;

    setOperatorStatus({
      isOperator,
      assignedFarm,
    });
  }, []);

  const updateOperatorStatus = (status: OperatorStatus) => {
    setOperatorStatus(status);
    Cookies.set("isOperator", String(status.isOperator));
    Cookies.set("assignedFarm", status.assignedFarm || "");
  };

  return {
    operatorStatus,
    updateOperatorStatus,
  };
};

export default useOperatorStatus;

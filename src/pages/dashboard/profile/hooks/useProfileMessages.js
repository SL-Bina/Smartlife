import { useState } from "react";

export function useProfileMessages() {
  const [successMessage, setSuccessMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const clearMessages = () => {
    setSuccessMessage(null);
    setErrorMessage(null);
  };

  const showSuccess = (msg, ms = 3000) => {
    setSuccessMessage(msg);
    setTimeout(() => setSuccessMessage(null), ms);
  };

  const showError = (msg, ms = 5000) => {
    setErrorMessage(msg);
    setTimeout(() => setErrorMessage(null), ms);
  };

  return {
    successMessage,
    errorMessage,
    clearMessages,
    showSuccess,
    showError,
    setSuccessMessage,
    setErrorMessage,
  };
}

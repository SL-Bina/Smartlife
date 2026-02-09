// SignIn.jsx (və ya pages/SignIn.jsx - hansı qovluqdadırsa)
import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  IconButton,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useTranslation } from "react-i18next";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

import LoginSplitQuoteImage02 from "../new-login/LoginSplitQuoteImage02";

import ReactCountryFlag from "react-country-flag";

const languages = [
  {
    code: "az",
    label: "Azərbaycan dili",
    flag: <ReactCountryFlag countryCode="AZ" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
  {
    code: "en",
    label: "English",
    flag: <ReactCountryFlag countryCode="GB" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
  {
    code: "ru",
    label: "Русский",
    flag: <ReactCountryFlag countryCode="RU" svg style={{ width: "1.5em", height: "1.5em" }} />
  },
];

export function SignIn() {
  const { login, loading, user, isAuthenticated, isInitialized } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isInitialized && isAuthenticated && user) {
      const userRole = user?.role?.name?.toLowerCase();
      if (userRole === "resident") {
        navigate("/dashboard/resident/home", { replace: true });
      } else {
        navigate("/dashboard/home", { replace: true });
      }
    }
  }, [isInitialized, isAuthenticated, user, navigate]);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!identifier.trim()) {
      setError(t("auth.signIn.identifierRequired") || "Email, Username, Phone və ya Name daxil edin");
      return;
    }

    if (!password.trim()) {
      setError(t("auth.signIn.passwordRequired") || "Şifrə daxil edin");
      return;
    }

    const result = await login(identifier.trim(), password);
    if (!result.success) {
      setError(result.message || t("auth.signIn.invalidCredentialsError"));
      return;
    }

    const userRole = result.user?.role?.name?.toLowerCase();
    if (userRole === "resident") {
      navigate("/dashboard/resident/home");
    } else {
      navigate("/dashboard/home");
    }
  };

  if (!isInitialized) {
    return (
      <section className="h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">{t("auth.signIn.loading") || "Yüklənir..."}</p>
        </div>
      </section>
    );
  }

  return (
    <LoginSplitQuoteImage02 />
  );
}

export default SignIn;

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
    <section className="h-full flex gap-4 relative px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-6 overflow-hidden">
      <div 
        className="absolute inset-0 lg:hidden bg-cover bg-center opacity-40 dark:opacity-25 -z-10"
        style={{ backgroundImage: "url('/img/pattern.png')" }}
      ></div>

      <div className="absolute left-1/2 -translate-x-1/2 top-6 sm:top-8 lg:hidden z-20">
        <Link to="/">
          <img
            src="/Vector_Logo/color_logo.svg"
            alt="SmartLife Logo"
            className="w-24 h-24 sm:w-28 sm:h-28 object-contain"
          />
        </Link>
      </div>

      <div className="absolute right-4 sm:right-6 lg:right-8 top-4 sm:top-6 lg:top-6 z-10">
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button variant="text" className="flex items-center gap-1 px-2 normal-case bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
              {languages.map((lng) =>
                lng.code === i18n.language ? (
                  <span key={lng.code} className="flex items-center gap-1">
                    <span>{lng.flag}</span>
                    <span className="hidden sm:inline-block text-xs font-medium">
                      {lng.label}
                    </span>
                  </span>
                ) : null
              )}
            </Button>
          </MenuHandler>
          <MenuList className="min-w-[160px]">
            {languages.map((lng) => (
              <MenuItem key={lng.code} onClick={() => changeLanguage(lng.code)}>
                <span className="mr-2">{lng.flag}</span>
                <span>{lng.label}</span>
              </MenuItem>
            ))}
          </MenuList>
        </Menu>
      </div>

      <div className="w-full lg:w-3/5 flex flex-col justify-center items-center lg:items-start mt-32 sm:mt-36 lg:mt-0 relative z-10">
        <div className="w-full max-w-md mx-auto lg:mx-0 " style={{margin: "0 auto"}}>
          <div className="lg:flex mb-6 hidden justify-center items-center" style={{margin: "0 auto"}}>
            <Link to="/" className="flex items-center" style={{margin: "0 auto"}}>
              <img
                src="/Vector_Logo/color_logo.svg"
                alt="SmartLife Logo"
                className="w-28 h-28 object-contain"
              />
            </Link>
          </div>

          <div className="text-center lg:text-left mb-4 lg:mb-6">
            <Typography variant="h2" className="font-bold text-xl sm:text-2xl lg:text-3xl text-center">
              {t("auth.signIn.title")}
            </Typography>
            {/* <Typography
              variant="paragraph"
              color="blue-gray"
              className="text-lg font-normal"
            >
              {t("auth.signIn.subtitle")}
            </Typography> */}
          </div>
          <form className="mt-6 mb-2 w-full" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              {t("auth.signIn.identifierLabel") || "Email, Username, Phone və ya Name"}
            </Typography>
            <Input
              type="text"
              size="lg"
              placeholder={t("auth.signIn.identifierPlaceholder") || "Email, Username, Phone və ya Name daxil edin"}
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              className=" !border-t-red-500 !border-red-500 focus:!border-red-600"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              {t("auth.signIn.passwordLabel")}
            </Typography>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                size="lg"
                placeholder="********"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className=" !border-t-red-500 !border-red-500 focus:!border-red-600 pr-12"
                labelProps={{
                  className: "before:content-none after:content-none",
                }}
              />
              <IconButton
                variant="text"
                size="sm"
                className="!absolute right-1 top-1/2 -translate-y-1/2 rounded-full hover:bg-blue-gray-50 dark:hover:bg-gray-700"
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 text-blue-gray-500 dark:text-gray-400" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-blue-gray-500 dark:text-gray-400" />
                )}
              </IconButton>
            </div>
          </div>
          {error && (
            <Typography variant="small" color="red" className="mt-2 font-medium">
              {error}
            </Typography>
          )}
          {/* <Checkbox
            label={
              <Typography
                variant="small"
                color="gray"
                className="flex items-center justify-start font-medium"
              >
                I agree the&nbsp;
                <a
                  href="#"
                  className="font-normal text-black transition-colors hover:text-gray-900 underline"
                >
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          /> */}
          <Button 
            type="submit" 
            className="mt-6" 
            fullWidth
            disabled={loading}
          >
            {loading ? t("auth.signIn.loading") || "Yüklənir..." : t("auth.signIn.submit")}
          </Button>
        </form>
        </div>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>

    </section>
  );
}

export default SignIn;

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
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/auth-context";
import { useTranslation } from "react-i18next";
import { demoUsers } from "@/auth-users";

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
  const { login } = useAuth();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("admin123");
  const [error, setError] = useState(null);

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const ok = login(username, password);
    if (!ok) {
      setError(t("auth.signIn.invalidCredentialsError"));
      return;
    }

    const foundUser = demoUsers.find(
      (u) => u.username === username && u.password === password
    );
    if (foundUser && foundUser.role === "resident") {
      navigate("/dashboard/resident/home");
    } else {
      navigate("/dashboard/home");
    }
  };

  return (
    <section className="h-full flex gap-4 relative px-8 py-6">
      <div className="absolute right-8 top-6 z-10">
        <Menu placement="bottom-end">
          <MenuHandler>
            <Button variant="text" className="flex items-center gap-1 px-2 normal-case bg-gray-100 hover:bg-gray-200">
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
      <div className="w-full lg:w-3/5 flex flex-col justify-center">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">
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
        <form className="mt-6 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleSubmit}>
          <div className="mb-1 flex flex-col gap-6">
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              {t("auth.signIn.usernameLabel")}
            </Typography>
            <Input
              size="lg"
              placeholder="admin"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
            <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
              {t("auth.signIn.passwordLabel")}
            </Typography>
            <Input
              type="password"
              size="lg"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
              labelProps={{
                className: "before:content-none after:content-none",
              }}
            />
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
          <Button type="submit" className="mt-6" fullWidth>
            {t("auth.signIn.submit")}
          </Button>

          <div className="mt-4">
            <Typography variant="small" className="text-blue-gray-700 font-medium dark:text-gray-300">
              {t("auth.signIn.demoUsersTitle")}
            </Typography>
            <div className="mt-2 space-y-2">
              {demoUsers
                .filter((user) => user.role !== "resident")
                .map((demoUser) => (
                  <div key={demoUser.id} className="text-xs text-blue-gray-600 dark:text-gray-400">
                    <span className="font-semibold capitalize">{demoUser.role}:</span> {demoUser.username} / {demoUser.password}
                  </div>
                ))}
              <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
                <Typography variant="small" className="text-blue-gray-700 font-semibold dark:text-gray-300 mb-1">
                  Sakin hesabları:
                </Typography>
                {demoUsers
                  .filter((user) => user.role === "resident")
                  .map((demoUser) => (
                    <div key={demoUser.id} className="text-xs text-blue-gray-600 dark:text-gray-400">
                      <span className="font-semibold">{demoUser.fullName}:</span> {demoUser.username} / {demoUser.password}
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </form>

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

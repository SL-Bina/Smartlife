import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Chip,
  Avatar,
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  ChevronRightIcon,
  UserCircleIcon,
  HomeIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

export function ProfileSidebar({ user }) {
  const { t } = useTranslation();

  const fullName = user?.name && user?.surname 
    ? `${user.name} ${user.surname}` 
    : user?.name || user?.surname || "Resident";

  return (
    <div className="space-y-3 flex flex-col min-h-0">
      {/* Top profile card */}
      <Card className="border border-blue-600 dark:border-gray-700 shadow-lg dark:bg-gray-800 overflow-hidden flex-1 min-h-0 flex flex-col">
        <div className="relative bg-gradient-to-br from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-4 flex-1 min-h-0">
          <div className="absolute inset-0 opacity-20">
            <img
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&q=80"
              alt="Complex"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.style.display = "none";
              }}
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90 dark:from-blue-700/90 dark:to-blue-900/90" />

          <div className="relative flex flex-col items-center justify-center z-10 h-full">
            <div className="relative mb-2">
              {user?.profile_photo ? (
                <Avatar
                  src={user.profile_photo}
                  alt={fullName}
                  size="lg"
                  className="border-3 border-white dark:border-gray-700 shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center text-blue-600 dark:text-blue-400 text-2xl font-bold border-3 border-white dark:border-gray-700 shadow-lg">
                  {user?.name?.charAt(0) || user?.surname?.charAt(0) || "R"}
                </div>
              )}
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 dark:bg-green-400 rounded-full border-2 border-white dark:border-gray-800 shadow-md"></div>
            </div>

            <Typography variant="h6" className="text-white font-bold mb-0 text-center text-sm">
              {fullName}
            </Typography>

            <Typography variant="small" className="text-blue-100 dark:text-blue-200 text-center text-xs mt-0.5">
              {user?.email || "N/A"}
            </Typography>

            <Chip
              value="RESIDENT"
              size="sm"
              className="mt-1 bg-white/20 text-white border border-white/30 text-xs"
              icon={<UserCircleIcon className="h-2.5 w-2.5" />}
            />
          </div>
        </div>
      </Card>

      {/* Contact Info */}
      <Card className="border border-blue-600 dark:border-gray-700 shadow-sm dark:bg-gray-800 flex-1 min-h-0 flex flex-col">
        <CardBody className="p-3 dark:bg-gray-800 flex-1 flex flex-col min-h-0">
          <Typography variant="h6" className="mb-2 font-bold text-blue-gray-900 dark:text-white text-xs flex-shrink-0">
            {t("profile.contactInfo") || "ƏLAQƏ MƏLUMATLARI"}
          </Typography>

          <div className="space-y-1.5 flex-1 flex flex-col justify-center">
            {/* Email */}
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
              <CardBody className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-lg group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 transition-colors">
                    <EnvelopeIcon className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                      {t("profile.email") || "E-poçt"}
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs truncate">
                      {user?.email || "N/A"}
                    </Typography>
                  </div>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-blue-gray-400 dark:text-gray-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-shrink-0" />
              </CardBody>
            </Card>

            {/* Phone */}
            <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
              <CardBody className="p-2.5 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="p-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg group-hover:bg-green-100 dark:group-hover:bg-green-900/30 transition-colors">
                    <PhoneIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                      {t("profile.phone") || "Telefon"}
                    </Typography>
                    <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs truncate">
                      {user?.phone || "N/A"}
                    </Typography>
                  </div>
                </div>
                <ChevronRightIcon className="h-4 w-4 text-blue-gray-400 dark:text-gray-500 group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors flex-shrink-0" />
              </CardBody>
            </Card>

            {/* Properties Count */}
            {user?.properties && user.properties.length > 0 && (
              <Card className="border border-gray-200 dark:border-gray-700 shadow-sm bg-white dark:bg-gray-800 hover:shadow-lg hover:scale-[1.01] transition-all duration-200 cursor-pointer group">
                <CardBody className="p-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 bg-purple-50 dark:bg-purple-900/20 rounded-lg group-hover:bg-purple-100 dark:group-hover:bg-purple-900/30 transition-colors">
                      <HomeIcon className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <Typography variant="small" className="text-blue-gray-600 dark:text-gray-400 text-xs mb-0.5 font-semibold">
                        {t("profile.properties") || "Mənzillər"}
                      </Typography>
                      <Typography variant="small" className="text-blue-gray-900 dark:text-white font-medium text-xs truncate">
                        {user.properties.length} {t("profile.property") || "mənzil"}
                      </Typography>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-4 w-4 text-blue-gray-400 dark:text-gray-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors flex-shrink-0" />
                </CardBody>
              </Card>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  );
}


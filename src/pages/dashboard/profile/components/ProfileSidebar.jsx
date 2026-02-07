import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Avatar,
  Chip
} from "@material-tailwind/react";
import {
  EnvelopeIcon,
  PhoneIcon,
  UserCircleIcon
} from "@heroicons/react/24/outline";

export function ProfileSidebar({ user }) {
  // İstifadəçi adı yoxdursa default bir ad göstərək
  const displayName = user?.name || user?.fullName || "İstifadəçi";

  return (
    <Card className="border border-red-600/20 dark:border-gray-700 shadow-sm dark:bg-gray-800">
      <CardBody className="flex flex-col items-center p-6">
        {/* Profil Şəkli */}
        <div className="relative mb-4">
          <Avatar
            src={user?.profile_photo || "https://docs.material-tailwind.com/img/face-2.jpg"}
            alt="User Avatar"
            size="xl"
            className="border-2 border-red-500 p-0.5"
          />
          <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
        </div>

        {/* Ad və Rol */}
        <Typography variant="h5" color="blue-gray" className="dark:text-white font-bold text-center">
          {displayName}
        </Typography>
        <Chip
          value={user?.role?.name || user?.role || "USER"}
          size="sm"
          className="mt-2 bg-red-500/10 text-red-600 font-bold border border-red-500/20"
        />

        {/* Əlaqə Məlumatları Siyahısı */}
        <div className="w-full mt-8 space-y-4">
          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-blue-50 dark:bg-blue-500/10 rounded-lg">
              <EnvelopeIcon className="h-5 w-5 text-blue-500" />
            </div>
            <div className="flex flex-col overflow-hidden">
              <Typography className="text-[10px] uppercase font-bold text-gray-400">Email</Typography>
              <Typography className="text-sm font-medium dark:text-gray-200 truncate">
                {user?.email || "Email qeyd olunmayıb"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-green-50 dark:bg-green-500/10 rounded-lg">
              <PhoneIcon className="h-5 w-5 text-green-500" />
            </div>
            <div className="flex flex-col">
              <Typography className="text-[10px] uppercase font-bold text-gray-400">Telefon</Typography>
              <Typography className="text-sm font-medium dark:text-gray-200">
                {user?.phone || "Telefon yoxdur"}
              </Typography>
            </div>
          </div>

          <div className="flex items-center gap-4 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
            <div className="p-2 bg-purple-50 dark:bg-purple-500/10 rounded-lg">
              <UserCircleIcon className="h-5 w-5 text-purple-500" />
            </div>
            <div className="flex flex-col">
              <Typography className="text-[10px] uppercase font-bold text-gray-400">İstifadəçi Adı</Typography>
              <Typography className="text-sm font-medium dark:text-gray-200">
                @{user?.username || "istifadeci"}
              </Typography>
            </div>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
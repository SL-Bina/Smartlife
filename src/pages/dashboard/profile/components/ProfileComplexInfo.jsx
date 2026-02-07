import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { BuildingOfficeIcon, UserGroupIcon } from "@heroicons/react/24/outline";

export function ProfileComplexInfo({ user }) {

  const getComplexName = () => {
    if (!user?.email) return "Məlumat yoxdur";
    const parts = user.email.split("@")[0].split(".");
    return parts.length > 1 ? parts.join(" ").toUpperCase() : "SmartLife";
  };

  return (
    <Card className="border border-red-600/20 dark:border-gray-700 shadow-sm dark:bg-gray-800 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <Typography variant="small" className="font-bold text-blue-gray-900 dark:text-white uppercase">
          Kompleks Məlumatı
        </Typography>
      </div>
      <CardBody className="p-4 flex items-center gap-4">
        <div className="p-3 bg-red-50 dark:bg-red-500/10 rounded-full">
          <BuildingOfficeIcon className="h-6 w-6 text-red-600" />
        </div>
        <div>
          <Typography className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
            Yaşayış Kompleksi
          </Typography>
          <Typography variant="h6" className="text-blue-gray-900 dark:text-white leading-tight">
            {getComplexName()}
          </Typography>
          <div className="flex items-center gap-1 mt-1">
            <UserGroupIcon className="h-3 w-3 text-green-500" />
            <Typography className="text-[11px] text-green-600 font-medium">Aktiv Sakin</Typography>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}
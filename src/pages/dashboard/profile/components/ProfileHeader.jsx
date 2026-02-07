import React from "react";
import { Typography, Button } from "@material-tailwind/react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

export function ProfileHeader() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-100 dark:border-gray-700 shadow-sm">
      <div>
        <Typography variant="h4" className="text-blue-gray-900 dark:text-white font-black">
          Profil Ayarları
        </Typography>
        <Typography variant="small" className="text-gray-500 font-medium">
          Şəxsi məlumatlarınızı və təhlükəsizlik tənzimləmələrinizi buradan idarə edin.
        </Typography>
      </div>

      <Button
        variant="outlined"
        size="sm"
        color="blue-gray"
        className="flex items-center gap-2 border-gray-300 dark:border-gray-600 dark:text-gray-300"
        onClick={() => navigate(-1)}
      >
        <ArrowLeftIcon className="h-4 w-4" /> Geri qayıt
      </Button>
    </div>
  );
}
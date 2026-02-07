import React from "react";
import { Card, CardBody, Typography } from "@material-tailwind/react";
import { CalendarIcon, MapPinIcon, IdentificationIcon } from "@heroicons/react/24/outline";

export function ProfileAdditionalInfo({ user }) {
  // Tarixi formatlayaq (məs: 21 Avqust 1995)
  const formatDate = (dateString) => {
    if (!dateString) return "Qeyd olunmayıb";
    const date = new Date(dateString);
    return date.toLocaleDateString("az-AZ", { day: 'numeric', month: 'long', year: 'numeric' });
  };

  const infoItems = [
    {
      label: "Doğum Tarixi",
      value: formatDate(user?.birthday),
      icon: CalendarIcon,
      color: "text-orange-500"
    },
    {
      label: "Ünvan",
      value: user?.address || "Ünvan qeyd olunmayıb",
      icon: MapPinIcon,
      color: "text-red-500"
    },
    {
      label: "Şəxsi Kod (FIN)",
      value: user?.personal_code || "—",
      icon: IdentificationIcon,
      color: "text-blue-500"
    }
  ];

  return (
    <Card className="border border-red-600/20 dark:border-gray-700 shadow-sm dark:bg-gray-800 overflow-hidden">
      <div className="bg-gray-50 dark:bg-gray-700/30 px-4 py-3 border-b border-gray-100 dark:border-gray-700">
        <Typography variant="small" className="font-bold text-blue-gray-900 dark:text-white uppercase">
          Əlavə Məlumatlar
        </Typography>
      </div>
      <CardBody className="p-4 space-y-4">
        {infoItems.map((item, idx) => (
          <div key={idx} className="flex items-start gap-3">
            <item.icon className={'h-5 w-5 mt-0.5 ${item.color}'} />
            <div>
              <Typography className="text-[10px] uppercase font-bold text-gray-400 leading-none mb-1">
                {item.label}
              </Typography>
              <Typography className="text-sm font-medium dark:text-gray-200">
                {item.value}
              </Typography>
            </div>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
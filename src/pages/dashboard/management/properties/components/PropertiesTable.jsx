import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";
import { useNavigate } from "react-router-dom";
import {
  EyeIcon,
  PencilIcon,
  TrashIcon,
  CurrencyDollarIcon,
} from "@heroicons/react/24/outline";

export function PropertiesTable({
  properties = [],
  onView,
  onEdit,
  onDelete,
  loading = false,
}) {
  const navigate = useNavigate();
  const { state, actions } = useManagement();

  const openFeePage = (apartment) => {
    navigate(`/dashboard/management/service-fee/${apartment.id}`);
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800">
      <CardBody className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1200px] table-auto">
            <thead>
              <tr className="bg-blue-gray-50 dark:bg-gray-900/40">
                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Ad
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Mərtəbə
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Blok
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Sahə
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Status
                  </Typography>
                </th>

                <th className="p-4 text-right">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Əməliyyat
                  </Typography>
                </th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td className="p-6" colSpan={6}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Yüklənir...</Typography>
                  </td>
                </tr>
              ) : properties.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={6}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Heç nə tapılmadı</Typography>
                  </td>
                </tr>
              ) : (
                properties.map((x) => {
                  const isSelected = String(state.propertyId || "") === String(x.id);

                  return (
                    <tr
                      key={x.id}
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer ${
                        isSelected ? "bg-blue-50/60 dark:bg-gray-700/40" : ""
                      }`}
                      onClick={() => actions.setProperty(x.id, x)}
                      title="Mənzil seç (scope)"
                    >
                      <td className="p-4">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name || "—"}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 dark:text-gray-400">ID: {x.id}</Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x.meta?.floor || x.floor || "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x.blockName || x.block?.name || "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x.meta?.area || x.area ? `${x.meta?.area || x.area} m²` : "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            x.status === "active"
                              ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                          }`}
                        >
                          {x.status === "active" ? "Aktiv" : "Qeyri-aktiv"}
                        </span>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button
                            size="sm"
                            variant="text"
                            color="blue"
                            onClick={() => onView?.(x)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20"
                          >
                            <EyeIcon className="h-4 w-4" /> Bax
                          </Button>
                          <Button
                            size="sm"
                            variant="text"
                            color="amber"
                            onClick={() => onEdit?.(x)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-900/20"
                          >
                            <PencilIcon className="h-4 w-4" /> Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="gradient"
                            color="red"
                            onClick={() => onDelete?.(x)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-red-500 to-red-600 text-white shadow-md hover:shadow-lg hover:from-red-600 hover:to-red-700"
                          >
                            <TrashIcon className="h-4 w-4" /> Sil
                          </Button>

                          <Button
                            size="sm"
                            variant="gradient"
                            color="green"
                            onClick={() => openFeePage(x)}
                            className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md hover:shadow-lg hover:from-green-600 hover:to-green-700"
                          >
                            <CurrencyDollarIcon className="h-4 w-4" /> Ödəniş
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

import React from "react";
import { Card, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
import { useManagement } from "@/context/ManagementContext";

export function ComplexTable({ items = [], loading, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
  const { state, actions } = useManagement();

  const buildingCountOf = (x) => (Array.isArray(x?.buildings) ? x.buildings.length : 0);
  
  const goBuildings = (complex) => {
    const mtkId = complex?.bind_mtk?.id || complex?.mtk_id || null;

    // 1) əvvəlcə scope-ları set elə
    actions.setMtk(mtkId, complex?.bind_mtk || null);
    actions.setComplex(complex.id, complex);

    // 2) sonra navigate elə
    navigate("/dashboard/management/buildings");
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800">
      <CardBody className="p-0">
        <div className="w-full overflow-x-auto">
          <table className="w-full min-w-[1400px] table-auto">
            <thead>
              <tr className="bg-blue-gray-50 dark:bg-gray-900/40">
                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Ad
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    MTK
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Ünvan
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Status
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Bina sayı
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
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={6}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Heç nə tapılmadı</Typography>
                  </td>
                </tr>
              ) : (
                items.map((x) => {
                  const isSelected = String(state.complexId || "") === String(x.id);

                  return (
                    <tr
                      key={x.id}
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer ${
                        isSelected ? "bg-blue-50/60 dark:bg-gray-700/40" : ""
                      }`}
                      onClick={() => actions.setComplex(x.id, x)}
                      title="Kompleks seç (scope)"
                    >
                      <td className="p-4">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 dark:text-gray-400">ID: {x.id}</Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.bind_mtk?.name || (x?.mtk_id ? `#${x.mtk_id}` : "—")}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.meta?.address || "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Chip
                          value={x.status || "—"}
                          size="sm"
                          color={x.status === "active" ? "green" : "blue-gray"}
                          className="w-fit"
                        />
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {buildingCountOf(x)}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <Button size="sm" variant="outlined" onClick={() => onView?.(x)}>
                            Bax
                          </Button>
                          <Button size="sm" variant="outlined" onClick={() => onEdit?.(x)}>
                            Edit
                          </Button>
                          <Button size="sm" color="red" onClick={() => onDelete?.(x)}>
                            Sil
                          </Button>

                          <Button size="sm" color="blue" onClick={() => goBuildings(x)}>
                            Binalara keç
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

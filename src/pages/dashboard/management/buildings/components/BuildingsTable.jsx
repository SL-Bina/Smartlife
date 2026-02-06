import React from "react";
import { Card, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";
import { useNavigate } from "react-router-dom";

export function BuildingsTable({ items = [], loading, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
  const { state, actions } = useManagement();

  const goBlocks = (building) => {
    const mtkId = state.mtkId || building?.complex?.bind_mtk?.id || building?.complex?.mtk_id || null;
    const complexId = state.complexId || building?.complex?.id || null;

    actions.setMtk(mtkId, null);
    actions.setComplex(complexId, building?.complex || null);
    actions.setBuilding(building.id, building); // ⚠️ context-də olmalıdır

    navigate("/dashboard/management/blocks", {
      state: { mtkId, complexId, buildingId: building.id },
    });
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
                    Kompleks
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Status
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Desc
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
                  <td className="p-6" colSpan={5}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Yüklənir...</Typography>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={5}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Heç nə tapılmadı</Typography>
                  </td>
                </tr>
              ) : (
                items.map((x) => {
                  const isSelected = String(state.buildingId || "") === String(x.id);

                  return (
                    <tr
                      key={x.id}
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer ${
                        isSelected ? "bg-blue-50/60 dark:bg-gray-700/40" : ""
                      }`}
                      onClick={() => actions.setBuilding(x.id, x)}
                      title="Bina seç (scope)"
                    >
                      <td className="p-4">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 dark:text-gray-400">ID: {x.id}</Typography>
                      </td>

                    <td className="p-4">
                      <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                        {x?.complex?.name || "—"}
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
                        {x?.meta?.desc || "—"}
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

                          <Button size="sm" color="blue" onClick={() => goBlocks(x)}>
                            Bloklara keç
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

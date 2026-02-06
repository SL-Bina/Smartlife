import React from "react";
import { Card, CardBody, Typography, Button } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";
import { useNavigate } from "react-router-dom";

export function BlocksTable({ items = [], loading, onEdit, onDelete, onView }) {
  const navigate = useNavigate();
  const { state, actions } = useManagement();

  const goProperties = (block) => {
    const mtkId = state.mtkId || block?.building?.complex?.bind_mtk?.id || block?.building?.complex?.mtk_id || null;
    const complexId = state.complexId || block?.building?.complex?.id || block?.complex?.id || null;
    const buildingId = state.buildingId || block?.building?.id || block?.building_id || null;

    actions.setMtk(mtkId, null);
    actions.setComplex(complexId, block?.complex || block?.building?.complex || null);
    actions.setBuilding(buildingId, block?.building || null);
    actions.setBlock(block.id, block);

    navigate("/dashboard/management/properties", {
      state: { mtkId, complexId, buildingId, blockId: block.id },
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
                    Bina
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Mərtəbə
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Mənzil
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
                  const isSelected = String(state.blockId || "") === String(x.id);

                  return (
                    <tr
                      key={x.id}
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer ${
                        isSelected ? "bg-blue-50/60 dark:bg-gray-700/40" : ""
                      }`}
                      onClick={() => actions.setBlock(x.id, x)}
                      title="Blok seç (scope)"
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
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.building?.name || "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.meta?.total_floor || "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                          {x?.meta?.total_apartment || "—"}
                        </Typography>
                      </td>

                      <td className="p-4">
                        <div className="flex justify-end gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onView?.(x)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/30 rounded-lg border border-blue-200 dark:border-blue-800 transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Bax
                          </button>
                          <button
                            onClick={() => onEdit?.(x)}
                            className="px-3 py-1.5 text-xs font-medium text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg border border-amber-200 dark:border-amber-800 transition-colors flex items-center gap-1.5"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete?.(x)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Sil
                          </button>
                          <button
                            onClick={() => goProperties(x)}
                            className="px-3 py-1.5 text-xs font-medium text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                            Mənzillərə keç
                          </button>
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

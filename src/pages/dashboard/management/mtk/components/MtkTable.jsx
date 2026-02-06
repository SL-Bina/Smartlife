import React from "react";
import { Card, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { useManagement } from "@/context/ManagementContext";

export function MtkTable({ items = [], loading, onEdit, onDelete, onView, onGoComplex }) {
  const { state, actions } = useManagement();

  const complexCountOf = (x) => {
    const v = x?.complex_count;
    if (v === 0) return 0;
    return v || "—";
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
                    Email
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Telefon
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Kompleks sayı
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Rəng
                  </Typography>
                </th>

                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    Web sayt
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
                  <td className="p-6" colSpan={9}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Yüklənir...</Typography>
                  </td>
                </tr>
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={9}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Heç nə tapılmadı</Typography>
                  </td>
                </tr>
              ) : (
                items.map((x) => {
                  const isSelected = String(state.mtkId || "") === String(x.id);

                  return (
                    <tr
                      key={x.id}
                      className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer ${
                        isSelected ? "bg-blue-50/60 dark:bg-gray-700/40" : ""
                      }`}
                      onClick={() => actions.setMtk(x.id, x)}
                      title="MTK seç (scope)"
                    >
                      <td className="p-4">
                        <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                          {x.name}
                        </Typography>
                        <Typography className="text-xs text-blue-gray-500 dark:text-gray-400">ID: {x.id}</Typography>
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
                        {x?.meta?.email || "—"}
                      </Typography>
                    </td>

                    <td className="p-4">
                      <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                        {x?.meta?.phone || "—"}
                      </Typography>
                    </td>

                    <td className="p-4">
                      <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                        {complexCountOf(x)}
                      </Typography>
                    </td>

                    <td className="p-4">
                      {x?.meta?.color_code ? (
                        <div className="flex items-center gap-2">
                          <span
                            className="h-4 w-4 rounded-full border border-blue-gray-100 dark:border-gray-700"
                            style={{ backgroundColor: x.meta.color_code }}
                            title={x.meta.color_code}
                          />
                          <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                            {x.meta.color_code}
                          </Typography>
                        </div>
                      ) : (
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">—</Typography>
                      )}
                    </td>

                    <td className="p-4">
                      {x?.meta?.website ? (
                        <a
                          href={x.meta.website}
                          target="_blank"
                          rel="noreferrer"
                          className="text-sm text-blue-600 dark:text-blue-400 underline"
                        >
                          {x.meta.website}
                        </a>
                      ) : (
                        <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">—</Typography>
                      )}
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
                        <Button
                          size="sm"
                          color="blue"
                          onClick={() => {
                            actions.setMtk(x.id, x);
                            onGoComplex?.();
                          }}
                        >
                          Complex-ə keç
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

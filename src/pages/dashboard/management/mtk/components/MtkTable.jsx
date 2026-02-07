import React from "react";
import { Card, CardBody, Typography, Chip, IconButton, Menu, MenuHandler, MenuList, MenuItem } from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useManagement } from "@/context/ManagementContext";
import { MtkTableSkeleton } from "./MtkTableSkeleton";

export function MtkTable({ items = [], loading, onEdit, onDelete, onView, onGoComplex }) {
  const { state, actions } = useManagement();

  const complexCountOf = (x) => {
    const v = x?.complex_count;
    if (v === 0) return 0;
    return v || "—";
  };

  return (
    <Card className="shadow-sm dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
        <CardBody className="p-0">
          <div className="w-full overflow-x-auto">
            <table className="w-full min-w-[1400px] table-auto">
            <thead>
              <tr className="bg-blue-gray-50 dark:bg-gray-900/40">
                <th className="p-4 text-left">
                  <Typography className="text-xs font-semibold uppercase text-blue-gray-600 dark:text-gray-300">
                    ID
                  </Typography>
                </th>
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
                <MtkTableSkeleton rows={10} />
              ) : items.length === 0 ? (
                <tr>
                  <td className="p-6" colSpan={9}>
                    <Typography className="text-sm text-blue-gray-500 dark:text-gray-300 text-center">
                      Heç nə tapılmadı
                    </Typography>
                  </td>
                </tr>
              ) : (
                <>
                  {items.map((x) => {
                    const isSelected = String(state.mtkId || "") === String(x.id);

                    return (
                      <tr
                        key={x.id}
                        className={`border-b border-blue-gray-50 dark:border-gray-700 cursor-pointer transition-colors hover:bg-blue-gray-50/50 dark:hover:bg-gray-700/30 ${
                          isSelected ? "bg-blue-50/60 dark:bg-gray-700/40" : ""
                        }`}
                        onClick={() => actions.setMtk(x.id, x)}
                        title="MTK seç (scope)"
                      >

                        <td className="p-4">
                          <Typography className="text-base text-blue-gray-500 font-bold dark:text-gray-400">{x.id}</Typography>
                        </td>

                        <td className="p-4">
                          <Typography className="text-sm font-medium text-blue-gray-800 dark:text-white">
                            {x.name}
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
                            {x?.meta?.email || "—"}
                          </Typography>
                        </td>

                        <td className="p-4">
                          <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">
                            {x?.meta?.phone || "—"}
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
                              className="text-sm text-blue-600 dark:text-blue-400 underline hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              {x.meta.website}
                            </a>
                          ) : (
                            <Typography className="text-sm text-blue-gray-700 dark:text-gray-200">—</Typography>
                          )}
                        </td>

                        <td className="p-4">
                          <div className="flex justify-end items-center gap-2" onClick={(e) => e.stopPropagation()}>
                          <button
                              onClick={(e) => {
                                e.stopPropagation();
                                actions.setMtk(x.id, x);
                                onGoComplex?.();
                              }}
                              className="px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-md transition-colors"
                            >
                              Complex-ə keç
                            </button>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton
                                  size="sm"
                                  variant="text"
                                  color="blue-gray"
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  <EllipsisVerticalIcon strokeWidth={2} className="h-5 w-5" />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="dark:bg-gray-800 dark:border-gray-800">
                                <MenuItem
                                  onClick={() => onView?.(x)}
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Bax
                                </MenuItem>
                                <MenuItem
                                  onClick={() => onEdit?.(x)}
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Düzəliş et
                                </MenuItem>
                                <MenuItem
                                  onClick={() => onDelete?.(x)}
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  Sil
                                </MenuItem>
                              </MenuList>
                            </Menu>
                            
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </>
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
  );
}

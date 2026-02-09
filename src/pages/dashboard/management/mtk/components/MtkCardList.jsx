import React from "react";
import { Card, CardBody, Typography, Chip, Button } from "@material-tailwind/react";
import { useManagementEnhanced } from "@/context";

export function MtkCardList({ items = [], loading, onEdit, onDelete, onView, onGoComplex }) {
  const { actions } = useManagementEnhanced();

  if (loading) {
    return <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Yüklənir...</Typography>;
  }

  if (!items.length) {
    return <Typography className="text-sm text-blue-gray-500 dark:text-gray-300">Heç nə tapılmadı</Typography>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
      {items.map((x) => (
        <Card key={x.id} className="dark:bg-gray-800 shadow-sm">
          <CardBody className="flex flex-col gap-3">
            <div className="flex items-start justify-between gap-2">
              <div>
                <Typography className="text-base font-semibold dark:text-white">{x.name}</Typography>
                <Typography className="text-xs text-blue-gray-400 dark:text-gray-400">ID: {x.id}</Typography>
              </div>
              <Chip value={x.status || "—"} size="sm" color={x.status === "active" ? "green" : "blue-gray"} />
            </div>

            <div className="text-sm text-blue-gray-600 dark:text-gray-300">
              Ünvan: <b>{x?.meta?.address || "—"}</b>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
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
                  onGoComplex?.(x);
                }}
              >
                Complex-ə keç
              </Button>
            </div>
          </CardBody>
        </Card>
      ))}
    </div>
  );
}

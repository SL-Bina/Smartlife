import React from "react";
import { Card, Typography, Button } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export default function RoleInfoBar({ selectedRole, saving, onSavePermissions }) {
  const { t } = useTranslation();
  const id = selectedRole?.role_id ?? selectedRole?.id;
  const name = selectedRole?.role_name ?? selectedRole?.name;

  return (
    <Card className="p-4 dark:bg-gray-900 border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="min-w-0">
          <Typography variant="h6" className="font-bold dark:text-white truncate">
            {name ? name : (t("permissions.selectRole") || "Rol seçin")}
          </Typography>
          <Typography variant="small" className="text-gray-600 dark:text-gray-400">
            {id ? `ID: ${id}` : (t("permissions.selectRoleHint") || "İcazələri görmək üçün soldan rol seçin")}
          </Typography>
        </div>

        <Button
          disabled={!id || saving}
          onClick={onSavePermissions}
          className="bg-green-600 hover:bg-green-700"
          size="sm"
        >
          {saving ? (t("buttons.saving") || "Yadda saxlanır...") : (t("permissions.savePermissions") || "İcazələri yadda saxla")}
        </Button>
      </div>
    </Card>
  );
}

import React from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography } from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

export function ExpensesFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
  const { t } = useTranslation();

  if (!open) return null;

  return (
    <Dialog open={open} handler={onClose} size="sm" className="dark:bg-gray-800 border border-red-600 dark:border-gray-700" dismiss={{ enabled: false }}>
      <DialogHeader className="dark:text-white">{title}</DialogHeader>
      <DialogBody divider className="space-y-4 dark:bg-gray-800">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.category")}
          </Typography>
          <Input
            label={t("expenses.form.enter")}
            value={formData.category}
            onChange={(e) => onFieldChange("category", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.description")}
          </Typography>
          <Input
            label={t("expenses.form.enter")}
            value={formData.description}
            onChange={(e) => onFieldChange("description", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.amount")}
          </Typography>
          <Input
            type="number"
            label={t("expenses.form.enter")}
            value={formData.amount}
            onChange={(e) => onFieldChange("amount", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.paymentMethod")}
          </Typography>
          <Input
            label={t("expenses.form.enter")}
            value={formData.paymentMethod}
            onChange={(e) => onFieldChange("paymentMethod", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.paymentDate")}
          </Typography>
          <Input
            type="date"
            label={t("expenses.form.enter")}
            value={formData.paymentDate}
            onChange={(e) => onFieldChange("paymentDate", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.paidBy")}
          </Typography>
          <Input
            label={t("expenses.form.enter")}
            value={formData.paidBy}
            onChange={(e) => onFieldChange("paidBy", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
        <div>
          <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
            {t("expenses.form.invoiceNumber")}
          </Typography>
          <Input
            label={t("expenses.form.enter")}
            value={formData.invoiceNumber}
            onChange={(e) => onFieldChange("invoiceNumber", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
          />
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel")}
        </Button>
        <Button
          color={isEdit ? "blue" : "green"}
          onClick={onSave}
          className={isEdit ? "dark:bg-blue-600 dark:hover:bg-blue-700" : "dark:bg-green-600 dark:hover:bg-green-700"}
        >
          {t("buttons.save")}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}


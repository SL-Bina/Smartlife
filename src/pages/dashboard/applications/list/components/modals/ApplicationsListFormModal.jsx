import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Input, Typography, Select, Option, Textarea, Card, CardBody } from "@material-tailwind/react";
import { XMarkIcon, ClockIcon, BuildingOfficeIcon, CalendarIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock priorities - real API hazır olduqda değiştirilecek
const mockPriorities = [
  { value: "Orta", label: "Orta" },
  { value: "Yüksək", label: "Yüksək" },
  { value: "Tecili", label: "Tecili" },
  { value: "Aşağı", label: "Aşağı" },
  { value: "5 deqiqelik", label: "5 deqiqelik" },
];

// Mock departments - real API hazır olduqda değiştirilecek
const mockDepartments = [
  { value: "Təmizlik", label: "Təmizlik" },
  { value: "Santexnika", label: "Santexnika" },
  { value: "Elektrik", label: "Elektrik" },
  { value: "Təmir", label: "Təmir" },
];

// Mock categories - real API hazır olduqda değiştirilecek
const mockCategories = [
  { value: "ELEKTRİK SİSTEMİ", label: "ELEKTRİK SİSTEMİ" },
  { value: "İŞÇİLİK", label: "İŞÇİLİK" },
  { value: "Təmizlik", label: "Təmizlik" },
];

export function ApplicationsListFormModal({ open, onClose, title, formData, onFieldChange, onSave, isEdit = false }) {
  const { t } = useTranslation();
  const [selectedFile, setSelectedFile] = useState(null);

  if (!open) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      onFieldChange("file", file);
    }
  };

  return (
    <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
      <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
        <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
          {title}
        </Typography>
        <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
          <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
        </div>
      </DialogHeader>
      <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[80vh] overflow-y-auto">
        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.newApplicationModal.selectPriority") || "Prioritet seçin"} <span className="text-red-500">*</span>
          </Typography>
          <Select
            label={t("applications.list.newApplicationModal.selectPriority") || "Prioritet seçin"}
            value={formData.priority || ""}
            onChange={(val) => onFieldChange("priority", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.selectPriority") || "Prioritet seçin"}
            </Option>
            {mockPriorities.map((priority) => (
              <Option key={priority.value} value={priority.value} className="dark:text-gray-300">
                {priority.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <CalendarIcon className="h-5 w-5 text-blue-500" />
            <Typography variant="small" color="blue-gray" className="font-semibold dark:text-gray-300">
              {t("applications.list.newApplicationModal.startAndEndTimes") || "Başlama və bitmə vaxtları"}
            </Typography>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Card className="border border-green-200 dark:border-green-700 dark:bg-gray-700">
              <CardBody className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-semibold dark:text-white">
                      {t("applications.list.newApplicationModal.startTime") || "Başlama vaxtı"}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      {t("applications.list.newApplicationModal.taskStartDateTime") || "Task-in başlama tarixi və saatı"}
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    placeholder={t("applications.list.newApplicationModal.selectStartTime") || "Başlama vaxtını seçin"}
                    value={formData.startTime || ""}
                    onChange={(e) => onFieldChange("startTime", e.target.value)}
                    className="dark:text-white flex-1"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "!min-w-0 flex-1" }}
                  />
                  <CalendarIcon className="h-5 w-5 text-green-600 dark:text-green-400 mt-2" />
                </div>
              </CardBody>
            </Card>
            <Card className="border border-pink-200 dark:border-pink-700 dark:bg-gray-700">
              <CardBody className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-10 h-10 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center">
                    <ClockIcon className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                  </div>
                  <div>
                    <Typography variant="small" className="font-semibold dark:text-white">
                      {t("applications.list.newApplicationModal.endTime") || "Bitmə vaxtı"}
                    </Typography>
                    <Typography variant="small" className="text-gray-500 dark:text-gray-400 text-xs">
                      {t("applications.list.newApplicationModal.taskEndDateTime") || "Task-in bitmə tarixi və saatı"}
                    </Typography>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Input
                    type="datetime-local"
                    placeholder={t("applications.list.newApplicationModal.selectEndTime") || "Bitmə vaxtını seçin"}
                    value={formData.endTime || ""}
                    onChange={(e) => onFieldChange("endTime", e.target.value)}
                    className="dark:text-white flex-1"
                    labelProps={{ className: "dark:text-gray-400" }}
                    containerProps={{ className: "!min-w-0 flex-1" }}
                  />
                  <CalendarIcon className="h-5 w-5 text-red-600 dark:text-red-400 mt-2" />
                </div>
              </CardBody>
            </Card>
          </div>
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.newApplicationModal.selectDepartment") || "Şöbə seçin"} <span className="text-red-500">*</span>
          </Typography>
          <Select
            label={t("applications.list.newApplicationModal.selectDepartment") || "Şöbə seçin"}
            value={formData.department || ""}
            onChange={(val) => onFieldChange("department", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.selectDepartment") || "Şöbə seçin"}
            </Option>
            {mockDepartments.map((dept) => (
              <Option key={dept.value} value={dept.value} className="dark:text-gray-300">
                {dept.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.newApplicationModal.selectCategory") || "Kateqoriya seçin"}
          </Typography>
          <Select
            label={t("applications.list.newApplicationModal.selectCategory") || "Kateqoriya seçin"}
            value={formData.category || ""}
            onChange={(val) => onFieldChange("category", val)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400 !text-left" }}
            containerProps={{ className: "!min-w-0" }}
          >
            <Option value="" className="dark:text-gray-300">
              {t("applications.list.newApplicationModal.selectCategory") || "Kateqoriya seçin"}
            </Option>
            {mockCategories.map((cat) => (
              <Option key={cat.value} value={cat.value} className="dark:text-gray-300">
                {cat.label}
              </Option>
            ))}
          </Select>
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.newApplicationModal.selectEmployees") || "Əməkdaşlar seçin"} <span className="text-red-500">*</span>
          </Typography>
          <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center min-h-[120px] flex flex-col items-center justify-center">
            {formData.department ? (
              <div className="space-y-2">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                  {t("applications.list.newApplicationModal.selectEmployeesFromDepartment") || "Əməkdaşları seçin"}
                </Typography>
              </div>
            ) : (
              <div className="space-y-2">
                <BuildingOfficeIcon className="h-12 w-12 text-gray-400 dark:text-gray-500 mx-auto" />
                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                  {t("applications.list.newApplicationModal.firstSelectDepartment") || "Əvvəlcə şöbə seçin"}
                </Typography>
              </div>
            )}
          </div>
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.newApplicationModal.applicationText") || "Müraciət mətni"} <span className="text-red-500">*</span>
          </Typography>
          <Textarea
            placeholder={t("applications.list.newApplicationModal.enterApplicationText") || "Müraciət mətni..."}
            value={formData.text || ""}
            onChange={(e) => onFieldChange("text", e.target.value)}
            className="dark:text-white"
            labelProps={{ className: "dark:text-gray-400" }}
            rows={4}
          />
        </div>

        <div>
          <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
            {t("applications.list.newApplicationModal.file") || "Fayl"}
          </Typography>
          <div className="flex items-center gap-3">
            <input
              type="file"
              id="file-upload"
              onChange={handleFileChange}
              className="hidden"
            />
            <label htmlFor="file-upload">
              <Button
                size="sm"
                color="blue"
                className="dark:bg-blue-600 dark:hover:bg-blue-700 cursor-pointer"
                component="span"
              >
                {t("applications.list.newApplicationModal.selectFile") || "Fayl seç"}
              </Button>
            </label>
            <Typography variant="small" className="text-gray-500 dark:text-gray-400">
              {selectedFile ? selectedFile.name : t("applications.list.newApplicationModal.fileNotSelected") || "Fayl seçilməyib"}
            </Typography>
          </div>
        </div>
      </DialogBody>
      <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
        <Button
          variant="outlined"
          color="blue-gray"
          onClick={onClose}
          className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {t("buttons.cancel") || "Ləğv et"}
        </Button>
        <Button
          color="blue"
          onClick={onSave}
          className="dark:bg-blue-600 dark:hover:bg-blue-700"
        >
          {t("applications.list.newApplicationModal.confirm") || "Təsdiq et"}
        </Button>
      </DialogFooter>
    </Dialog>
  );
}


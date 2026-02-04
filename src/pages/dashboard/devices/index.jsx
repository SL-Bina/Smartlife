import React, { useEffect, useState } from "react";
import {
  Typography,
  Card,
  CardHeader,
  CardBody,
  Button,
  IconButton,
  Menu,
  MenuHandler,
  MenuList,
  MenuItem,
  Spinner,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
  Select,
  Option,
  Chip,
} from "@material-tailwind/react";
import { 
  EllipsisVerticalIcon, 
  Cog6ToothIcon,
  UserIcon,
  KeyIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";
import devicesDataRaw from './api/data.json';

const devicesData = devicesDataRaw && devicesDataRaw.devices ? devicesDataRaw.devices : [];
const accessRulesData = devicesDataRaw && devicesDataRaw.accessRules ? devicesDataRaw.accessRules : [];
const usersData = devicesDataRaw && devicesDataRaw.users ? devicesDataRaw.users : [];
const identifiersData = devicesDataRaw && devicesDataRaw.identifiers ? devicesDataRaw.identifiers : [];
const logsData = devicesDataRaw && devicesDataRaw.logs ? devicesDataRaw.logs : [];

const ITEMS_PER_PAGE = 10;

const Tag = ({ children, color = "green" }) => {
  const map = {
    green: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800",
    red: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800",
    teal: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/20 dark:text-teal-300 dark:border-teal-800",
    slate: "bg-slate-100 text-slate-800 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-800",
    gray: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900/20 dark:text-gray-300 dark:border-gray-800",
  };
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium border ${map[color] || map.gray}`}>
      {children}
    </span>
  );
};

const DevicesPage = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [accessRulesOpen, setAccessRulesOpen] = useState(false);
  const [deviceUsersOpen, setDeviceUsersOpen] = useState(false);
  const [deviceIdentifiersOpen, setDeviceIdentifiersOpen] = useState(false);
  const [deviceLogsOpen, setDeviceLogsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [filterName, setFilterName] = useState("");
  const [filterBuilding, setFilterBuilding] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  const [formName, setFormName] = useState("");
  const [formBuilding, setFormBuilding] = useState("");
  const [formApartment, setFormApartment] = useState("");
  const [formStatus, setFormStatus] = useState("Aktiv");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const totalPages = Math.ceil(devicesData.length / ITEMS_PER_PAGE);
  const startIndex = (page - 1) * ITEMS_PER_PAGE;
  const pageData = devicesData.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const handlePrev = () => setPage((prev) => Math.max(1, prev - 1));
  const handleNext = () => setPage((prev) => Math.min(totalPages, prev + 1));

  const openCreateModal = () => {
    setSelectedItem(null);
    setFormName("");
    setFormBuilding("");
    setFormApartment("");
    setFormStatus("Aktiv");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormName(item.nameLines?.[0]?.text || "");
    setFormBuilding(item.building?.toString() || "");
    setFormApartment(item.apartment || "");
    setFormStatus(item.userStatus || "Aktiv");
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterName("");
    setFilterBuilding("");
    setFilterStatus("");
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    setEditOpen(false);
  };

  return (
    <div className=" ">
      {/* Section title bar */}
      <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
        <h3 className="text-white font-bold">{t("devices.pageTitle")}</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("devices.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.filter.name")}
            </Typography>
            <Input
              label={t("devices.filter.enterName")}
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.filter.building")}
            </Typography>
            <Input
              label={t("devices.filter.enterBuilding")}
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.filter.status")}
            </Typography>
            <Select
              label={t("devices.filter.enterStatus")}
              value={filterStatus}
              onChange={(val) => setFilterStatus(val || "")}
              className="dark:text-white"
            >
              <Option value="Onlayn">{t("devices.filter.online")}</Option>
              <Option value="Offline">{t("devices.filter.offline")}</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("devices.filter.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("devices.filter.close")}
            </Button>
            <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              {t("devices.filter.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create device modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("devices.create.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.create.name")}
            </Typography>
            <Input
              label={t("devices.create.enterName")}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("devices.create.building")}
              </Typography>
              <Input
                label={t("devices.create.enterBuilding")}
                value={formBuilding}
                onChange={(e) => setFormBuilding(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("devices.create.apartment")}
              </Typography>
              <Input
                label={t("devices.create.enterApartment")}
                value={formApartment}
                onChange={(e) => setFormApartment(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.create.status")}
            </Typography>
            <Select
              label={t("devices.create.enterStatus")}
              value={formStatus}
              onChange={(val) => setFormStatus(val || "Aktiv")}
              className="dark:text-white"
            >
              <Option value="Onlayn">{t("devices.filter.online")}</Option>
              <Option value="Offline">{t("devices.filter.offline")}</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("devices.create.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("devices.create.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit device modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("devices.edit.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.edit.name")}
            </Typography>
            <Input
              label={t("devices.edit.enterName")}
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("devices.edit.building")}
              </Typography>
              <Input
                label={t("devices.edit.enterBuilding")}
                value={formBuilding}
                onChange={(e) => setFormBuilding(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("devices.edit.apartment")}
              </Typography>
              <Input
                label={t("devices.edit.enterApartment")}
                value={formApartment}
                onChange={(e) => setFormApartment(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("devices.edit.status")}
            </Typography>
            <Select
              label={t("devices.edit.enterStatus")}
              value={formStatus}
              onChange={(val) => setFormStatus(val || "Aktiv")}
              className="dark:text-white"
            >
              <Option value="Onlayn">{t("devices.filter.online")}</Option>
              <Option value="Offline">{t("devices.filter.offline")}</Option>
            </Select>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("devices.edit.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("devices.edit.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Access Rules Modal */}
      <Dialog open={accessRulesOpen} handler={setAccessRulesOpen} size="xl" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          <div className="flex items-center gap-2">
            <Typography variant="h6" className="dark:text-white">
              {t("devices.accessRules.title") || "Cihaz icazələri"}
            </Typography>
          </div>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        ID
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.accessRules.name")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.accessRules.deviceCount")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {accessRulesData.map((rule) => (
                    <tr key={rule.id} className="hover:bg-blue-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {rule.id}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {rule.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {rule.deviceCount}
                        </Typography>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setAccessRulesOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("devices.actions.close")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Device Users Modal */}
      <Dialog open={deviceUsersOpen} handler={setDeviceUsersOpen} size="xl" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          <Typography variant="h6" className="dark:text-white">
            {t("devices.deviceUsers.title") || "Cihaz istifadəçiləri"}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        ID
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceUsers.userName")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceUsers.email")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceUsers.phone")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.table.userStatus")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {usersData.map((user) => (
                    <tr key={user.id} className="hover:bg-blue-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {user.id}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {user.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {user.email}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {user.phone}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Chip
                          value={user.status}
                          color={String(user.status).toLowerCase() === 'onlayn' ? 'green' : 'red'}
                          variant="ghost"
                          size="sm"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setDeviceUsersOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("devices.actions.close")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Device Identifiers Modal */}
      <Dialog open={deviceIdentifiersOpen} handler={setDeviceIdentifiersOpen} size="xl" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          <Typography variant="h6" className="dark:text-white">
            {t("devices.deviceIdentifiers.title") || "Cihaz identifikatorları"}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        ID
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceIdentifiers.name")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceIdentifiers.value")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceIdentifiers.type")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {identifiersData.map((identifier) => (
                    <tr key={identifier.id} className="hover:bg-blue-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {identifier.id}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {identifier.name}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {identifier.identifier}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Chip
                          value={identifier.type}
                          color="blue"
                          variant="ghost"
                          size="sm"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setDeviceIdentifiersOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("devices.actions.close")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Device Logs Modal */}
      <Dialog open={deviceLogsOpen} handler={setDeviceLogsOpen} size="xl" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">
          <Typography variant="h6" className="dark:text-white">
            {t("devices.deviceLogs.title") || "Cihaz qeydləri"}
          </Typography>
        </DialogHeader>
        <DialogBody divider className="dark:bg-gray-800 dark:border-gray-700 max-h-[70vh] overflow-y-auto">
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full table-auto">
                <thead>
                  <tr>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceLogs.date")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceLogs.device")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceLogs.identifier")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceLogs.type")}
                      </Typography>
                    </th>
                    <th className="border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left">
                      <Typography variant="small" className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400">
                        {t("devices.deviceLogs.acsMessage")}
                      </Typography>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {logsData.map((log, idx) => (
                    <tr key={idx} className="hover:bg-blue-gray-50 dark:hover:bg-gray-700/50">
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {log.date}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {log.device}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                          {log.identifier}
                        </Typography>
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Chip
                          value={log.type}
                          color="blue"
                          variant="ghost"
                          size="sm"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        />
                      </td>
                      <td className="py-3 px-6 border-b border-blue-gray-50 dark:border-gray-800">
                        <Chip
                          value={log.acsMessage}
                          color={log.acsMessage === "Access granted" ? "green" : "red"}
                          variant="ghost"
                          size="sm"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setDeviceLogsOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("devices.actions.close")}
          </Button>
        </DialogFooter>
      </Dialog>

      <Card className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800">
        <CardHeader
          floated={false}
          shadow={false}
          color="transparent"
          className="m-0 flex items-center justify-between p-6 dark:bg-gray-800"
        >
          <div className="flex flex-wrap items-center gap-3">
            <Button 
              variant="outlined" 
              color="blue-gray" 
              onClick={() => setAccessRulesOpen(true)} 
              className="flex items-center gap-2 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              <Cog6ToothIcon className="h-4 w-4" />
              {t("devices.actions.accessRules")}
            </Button>
            <Button 
              variant="outlined" 
              color="green" 
              onClick={() => setDeviceUsersOpen(true)} 
              className="flex items-center gap-2 dark:border-green-600 dark:text-gray-300 dark:hover:bg-green-700"
            >
              <UserIcon className="h-4 w-4" />
              {t("devices.actions.deviceUsers")}
            </Button>
            <Button 
              variant="outlined" 
              color="amber" 
              onClick={() => setDeviceIdentifiersOpen(true)} 
              className="flex items-center gap-2 dark:border-amber-600 dark:text-gray-300 dark:hover:bg-amber-700"
            >
              <KeyIcon className="h-4 w-4" />
              {t("devices.actions.deviceIdentifiers")}
            </Button>
            <Button 
              variant="outlined" 
              color="teal" 
              onClick={() => setDeviceLogsOpen(true)} 
              className="flex items-center gap-2 dark:border-teal-600 dark:text-gray-300 dark:hover:bg-teal-700"
            >
              <CameraIcon className="h-4 w-4" />
              {t("devices.actions.deviceLogs")}
            </Button>
            <Button 
              variant="outlined" 
              color="blue" 
              onClick={() => setFilterOpen(true)} 
              className="flex items-center gap-2 dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20"
            >
              <MagnifyingGlassIcon className="h-4 w-4" />
              {t("devices.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="flex items-center gap-2 dark:bg-green-600 dark:hover:bg-green-700">
              {t("devices.actions.add")}
            </Button>
          </div>
        </CardHeader>
        <CardBody className="px-0 pt-0 pb-2 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("devices.loading")}
              </Typography>
            </div>
          ) : (
            <>
              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full table-auto min-w-[1000px]">
                  <thead>
                    <tr>
                      {[t("devices.table.name"), t("devices.table.building"), t("devices.table.apartment"), t("devices.table.device"), t("devices.table.userStatus"), t("devices.table.actions")].map(
                        (el, idx) => (
                          <th
                            key={el}
                            className={`border-b border-blue-gray-100 dark:border-gray-800 py-3 px-6 text-left ${
                              idx === 5 ? "text-right" : ""
                            }`}
                          >
                            <Typography
                              variant="small"
                              className="text-[11px] font-medium uppercase text-blue-gray-400 dark:text-gray-400"
                            >
                              {el}
                            </Typography>
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {pageData.map((row, key) => {
                      const className = `py-3 px-6 ${
                        key === pageData.length - 1 ? "" : "border-b border-blue-gray-50 dark:border-gray-800"
                      }`;
                      return (
                        <tr 
                          key={row.id} 
                          className="dark:hover:bg-gray-700/50"
                        >
                          <td className={`${className} min-w-[200px]`}>
                            <div className="flex flex-col gap-1.5">
                              {(row.nameLines || [{ id: row.id, text: row.name || "" }]).map((ln) => (
                                <div key={ln.id} className="flex items-center gap-1.5 flex-wrap">
                                  <Tag color="teal">{ln.id}</Tag>
                                  <span className="text-[11px] text-gray-400 dark:text-gray-500">:</span>
                                  <Tag color="green" className="break-words">{ln.text}</Tag>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.building}
                            </Typography>
                          </td>
                          <td className={className}>
                            <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                              {row.apartment}
                            </Typography>
                          </td>
                          <td className={`${className} min-w-[250px]`}>
                            <div className="flex flex-col gap-1.5">
                              {(row.devices || []).map((d, idx) => (
                                <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                                  <Tag color="slate">{t("devices.table.serial")}</Tag>
                                  <Tag color={d.status === "Onlayn" ? "green" : "red"}>{d.status}</Tag>
                                  <Tag color="gray" className="break-all max-w-[150px] truncate">{d.value}</Tag>
                                </div>
                              ))}
                            </div>
                          </td>
                          <td className={className}>
                            <Chip
                              value={row.userStatus}
                              color={String(row.userStatus).toLowerCase() === 'onlayn' ? 'green' : 'red'}
                              variant="ghost"
                              size="sm"
                              className="dark:bg-gray-700 dark:text-gray-300"
                            />
                          </td>
                          <td className={`${className} text-right`}>
                            <div className="flex items-center justify-end gap-2">
                              <Menu placement="left-start">
                                <MenuHandler>
                                  <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                                    <EllipsisVerticalIcon
                                      strokeWidth={2}
                                      className="h-5 w-5"
                                    />
                                  </IconButton>
                                </MenuHandler>
                                <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                                  <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("devices.actions.edit")}</MenuItem>
                                  <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("devices.actions.delete")}</MenuItem>
                                </MenuList>
                              </Menu>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Tablet & mobile cards */}
              <div className="grid gap-4 sm:grid-cols-2 lg:hidden px-4 pt-4">
                {pageData.map((row) => (
                  <Card
                    key={row.id}
                    className="border border-red-600 dark:border-gray-700 shadow-sm dark:bg-gray-800"
                  >
                    <CardBody className="space-y-3 dark:bg-gray-800">
                      <div className="flex items-start justify-between gap-2">
                        <div className="space-y-1 flex-1 min-w-0">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-[11px] font-medium uppercase dark:text-gray-400"
                          >
                            {t("devices.table.name")}
                          </Typography>
                          <div className="flex flex-col gap-1.5">
                            {(row.nameLines || [{ id: row.id, text: row.name || "" }]).map((ln) => (
                              <div key={ln.id} className="flex items-center gap-1.5 flex-wrap">
                                <Tag color="teal">{ln.id}</Tag>
                                <span className="text-[10px] text-gray-400 dark:text-gray-500">:</span>
                                <Tag color="green" className="break-words">{ln.text}</Tag>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Menu placement="left-start">
                            <MenuHandler>
                              <IconButton size="sm" variant="text" color="blue-gray" className="dark:text-gray-300 dark:hover:bg-gray-700">
                                <EllipsisVerticalIcon
                                  strokeWidth={2}
                                  className="h-5 w-5"
                                />
                              </IconButton>
                            </MenuHandler>
                            <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                              <MenuItem onClick={() => openEditModal(row)} className="dark:text-gray-300 dark:hover:bg-gray-700">{t("devices.actions.edit")}</MenuItem>
                              <MenuItem className="dark:text-gray-300 dark:hover:bg-gray-700">{t("devices.actions.delete")}</MenuItem>
                            </MenuList>
                          </Menu>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="space-y-1">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-[11px] font-medium uppercase dark:text-gray-400"
                          >
                            {t("devices.table.building")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                            {row.building}
                          </Typography>
                        </div>
                        <div className="space-y-1">
                          <Typography
                            variant="small"
                            color="blue-gray"
                            className="text-[11px] font-medium uppercase dark:text-gray-400"
                          >
                            {t("devices.table.apartment")}
                          </Typography>
                          <Typography variant="small" color="blue-gray" className="dark:text-gray-300">
                            {row.apartment}
                          </Typography>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase dark:text-gray-400"
                        >
                          {t("devices.table.device")}
                        </Typography>
                        <div className="flex flex-col gap-1.5">
                          {(row.devices || []).map((d, idx) => (
                            <div key={idx} className="flex items-center gap-1.5 flex-wrap">
                              <Tag color="slate">{t("devices.table.serial")}</Tag>
                              <Tag color={d.status === "Onlayn" ? "green" : "red"}>{d.status}</Tag>
                              <Tag color="gray" className="break-all max-w-[120px] truncate">{d.value}</Tag>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <Typography
                          variant="small"
                          color="blue-gray"
                          className="text-[11px] font-medium uppercase dark:text-gray-400"
                        >
                          {t("devices.table.userStatus")}
                        </Typography>
                        <Chip
                          value={row.userStatus}
                          color={String(row.userStatus).toLowerCase() === 'onlayn' ? 'green' : 'red'}
                          variant="ghost"
                          size="sm"
                          className="dark:bg-gray-700 dark:text-gray-300"
                        />
                      </div>
                    </CardBody>
                  </Card>
                ))}
              </div>

              <div className="flex items-center justify-end gap-2 px-6 pt-4">
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={handlePrev}
                  disabled={page === 1}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("devices.pagination.prev")}
                </Button>
                {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                  (pageNumber) => (
                    <Button
                      key={pageNumber}
                      variant={pageNumber === page ? "filled" : "text"}
                      size="sm"
                      color={pageNumber === page ? "blue" : "blue-gray"}
                      onClick={() => setPage(pageNumber)}
                      className={`min-w-[32px] px-2 ${
                        pageNumber === page 
                          ? "dark:bg-blue-600 dark:hover:bg-blue-700" 
                          : "dark:text-gray-300 dark:hover:bg-gray-700"
                      }`}
                    >
                      {pageNumber}
                    </Button>
                  )
                )}
                <Button
                  variant="text"
                  size="sm"
                  color="blue-gray"
                  onClick={handleNext}
                  disabled={page === totalPages}
                  className="dark:text-gray-300 dark:hover:bg-gray-700 dark:disabled:text-gray-600"
                >
                  {t("devices.pagination.next")}
                </Button>
              </div>
            </>
          )}
        </CardBody>
      </Card>
    </div>
  );
};

export default DevicesPage;

import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip,
  Slider,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { XMarkIcon, MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

const mockFees = [
  {
    id: 1,
    building: "Bina 1",
    complex: "Kompleks 1",
    baseFee: 25,
    perM2: 0.4,
    lastUpdatedBy: "Admin",
  },
  {
    id: 2,
    building: "Bina 2",
    complex: "Kompleks 1",
    baseFee: 30,
    perM2: 0.5,
    lastUpdatedBy: "Manager",
  },
];

const BuildingServiceFeePage = () => {
  const { t } = useTranslation();

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = React.useState(null);

  const [filterComplex, setFilterComplex] = React.useState("");
  const [filterBuilding, setFilterBuilding] = React.useState("");

  const [formBuilding, setFormBuilding] = React.useState("");
  const [formComplex, setFormComplex] = React.useState("");
  const [formBaseFee, setFormBaseFee] = React.useState("");
  const [formPerM2, setFormPerM2] = React.useState("");
  const [formLastUpdatedBy, setFormLastUpdatedBy] = React.useState("");

  const openCreateModal = () => {
    setSelectedItem(null);
    setFormBuilding("");
    setFormComplex("");
    setFormBaseFee("");
    setFormPerM2("");
    setFormLastUpdatedBy("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormBuilding(item.building);
    setFormComplex(item.complex);
    setFormBaseFee(String(item.baseFee));
    setFormPerM2(String(item.perM2));
    setFormLastUpdatedBy(item.lastUpdatedBy);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterComplex("");
    setFilterBuilding("");
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
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">
          {t("buildingServiceFee.pageTitle")}
        </h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <div className="flex items-center gap-3">
            <MagnifyingGlassIcon className="h-5 w-5 text-blue-500" />
            <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
              {t("buttons.filter") || "Axtarış"}
            </Typography>
          </div>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setFilterOpen(false)}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="space-y-6 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.complex")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={filterComplex}
              onChange={(e) => setFilterComplex(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.building")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outlined" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.clear") || "Təmizlə"}
          </Button>
          <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.search") || "Axtar"}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Create service fee modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            Yeni servis haqqı
          </Typography>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setCreateOpen(false)}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.building")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={formBuilding}
              onChange={(e) => setFormBuilding(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.complex")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("buildingServiceFee.labels.baseFee")}
              </Typography>
              <Input
                type="number"
                placeholder="Daxil et"
                value={formBaseFee}
                onChange={(e) => setFormBaseFee(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("buildingServiceFee.labels.perM2")}
              </Typography>
              <Input
                type="number"
                placeholder="Daxil et"
                value={formPerM2}
                onChange={(e) => setFormPerM2(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.lastUpdatedBy")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={formLastUpdatedBy}
              onChange={(e) => setFormLastUpdatedBy(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit service fee modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="md" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
        <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
          <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
            Servis haqqı məlumatlarını dəyiş
          </Typography>
          <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={() => setEditOpen(false)}>
            <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
          </div>
        </DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.building")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={formBuilding}
              onChange={(e) => setFormBuilding(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.complex")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("buildingServiceFee.labels.baseFee")}
              </Typography>
              <Input
                type="number"
                placeholder="Daxil et"
                value={formBaseFee}
                onChange={(e) => setFormBaseFee(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                {t("buildingServiceFee.labels.perM2")}
              </Typography>
              <Input
                type="number"
                placeholder="Daxil et"
                value={formPerM2}
                onChange={(e) => setFormPerM2(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
                containerProps={{ className: "!min-w-0" }}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
              {t("buildingServiceFee.labels.lastUpdatedBy")}
            </Typography>
            <Input
              placeholder="Daxil et"
              value={formLastUpdatedBy}
              onChange={(e) => setFormLastUpdatedBy(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
              containerProps={{ className: "!min-w-0" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("buttons.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border border-red-600 dark:border-gray-700 shadow-sm md:col-span-2">
          <CardHeader
            floated={false}
            shadow={false}
            color="transparent"
            className="p-4 pb-2 flex items-center justify-between"
          >
            <Typography variant="small" color="blue-gray" className="font-semibold">
              {t("buildingServiceFee.adjustment.title")}
            </Typography>
            <Chip value={t("buildingServiceFee.adjustment.infoLabel")} size="sm" />
          </CardHeader>
          <CardBody className="p-4 pt-0 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Typography variant="small" color="blue-gray">
                  {t("buildingServiceFee.adjustment.globalIncrease")}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  0%
                </Typography>
              </div>
              <Slider defaultValue={0} min={-20} max={50} step={1} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outlined" size="sm" color="blue-gray">
                {t("buttons.cancel")}
              </Button>
              <Button color="blue" size="sm">
                {t("buttons.save")}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-red-600 dark:border-gray-700 shadow-sm">
          <CardBody className="space-y-2">
            <Typography variant="small" color="blue-gray" className="font-semibold">
              {t("buildingServiceFee.summary.title")}
            </Typography>
            <Typography variant="small" color="blue-gray">
              {t("buildingServiceFee.summary.totalBuildings", { count: 2 })}
            </Typography>
            <Typography variant="small" color="blue-gray">
              {t("buildingServiceFee.summary.avgFee", { value: 27.5 })}
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {mockFees.map((item) => (
          <Card key={item.id} className="border border-red-600 dark:border-gray-700 shadow-sm">
            <CardHeader
              floated={false}
              shadow={false}
              color="transparent"
              className="p-4 pb-2 flex items-center justify-between"
            >
              <div>
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="text-[11px] font-medium uppercase"
                >
                  {t("buildingServiceFee.labels.building")}
                </Typography>
                <Typography variant="small" color="blue-gray" className="font-semibold">
                  {item.building}
                </Typography>
              </div>
              <div className="text-right">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="text-[11px] font-medium uppercase"
                >
                  {t("buildingServiceFee.labels.complex")}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {item.complex}
                </Typography>
              </div>
            </CardHeader>
            <CardBody className="p-4 pt-0 space-y-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[11px] font-medium uppercase"
                  >
                    {t("buildingServiceFee.labels.baseFee")}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {t("buildingServiceFee.labels.amountValue", { value: item.baseFee })}
                  </Typography>
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[11px] font-medium uppercase"
                  >
                    {t("buildingServiceFee.labels.perM2")}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {t("buildingServiceFee.labels.perM2Value", { value: item.perM2 })}
                  </Typography>
                </div>
              </div>
              <div className="space-y-1 pt-2">
                <Typography
                  variant="small"
                  color="blue-gray"
                  className="text-[11px] font-medium uppercase"
                >
                  {t("buildingServiceFee.labels.lastUpdatedBy")}
                </Typography>
                <Typography variant="small" color="blue-gray">
                  {item.lastUpdatedBy}
                </Typography>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button
                  variant="outlined"
                  size="sm"
                  color="blue-gray"
                  onClick={() => openEditModal(item)}
                >
                  {t("buttons.edit")}
                </Button>
                <Button color="blue" size="sm">
                  {t("buttons.apply")}
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BuildingServiceFeePage;

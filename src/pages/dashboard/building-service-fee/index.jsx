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
      <div className="w-full bg-black my-4 p-4 rounded-lg shadow-lg mb-6">
        <h3 className="text-white font-bold">
          {t("buildingServiceFee.pageTitle")}
        </h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>{t("buttons.filter")}</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.complex")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.complex")}
              value={filterComplex}
              onChange={(e) => setFilterComplex(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.building")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.building")}
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear}>
            {t("buttons.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)}>
              {t("buttons.cancel")}
            </Button>
            <Button color="blue" onClick={handleFilterApply}>
              {t("buttons.filter")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create service fee modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni servis haqqı</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.building")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.building")}
              value={formBuilding}
              onChange={(e) => setFormBuilding(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.complex")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.complex")}
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("buildingServiceFee.labels.baseFee")}
              </Typography>
              <Input
                type="number"
                label={t("buildingServiceFee.labels.baseFee")}
                value={formBaseFee}
                onChange={(e) => setFormBaseFee(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("buildingServiceFee.labels.perM2")}
              </Typography>
              <Input
                type="number"
                label={t("buildingServiceFee.labels.perM2")}
                value={formPerM2}
                onChange={(e) => setFormPerM2(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.lastUpdatedBy")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.lastUpdatedBy")}
              value={formLastUpdatedBy}
              onChange={(e) => setFormLastUpdatedBy(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave}>
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit service fee modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Servis haqqı məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.building")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.building")}
              value={formBuilding}
              onChange={(e) => setFormBuilding(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.complex")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.complex")}
              value={formComplex}
              onChange={(e) => setFormComplex(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("buildingServiceFee.labels.baseFee")}
              </Typography>
              <Input
                type="number"
                label={t("buildingServiceFee.labels.baseFee")}
                value={formBaseFee}
                onChange={(e) => setFormBaseFee(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("buildingServiceFee.labels.perM2")}
              </Typography>
              <Input
                type="number"
                label={t("buildingServiceFee.labels.perM2")}
                value={formPerM2}
                onChange={(e) => setFormPerM2(e.target.value)}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("buildingServiceFee.labels.lastUpdatedBy")}
            </Typography>
            <Input
              label={t("buildingServiceFee.labels.lastUpdatedBy")}
              value={formLastUpdatedBy}
              onChange={(e) => setFormLastUpdatedBy(e.target.value)}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)}>
            {t("buttons.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave}>
            {t("buttons.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <Card className="border border-red-500 shadow-sm md:col-span-2">
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

        <Card className="border border-red-500 shadow-sm">
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
          <Card key={item.id} className="border border-red-500 shadow-sm">
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

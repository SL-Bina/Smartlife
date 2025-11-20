import React from "react";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Chip,
  Button,
  Select,
  Option,
  Dialog,
  DialogHeader,
  DialogBody,
  DialogFooter,
  Input,
} from "@material-tailwind/react";
import { useTranslation } from "react-i18next";

const mockGroups = [
  {
    id: 1,
    name: "A Blok - 1-ci giriş",
    building: "Bina 1",
    complex: "Kompleks 1",
    total: 40,
    occupied: 32,
    serviceFee: 25,
  },
  {
    id: 2,
    name: "A Blok - 2-ci giriş",
    building: "Bina 1",
    complex: "Kompleks 1",
    total: 28,
    occupied: 20,
    serviceFee: 30,
  },
  {
    id: 3,
    name: "B Blok - 1-ci giriş",
    building: "Bina 2",
    complex: "Kompleks 2",
    total: 36,
    occupied: 18,
    serviceFee: 22,
  },
];

const ApartmentGroupsPage = () => {
  const { t } = useTranslation();

  const [filterOpen, setFilterOpen] = React.useState(false);
  const [createOpen, setCreateOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [selectedGroup, setSelectedGroup] = React.useState(null);

  const [filterComplex, setFilterComplex] = React.useState("");
  const [filterBuilding, setFilterBuilding] = React.useState("");

  const [formName, setFormName] = React.useState("");
  const [formComplex, setFormComplex] = React.useState("");
  const [formBuilding, setFormBuilding] = React.useState("");
  const [formTotal, setFormTotal] = React.useState("");
  const [formOccupied, setFormOccupied] = React.useState("");
  const [formServiceFee, setFormServiceFee] = React.useState("");

  const openCreateModal = () => {
    setSelectedGroup(null);
    setFormName("");
    setFormComplex("");
    setFormBuilding("");
    setFormTotal("");
    setFormOccupied("");
    setFormServiceFee("");
    setCreateOpen(true);
  };

  const openEditModal = (group) => {
    setSelectedGroup(group);
    setFormName(group.name);
    setFormComplex(group.complex);
    setFormBuilding(group.building);
    setFormTotal(String(group.total));
    setFormOccupied(String(group.occupied));
    setFormServiceFee(String(group.serviceFee));
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
          {t("apartmentGroups.pageTitle")}
        </h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm">
        <DialogHeader>{t("buttons.filter")}</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("apartmentGroups.filters.complex")}
            </Typography>
            <Input
              label="Daxil et"
              value={filterComplex}
              onChange={(e) => setFilterComplex(e.target.value)}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("apartmentGroups.filters.building")}
            </Typography>
            <Input
              label="Daxil et"
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

      {/* Create group modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm">
        <DialogHeader>Yeni mənzil qrupu</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("apartmentGroups.labels.groupName")}
            </Typography>
            <Input
              label="Daxil et"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.complex")}
              </Typography>
              <Input
                label="Daxil et"
                value={formComplex}
                onChange={(e) => setFormComplex(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.building")}
              </Typography>
              <Input
                label="Daxil et"
                value={formBuilding}
                onChange={(e) => setFormBuilding(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.total")}
              </Typography>
              <Input
                type="number"
                label="Daxil et"
                value={formTotal}
                onChange={(e) => setFormTotal(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.occupied")}
              </Typography>
              <Input
                type="number"
                label="Daxil et"
                value={formOccupied}
                onChange={(e) => setFormOccupied(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.serviceFee")}
              </Typography>
              <Input
                type="number"
                label="Daxil et"
                value={formServiceFee}
                onChange={(e) => setFormServiceFee(e.target.value)}
              />
            </div>
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

      {/* Edit group modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm">
        <DialogHeader>Mənzil qrupu məlumatlarını dəyiş</DialogHeader>
        <DialogBody divider className="space-y-4">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1">
              {t("apartmentGroups.labels.groupName")}
            </Typography>
            <Input
              label="Daxil et"
              value={formName}
              onChange={(e) => setFormName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.complex")}
              </Typography>
              <Input
                label="Daxil et"
                value={formComplex}
                onChange={(e) => setFormComplex(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.building")}
              </Typography>
              <Input
                label="Daxil et"
                value={formBuilding}
                onChange={(e) => setFormBuilding(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.total")}
              </Typography>
              <Input
                type="number"
                label="Daxil et"
                value={formTotal}
                onChange={(e) => setFormTotal(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.occupied")}
              </Typography>
              <Input
                type="number"
                label="Daxil et"
                value={formOccupied}
                onChange={(e) => setFormOccupied(e.target.value)}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1">
                {t("apartmentGroups.labels.serviceFee")}
              </Typography>
              <Input
                type="number"
                label="Daxil et"
                value={formServiceFee}
                onChange={(e) => setFormServiceFee(e.target.value)}
              />
            </div>
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

      <div className="mb-4 grid gap-4 md:grid-cols-3">
        <Card className="border border-red-500 shadow-sm md:col-span-2">
          <CardBody className="flex flex-wrap gap-4 items-end">
            <div className="w-full ">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 text-[11px] font-medium uppercase"
              >
                {t("apartmentGroups.filters.complex")}
              </Typography>
              <Select label="Daxil et">
                <Option>Kompleks 1</Option>
                <Option>Kompleks 2</Option>
              </Select>
            </div>
            <div className="w-full ">
              <Typography
                variant="small"
                color="blue-gray"
                className="mb-1 text-[11px] font-medium uppercase"
              >
                {t("apartmentGroups.filters.building")}
              </Typography>
              <Select label="Daxil et">
                <Option>Bina 1</Option>
                <Option>Bina 2</Option>
              </Select>
            </div>
            <div className="w-full  flex gap-2 justify-end">
              <Button variant="outlined" color="blue-gray" size="sm" onClick={handleFilterClear}>
                {t("buttons.clear")}
              </Button>
              <Button color="blue" size="sm" onClick={() => setFilterOpen(true)}>
                {t("buttons.filter")}
              </Button>
              <Button color="green" size="sm" onClick={openCreateModal}>
                {t("buttons.save")}
              </Button>
            </div>
          </CardBody>
        </Card>

        <Card className="border border-red-500 shadow-sm">
          <CardBody className="space-y-2">
            <Typography variant="small" color="blue-gray" className="font-semibold">
              {t("apartmentGroups.summary.title")}
            </Typography>
            <Typography variant="small" color="blue-gray">
              {t("apartmentGroups.summary.totalGroups", { count: mockGroups.length })}
            </Typography>
            <Typography variant="small" color="blue-gray">
              {t("apartmentGroups.summary.totalApartments", { count: 104 })}
            </Typography>
            <Typography variant="small" color="blue-gray">
              {t("apartmentGroups.summary.occupied", { count: 70 })}
            </Typography>
          </CardBody>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {mockGroups.map((group) => {
          const free = group.total - group.occupied;
          const ratio = Math.round((group.occupied / group.total) * 100);
          return (
            <Card
              key={group.id}
              className="border border-red-500 shadow-sm flex flex-col justify-between"
            >
              <CardHeader
                floated={false}
                shadow={false}
                color="transparent"
                className="p-4 pb-2 flex items-start justify-between"
              >
                <div>
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[11px] font-medium uppercase"
                  >
                    {t("apartmentGroups.labels.groupName")}
                  </Typography>
                  <Typography variant="small" color="blue-gray" className="font-semibold">
                    {group.name}
                  </Typography>
                </div>
                <Chip
                  size="sm"
                  color={ratio > 80 ? "green" : ratio > 50 ? "amber" : "blue-gray"}
                  value={t("apartmentGroups.labels.occupancy", { ratio })}
                />
              </CardHeader>
              <CardBody className="p-4 pt-0 space-y-2">
                <div className="space-y-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[11px] font-medium uppercase"
                  >
                    {t("apartmentGroups.labels.complex")}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {group.complex}
                  </Typography>
                </div>
                <div className="space-y-1">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[11px] font-medium uppercase"
                  >
                    {t("apartmentGroups.labels.building")}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {group.building}
                  </Typography>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-2">
                  <div className="space-y-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-[11px] font-medium uppercase"
                    >
                      {t("apartmentGroups.labels.total")}
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      {group.total}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-[11px] font-medium uppercase"
                    >
                      {t("apartmentGroups.labels.occupied")}
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      {group.occupied}
                    </Typography>
                  </div>
                  <div className="space-y-1">
                    <Typography
                      variant="small"
                      color="blue-gray"
                      className="text-[11px] font-medium uppercase"
                    >
                      {t("apartmentGroups.labels.free")}
                    </Typography>
                    <Typography variant="small" color="blue-gray">
                      {free}
                    </Typography>
                  </div>
                </div>
                <div className="space-y-1 pt-2">
                  <Typography
                    variant="small"
                    color="blue-gray"
                    className="text-[11px] font-medium uppercase"
                  >
                    {t("apartmentGroups.labels.serviceFee")}
                  </Typography>
                  <Typography variant="small" color="blue-gray">
                    {t("apartmentGroups.labels.serviceFeeValue", { value: group.serviceFee })}
                  </Typography>
                </div>
                <div className="flex justify-end pt-4">
                  <Button variant="outlined" size="sm" color="blue-gray" onClick={() => openEditModal(group)}>
                    {t("buttons.edit")}
                  </Button>
                </div>
              </CardBody>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default ApartmentGroupsPage;

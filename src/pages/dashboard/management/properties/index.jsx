import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Switch,
} from "@material-tailwind/react";
import { EllipsisVerticalIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Hər mərtəbədə 5 mənzil olacaq şəkildə data yaradırıq
// 50 mənzil = 10 mərtəbə (hər mərtəbədə 5 mənzil)
const TOTAL_APARTMENTS = 50;
const APARTMENTS_PER_FLOOR = 5;
const TOTAL_FLOORS = Math.ceil(TOTAL_APARTMENTS / APARTMENTS_PER_FLOOR);

const data = Array.from({ length: TOTAL_APARTMENTS }, (_, index) => {
  const floor = Math.floor(index / APARTMENTS_PER_FLOOR) + 1; // 1-ci mərtəbə: 0-4, 2-ci mərtəbə: 5-9, ...
  const apartmentInFloor = (index % APARTMENTS_PER_FLOOR) + 1; // Mərtəbə daxilində mənzil nömrəsi (1-5)
  const blockIndex = Math.floor(index / (APARTMENTS_PER_FLOOR * TOTAL_FLOORS / 5)) % 5; // 5 blok
  
  return {
    id: index + 1,
    number: `Mənzil ${floor}${String(apartmentInFloor).padStart(2, '0')}`, // Məs: Mənzil 101, Mənzil 102, ...
    block: `Blok ${String.fromCharCode(65 + blockIndex)}`, // Blok A, B, C, D, E
    floor: floor,
    area: 60 + (index % 10) * 5, // 60-105 m² arası
    resident: `Sakin ${index + 1}`,
    serviceFee: 20 + (index % 6) * 2, // 20-30 arası
  };
});

// Mənzilləri mərtəbələrə görə qruplaşdırırıq
const groupByFloor = (properties) => {
  const grouped = {};
  properties.forEach((prop) => {
    if (!grouped[prop.floor]) {
      grouped[prop.floor] = [];
    }
    grouped[prop.floor].push(prop);
  });
  return grouped;
};

// Hər mərtəbədə 5 mənzil olacaq şəkildə qruplaşdırırıq
const organizeByFloors = (properties, ascending = true) => {
  const grouped = groupByFloor(properties);
  const floors = Object.keys(grouped)
    .map(Number)
    .sort((a, b) => ascending ? a - b : b - a); // Sıralama istiqaməti
  
  const organized = [];
  floors.forEach((floor) => {
    const floorProperties = grouped[floor];
    // Hər mərtəbədə tam 5 mənzil olacaq şəkildə bölürük
    for (let i = 0; i < floorProperties.length; i += 5) {
      const apartments = floorProperties.slice(i, i + 5);
      // Əgər 5-dən az mənzil qalıbsa, boş yerləri null ilə doldururuq
      while (apartments.length < 5) {
        apartments.push(null);
      }
      organized.push({
        floor,
        apartments: apartments.slice(0, 5), // Həmişə 5 mənzil
      });
    }
  });
  
  return organized;
};

function PropertiesPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);
  const [createOpen, setCreateOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [sortAscending, setSortAscending] = useState(true); // true = aşağıdan yuxarı, false = yuxarıdan aşağı

  const [filterNumber, setFilterNumber] = useState("");
  const [filterBlock, setFilterBlock] = useState("");

  const [formNumber, setFormNumber] = useState("");
  const [formBlock, setFormBlock] = useState("");
  const [formFloor, setFormFloor] = useState("");
  const [formArea, setFormArea] = useState("");
  const [formResident, setFormResident] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  // Mənzilləri mərtəbələrə görə təşkil edirik
  const organizedData = organizeByFloors(data, sortAscending);


  const openCreateModal = () => {
    setSelectedItem(null);
    setFormNumber("");
    setFormBlock("");
    setFormFloor("");
    setFormArea("");
    setFormResident("");
    setCreateOpen(true);
  };

  const openEditModal = (item) => {
    setSelectedItem(item);
    setFormNumber(item.number);
    setFormBlock(item.block);
    setFormFloor(String(item.floor));
    setFormArea(String(item.area));
    setFormResident(item.resident);
    setEditOpen(true);
  };

  const handleFilterApply = () => {
    setFilterOpen(false);
  };

  const handleFilterClear = () => {
    setFilterNumber("");
    setFilterBlock("");
    setFilterOpen(false);
  };

  const handleCreateSave = () => {
    setCreateOpen(false);
  };

  const handleEditSave = () => {
    setEditOpen(false);
  };

  const openFeePage = (item) => {
    navigate(`/dashboard/management/service-fee/${item.id}`);
  };

  return (
    <div className=" ">
      {/* Section title bar to match Home design */}
      <div className="w-full bg-black dark:bg-gray-800 my-4 p-4 rounded-lg shadow-lg mb-6 border border-red-600 dark:border-gray-700">
        <h3 className="text-white font-bold">{t("properties.pageTitle")}</h3>
      </div>

      {/* Filter modal */}
      <Dialog open={filterOpen} handler={setFilterOpen} size="sm" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("properties.filter.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.filter.apartment")}
            </Typography>
            <Input
              label={t("properties.filter.enterApartment")}
              value={filterNumber}
              onChange={(e) => setFilterNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.filter.block")}
            </Typography>
            <Input
              label={t("properties.filter.enterBlock")}
              value={filterBlock}
              onChange={(e) => setFilterBlock(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-between gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="text" color="blue-gray" onClick={handleFilterClear} className="dark:text-gray-300 dark:hover:bg-gray-700">
            {t("properties.filter.clear")}
          </Button>
          <div className="flex gap-2">
            <Button variant="outlined" color="blue-gray" onClick={() => setFilterOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
              {t("properties.filter.close")}
            </Button>
            <Button color="blue" onClick={handleFilterApply} className="dark:bg-blue-600 dark:hover:bg-blue-700">
              {t("properties.filter.apply")}
            </Button>
          </div>
        </DialogFooter>
      </Dialog>

      {/* Create property modal */}
      <Dialog open={createOpen} handler={setCreateOpen} size="sm" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("properties.create.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.create.apartment")}
            </Typography>
            <Input
              label={t("properties.create.enterApartment")}
              value={formNumber}
              onChange={(e) => setFormNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.create.block")}
            </Typography>
            <Input
              label={t("properties.create.enterBlock")}
              value={formBlock}
              onChange={(e) => setFormBlock(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("properties.create.floor")}
              </Typography>
              <Input
                type="number"
                label={t("properties.create.enterFloor")}
                value={formFloor}
                onChange={(e) => setFormFloor(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("properties.create.area")}
              </Typography>
              <Input
                type="number"
                label={t("properties.create.enterArea")}
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.create.resident")}
            </Typography>
            <Input
              label={t("properties.create.enterResident")}
              value={formResident}
              onChange={(e) => setFormResident(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setCreateOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("properties.create.cancel")}
          </Button>
          <Button color="green" onClick={handleCreateSave} className="dark:bg-green-600 dark:hover:bg-green-700">
            {t("properties.create.save")}
          </Button>
        </DialogFooter>
      </Dialog>

      {/* Edit property modal */}
      <Dialog open={editOpen} handler={setEditOpen} size="sm" className="dark:bg-gray-900">
        <DialogHeader className="dark:bg-gray-800 dark:text-white">{t("properties.edit.title")}</DialogHeader>
        <DialogBody divider className="space-y-4 dark:bg-gray-800 dark:border-gray-700">
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.edit.apartment")}
            </Typography>
            <Input
              label={t("properties.edit.enterApartment")}
              value={formNumber}
              onChange={(e) => setFormNumber(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.edit.block")}
            </Typography>
            <Input
              label={t("properties.edit.enterBlock")}
              value={formBlock}
              onChange={(e) => setFormBlock(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("properties.edit.floor")}
              </Typography>
              <Input
                type="number"
                label={t("properties.edit.enterFloor")}
                value={formFloor}
                onChange={(e) => setFormFloor(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
            <div>
              <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
                {t("properties.edit.area")}
              </Typography>
              <Input
                type="number"
                label={t("properties.edit.enterArea")}
                value={formArea}
                onChange={(e) => setFormArea(e.target.value)}
                className="dark:text-white"
                labelProps={{ className: "dark:text-gray-400" }}
              />
            </div>
          </div>
          <div>
            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-300">
              {t("properties.edit.resident")}
            </Typography>
            <Input
              label={t("properties.edit.enterResident")}
              value={formResident}
              onChange={(e) => setFormResident(e.target.value)}
              className="dark:text-white"
              labelProps={{ className: "dark:text-gray-400" }}
            />
          </div>
        </DialogBody>
        <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 dark:border-gray-700">
          <Button variant="outlined" color="blue-gray" onClick={() => setEditOpen(false)} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
            {t("properties.edit.cancel")}
          </Button>
          <Button color="blue" onClick={handleEditSave} className="dark:bg-blue-600 dark:hover:bg-blue-700">
            {t("properties.edit.save")}
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
          <div className="flex items-center gap-3">
            <Button variant="outlined" color="blue" onClick={() => setFilterOpen(true)} className="dark:border-blue-600 dark:text-blue-400 dark:hover:bg-blue-900/20">
              {t("properties.actions.search")}
            </Button>
            <Button color="green" onClick={openCreateModal} className="dark:bg-green-600 dark:hover:bg-green-700">
              {t("properties.actions.add")}
            </Button>
          </div>
          <div className="flex items-center gap-3">
            <Typography variant="small" className="text-blue-gray-700 dark:text-gray-300 text-sm">
              {sortAscending ? t("properties.sort.ascending") : t("properties.sort.descending")}
            </Typography>
            <Switch
              checked={sortAscending}
              onChange={(e) => setSortAscending(e.target.checked)}
              color="blue"
              className="dark:bg-gray-700"
              labelProps={{
                className: "hidden",
              }}
            />
          </div>
        </CardHeader>
        <CardBody className="px-4 pt-4 pb-6 dark:bg-gray-800">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Spinner className="h-6 w-6" />
              <Typography variant="small" className="mt-2 text-blue-gray-400 dark:text-gray-400">
                {t("properties.loading")}
              </Typography>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Hər mərtəbə üçün bir sətir - aşağıdan yuxarı (1-ci mərtəbə ən aşağıda) */}
              {organizedData.map((floorGroup, floorIndex) => (
                <div key={`floor-${floorGroup.floor}-${floorIndex}`} className="space-y-3">
                  {/* Mərtəbə başlığı */}
                  <div className="flex items-center gap-2">
                    <Typography
                      variant="h6"
                      className="text-blue-gray-700 dark:text-white font-bold"
                    >
                      {t("properties.table.floor")} {floorGroup.floor}
                    </Typography>
                    <div className="flex-1 h-px bg-blue-gray-200 dark:bg-gray-700"></div>
                  </div>
                  
                  {/* Mənzil card-ları - hər sətirdə tam 5 mənzil */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                    {floorGroup.apartments.map((apartment, aptIndex) => {
                      // Əgər mənzil yoxdursa (null), boş card göstəririk
                      if (!apartment) {
                        return (
                          <Card
                            key={`empty-${floorGroup.floor}-${aptIndex}`}
                            className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 opacity-50"
                          >
                            <CardBody className="p-4 dark:bg-gray-800">
                              <div className="flex items-center justify-center h-32">
                                <Typography
                                  variant="small"
                                  className="text-blue-gray-400 dark:text-gray-600 text-xs"
                                >
                                  {t("properties.empty")}
                                </Typography>
                              </div>
                            </CardBody>
                          </Card>
                        );
                      }
                      
                      return (
                      <Card
                        key={apartment.id}
                        className="border border-gray-200 dark:border-gray-700 shadow-sm dark:bg-gray-800 hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => openEditModal(apartment)}
                      >
                        <CardBody className="p-4 dark:bg-gray-800">
                          <div className="flex items-start justify-between mb-3">
                            <div className="flex-1">
                              <Typography
                                variant="h6"
                                className="text-blue-gray-900 dark:text-white font-bold text-lg mb-1"
                              >
                                {apartment.number}
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-blue-gray-500 dark:text-gray-400 text-xs"
                              >
                                ID: {apartment.id}
                              </Typography>
                            </div>
                            <Menu placement="left-start">
                              <MenuHandler>
                                <IconButton 
                                  size="sm" 
                                  variant="text" 
                                  color="blue-gray" 
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  <EllipsisVerticalIcon
                                    strokeWidth={2}
                                    className="h-5 w-5"
                                  />
                                </IconButton>
                              </MenuHandler>
                              <MenuList className="dark:bg-gray-800 dark:border-gray-700">
                                <MenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openFeePage(apartment);
                                  }} 
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  {t("properties.actions.serviceFee")}
                                </MenuItem>
                                <MenuItem 
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    openEditModal(apartment);
                                  }} 
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                >
                                  {t("properties.actions.edit")}
                                </MenuItem>
                                <MenuItem 
                                  className="dark:text-gray-300 dark:hover:bg-gray-700"
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {t("properties.actions.delete")}
                                </MenuItem>
                              </MenuList>
                            </Menu>
                          </div>
                          
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <Typography
                                variant="small"
                                className="text-blue-gray-600 dark:text-gray-400 text-xs"
                              >
                                {t("properties.table.block")}:
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-blue-gray-900 dark:text-white font-semibold text-xs"
                              >
                                {apartment.block}
                              </Typography>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Typography
                                variant="small"
                                className="text-blue-gray-600 dark:text-gray-400 text-xs"
                              >
                                {t("properties.table.area")}:
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-blue-gray-900 dark:text-white font-semibold text-xs"
                              >
                                {apartment.area} m²
                              </Typography>
                            </div>
                            
                            <div className="flex items-center justify-between">
                              <Typography
                                variant="small"
                                className="text-blue-gray-600 dark:text-gray-400 text-xs"
                              >
                                {t("properties.table.resident")}:
                              </Typography>
                              <Typography
                                variant="small"
                                className="text-blue-gray-900 dark:text-white font-semibold text-xs truncate max-w-[120px]"
                                title={apartment.resident}
                              >
                                {apartment.resident}
                              </Typography>
                            </div>
                          </div>
                        </CardBody>
                      </Card>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  );
}

export default PropertiesPage;

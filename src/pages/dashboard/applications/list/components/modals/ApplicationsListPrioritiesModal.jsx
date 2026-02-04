import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, IconButton, Card, CardBody, Input, Textarea, Select, Option } from "@material-tailwind/react";
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, SparklesIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock data - real API hazır olduqda değiştirilecek
const mockPriorities = [
    {
        id: 1,
        name: "Orta",
        level: 2,
        description: "Orta",
        minDuration: 1,
        minUnit: "saat",
        maxDuration: 5,
        maxUnit: "saat",
        color: "#a86229",
        status: "Aktiv",
    },
    {
        id: 2,
        name: "Yüksək",
        level: 3,
        description: "Yüksək",
        minDuration: 1,
        minUnit: "saat",
        maxDuration: 2,
        maxUnit: "saat",
        color: "#28a745",
        status: "Aktiv",
    },
    {
        id: 3,
        name: "Tecili",
        level: 4,
        description: "Tecili",
        minDuration: 1,
        minUnit: "dəqiqə",
        maxDuration: 2,
        maxUnit: "dəqiqə",
        color: "#8b4513",
        status: "Aktiv",
    },
    {
        id: 4,
        name: "Aşağı",
        level: 1,
        description: "Aşağı",
        minDuration: 1,
        minUnit: "gün",
        maxDuration: 2,
        maxUnit: "gün",
        color: "#6c757d",
        status: "Aktiv",
    },
    {
        id: 5,
        name: "5 deqiqelik",
        level: 5,
        description: "5 deqiqelik",
        minDuration: 2,
        minUnit: "dəqiqə",
        maxDuration: 5,
        maxUnit: "dəqiqə",
        color: "#343a40",
        status: "Aktiv",
    },
];

export function ApplicationsListPrioritiesModal({ open, onClose }) {
    const { t } = useTranslation();
    const [priorities, setPriorities] = useState(mockPriorities);
    const [showAddPriority, setShowAddPriority] = useState(false);
    const [editingPriority, setEditingPriority] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        level: 1,
        description: "",
        minDuration: 1,
        minUnit: "saat",
        maxDuration: 1,
        maxUnit: "saat",
        color: "#28a745",
        status: "Aktiv",
    });

    if (!open) return null;

    const resetForm = () => {
        setFormData({
            name: "",
            level: 1,
            description: "",
            minDuration: 1,
            minUnit: "saat",
            maxDuration: 1,
            maxUnit: "saat",
            color: "#28a745",
            status: "Aktiv",
        });
        setEditingPriority(null);
        setShowAddPriority(false);
    };

    const handleAddPriority = () => {
        if (formData.name.trim()) {
            const newPriority = {
                id: priorities.length + 1,
                ...formData,
            };
            setPriorities([...priorities, newPriority]);
            resetForm();
        }
    };

    const handleEditPriority = (priority) => {
        setEditingPriority(priority);
        setFormData({
            name: priority.name,
            level: priority.level,
            description: priority.description,
            minDuration: priority.minDuration,
            minUnit: priority.minUnit,
            maxDuration: priority.maxDuration,
            maxUnit: priority.maxUnit,
            color: priority.color,
            status: priority.status,
        });
        setShowAddPriority(true);
    };

    const handleUpdatePriority = () => {
        if (editingPriority && formData.name.trim()) {
            setPriorities(
                priorities.map((p) => (p.id === editingPriority.id ? { ...p, ...formData } : p))
            );
            resetForm();
        }
    };

    const handleDeletePriority = (priorityId) => {
        if (window.confirm(t("applications.list.prioritiesModal.confirmDelete") || "Bu prioriteti silmək istədiyinizə əminsiniz?")) {
            setPriorities(priorities.filter((p) => p.id !== priorityId));
        }
    };

    const getDurationText = (priority) => {
        const minText = `${priority.minDuration} ${priority.minUnit}`;
        const maxText = `${priority.maxDuration} ${priority.maxUnit}`;
        return `${minText} dan ${maxText} qədər`;
    };

    return (
        <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
            <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                    <SparklesIcon className="h-5 w-5 text-blue-500" />
                    <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                        {t("applications.list.prioritiesModal.title") || "Prioritetlər"}
                    </Typography>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        color="blue"
                        onClick={() => {
                            resetForm();
                            setShowAddPriority(true);
                        }}
                        className="dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        <div className="flex">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            {t("applications.list.prioritiesModal.add") || "Əlavə et"}
                        </div>
                    </Button>
                    <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
                        <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
                {showAddPriority && (
                    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700 mb-4">
                        <CardBody className="p-6">
                            <Typography variant="h6" className="mb-4 font-bold dark:text-white">
                                {editingPriority
                                    ? t("applications.list.prioritiesModal.editTitle") || "Prioritet Redaktəsi"
                                    : t("applications.list.prioritiesModal.addNewTitle") || "Yeni Prioritet Yarat"}
                            </Typography>
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                            {t("applications.list.prioritiesModal.priorityName") || "Prioritet Adı"} <span className="text-red-500">*</span>
                                        </Typography>
                                        <Input
                                            placeholder={t("applications.list.prioritiesModal.enterPriorityName") || "Prioritet adını daxil edin"}
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="dark:text-white"
                                            labelProps={{ className: "dark:text-gray-400" }}
                                            containerProps={{ className: "!min-w-0" }}
                                        />
                                    </div>
                                    <div>
                                        <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                            {t("applications.list.prioritiesModal.level") || "Səviyyə"}
                                        </Typography>
                                        <Input
                                            type="number"
                                            value={formData.level}
                                            onChange={(e) => setFormData({ ...formData, level: parseInt(e.target.value) || 1 })}
                                            className="dark:text-white"
                                            labelProps={{ className: "dark:text-gray-400" }}
                                            containerProps={{ className: "!min-w-0" }}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.prioritiesModal.description") || "Təsvir"}
                                    </Typography>
                                    <Textarea
                                        placeholder={t("applications.list.prioritiesModal.enterDescription") || "Prioritet təsvirini daxil edin"}
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="dark:text-white"
                                        labelProps={{ className: "dark:text-gray-400" }}
                                        rows={3}
                                    />
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.prioritiesModal.durationSettings") || "Müddət Tənzimləməsi"}
                                    </Typography>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                                                {t("applications.list.prioritiesModal.minDuration") || "Minimum Müddət"} <span className="text-red-500">*</span>
                                            </Typography>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={formData.minDuration}
                                                    onChange={(e) => setFormData({ ...formData, minDuration: parseInt(e.target.value) || 1 })}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    containerProps={{ className: "!min-w-0 flex-1" }}
                                                />
                                                <Select
                                                    value={formData.minUnit}
                                                    onChange={(val) => setFormData({ ...formData, minUnit: val })}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    containerProps={{ className: "!min-w-0 w-32" }}
                                                >
                                                    <Option value="dəqiqə" className="dark:text-gray-300">
                                                        {t("applications.list.prioritiesModal.minute") || "dəqiqə"}
                                                    </Option>
                                                    <Option value="saat" className="dark:text-gray-300">
                                                        {t("applications.list.prioritiesModal.hour") || "saat"}
                                                    </Option>
                                                    <Option value="gün" className="dark:text-gray-300">
                                                        {t("applications.list.prioritiesModal.day") || "gün"}
                                                    </Option>
                                                </Select>
                                            </div>
                                        </div>
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                                                {t("applications.list.prioritiesModal.maxDuration") || "Maksimum Müddət"} <span className="text-red-500">*</span>
                                            </Typography>
                                            <div className="flex gap-2">
                                                <Input
                                                    type="number"
                                                    value={formData.maxDuration}
                                                    onChange={(e) => setFormData({ ...formData, maxDuration: parseInt(e.target.value) || 1 })}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    containerProps={{ className: "!min-w-0 flex-1" }}
                                                />
                                                <Select
                                                    value={formData.maxUnit}
                                                    onChange={(val) => setFormData({ ...formData, maxUnit: val })}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    containerProps={{ className: "!min-w-0 w-32" }}
                                                >
                                                    <Option value="dəqiqə" className="dark:text-gray-300">
                                                        {t("applications.list.prioritiesModal.minute") || "dəqiqə"}
                                                    </Option>
                                                    <Option value="saat" className="dark:text-gray-300">
                                                        {t("applications.list.prioritiesModal.hour") || "saat"}
                                                    </Option>
                                                    <Option value="gün" className="dark:text-gray-300">
                                                        {t("applications.list.prioritiesModal.day") || "gün"}
                                                    </Option>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.prioritiesModal.appearanceSettings") || "Görünüş Tənzimləməsi"}
                                    </Typography>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                                                {t("applications.list.prioritiesModal.color") || "Rəng"}
                                            </Typography>
                                            <div className="flex gap-2 items-center">
                                                <input
                                                    type="color"
                                                    value={formData.color}
                                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                    className="w-12 h-10 rounded border border-gray-300 dark:border-gray-600 cursor-pointer"
                                                />
                                                <Input
                                                    value={formData.color}
                                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    containerProps={{ className: "!min-w-0 flex-1" }}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <Typography variant="small" color="blue-gray" className="mb-1 dark:text-gray-400">
                                                {t("applications.list.prioritiesModal.status") || "Status"}
                                            </Typography>
                                            <Select
                                                value={formData.status}
                                                onChange={(val) => setFormData({ ...formData, status: val })}
                                                className="dark:text-white"
                                                labelProps={{ className: "dark:text-gray-400" }}
                                                containerProps={{ className: "!min-w-0" }}
                                            >
                                                <Option value="Aktiv" className="dark:text-gray-300">
                                                    {t("applications.list.prioritiesModal.active") || "Aktiv"}
                                                </Option>
                                                <Option value="Deaktiv" className="dark:text-gray-300">
                                                    {t("applications.list.prioritiesModal.inactive") || "Deaktiv"}
                                                </Option>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.prioritiesModal.preview") || "Önizləmə"}
                                    </Typography>
                                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <div
                                            className="w-4 h-4 rounded-full"
                                            style={{ backgroundColor: formData.color }}
                                        />
                                        <Typography variant="small" className="dark:text-white">
                                            {formData.name || t("applications.list.prioritiesModal.priorityName")}
                                        </Typography>
                                        <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                                            ({getDurationText(formData)})
                                        </Typography>
                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                            {formData.status}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        onClick={resetForm}
                                        className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        {t("buttons.cancel") || "Ləğv et"}
                                    </Button>
                                    <Button
                                        color="blue"
                                        onClick={editingPriority ? handleUpdatePriority : handleAddPriority}
                                        className="dark:bg-blue-600 dark:hover:bg-blue-700"
                                    >
                                        {editingPriority
                                            ? t("applications.list.prioritiesModal.update") || "Yenilə"
                                            : t("applications.list.prioritiesModal.create") || "Yarat"}
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}

                <div>
                    <Typography variant="small" className="mb-3 font-semibold dark:text-gray-300">
                        {t("applications.list.prioritiesModal.employeePriority") || "Əməkdaş prioriteti"}
                    </Typography>
                    <div className="space-y-2">
                        {priorities.map((priority) => (
                            <Card key={priority.id} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700">
                                <CardBody className="p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3 flex-1">
                                            <div
                                                className="w-3 h-3 rounded-full"
                                                style={{ backgroundColor: priority.color }}
                                            />
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2">
                                                    <Typography variant="small" className="font-semibold dark:text-white">
                                                        {priority.name}
                                                    </Typography>
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                                                        {priority.status}
                                                    </span>
                                                </div>
                                                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                                                    {getDurationText(priority)}
                                                </Typography>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                size="sm"
                                                variant="text"
                                                color="blue-gray"
                                                onClick={() => handleEditPriority(priority)}
                                                className="dark:text-gray-300 dark:hover:bg-gray-600"
                                            >
                                                <PencilIcon className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="text"
                                                color="red"
                                                onClick={() => handleDeletePriority(priority.id)}
                                                className="dark:text-red-400 dark:hover:bg-red-900/20"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        ))}
                    </div>
                </div>
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    {t("buttons.close") || "Bağla"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}


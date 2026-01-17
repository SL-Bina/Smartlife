import React, { useState } from "react";
import { Dialog, DialogHeader, DialogBody, DialogFooter, Button, Typography, IconButton, Card, CardBody, Input, Textarea } from "@material-tailwind/react";
import { XMarkIcon, PlusIcon, PencilIcon, TrashIcon, TagIcon } from "@heroicons/react/24/outline";
import { useTranslation } from "react-i18next";

// Mock data - real API hazır olduqda değiştirilecek
const mockCategories = [
    {
        id: 1,
        name: "ELEKTRİK SİSTEMİ",
        nameEn: "Electric System",
        subcategories: [
            { id: 1, name: "Zəif axın sistemi", nameEn: "Low current system" },
        ],
    },
    {
        id: 2,
        name: "İŞÇİLİK",
        nameEn: "Labor/Workmanship",
        subcategories: [
            { id: 2, name: "Abadlıq işləri", nameEn: "Landscaping works" },
            { id: 3, name: "Daşınma işləri", nameEn: "Transportation works" },
            { id: 4, name: "Dezinfeksiya işləri", nameEn: "Disinfection works" },
            { id: 5, name: "Təmir işləri", nameEn: "Repair works" },
            { id: 6, name: "Təmizlik işləri", nameEn: "Cleaning works" },
        ],
    },
    {
        id: 3,
        name: "Təmizlik",
        nameEn: "Cleaning Services",
        subcategories: [
            { id: 7, name: "Mənzil / ev təmizliyi", nameEn: "Apartment / house cleaning" },
            { id: 8, name: "Ofis və biznes mərkəzi təmizliyi", nameEn: "Office and business center cleaning" },
            { id: 9, name: "Ticarət və istehsalat sahələrinin təmizliyi", nameEn: "Commercial and industrial area cleaning" },
        ],
    },
];

export function ApplicationsListCategoryModal({ open, onClose }) {
    const { t } = useTranslation();
    const [categories, setCategories] = useState(mockCategories);
    const [expandedCategories, setExpandedCategories] = useState(new Set());
    const [editingCategory, setEditingCategory] = useState(null);
    const [editingSubcategory, setEditingSubcategory] = useState(null);
    const [newCategoryName, setNewCategoryName] = useState("");
    const [newCategoryDescription, setNewCategoryDescription] = useState("");
    const [newSubcategoryName, setNewSubcategoryName] = useState("");
    const [newSubcategoryDescription, setNewSubcategoryDescription] = useState("");
    const [showAddCategory, setShowAddCategory] = useState(false);
    const [showAddSubcategory, setShowAddSubcategory] = useState(null);

    if (!open) return null;

    const toggleCategory = (categoryId) => {
        const newExpanded = new Set(expandedCategories);
        if (newExpanded.has(categoryId)) {
            newExpanded.delete(categoryId);
        } else {
            newExpanded.add(categoryId);
        }
        setExpandedCategories(newExpanded);
    };

    const handleAddCategory = () => {
        if (newCategoryName.trim()) {
            const newCategory = {
                id: categories.length + 1,
                name: newCategoryName,
                nameEn: "",
                description: newCategoryDescription,
                subcategories: [],
            };
            setCategories([...categories, newCategory]);
            setNewCategoryName("");
            setNewCategoryDescription("");
            setShowAddCategory(false);
        }
    };

    const handleAddSubcategory = (categoryId) => {
        if (newSubcategoryName.trim()) {
            setCategories(
                categories.map((cat) =>
                    cat.id === categoryId
                        ? { ...cat, subcategories: [...cat.subcategories, { id: Date.now(), name: newSubcategoryName, nameEn: "", description: newSubcategoryDescription }] }
                        : cat
                )
            );
            setNewSubcategoryName("");
            setNewSubcategoryDescription("");
            setShowAddSubcategory(null);
        }
    };

    const handleEditCategory = (category) => {
        setEditingCategory(category);
        setNewCategoryName(category.name);
    };

    const handleEditSubcategory = (subcategory) => {
        setEditingSubcategory(subcategory);
        setNewSubcategoryName(subcategory.name);
    };

    const handleSaveCategory = () => {
        if (editingCategory && newCategoryName.trim()) {
            setCategories(categories.map((cat) => (cat.id === editingCategory.id ? { ...cat, name: newCategoryName } : cat)));
            setEditingCategory(null);
            setNewCategoryName("");
        }
    };

    const handleSaveSubcategory = () => {
        if (editingSubcategory && newSubcategoryName.trim()) {
            setCategories(
                categories.map((cat) => ({
                    ...cat,
                    subcategories: cat.subcategories.map((sub) => (sub.id === editingSubcategory.id ? { ...sub, name: newSubcategoryName } : sub)),
                }))
            );
            setEditingSubcategory(null);
            setNewSubcategoryName("");
        }
    };

    const handleDeleteCategory = (categoryId) => {
        if (window.confirm(t("applications.list.categoryModal.confirmDeleteCategory") || "Bu kateqoriyanı silmək istədiyinizə əminsiniz?")) {
            setCategories(categories.filter((cat) => cat.id !== categoryId));
        }
    };

    const handleDeleteSubcategory = (categoryId, subcategoryId) => {
        if (window.confirm(t("applications.list.categoryModal.confirmDeleteSubcategory") || "Bu alt kateqoriyanı silmək istədiyinizə əminsiniz?")) {
            setCategories(
                categories.map((cat) =>
                    cat.id === categoryId ? { ...cat, subcategories: cat.subcategories.filter((sub) => sub.id !== subcategoryId) } : cat
                )
            );
        }
    };

    return (
        <Dialog open={open} handler={onClose} size="lg" className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl" dismiss={{ enabled: false }}>
            <DialogHeader className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-gray-800 dark:to-gray-700 border-b border-gray-200 dark:border-gray-700 pb-4 flex items-center justify-between rounded-t-lg">
                <div className="flex items-center gap-3">
                    <TagIcon className="h-5 w-5 text-blue-500" />
                    <Typography variant="h5" className="font-bold text-gray-900 dark:text-white">
                        {t("applications.list.categoryModal.title") || "Kateqoriyalar"}
                    </Typography>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        size="sm"
                        color="blue"
                        onClick={() => setShowAddCategory(true)}
                        className="dark:bg-blue-600 dark:hover:bg-blue-700"
                    >
                        <div className="flex">
                            <PlusIcon className="h-4 w-4 mr-1" />
                            {t("applications.list.categoryModal.add") || "Əlavə et"}
                        </div>
                    </Button>
                    <div className="cursor-pointer p-2 rounded-md transition-all hover:bg-gray-200 dark:hover:bg-gray-700" onClick={onClose}>
                        <XMarkIcon className="dark:text-white h-5 w-5 cursor-pointer" />
                    </div>
                </div>
            </DialogHeader>
            <DialogBody divider className="space-y-4 dark:bg-gray-800 py-6 max-h-[70vh] overflow-y-auto">
                {showAddCategory && (
                    <Card className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700 mb-4">
                        <CardBody className="p-6">
                            <Typography variant="h6" className="mb-4 font-bold dark:text-white">
                                {t("applications.list.categoryModal.addNewCategory") || "Yeni kateqoriya əlavə et"}
                            </Typography>
                            <div className="space-y-4">
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.categoryModal.categoryName") || "Kateqoriya adı"} <span className="text-red-500">*</span>
                                    </Typography>
                                    <Input
                                        placeholder={t("applications.list.categoryModal.enterCategoryName") || "Kateqoriya adını daxil edin"}
                                        value={newCategoryName}
                                        onChange={(e) => setNewCategoryName(e.target.value)}
                                        className="dark:text-white"
                                        labelProps={{ className: "dark:text-gray-400" }}
                                        containerProps={{ className: "!min-w-0" }}
                                    />
                                </div>
                                <div>
                                    <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.categoryModal.description") || "Təsvir"}
                                    </Typography>
                                    <Textarea
                                        placeholder={t("applications.list.categoryModal.enterDescription") || "Kateqoriya təsvirini daxil edin"}
                                        value={newCategoryDescription}
                                        onChange={(e) => setNewCategoryDescription(e.target.value)}
                                        className="dark:text-white"
                                        labelProps={{ className: "dark:text-gray-400" }}
                                        rows={4}
                                    />
                                </div>
                                <div className="flex justify-end gap-2 pt-2">
                                    <Button
                                        variant="outlined"
                                        color="blue-gray"
                                        onClick={() => {
                                            setShowAddCategory(false);
                                            setNewCategoryName("");
                                            setNewCategoryDescription("");
                                        }}
                                        className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                    >
                                        {t("buttons.cancel") || "Ləğv et"}
                                    </Button>
                                    <Button
                                        color="blue"
                                        onClick={handleAddCategory}
                                        className="dark:bg-blue-600 dark:hover:bg-blue-700"
                                    >
                                        {t("applications.list.categoryModal.create") || "Yarat"}
                                    </Button>
                                </div>
                            </div>
                        </CardBody>
                    </Card>
                )}

                {categories.map((category) => (
                    <Card key={category.id} className="border border-gray-200 dark:border-gray-700 dark:bg-gray-700">
                        <CardBody className="p-4">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex-1">
                                    {editingCategory?.id === category.id ? (
                                        <div className="flex items-center gap-2">
                                            <Input
                                                value={newCategoryName}
                                                onChange={(e) => setNewCategoryName(e.target.value)}
                                                className="dark:text-white"
                                                labelProps={{ className: "dark:text-gray-400" }}
                                                containerProps={{ className: "!min-w-0 flex-1" }}
                                            />
                                            <Button size="sm" color="blue" onClick={handleSaveCategory} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                                                {t("buttons.save") || "Yadda saxla"}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outlined"
                                                color="blue-gray"
                                                onClick={() => {
                                                    setEditingCategory(null);
                                                    setNewCategoryName("");
                                                }}
                                                className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                            >
                                                {t("buttons.cancel") || "Ləğv et"}
                                            </Button>
                                        </div>
                                    ) : (
                                        <>
                                            <Typography variant="h6" className="font-bold dark:text-white">
                                                {category.name}
                                            </Typography>
                                            {category.nameEn && (
                                                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                                                    {category.nameEn}
                                                </Typography>
                                            )}
                                        </>
                                    )}
                                </div>
                                {!editingCategory && (
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="text"
                                            color="blue-gray"
                                            onClick={() => {
                                                setShowAddSubcategory(category.id);
                                                toggleCategory(category.id);
                                            }}
                                            className="dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            <div className="flex">
                                                <PlusIcon className="h-4 w-4 mr-1" />
                                                {t("applications.list.categoryModal.addSubcategory") || "Alt kateqoriya"}
                                            </div>
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="text"
                                            color="blue-gray"
                                            onClick={() => handleEditCategory(category)}
                                            className="dark:text-gray-300 dark:hover:bg-gray-600"
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                        <IconButton
                                            size="sm"
                                            variant="text"
                                            color="red"
                                            onClick={() => handleDeleteCategory(category.id)}
                                            className="dark:text-red-400 dark:hover:bg-red-900/20"
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </IconButton>
                                    </div>
                                )}
                            </div>

                            {category.subcategories.length > 0 && (
                                <>
                                    <Typography variant="small" className="mb-2 font-semibold dark:text-gray-300">
                                        {t("applications.list.categoryModal.subcategories") || "Alt kateqoriyalar:"}
                                    </Typography>
                                    <div className="space-y-2">
                                        {category.subcategories.map((subcategory) => (
                                            <div key={subcategory.id} className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                                {editingSubcategory?.id === subcategory.id ? (
                                                    <div className="flex items-center gap-2 flex-1">
                                                        <Input
                                                            value={newSubcategoryName}
                                                            onChange={(e) => setNewSubcategoryName(e.target.value)}
                                                            className="dark:text-white"
                                                            labelProps={{ className: "dark:text-gray-400" }}
                                                            containerProps={{ className: "!min-w-0 flex-1" }}
                                                        />
                                                        <Button size="sm" color="blue" onClick={handleSaveSubcategory} className="dark:bg-blue-600 dark:hover:bg-blue-700">
                                                            {t("buttons.save") || "Yadda saxla"}
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outlined"
                                                            color="blue-gray"
                                                            onClick={() => {
                                                                setEditingSubcategory(null);
                                                                setNewSubcategoryName("");
                                                            }}
                                                            className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                        >
                                                            {t("buttons.cancel") || "Ləğv et"}
                                                        </Button>
                                                    </div>
                                                ) : (
                                                    <>
                                                        <div className="flex-1">
                                                            <Typography variant="small" className="dark:text-white">
                                                                {subcategory.name}
                                                            </Typography>
                                                            {subcategory.nameEn && (
                                                                <Typography variant="small" className="text-gray-500 dark:text-gray-400">
                                                                    {subcategory.nameEn}
                                                                </Typography>
                                                            )}
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                variant="text"
                                                                color="blue-gray"
                                                                onClick={() => handleEditSubcategory(subcategory)}
                                                                className="dark:text-gray-300 dark:hover:bg-gray-600"
                                                            >
                                                                <PencilIcon className="h-4 w-4" />
                                                            </Button>
                                                            <Button
                                                                size="sm"
                                                                variant="text"
                                                                color="red"
                                                                onClick={() => handleDeleteSubcategory(category.id, subcategory.id)}
                                                                className="dark:text-red-400 dark:hover:bg-red-900/20"
                                                            >
                                                                <TrashIcon className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {showAddSubcategory === category.id && (
                                <Card className="border border-gray-200 dark:border-gray-600 dark:bg-gray-800 mt-4">
                                    <CardBody className="p-6">
                                        <Typography variant="h6" className="mb-4 font-bold dark:text-white">
                                            {t("applications.list.categoryModal.addSubcategory") || "Alt kateqoriya əlavə et"}
                                        </Typography>
                                        <div className="space-y-4">
                                            <div>
                                                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                                    {t("applications.list.categoryModal.categoryName") || "Kateqoriya adı"} <span className="text-red-500">*</span>
                                                </Typography>
                                                <Input
                                                    placeholder={t("applications.list.categoryModal.enterCategoryName") || "Kateqoriya adını daxil edin"}
                                                    value={newSubcategoryName}
                                                    onChange={(e) => setNewSubcategoryName(e.target.value)}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    containerProps={{ className: "!min-w-0" }}
                                                />
                                            </div>
                                            <div>
                                                <Typography variant="small" color="blue-gray" className="mb-2 font-semibold dark:text-gray-300">
                                                    {t("applications.list.categoryModal.description") || "Təsvir"}
                                                </Typography>
                                                <Textarea
                                                    placeholder={t("applications.list.categoryModal.enterDescription") || "Kateqoriya təsvirini daxil edin"}
                                                    value={newSubcategoryDescription}
                                                    onChange={(e) => setNewSubcategoryDescription(e.target.value)}
                                                    className="dark:text-white"
                                                    labelProps={{ className: "dark:text-gray-400" }}
                                                    rows={4}
                                                />
                                            </div>
                                            <div>
                                                <Typography variant="small" color="blue-gray" className="dark:text-gray-400">
                                                    {t("applications.list.categoryModal.parentCategory") || "Ana kateqoriya"}: <span className="font-semibold dark:text-gray-300">{category.name}</span>
                                                </Typography>
                                            </div>
                                            <div className="flex justify-end gap-2 pt-2">
                                                <Button
                                                    variant="outlined"
                                                    color="blue-gray"
                                                    onClick={() => {
                                                        setShowAddSubcategory(null);
                                                        setNewSubcategoryName("");
                                                        setNewSubcategoryDescription("");
                                                    }}
                                                    className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
                                                >
                                                    {t("buttons.cancel") || "Ləğv et"}
                                                </Button>
                                                <Button
                                                    color="blue"
                                                    onClick={() => handleAddSubcategory(category.id)}
                                                    className="dark:bg-blue-600 dark:hover:bg-blue-700"
                                                >
                                                    {t("applications.list.categoryModal.create") || "Yarat"}
                                                </Button>
                                            </div>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </CardBody>
                    </Card>
                ))}
            </DialogBody>
            <DialogFooter className="flex justify-end gap-2 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 pt-4">
                <Button variant="outlined" color="blue-gray" onClick={onClose} className="dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700">
                    {t("buttons.close") || "Bağla"}
                </Button>
            </DialogFooter>
        </Dialog>
    );
}


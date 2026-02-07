import React, { useState, useEffect } from 'react';
import {
    UserIcon,
    DevicePhoneMobileIcon,
    CakeIcon,
    IdentificationIcon,
    XMarkIcon,
    EnvelopeIcon,
    ChartBarIcon,
} from '@heroicons/react/24/outline';
import profileAPI from "../api/index";
import { useTranslation } from 'react-i18next';

// Helper: normalize date for <input type="date">
const normalizeDate = (value) => {
    if (!value) return "";
    if (typeof value !== "string") return "";
    // Remove time part if present and return YYYY-MM-DD
    return value.split("T")[0].split(" ")[0];
};

const ProfilePage = () => {
    const { t, i18n } = useTranslation();

    // ────────────────────────────────────────────────
    // Dil dəyişikliyinin işlədiyini yoxlamaq üçün (sonradan silə bilərsən)
    useEffect(() => {
        console.log("Cari aktiv dil:", i18n.language);
    }, [i18n.language]);
    // ────────────────────────────────────────────────

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeTab, setActiveTab] = useState("personal");
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);

    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        username: "",
        email: "",
        phone: "",
        birthday: "",
        address: "Baku, Azerbaijan",
        personal_code: "",
        password: "",
        password_confirmation: "",
    });

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                const response = await profileAPI.getMe();

                console.log("[PROFILE] Full API response:", response);

                const userObj = response?.data?.user_data || response?.user_data || response?.data?.user || response?.data || response;

                console.log("[PROFILE] Selected user object:", userObj);

                setUserData(userObj || {});

                setFormData({
                    name: userObj?.name || "",
                    username: userObj?.username || "",
                    email: userObj?.email || "",
                    phone: userObj?.phone || "",
                    birthday: normalizeDate(userObj?.birthday),
                    address: userObj?.address || "Baku, Azerbaijan",
                    personal_code: userObj?.personal_code || "",
                    password: "",
                    password_confirmation: "",
                });
            } catch (error) {
                console.error("Failed to load profile:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            setUpdating(true);
            const response = await profileAPI.updateMe(formData, userData);
            const updated = response?.data?.user_data || response?.user_data || response?.data?.user || response?.data || response;

            setUserData(updated);
            setIsModalOpen(false);
            alert(t('profile.updateSuccess'));
        } catch (error) {
            const msg = error.allErrors?.join?.("\n") || error.message || t('common.errorOccurred');
            alert(msg);
        } finally {
            setUpdating(false);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleDateString("az-AZ", {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    const formatLongDate = (dateStr) => {
        if (!dateStr) return "—";
        try {
            return new Date(dateStr).toLocaleDateString("az-AZ", {
                year: "numeric",
                month: "long",
                day: "numeric",
            });
        } catch {
            return dateStr;
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <div className="flex flex-col items-center gap-3">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                    <p className="text-gray-600 dark:text-gray-300">{t('common.loading')}</p>
                </div>
            </div>
        );
    }

    if (!userData || !userData.id) {
        return (
            <div className="min-h-screen p-8 text-center text-red-600 dark:text-red-400">
                <h2 className="text-2xl font-bold mb-4">{t('profile.dataNotFound')}</h2>
                <p className="mb-6">{t('profile.checkConsole')}</p>
                <pre className="bg-gray-100 dark:bg-gray-800 p-6 rounded text-left overflow-auto max-w-4xl mx-auto text-sm text-gray-800 dark:text-gray-200">
                    {JSON.stringify(userData, null, 2) || "boş / null"}
                </pre>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-6 text-gray-900 dark:text-gray-100">
            {/* Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow border border-gray-200 dark:border-gray-700 p-6 mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center text-white">
                        {userData?.profile_photo ? (
                            <img src={userData.profile_photo} alt="Profil" className="w-full h-full object-cover rounded-xl" />
                        ) : (
                            <UserIcon className="w-9 h-9" />
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-bold">{userData.name || t('profile.nameNotSet')}</h2>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">
                            {userData.username ? `@${userData.username}` : t('profile.usernameNotSet')}
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition"
                >
                    {t('profile.editProfile')}
                </button>
            </div>

            {/* Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Şəxsi məlumatlar */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-5">
                        <UserIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{t('profile.personalInfo')}</h3>
                    </div>
                    <div className="space-y-4">
                        <InfoBox label={t('profile.fullName')} value={userData.name} />
                        <InfoBox label={t('profile.gender')} value={userData.gender === "male" ? t('profile.genderMale') : userData.gender === "female" ? t('profile.genderFemale') : "—"} />
                        <InfoBox label={t('profile.birthDate')} value={formatDate(userData.birthday)} />
                        <InfoBox label={t('profile.personalCode')} value={userData.personal_code} />
                    </div>
                </div>

                {/* Əlaqə məlumatları */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-5">
                        <EnvelopeIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{t('profile.contactInfo')}</h3>
                    </div>
                    <div className="space-y-4">
                        <InfoBox label={t('profile.email')} value={userData.email} />
                        <InfoBox label={t('profile.phone')} value={userData.phone} />
                        <InfoBox label={t('profile.address')} value={userData.address || "Baku, Azerbaijan"} />
                    </div>
                </div>

                {/* Hesab vəziyyəti - YALNIZ BURADA DÜZƏLİŞ VAR */}
                <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow border border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 mb-5">
                        <ChartBarIcon className="w-5 h-5 text-blue-600" />
                        <h3 className="text-lg font-semibold">{t('profile.accountStatus')}</h3>
                    </div>
                    <div className="space-y-4 text-sm">
                        <div
                            key={`account-status-key-${i18n.language}-${userData?.status || 'unknown'}`}
                            className={`p-4 rounded-xl ${userData.status
                                ? "bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200"
                                : "bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200"
                                }`}
                        >
                            {t('profile.account')} <strong>{userData.status ? t('profile.active') : t('profile.inactive')}</strong>
                        </div>
                        <div className="flex justify-between py-2 border-b dark:border-gray-700">
                            <span className="text-gray-600 dark:text-gray-400">{t('profile.id')}</span>
                            <span className="font-medium">#{userData.id}</span>
                        </div>
                        <div className="flex justify-between py-2">
                            <span className="text-gray-600 dark:text-gray-400">{t('profile.lastUpdated')}</span>
                            <span className="font-medium">{formatLongDate(userData.updated_at)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
                    <form
                        onSubmit={handleUpdate}
                        className="bg-white dark:bg-gray-800 w-full max-w-2xl rounded-2xl shadow-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                    >
                        <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
                            <h3 className="text-xl font-semibold">{t('profile.editProfile')}</h3>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                            >
                                <XMarkIcon className="w-6 h-6 text-gray-500 dark:text-gray-400" />
                            </button>
                        </div>

                        <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
                            <TabBtn
                                active={activeTab === "personal"}
                                label={t('profile.personalInfo')}
                                onClick={() => setActiveTab("personal")}
                            />
                            <TabBtn
                                active={activeTab === "password"}
                                label={t('profile.changePassword')}
                                onClick={() => setActiveTab("password")}
                            />
                        </div>

                        <div className="p-6 overflow-y-auto flex-1 space-y-5">
                            {activeTab === "personal" ? (
                                <>
                                    <Input label={t('profile.fullName')} name="name" value={formData.name} onChange={handleChange} />
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input label={t('profile.username')} name="username" value={formData.username} onChange={handleChange} />
                                        <Input label={t('profile.email')} name="email" value={formData.email} onChange={handleChange} type="email" />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                        <Input label={t('profile.birthDate')} name="birthday" value={formData.birthday} onChange={handleChange} type="date" />
                                        <Input label={t('profile.phone')} name="phone" value={formData.phone} onChange={handleChange} type="tel" />
                                    </div>
                                    <Input label={t('profile.personalCode')} name="personal_code" value={formData.personal_code} onChange={handleChange} />
                                </>
                            ) : (
                                <>
                                    <Input label={t('profile.newPassword')} name="password" type="password" value={formData.password} onChange={handleChange} />
                                    <Input label={t('profile.confirmPassword')} name="password_confirmation" type="password" value={formData.password_confirmation} onChange={handleChange} />
                                </>
                            )}
                        </div>

                        <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex justify-end gap-3">
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="px-6 py-2.5 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
                            >
                                {t('common.cancel')}
                            </button>
                            <button
                                type="submit"
                                disabled={updating}
                                className={`px-8 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition disabled:opacity-50 ${updating ? "opacity-60 cursor-not-allowed" : ""
                                    }`}
                            >
                                {updating ? t('common.saving') : t('common.save')}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

// ────────────────────────────────────────────────
// Helper components (dəyişməz qalır)
// ────────────────────────────────────────────────

const InfoBox = ({ label, value }) => (
    <div className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0 last:pb-0">
        <p className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">{label}</p>
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{value || "—"}</p>
    </div>
);

const TabBtn = ({ active, label, onClick }) => (
    <button
        type="button"
        onClick={onClick}
        className={`flex-1 py-3.5 text-xs font-semibold uppercase tracking-wide transition ${active
            ? "border-b-2 border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-gray-800"
            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
            }`}
    >
        {label}
    </button>
);

const Input = ({ label, type = "text", value, name, onChange, ...rest }) => (
    <div className="flex flex-col">
        <label className="text-xs font-semibold text-gray-500 dark:text-gray-400 mb-1.5 uppercase tracking-wide">
            {label}
        </label>
        <input
            type={type}
            name={name}
            value={value}
            onChange={onChange}
            className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 transition text-sm"
            {...rest}
        />
    </div>
);

export default ProfilePage;
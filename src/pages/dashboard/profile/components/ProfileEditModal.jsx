import React, { useState } from 'react';
import { XMarkIcon, UserIcon, DevicePhoneMobileIcon, MapPinIcon, CakeIcon } from '@heroicons/react/24/outline';
import { profileAPI } from '../api';

const ProfileEditModal = ({ user, onClose, onSuccess }) => {
    const [formData, setFormData] = useState({
        name: user?.name || "",
        username: user?.username || "",
        email: user?.email || "",
        phone: user?.phone || "",
        birthday: user?.birthday || "",
        personal_code: user?.personal_code || ""
    });

    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await profileAPI.updateMe(formData, user);
            onSuccess(); // Səhifəni yenilə və modalı bağla
        } catch (err) {
            alert(err.message || "Xəta baş verdi");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Modal Header */}
                <div className="p-6 border-b flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-bold text-slate-800">Profili Redaktə Et</h3>
                    <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition">
                        <XMarkIcon className="w-6 h-6 text-gray-500" />
                    </button>
                </div>

                {/* Modal Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto max-h-[70vh]">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModalInput
                            label="Ad Soyad"
                            value={formData.name}
                            onChange={(v) => setFormData({ ...formData, name: v })}
                        />
                        <ModalInput
                            label="İstifadəçi adı"
                            value={formData.username}
                            onChange={(v) => setFormData({ ...formData, username: v })}
                        />
                    </div>
                    <ModalInput
                        label="E-poçt"
                        type="email"
                        value={formData.email}
                        onChange={(v) => setFormData({ ...formData, email: v })}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <ModalInput
                            label="Telefon"
                            icon={<DevicePhoneMobileIcon className="w-5 h-5" />}
                            value={formData.phone}
                            onChange={(v) => setFormData({ ...formData, phone: v })}
                        />
                        <ModalInput
                            label="Doğum Tarixi"
                            type="date"
                            icon={<CakeIcon className="w-5 h-5" />}
                            value={formData.birthday}
                            onChange={(v) => setFormData({ ...formData, birthday: v })}
                        />
                    </div>
                    <ModalInput
                        label="FIN (Şəxsi Kod)"
                        value={formData.personal_code}
                        onChange={(v) => setFormData({ ...formData, personal_code: v })}
                    />
                </form>

                {/* Modal Footer */}
                <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
                    <button onClick={onClose} className="px-6 py-2 border rounded-xl font-semibold text-gray-600 hover:bg-white transition">Ləğv et</button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-lg disabled:opacity-50"
                    >
                        {loading ? "Yadda saxlanılır..." : "Yadda Saxla"}
                    </button>
                </div>
            </div>
        </div>
    );
};

const ModalInput = ({ label, value, onChange, type = "text", icon }) => (
    <div className="flex flex-col">
        <label className="text-[10px] font-bold text-gray-400 mb-1 ml-1 uppercase">{label}</label>
        <div className="relative">
            {icon && <div className="absolute left-3 top-2.5 text-gray-400">{icon}</div>}
            <input
                type={type}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className={`w-full border border-gray-200 rounded-xl py-2.5 px-3 focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition text-sm ${icon ? 'pl-10' : ''}`}
            />
        </div>
    </div>
);

export default ProfileEditModal;
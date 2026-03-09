import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
} from "@material-tailwind/react";
import {
    Cog6ToothIcon, XMarkIcon, CreditCardIcon,
    CpuChipIcon, EnvelopeIcon, EyeIcon, EyeSlashIcon,
} from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import { useComplexSettings } from "../../hooks/useComplexSettings";

const ACTIVE_COLOR = "#3b82f6";

function SectionHeader({ icon: Icon, title, color = "blue" }) {
    const colors = {
        blue: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400",
        purple: "bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400",
        green: "bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400",
    };
    return (
        <div className="flex items-center gap-3 mb-4">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${colors[color]}`}>
                <Icon className="h-5 w-5" />
            </div>
            <Typography className="font-semibold text-gray-800 dark:text-white">
                {title}
            </Typography>
        </div>
    );
}

function SettingsInput({ label, value, onChange, type = "text", placeholder = "" }) {
    const [show, setShow] = React.useState(false);
    const isPassword = type === "password";
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <div className="relative">
                <input
                    type={isPassword && !show ? "password" : "text"}
                    value={value ?? ""}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 pr-9"
                />
                {isPassword && (
                    <button
                        type="button"
                        onClick={() => setShow((s) => !s)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        {show ? <EyeSlashIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </button>
                )}
            </div>
        </div>
    );
}

function SettingsSelect({ label, value, onChange, options = [] }) {
    return (
        <div>
            <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">{label}</label>
            <select
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
            </select>
        </div>
    );
}

export default function ComplexSettingsModal({ open, onClose, complexId, complexData }) {
    const { config, updateField, updateNestedField, setConfigFromData, save, loading } = useComplexSettings();

    const [toast, setToast] = React.useState({ open: false, type: "info", message: "" });

    React.useEffect(() => {
        if (open && complexData?.config) {
            setConfigFromData(complexData.config);
        }
    }, [open, complexData]);

    const handleSave = async () => {
        const result = await save(complexId);
        if (result.success) {
            setToast({ open: true, type: "success", message: "Parametrlər uğurla yeniləndi" });
            setTimeout(() => onClose?.(), 800);
        } else {
            setToast({ open: true, type: "error", message: result.message });
        }
    };

    if (!open) return null;

    const dev = config.integrations?.device || {};
    const mail = config.mail || {};

    return (
        <>
            <Dialog
                open={open}
                handler={onClose}
                size="lg"
                className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
                dismiss={{ enabled: false }}
            >
                <DialogHeader
                    className="flex justify-between items-center text-white"
                    style={{ background: `linear-gradient(to right, ${ACTIVE_COLOR}, #1d4ed8)` }}
                >
                    <div className="flex items-center gap-3">
                        <Cog6ToothIcon className="h-6 w-6" />
                        <Typography variant="h6" className="text-white font-bold">
                            Kompleks Parametrləri
                        </Typography>
                    </div>
                    <Button variant="text" size="sm" onClick={onClose} className="text-white hover:bg-white/10">
                        <XMarkIcon className="h-5 w-5" />
                    </Button>
                </DialogHeader>

                <DialogBody className="p-6 space-y-6 overflow-y-auto max-h-[75vh] bg-gray-50 dark:bg-gray-900">

                    {/* Pre-Paid */}
                    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                        <SectionHeader icon={CreditCardIcon} title="Ödəniş Konfiqurasiyası" color="blue" />
                        <div className="flex items-center justify-between">
                            <div>
                                <Typography className="font-medium text-gray-800 dark:text-white text-sm">Pre-Paid Sistemi</Typography>
                                <Typography className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    Sakinlər balans yükləyərək xidmətlərdən istifadə edəcək.
                                </Typography>
                                <span className={`mt-2 block text-xs font-medium ${config.pre_paid ? "text-green-600 dark:text-green-400" : "text-gray-400"}`}>
                                    ● {config.pre_paid ? "Aktivdir" : "Aktiv deyil"}
                                </span>
                            </div>
                            <div
                                onClick={() => updateField("pre_paid", !config.pre_paid)}
                                className={`relative w-14 h-8 flex items-center rounded-full transition-all duration-300 cursor-pointer ${config.pre_paid ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30" : "bg-gray-300 dark:bg-gray-600"}`}
                            >
                                <div className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${config.pre_paid ? "translate-x-6" : "translate-x-0"}`} />
                            </div>
                        </div>
                    </div>

                    {/* Device Integration */}
                    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                        <SectionHeader icon={CpuChipIcon} title="Cihaz İnteqrasiyası" color="purple" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <SettingsSelect
                                label="Bağlantı növü"
                                value={dev.device_connection}
                                onChange={(v) => updateNestedField("integrations.device.device_connection", v)}
                                options={[
                                    { value: "", label: "-- Seçin --" },
                                    { value: "basip_project", label: "Basip Project" },
                                    { value: "hikvision", label: "Hikvision" },
                                    { value: "dahua", label: "Dahua" },
                                ]}
                            />
                            <SettingsInput
                                label="Panel login"
                                value={dev.device_panel_login}
                                onChange={(v) => updateNestedField("integrations.device.device_panel_login", v)}
                                placeholder="info@example.com"
                            />
                            <SettingsInput
                                label="Panel şifrə"
                                type="password"
                                value={dev.device_panel_password}
                                onChange={(v) => updateNestedField("integrations.device.device_panel_password", v)}
                            />
                        </div>
                    </div>

                    {/* Mail */}
                    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5">
                        <SectionHeader icon={EnvelopeIcon} title="Mail Konfiqurasiyası" color="green" />
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <SettingsSelect
                                label="Driver"
                                value={mail.driver}
                                onChange={(v) => updateNestedField("mail.driver", v)}
                                options={[
                                    { value: "smtp", label: "SMTP" },
                                    { value: "sendmail", label: "Sendmail" },
                                    { value: "mailgun", label: "Mailgun" },
                                    { value: "ses", label: "Amazon SES" },
                                ]}
                            />
                            <SettingsSelect
                                label="Ŝifrləmə (encryption)"
                                value={mail.encryption}
                                onChange={(v) => updateNestedField("mail.encryption", v)}
                                options={[
                                    { value: "tls", label: "TLS" },
                                    { value: "ssl", label: "SSL" },
                                    { value: "", label: "Hərəkətsiz (none)" },
                                ]}
                            />
                            <SettingsInput
                                label="Host"
                                value={mail.host}
                                onChange={(v) => updateNestedField("mail.host", v)}
                                placeholder="smtp.gmail.com"
                            />
                            <SettingsInput
                                label="Port"
                                value={mail.port}
                                onChange={(v) => updateNestedField("mail.port", v === "" ? "" : Number(v))}
                                placeholder="587"
                            />
                            <SettingsInput
                                label="İstifadəçi adı (username)"
                                value={mail.username}
                                onChange={(v) => updateNestedField("mail.username", v)}
                                placeholder="you@gmail.com"
                            />
                            <SettingsInput
                                label="Şifrə"
                                type="password"
                                value={mail.password}
                                onChange={(v) => updateNestedField("mail.password", v)}
                            />
                            <SettingsInput
                                label="Göndərən ünvan (from_address)"
                                value={mail.from_address}
                                onChange={(v) => updateNestedField("mail.from_address", v)}
                                placeholder="noreply@example.com"
                            />
                            <SettingsInput
                                label="Göndərən ad (from_name)"
                                value={mail.from_name}
                                onChange={(v) => updateNestedField("mail.from_name", v)}
                                placeholder="SmartLife"
                            />
                        </div>
                    </div>

                </DialogBody>

                <DialogFooter className="border-t dark:border-gray-700 flex justify-between bg-white dark:bg-gray-800">
                    <Button variant="outlined" onClick={onClose} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                        Ləğv et
                    </Button>
                    <Button
                        onClick={handleSave}
                        disabled={loading}
                        style={{ backgroundColor: ACTIVE_COLOR }}
                        className="text-white hover:shadow-lg transition-all duration-300 disabled:opacity-50"
                    >
                        {loading ? "Yadda saxlanılır..." : "Yadda saxla"}
                    </Button>
                </DialogFooter>
            </Dialog>

            <DynamicToast
                open={toast.open}
                type={toast.type}
                message={toast.message}
                onClose={() => setToast((t) => ({ ...t, open: false }))}
            />
        </>
    );
}

import React from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    Button,
    Typography,
    Switch,
} from "@material-tailwind/react";
import { Cog6ToothIcon, XMarkIcon, CreditCardIcon, BellAlertIcon } from "@heroicons/react/24/outline";
import DynamicToast from "@/components/DynamicToast";
import { useComplexSettings } from "../../hooks/useComplexSettings";

const ACTIVE_COLOR = "#3b82f6";

export default function ComplexSettingsModal({
    open,
    onClose,
    complexId,
    complexData,
}) {
    const {
        config,
        updateField,
        setConfigFromData,
        save,
        loading,
    } = useComplexSettings();

    const [toast, setToast] = React.useState({
        open: false,
        type: "info",
        message: "",
    });

    React.useEffect(() => {
        if (open && complexData?.config) {
            setConfigFromData(complexData.config);
        }
    }, [open, complexData]);

    const setConfig = (newConfig) => {
        setConfigFromData(newConfig);
    };

    const handleSave = async () => {
        const result = await save(complexId);

        if (result.success) {
            setToast({
                open: true,
                type: "success",
                message: "Parametrlər uğurla yeniləndi",
            });
            setTimeout(() => onClose?.(), 800);
        } else {
            setToast({
                open: true,
                type: "error",
                message: result.message,
            });
        }
    };

    if (!open) return null;

    return (
        <>
            <Dialog
                open={open}
                handler={onClose}
                size="md"
                className="dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
            >
                <DialogHeader
                    className="flex justify-between items-center text-white"
                    style={{
                        background: `linear-gradient(to right, ${ACTIVE_COLOR}, #1d4ed8)`,
                    }}
                >
                    <div className="flex items-center gap-3">
                        <Cog6ToothIcon className="h-6 w-6" />
                        <Typography variant="h6" className="text-white font-bold">
                            Compleks parametrləri
                        </Typography>
                    </div>
                    <Button
                        variant="text"
                        size="sm"
                        onClick={onClose}
                        className="text-white hover:bg-white/10"
                    >
                        <XMarkIcon className="h-5 w-5" />
                    </Button>
                </DialogHeader>

                <DialogBody className="p-0 bg-gray-50 dark:bg-gray-900">

                    <div className="p-6 space-y-6">

                        <div>
                            <Typography className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                                Ödəniş Konfiqurasiyası
                            </Typography>

                            <div className="flex items-center justify-between rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 transition-all duration-300 hover:shadow-md">

                                <div className="flex items-start gap-4">
                                    <div className="w-11 h-11 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                                        <CreditCardIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                                    </div>

                                    <div>
                                        <Typography className="font-semibold text-gray-900 dark:text-white">
                                            Pre-Paid Sistemi
                                        </Typography>
                                        <Typography className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Sakinlər balans yükləyərək xidmətlərdən istifadə edəcək.
                                        </Typography>

                                        <div className="mt-3 text-xs font-medium">
                                            {config.pre_paid ? (
                                                <span className="text-green-600 dark:text-green-400">
                                                    ● Aktivdir
                                                </span>
                                            ) : (
                                                <span className="text-gray-400">
                                                    ● Aktiv deyil
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div
                                    onClick={() => setConfig({ ...config, pre_paid: !config.pre_paid })}
                                    className={`relative w-14 h-8 flex items-center rounded-full transition-all duration-300 cursor-pointer ${config.pre_paid
                                        ? "bg-gradient-to-r from-blue-500 to-blue-600 shadow-lg shadow-blue-500/30"
                                        : "bg-gray-300 dark:bg-gray-600"
                                        }`}
                                >
                                    <div
                                        className={`absolute left-1 w-6 h-6 bg-white rounded-full shadow-md transform transition-all duration-300 ${config.pre_paid ? "translate-x-6" : "translate-x-0"
                                            }`}
                                    />
                                </div>


                            </div>
                        </div>

                        <div className="border-t border-dashed border-gray-300 dark:border-gray-700"></div>

                        <div>
                            <Typography className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                                Gələcək Modullar
                            </Typography>

                            <div className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-5 space-y-4">

                                {[
                                    {
                                        title: "SMS API",
                                        desc: "Avtomatik bildiriş və OTP sistemi",
                                    },
                                    {
                                        title: "Payment Gateway",
                                        desc: "Onlayn kart və bank ödənişləri",
                                    },
                                    {
                                        title: "Email Service",
                                        desc: "Sistem bildirişlərinin email vasitəsilə göndərilməsi",
                                    },
                                ].map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-start justify-between border-b last:border-b-0 border-gray-200 dark:border-gray-700 pb-3 last:pb-0"
                                    >
                                        <div>
                                            <Typography className="font-medium text-gray-800 dark:text-gray-200">
                                                {item.title}
                                            </Typography>
                                            <Typography className="text-sm text-gray-500 dark:text-gray-400">
                                                {item.desc}
                                            </Typography>
                                        </div>

                                        <span className="text-xs px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-300">
                                            Coming Soon
                                        </span>
                                    </div>
                                ))}

                            </div>
                        </div>

                    </div>
                </DialogBody>

                <DialogFooter className="border-t dark:border-gray-700 flex justify-between bg-white dark:bg-gray-800">
                    <Button
                        variant="outlined"
                        onClick={onClose}
                        className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
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
                onClose={() => setToast({ ...toast, open: false })}
            />
        </>
    );
}
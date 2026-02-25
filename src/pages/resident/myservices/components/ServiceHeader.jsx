import { BuildingOfficeIcon } from '@heroicons/react/24/outline'
import { Typography } from '@material-tailwind/react'
import React from 'react'
import { useTranslation } from 'react-i18next'

const ServiceHeader = () => {
    const { t } = useTranslation();
    return (
        <header>
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 dark:from-blue-700 dark:to-blue-900 p-4 rounded-xl shadow-lg border border-blue-500 dark:border-blue-700">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <BuildingOfficeIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <Typography variant="h4" className="text-white font-bold">
                            {t("services.myServices") || "Mənim Xidmətlərim"}
                        </Typography>
                        <Typography variant="small" className="text-blue-100 dark:text-blue-200">
                            {t("services.service") || "xidmət"}
                        </Typography>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ServiceHeader
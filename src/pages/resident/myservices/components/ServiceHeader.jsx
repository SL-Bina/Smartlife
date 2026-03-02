import { CogIcon } from '@heroicons/react/24/outline'
import { Typography } from '@material-tailwind/react'
import React from 'react'
import { useTranslation } from 'react-i18next'
import { useComplexColor } from '@/hooks/useComplexColor'

const ServiceHeader = () => {
    const { t } = useTranslation();
    const { headerStyle } = useComplexColor();
    return (
        <header>
            <div className="p-4 sm:p-6 rounded-xl shadow-lg border" style={headerStyle}>
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-white/20 rounded-lg">
                        <CogIcon className="h-8 w-8 text-white" />
                    </div>
                    <div>
                        <Typography variant="h4" className="text-white font-bold">
                            {t("services.myServices") || " Xidmətlərim"}
                        </Typography>
                        <Typography variant="small" className="text-white/80">
                            {t("services.service") || "xidmət"}
                        </Typography>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default ServiceHeader
import Logo from './Logo';
import LoginForm from './LoginForm';
import QuoteSection from './QuoteSection';
import SiteLogo from '../../../../public/Site_Logo/color_big.png'
import { useTranslation } from 'react-i18next';

export default function LoginSplitQuoteImage02() {
    const { t } = useTranslation();

    return (
        <div className="grid min-h-screen grid-cols-1 bg-primary lg:grid-cols-2">
            <div className="relative flex min-h-screen items-center justify-center px-4 py-12 md:px-8 z-20">
                <div className="absolute inset-0 z-0 lg:hidden">
                    <img
                        src="https://static.propsearch.ae/dubai-locations/rise-residence_SB4bC_xl.jpg"
                        alt="Background"
                        className="h-full w-full object-cover opacity-40"
                    />
                    <div className="absolute inset-0 bg-black/20" />
                </div>

                <div className="relative z-10 flex w-full flex-col gap-8 sm:max-w-90 items-center">
                    <div className="flex flex-col gap-8 items-center">
                        <Logo />
                        <div className="flex flex-col gap-2 md:gap-3">
                            <img
                                src={SiteLogo}
                                alt="SiteLogo"
                                className="w-[120px] h-[120px] object-contain"
                            />
                        </div>
                    </div>
                    <LoginForm />
                </div>
            </div>

            <QuoteSection />

            <footer className="fixed bottom-0 left-0 text-gray-400 py-6 px-4 text-sm z-50 mt-[30px]">
                {t('© 2026 SmartLife. Bütün hüquqlar qorunur.')}
            </footer>
        </div>
    );
}
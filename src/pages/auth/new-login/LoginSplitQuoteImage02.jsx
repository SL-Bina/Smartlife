import Logo from './Logo';
import LoginForm from './LoginForm';
import QuoteSection from './QuoteSection';

export default function LoginSplitQuoteImage02() {
    return (
        <>
            <div className="grid min-h-screen grid-cols-1 bg-primary lg:grid-cols-2">
                {/* Sol tərəf - Forma sahəsi */}
                <div className="relative flex justify-center px-4 py-12 md:items-center md:px-8">
                    <div className="flex w-full flex-col gap-8 sm:max-w-90">

                        {/* pl-20 əlavə edildi: 20 * 4px = 80px sağa (soldan boşluq) sürüşdürmə */}
                        <div className="flex flex-col gap-8 pl-40">
                            <Logo />

                            <div className="flex flex-col gap-2 md:gap-3">
                                <h1 className="text-[35px] font-bold text-black leading-tight">
                                    Welcome back
                                </h1>
                                <p className="text-md text-tertiary">
                                    Welcome back! Please enter your details.
                                </p>
                            </div>
                        </div>
                        <LoginForm />

                    </div>
                </div>

                {/* Sağ tərəf - Şəkil + Sitat */}
                <QuoteSection />
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 text-black py-6 text-center text-sm">
                © 2026 SmartLife. Bütün hüquqlar qorunur.
            </footer>
        </>
    );
}
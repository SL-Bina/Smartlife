import { useState } from 'react';
import { Languages, X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function QuoteSection() {
    const [isLangModalOpen, setIsLangModalOpen] = useState(false);
    const [currentLang, setCurrentLang] = useState('en');

    const flags = {
        az: "https://flagcdn.com/w40/az.png",
        ru: "https://flagcdn.com/w40/ru.png",
        en: "https://flagcdn.com/w40/gb.png"
    };


    const handleLangChange = (lang) => {
        setCurrentLang(lang);
        setIsLangModalOpen(false);

        console.log("Seçilmiş dil:", lang);
    };

    return (
        <div className="relative hidden flex-col items-start justify-end overflow-hidden lg:flex">
            <img
                src="https://static.propsearch.ae/dubai-locations/rise-residence_SB4bC_xl.jpg"
                alt="Rise Residence Dubai"
                className="absolute inset-0 size-full object-cover"
            />


            <button
                onClick={() => setIsLangModalOpen(true)}
                className="absolute top-6 right-6 z-30 bg-white/20 backdrop-blur-md p-2 rounded-full border border-white/30 hover:bg-white/40 transition-all shadow-lg"
            >
                <Languages className="text-white" size={24} />
            </button>


            {isLangModalOpen && (
                <div className="absolute top-20 right-6 z-40 animate-in slide-in-from-top-2 duration-200">
                    <div className="bg-white rounded-xl p-4 w-[220px] shadow-2xl relative border border-gray-100">
                        <button
                            onClick={() => setIsLangModalOpen(false)}
                            className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                        >
                            <X size={16} />
                        </button>

                        <div className="flex flex-col gap-1 mt-2">
                            <button
                                onClick={() => handleLangChange('az')}
                                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors text-gray-700"
                            >
                                <img src={flags.az} alt="AZ" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                                Azərbaycanca
                            </button>

                            <button
                                onClick={() => handleLangChange('ru')}
                                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors text-gray-700"
                            >
                                <img src={flags.ru} alt="RU" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                                Русский
                            </button>

                            <button
                                onClick={() => handleLangChange('en')}
                                className="flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-lg hover:bg-gray-50 font-medium transition-colors text-gray-700"
                            >
                                <img src={flags.en} alt="EN" className="w-6 h-4 object-cover rounded-sm shadow-sm" />
                                English
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 bg-gradient-to-t from-black/40 to-transparent p-8 pt-24 w-full">
                <div className="rounded-2xl bg-primary/25 px-5 py-6 backdrop-blur-md ring-1 ring-white/30">
                    <blockquote className="text-display-sm font-semibold text-white text-balance">
                        “We've been using Untitled to kick start every new project and can't
                        imagine working without it. It's incredible.”
                    </blockquote>

                    <div className="mt-6 flex items-center justify-between">
                        <div className="flex flex-col gap-3">
                            <div>
                                <p className="text-xl font-semibold text-white md:text-display-xs">
                                    Fleur Cook
                                </p>
                                <p className="text-sm text-white/90">Founder, Catalog</p>
                            </div>
                            <p className="text-sm font-medium text-white">
                                Web Design Agency
                            </p>
                        </div>


                        <div className="flex gap-4">
                            <button className="p-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all">
                                <ChevronLeft size={24} />
                            </button>
                            <button className="p-2 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all">
                                <ChevronRight size={24} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
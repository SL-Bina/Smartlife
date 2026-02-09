// components/auth/QuoteSection.jsx
export default function QuoteSection() {
    return (
        <div className="relative hidden flex-col items-start justify-end overflow-hidden lg:flex">
            <img
                src="https://static.propsearch.ae/dubai-locations/rise-residence_SB4bC_xl.jpg"
                alt="Rise Residence Dubai"
                className="absolute inset-0 size-full object-cover"
            />

            <div className="relative z-10 bg-gradient-to-t from-black/40 to-transparent p-8 pt-24 w-full">
                <div className="rounded-2xl bg-primary/25 px-5 py-6 backdrop-blur-md ring-1 ring-white/30">
                    <blockquote className="text-display-sm font-semibold text-white text-balance">
                        “We've been using Untitled to kick start every new project and can't
                        imagine working without it. It's incredible.”
                    </blockquote>

                    <div className="mt-6 flex flex-col gap-3">
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
                </div>
            </div>
        </div>
    );
}
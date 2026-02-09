// components/auth/Logo.jsx
export default function Logo() {
    return (
        <>
            {/* Desktop versiya */}
            <div className="hidden lg:flex items-center gap-3">
                <div className="relative h-8 w-8">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600" />
                </div>

            </div>

            {/* Mobil versiya */}
            <div className="lg:hidden flex justify-center mb-6">
                <div className="relative h-10 w-10">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-600 scale-125" />
                </div>
            </div>
        </>
    );
}
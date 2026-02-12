import { useState } from 'react';
import { QrCode, ArrowLeft, Phone } from 'lucide-react';
import PasswordToggle from './PasswordToggle';

export default function LoginForm() {
    const [loginMethod, setLoginMethod] = useState('email');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const [view, setView] = useState('login');
    const [otp, setOtp] = useState('');

    const phoneNumber = "0551234567";
    const maskedPhone = "********" + phoneNumber.slice(-2);

    const handleSubmit = (e) => {
        e.preventDefault();
        setView('otp');
    };

    if (view === 'otp') {
        return (
            <div className="flex flex-col items-center gap-6 w-[320px] -mt-[15px] pb-[25px]">
                <div className="flex flex-col gap-2 w-full text-center">
                    <h2 className="text-xl font-bold text-primary">Təsdiq kodu</h2>
                    <p className="text-sm text-secondary">
                        {loginMethod === 'phone' ? maskedPhone : email} ünvanına kod göndərildi.
                    </p>
                </div>
                <input
                    type="text"
                    maxLength="6"
                    placeholder="000000"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    // OTP border qırmızı edildi
                    className="w-full bg-primary border border-red-500 rounded-lg px-3.5 py-2.5 text-center text-2xl tracking-[10px] outline-none focus:ring-2 focus:ring-red-500"
                />
                <button type="button" className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-md font-semibold text-white hover:bg-red-700 transition-colors">
                    Təsdiqlə
                </button>
                <button onClick={() => setView('login')} className="flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors">
                    <ArrowLeft size={16} /> Geri qayıt
                </button>
            </div>
        );
    }

    if (view === 'qr') {
        return (
            <div className="flex flex-col items-center gap-6 w-[320px] -mt-[15px] pb-[25px]">
                <h2 className="text-lg font-bold text-primary">QR kodu skan edin</h2>
                {/* QR border qırmızı edildi */}
                <div className="p-4 bg-white rounded-xl shadow-lg border-4 border-red-600">
                    <QrCode size={180} className="text-gray-800" />
                </div>
                <button onClick={() => setView('login')} className="text-sm text-secondary hover:text-red-600 underline">
                    Geri qayıt
                </button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full -mt-[15px]">
            <div className="flex flex-col gap-5 w-[320px]">
                {loginMethod === 'email' ? (
                    <>
                        <div className="group flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-secondary">Email</label>
                            <div className="relative flex w-full rounded-lg bg-primary shadow-xs ring-1 ring-red-500 transition-shadow group-focus-within:ring-2 group-focus-within:ring-red-500">
                                <input
                                    type="email"
                                    required
                                    placeholder="Enter your email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full bg-transparent px-3.5 py-2.5 text-md text-primary outline-none"
                                />
                            </div>
                        </div>
                        <PasswordToggle
                            id="password"
                            label="Password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                        <button
                            type="button"
                            onClick={() => setLoginMethod('phone')}
                            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 transition-colors w-fit"
                        >
                            <Phone size={16} /> Telefonla qeydiyyatdan keç
                        </button>
                    </>
                ) : (
                    <>
                        <div className="group flex flex-col gap-1.5 w-full">
                            <label className="text-sm font-medium text-secondary">Telefon nömrəsi</label>
                            <div className="relative flex w-full rounded-lg bg-primary shadow-xs ring-1 ring-red-500 transition-shadow group-focus-within:ring-2 group-focus-within:ring-red-500">
                                <input
                                    type="tel"
                                    required
                                    placeholder="+994 -- --- -- --"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    className="w-full bg-transparent px-3.5 py-2.5 text-md text-primary outline-none"
                                />
                            </div>
                        </div>
                        <button
                            type="button"
                            onClick={() => setLoginMethod('email')}
                            className="flex items-center gap-2 text-sm font-medium text-secondary hover:text-primary transition-colors w-fit"
                        >
                            <ArrowLeft size={16} /> Email ilə daxil ol
                        </button>
                    </>
                )}
            </div>

            <div className="flex items-start justify-between gap-4 w-[320px]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input type="checkbox" className="h-4 w-4 rounded border-primary text-red-600 focus:ring-red-500" />
                    <span className="text-sm font-medium text-secondary">Remember for 30 days</span>
                </label>
            </div>

            <div className="w-[320px] flex flex-col gap-3 pb-[25px]">
                {/* Ana düymə qırmızı edildi */}
                <button type="submit" className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-md font-semibold text-white shadow-xs-skeumorphic ring-1 ring-red-600 hover:bg-red-700 transition-colors">
                    {loginMethod === 'email' ? 'Sign in' : 'Qeydiyyatdan keç'}
                </button>

                <button type="button" onClick={() => setView('qr')} className="flex items-center justify-center gap-2 w-full rounded-lg bg-white px-4 py-2.5 text-md font-semibold text-gray-700 border border-gray-300 shadow-sm hover:bg-gray-50 transition-colors mt-2">
                    <QrCode size={20} /> QR kodla giriş
                </button>
            </div>
        </form>
    );
}
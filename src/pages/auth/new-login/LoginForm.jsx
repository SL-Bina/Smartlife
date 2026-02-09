// components/auth/LoginForm.jsx
import { useState } from 'react';
import PasswordToggle from './PasswordToggle';

export default function LoginForm() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Giriş cəhdi:', { email, password });
    };

    return (
        <form onSubmit={handleSubmit} className="flex flex-col items-center gap-6 w-full">

            <div className="flex flex-col gap-5 w-[320px]">
                {/* Email */}
                <div className="group flex flex-col gap-1.5 w-full">
                    <label htmlFor="email" className="text-sm font-medium text-secondary">
                        Email
                    </label>
                    <div className="relative flex w-full rounded-lg bg-primary shadow-xs ring-1 ring-primary transition-shadow group-focus-within:ring-2 group-focus-within:ring-brand">
                        <input
                            id="email"
                            type="email"
                            required
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-transparent px-3.5 py-2.5 text-md text-primary placeholder:text-placeholder outline-none"
                        />
                    </div>
                </div>

                {/* Password */}
                <PasswordToggle
                    id="password"
                    label="Password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
            </div>

            <div className="flex items-start justify-between gap-4 w-[320px]">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-primary text-brand focus:ring-brand"
                    />
                    <span className="text-sm font-medium text-secondary">
                        Remember for 30 days
                    </span>
                </label>
                <a href="#" className="text-sm font-semibold text-brand-secondary hover:text-brand-secondary_hover whitespace-nowrap">
                    Forgot password
                </a>
            </div>

            <div className="w-[320px]">
                <button
                    type="submit"
                    className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-md font-semibold text-white shadow-xs-skeumorphic ring-1 ring-blue-600 hover:bg-blue-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 transition-colors"
                >
                    Sign in
                </button>
            </div>

            <p className="text-sm text-secondary mt-4">
                © 2026 SmartLife. Bütün hüquqlar qorunur.
            </p>
        </form>
    );
}
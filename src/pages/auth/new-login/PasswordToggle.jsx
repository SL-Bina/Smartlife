// components/auth/PasswordToggle.jsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordToggle({ label, id, className = '', ...props }) {
    const [show, setShow] = useState(false);

    return (
        <div className={`group flex flex-col gap-1.5 ${className}`}>
            <label htmlFor={id} className="text-sm font-medium text-secondary">
                {label}
            </label>
            <div className="relative flex w-[320px] rounded-lg bg-primary shadow-xs ring-1 ring-primary transition-shadow group-focus-within:ring-2 group-focus-within:ring-brand">
                <input
                    id={id}
                    type={show ? 'text' : 'password'}
                    className="w-full bg-transparent px-3.5 py-2.5 pr-11 text-md text-primary placeholder:text-placeholder outline-none"
                    {...props}
                />
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-tertiary hover:text-primary transition-colors"
                >
                    {show ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
            </div>
        </div>
    );
}
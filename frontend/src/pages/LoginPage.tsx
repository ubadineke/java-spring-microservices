import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Eye, EyeOff, Loader2, AlertCircle } from 'lucide-react';

export default function LoginPage() {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');

    const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/dashboard';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        try {
            await login({ email, password });
            navigate(from, { replace: true });
        } catch (err: unknown) {
            const errorObj = err as { response?: { data?: { message?: string }; status?: number } };
            if (errorObj.response?.status === 401) {
                setError('Invalid email or password. Please try again.');
            } else {
                setError(
                    errorObj.response?.data?.message ||
                    'Unable to connect to the server. Please try again later.'
                );
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Panel — Branding */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-surface-950 via-primary-950 to-surface-900">
                {/* Ambient glow effects */}
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent-500/15 rounded-full blur-[100px]" />

                {/* Grid pattern */}
                <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                        backgroundSize: '60px 60px',
                    }}
                />

                <div className="relative flex flex-col items-center justify-center w-full px-16 text-white animate-fade-in">
                    <div className="flex items-center gap-4 mb-8">
                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-2xl shadow-primary-500/30">
                            <Activity className="w-7 h-7 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold tracking-tight">MedFlow</h1>
                            <p className="text-sm text-primary-300 font-medium">Patient Management System</p>
                        </div>
                    </div>
                    <p className="text-center text-surface-400 text-lg max-w-sm leading-relaxed">
                        Streamline your patient workflows with a modern, secure, and intelligent platform.
                    </p>

                    {/* Feature pills */}
                    <div className="flex flex-wrap justify-center gap-3 mt-12">
                        {['Secure Auth', 'Real-time Data', 'Analytics', 'HIPAA Ready'].map((feat) => (
                            <span
                                key={feat}
                                className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-xs font-medium text-surface-300 backdrop-blur-sm"
                            >
                                {feat}
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Panel — Login Form */}
            <div className="flex-1 flex items-center justify-center px-6 py-12 bg-white">
                <div className="w-full max-w-md animate-fade-in">
                    {/* Mobile header */}
                    <div className="flex items-center gap-3 mb-8 lg:hidden">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <h1 className="text-xl font-bold text-surface-900">MedFlow</h1>
                    </div>

                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-surface-900 tracking-tight">
                            Welcome back
                        </h2>
                        <p className="mt-2 text-surface-500">
                            Sign in to access the patient management portal.
                        </p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="flex items-center gap-3 p-4 mb-6 rounded-xl bg-danger-500/5 border border-danger-500/20 text-danger-600 animate-fade-in">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label
                                htmlFor="email-input"
                                className="block text-sm font-semibold text-surface-700 mb-2"
                            >
                                Email Address
                            </label>
                            <input
                                id="email-input"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                required
                                autoComplete="email"
                                className="w-full px-4 py-3 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 placeholder:text-surface-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-surface-300"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label
                                htmlFor="password-input"
                                className="block text-sm font-semibold text-surface-700 mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password-input"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter your password"
                                    required
                                    autoComplete="current-password"
                                    className="w-full px-4 py-3 pr-12 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 placeholder:text-surface-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 hover:border-surface-300"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-surface-400 hover:text-surface-600 transition-colors"
                                    id="toggle-password-visibility"
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !email || !password}
                            id="login-submit-button"
                            className="relative w-full flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/25 transition-all duration-200 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-lg"
                        >
                            {isSubmitting ? (
                                <>
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    Signing in...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <p className="mt-8 text-center text-xs text-surface-400">
                        Secured with JWT Authentication · API Gateway Proxy
                    </p>
                </div>
            </div>
        </div>
    );
}

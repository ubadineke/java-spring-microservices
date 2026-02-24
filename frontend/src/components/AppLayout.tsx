import { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    Users,
    LogOut,
    Menu,
    X,
    Activity,
    ChevronRight,
} from 'lucide-react';
import { cn } from '../lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Patients', href: '/patients', icon: Users },
];

export default function AppLayout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-surface-50">
            {/* Mobile sidebar overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={cn(
                    'fixed inset-y-0 left-0 z-50 w-72 bg-surface-950 text-white transform transition-transform duration-300 ease-out lg:translate-x-0 lg:static lg:z-auto',
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                )}
            >
                <div className="flex flex-col h-full">
                    {/* Logo Section */}
                    <div className="flex items-center gap-3 px-6 py-6 border-b border-white/10">
                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 shadow-lg shadow-primary-500/25">
                            <Activity className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h1 className="text-lg font-bold tracking-tight">MedFlow</h1>
                            <p className="text-[11px] text-surface-400 font-medium uppercase tracking-widest">
                                Patient Management
                            </p>
                        </div>
                        <button
                            onClick={() => setSidebarOpen(false)}
                            className="ml-auto lg:hidden p-1 rounded-lg hover:bg-white/10 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6 space-y-1.5">
                        <p className="px-3 mb-3 text-[10px] font-bold uppercase tracking-[0.15em] text-surface-500">
                            Menu
                        </p>
                        {navigation.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.href}
                                onClick={() => setSidebarOpen(false)}
                                className={({ isActive }) =>
                                    cn(
                                        'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
                                        isActive
                                            ? 'bg-primary-600/20 text-primary-300 shadow-sm'
                                            : 'text-surface-400 hover:bg-white/5 hover:text-white'
                                    )
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        <item.icon
                                            className={cn(
                                                'w-5 h-5 transition-colors',
                                                isActive ? 'text-primary-400' : 'text-surface-500 group-hover:text-surface-300'
                                            )}
                                        />
                                        {item.name}
                                        {isActive && (
                                            <ChevronRight className="w-4 h-4 ml-auto text-primary-400" />
                                        )}
                                    </>
                                )}
                            </NavLink>
                        ))}
                    </nav>

                    {/* User Section */}
                    <div className="px-4 py-4 border-t border-white/10">
                        <div className="flex items-center gap-3 px-3 py-2">
                            <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-accent-500 to-accent-600 text-white text-xs font-bold shadow-sm">
                                {user?.email?.charAt(0).toUpperCase() || 'U'}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-white truncate">
                                    {user?.email || 'User'}
                                </p>
                                <p className="text-[11px] text-surface-500">Authenticated</p>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="p-2 rounded-lg text-surface-500 hover:text-danger-400 hover:bg-danger-400/10 transition-all duration-200"
                                title="Sign out"
                                id="logout-button"
                            >
                                <LogOut className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                {/* Top Bar */}
                <header className="flex items-center h-16 px-4 lg:px-8 border-b border-surface-200 bg-white/80 backdrop-blur-md">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="lg:hidden p-2 -ml-2 rounded-lg text-surface-600 hover:bg-surface-100 transition-colors"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                </header>

                {/* Content */}
                <main className="flex-1 overflow-auto p-4 lg:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

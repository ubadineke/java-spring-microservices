import { useQuery } from '@tanstack/react-query';
import { patientsApi } from '../api/patients';
import { Users, UserPlus, Activity, TrendingUp, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuth();

    const {
        data: patients,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['patients'],
        queryFn: patientsApi.getAll,
    });

    const totalPatients = patients?.length ?? 0;
    const recentPatients = patients?.slice(-5).reverse() ?? [];

    const stats = [
        {
            title: 'Total Patients',
            value: totalPatients,
            icon: Users,
            gradient: 'from-primary-500 to-primary-700',
            shadow: 'shadow-primary-500/20',
            bgAccent: 'bg-primary-50',
            textAccent: 'text-primary-700',
        },
        {
            title: 'Active Records',
            value: totalPatients,
            icon: Activity,
            gradient: 'from-accent-500 to-accent-600',
            shadow: 'shadow-accent-500/20',
            bgAccent: 'bg-emerald-50',
            textAccent: 'text-emerald-700',
        },
        {
            title: 'This Month',
            value: patients
                ? patients.filter((p) => {
                    const regDate = new Date(p.registeredDate);
                    const now = new Date();
                    return (
                        regDate.getMonth() === now.getMonth() &&
                        regDate.getFullYear() === now.getFullYear()
                    );
                }).length
                : 0,
            icon: TrendingUp,
            gradient: 'from-warning-400 to-warning-500',
            shadow: 'shadow-warning-400/20',
            bgAccent: 'bg-amber-50',
            textAccent: 'text-amber-700',
        },
    ];

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 tracking-tight">
                    Dashboard
                </h1>
                <p className="mt-1 text-surface-500">
                    Welcome back, <span className="font-medium text-surface-700">{user?.email}</span>
                </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-8">
                {stats.map((stat, i) => (
                    <div
                        key={stat.title}
                        className={`group relative overflow-hidden rounded-2xl bg-white border border-surface-200/60 p-6 transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${stat.shadow}`}
                        style={{ animationDelay: `${i * 80}ms` }}
                    >
                        <div className="flex items-start justify-between">
                            <div>
                                <p className="text-sm font-medium text-surface-500">{stat.title}</p>
                                <p className="mt-2 text-3xl font-bold text-surface-900">
                                    {isLoading ? (
                                        <span className="inline-block w-16 h-8 rounded-lg animate-shimmer" />
                                    ) : (
                                        stat.value
                                    )}
                                </p>
                            </div>
                            <div
                                className={`flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br ${stat.gradient} shadow-lg ${stat.shadow}`}
                            >
                                <stat.icon className="w-6 h-6 text-white" />
                            </div>
                        </div>
                        {/* Decorative accent */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                            backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))`,
                        }} />
                    </div>
                ))}
            </div>

            {/* Recent Patients Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Patients list */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-surface-200/60 overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
                        <div>
                            <h2 className="text-lg font-semibold text-surface-900">Recent Patients</h2>
                            <p className="text-sm text-surface-500 mt-0.5">Latest patient registrations</p>
                        </div>
                        <button
                            onClick={() => navigate('/patients')}
                            className="px-4 py-2 rounded-lg text-sm font-medium text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
                            id="view-all-patients-button"
                        >
                            View All
                        </button>
                    </div>

                    {isLoading ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                        </div>
                    ) : error ? (
                        <div className="flex items-center justify-center py-16 text-sm text-danger-500">
                            Failed to load patients. Please check your connection.
                        </div>
                    ) : recentPatients.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 text-surface-400">
                            <Users className="w-10 h-10 mb-3" />
                            <p className="text-sm font-medium">No patients yet</p>
                            <p className="text-xs mt-1">Create your first patient to get started.</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-surface-100">
                            {recentPatients.map((patient) => (
                                <div
                                    key={patient.id}
                                    className="flex items-center gap-4 px-6 py-4 hover:bg-surface-50 transition-colors"
                                >
                                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 text-sm font-bold flex-shrink-0">
                                        {patient.name
                                            .split(' ')
                                            .map((n) => n[0])
                                            .join('')
                                            .toUpperCase()
                                            .slice(0, 2)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-surface-900 truncate">
                                            {patient.name}
                                        </p>
                                        <p className="text-xs text-surface-500 truncate">{patient.email}</p>
                                    </div>
                                    <span className="text-xs text-surface-400 hidden sm:block">
                                        {new Date(patient.registeredDate).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                        })}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-2xl border border-surface-200/60 p-6">
                    <h2 className="text-lg font-semibold text-surface-900 mb-4">Quick Actions</h2>
                    <div className="space-y-3">
                        <button
                            onClick={() => navigate('/patients?action=create')}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-medium text-sm shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
                            id="quick-add-patient-button"
                        >
                            <UserPlus className="w-5 h-5" />
                            Add New Patient
                        </button>
                        <button
                            onClick={() => navigate('/patients')}
                            className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border border-surface-200 text-surface-700 font-medium text-sm hover:bg-surface-50 hover:border-surface-300 transition-all duration-200"
                            id="quick-view-patients-button"
                        >
                            <Users className="w-5 h-5 text-surface-500" />
                            Manage Patients
                        </button>
                    </div>

                    {/* System Status */}
                    <div className="mt-8 p-4 rounded-xl bg-surface-50 border border-surface-100">
                        <p className="text-xs font-semibold text-surface-600 uppercase tracking-wider mb-3">
                            System
                        </p>
                        <div className="space-y-2.5">
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-surface-500">API Gateway</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-surface-500">Auth Service</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
                                    Online
                                </span>
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-xs text-surface-500">Patient Service</span>
                                <span className="flex items-center gap-1.5 text-xs font-medium text-success-600">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success-500 animate-pulse-soft" />
                                    Online
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

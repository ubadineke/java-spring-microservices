import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { patientsApi } from '../api/patients';
import type { Patient, CreatePatientRequest, UpdatePatientRequest } from '../types';
import { formatDate, getInitials } from '../lib/utils';
import {
    Search,
    UserPlus,
    Edit3,
    Trash2,
    X,
    Loader2,
    AlertCircle,
    Users,
    ChevronDown,
} from 'lucide-react';

export default function PatientsPage() {
    const queryClient = useQueryClient();
    const [searchParams, setSearchParams] = useSearchParams();

    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingPatient, setEditingPatient] = useState<Patient | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

    // Open modal if ?action=create
    useEffect(() => {
        if (searchParams.get('action') === 'create') {
            setIsModalOpen(true);
            setSearchParams({}, { replace: true });
        }
    }, [searchParams, setSearchParams]);

    // Queries
    const {
        data: patients,
        isLoading,
        error,
    } = useQuery({
        queryKey: ['patients'],
        queryFn: patientsApi.getAll,
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: patientsApi.create,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            closeModal();
        },
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: UpdatePatientRequest }) =>
            patientsApi.update(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            closeModal();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: patientsApi.delete,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['patients'] });
            setDeleteConfirm(null);
        },
    });

    const filteredPatients = patients?.filter(
        (p) =>
            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const openCreate = () => {
        setEditingPatient(null);
        setIsModalOpen(true);
    };

    const openEdit = (patient: Patient) => {
        setEditingPatient(patient);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setEditingPatient(null);
    };

    const handleFormSubmit = (formData: CreatePatientRequest) => {
        if (editingPatient) {
            updateMutation.mutate({
                id: editingPatient.id,
                data: {
                    name: formData.name,
                    email: formData.email,
                    address: formData.address,
                    dateOfBirth: formData.dateOfBirth,
                },
            });
        } else {
            createMutation.mutate(formData);
        }
    };

    return (
        <div className="max-w-7xl mx-auto animate-fade-in">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-surface-900 tracking-tight">
                        Patients
                    </h1>
                    <p className="mt-1 text-surface-500">
                        {isLoading
                            ? 'Loading...'
                            : `${patients?.length ?? 0} patient${patients?.length !== 1 ? 's' : ''} registered`}
                    </p>
                </div>
                <button
                    onClick={openCreate}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 hover:-translate-y-0.5 transition-all duration-200"
                    id="add-patient-button"
                >
                    <UserPlus className="w-4 h-4" />
                    Add Patient
                </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-6">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-surface-400" />
                <input
                    type="text"
                    placeholder="Search by name, email, or address..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-surface-200 bg-white text-surface-900 placeholder:text-surface-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                    id="patient-search-input"
                />
            </div>

            {/* Table */}
            <div className="bg-white rounded-2xl border border-surface-200/60 overflow-hidden">
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-6 h-6 text-primary-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center justify-center py-20 text-danger-500">
                        <AlertCircle className="w-8 h-8 mb-3" />
                        <p className="text-sm font-medium">Failed to load patients</p>
                        <p className="text-xs text-surface-500 mt-1">Please check your connection and try again.</p>
                    </div>
                ) : filteredPatients?.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-surface-400">
                        <Users className="w-10 h-10 mb-3" />
                        <p className="text-sm font-medium">
                            {searchTerm ? 'No patients match your search' : 'No patients found'}
                        </p>
                        <p className="text-xs mt-1">
                            {searchTerm ? 'Try a different search term.' : 'Click "Add Patient" to create one.'}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-surface-100">
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                                        <div className="flex items-center gap-1">
                                            Patient <ChevronDown className="w-3 h-3" />
                                        </div>
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden md:table-cell">
                                        Email
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden lg:table-cell">
                                        Address
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">
                                        DOB
                                    </th>
                                    <th className="text-left px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider hidden sm:table-cell">
                                        Registered
                                    </th>
                                    <th className="text-right px-6 py-4 text-xs font-semibold text-surface-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-surface-100">
                                {filteredPatients?.map((patient) => (
                                    <tr
                                        key={patient.id}
                                        className="hover:bg-surface-50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex items-center justify-center w-9 h-9 rounded-full bg-gradient-to-br from-primary-100 to-primary-200 text-primary-700 text-xs font-bold flex-shrink-0">
                                                    {getInitials(patient.name)}
                                                </div>
                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-surface-900 truncate">
                                                        {patient.name}
                                                    </p>
                                                    <p className="text-xs text-surface-500 truncate md:hidden">
                                                        {patient.email}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-600 hidden md:table-cell">
                                            {patient.email}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-600 hidden lg:table-cell truncate max-w-[200px]">
                                            {patient.address}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-600 hidden sm:table-cell">
                                            {formatDate(patient.dateOfBirth)}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-surface-600 hidden sm:table-cell">
                                            {formatDate(patient.registeredDate)}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-1">
                                                <button
                                                    onClick={() => openEdit(patient)}
                                                    className="p-2 rounded-lg text-surface-400 hover:text-primary-600 hover:bg-primary-50 transition-all duration-200"
                                                    title="Edit patient"
                                                >
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                {deleteConfirm === patient.id ? (
                                                    <div className="flex items-center gap-1 animate-fade-in">
                                                        <button
                                                            onClick={() => deleteMutation.mutate(patient.id)}
                                                            disabled={deleteMutation.isPending}
                                                            className="px-2.5 py-1 rounded-lg text-xs font-medium bg-danger-500 text-white hover:bg-danger-600 transition-colors disabled:opacity-50"
                                                        >
                                                            {deleteMutation.isPending ? '...' : 'Confirm'}
                                                        </button>
                                                        <button
                                                            onClick={() => setDeleteConfirm(null)}
                                                            className="px-2.5 py-1 rounded-lg text-xs font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                                                        >
                                                            Cancel
                                                        </button>
                                                    </div>
                                                ) : (
                                                    <button
                                                        onClick={() => setDeleteConfirm(patient.id)}
                                                        className="p-2 rounded-lg text-surface-400 hover:text-danger-600 hover:bg-danger-50 transition-all duration-200"
                                                        title="Delete patient"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Patient Form Modal */}
            {isModalOpen && (
                <PatientFormModal
                    patient={editingPatient}
                    onSubmit={handleFormSubmit}
                    onClose={closeModal}
                    isSubmitting={createMutation.isPending || updateMutation.isPending}
                    error={createMutation.error || updateMutation.error}
                />
            )}
        </div>
    );
}

// ========================================
// Patient Form Modal Component
// ========================================

interface PatientFormModalProps {
    patient: Patient | null;
    onSubmit: (data: CreatePatientRequest) => void;
    onClose: () => void;
    isSubmitting: boolean;
    error: Error | null;
}

function PatientFormModal({
    patient,
    onSubmit,
    onClose,
    isSubmitting,
    error,
}: PatientFormModalProps) {
    const isEditing = !!patient;
    const today = new Date().toISOString().split('T')[0];

    const [formData, setFormData] = useState<CreatePatientRequest>({
        name: patient?.name ?? '',
        email: patient?.email ?? '',
        address: patient?.address ?? '',
        dateOfBirth: patient?.dateOfBirth ?? '',
        registeredDate: patient?.registeredDate ?? today,
    });

    const handleChange = (field: keyof CreatePatientRequest, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                onClick={onClose}
            />

            {/* Modal */}
            <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl animate-fade-in">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-5 border-b border-surface-100">
                    <div>
                        <h2 className="text-lg font-bold text-surface-900">
                            {isEditing ? 'Edit Patient' : 'Add New Patient'}
                        </h2>
                        <p className="text-sm text-surface-500 mt-0.5">
                            {isEditing
                                ? 'Update the patient information below.'
                                : 'Fill in the details to register a new patient.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 rounded-lg text-surface-400 hover:text-surface-600 hover:bg-surface-100 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Error */}
                {error && (
                    <div className="mx-6 mt-4 flex items-center gap-3 p-3 rounded-xl bg-danger-500/5 border border-danger-500/20 text-danger-600">
                        <AlertCircle className="w-4 h-4 flex-shrink-0" />
                        <p className="text-sm">{(error as Error).message || 'An error occurred.'}</p>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label htmlFor="patient-name" className="block text-sm font-semibold text-surface-700 mb-1.5">
                            Full Name
                        </label>
                        <input
                            id="patient-name"
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleChange('name', e.target.value)}
                            placeholder="John Doe"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="patient-email" className="block text-sm font-semibold text-surface-700 mb-1.5">
                            Email
                        </label>
                        <input
                            id="patient-email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleChange('email', e.target.value)}
                            placeholder="john@example.com"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="patient-address" className="block text-sm font-semibold text-surface-700 mb-1.5">
                            Address
                        </label>
                        <input
                            id="patient-address"
                            type="text"
                            value={formData.address}
                            onChange={(e) => handleChange('address', e.target.value)}
                            placeholder="123 Main Street"
                            required
                            className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 placeholder:text-surface-400 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="patient-dob" className="block text-sm font-semibold text-surface-700 mb-1.5">
                                Date of Birth
                            </label>
                            <input
                                id="patient-dob"
                                type="date"
                                value={formData.dateOfBirth}
                                onChange={(e) => handleChange('dateOfBirth', e.target.value)}
                                required
                                className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                            />
                        </div>
                        {!isEditing && (
                            <div>
                                <label htmlFor="patient-registered" className="block text-sm font-semibold text-surface-700 mb-1.5">
                                    Registered Date
                                </label>
                                <input
                                    id="patient-registered"
                                    type="date"
                                    value={formData.registeredDate}
                                    onChange={(e) => handleChange('registeredDate', e.target.value)}
                                    required
                                    className="w-full px-4 py-2.5 rounded-xl border border-surface-200 bg-surface-50 text-surface-900 focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
                                />
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 pt-4 border-t border-surface-100">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-5 py-2.5 rounded-xl text-sm font-medium text-surface-600 hover:bg-surface-100 transition-colors"
                            id="modal-cancel-button"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-700 text-white font-semibold text-sm shadow-lg shadow-primary-500/20 hover:shadow-xl hover:shadow-primary-500/30 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            id="modal-submit-button"
                        >
                            {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                            {isEditing ? 'Update Patient' : 'Create Patient'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

'use client';

import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '@/app/Utils/backendUrl';

const CompanyList = ({ companies, setCompanies, setEditingCompany, setIsEditing }) => {
    const [loadingKycIds, setLoadingKycIds] = useState(new Set());
    const [deletingId, setDeletingId] = useState(null);
    const { businessId, role } = useRole();

    async function verifyKYC(companyId, newStatus) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/business/verify/${companyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ kycStatus: newStatus }),
            });

            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const result = await response.json();
            toast.success(`KYC status updated to ${newStatus}!`);
            return result;
        } catch (error) {
            toast.error('KYC verification failed. Please try again.');
            return null;
        }
    }

    async function handleKycToggle(company) {
        if (loadingKycIds.has(company.businessId)) return;
        const newStatus = company.verificationStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';

        setLoadingKycIds(prev => new Set(prev).add(company.businessId));
        const result = await verifyKYC(company.businessId, newStatus);

        if (result) {
            setCompanies(prev =>
                prev.map(c =>
                    c.businessId === company.businessId
                        ? { ...c, verificationStatus: newStatus }
                        : c
                )
            );
        }

        setLoadingKycIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(company.businessId);
            return newSet;
        });
    }

    async function handleDeleteCompany(companyId) {
        const confirmDelete = confirm('Are you sure you want to delete this company?');
        if (!confirmDelete) return;

        try {
            setDeletingId(companyId);
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/business/${companyId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` },
            });

            if (!response.ok) throw new Error('Failed to delete company');

            setCompanies(prev => prev.filter(c => c.businessId !== companyId));
            toast.success('Company deleted successfully');
        } catch (error) {
            toast.error('Failed to delete company');
        } finally {
            setDeletingId(null);
        }
    }

    return (
        <div className="flex-1 overflow-auto rounded border border-gray-300 bg-white">
            <div className="max-w-[800px]">
                <table className="w-full text-left text-black border-collapse">
                    <thead>
                        <tr className="bg-gray-100">
                            <th className="py-2 px-4 border-b">Id</th>
                            <th className="py-2 px-4 border-b">Name</th>
                            <th className="py-2 px-4 border-b">Owner</th>
                            <th className="py-2 px-4 border-b">Phone</th>
                            <th className="py-2 px-4 border-b">Email</th>
                            <th className="py-2 px-4 border-b">Address</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">GST No</th>
                            <th className="py-2 px-4 border-b">Website</th>
                            <th className="py-2 px-4 border-b">Social</th>
                            <th className="py-2 px-4 border-b">Joined</th>
                            <th className="py-2 px-4 border-b">Subscription</th>
                            <th className="py-2 px-4 border-b">Business Type</th>
                            <th className="py-2 px-4 border-b">KYC</th>
                            {hasPermission(role, PERMISSIONS.VERIFY_KYC) && (
                                <th className="py-2 px-4 border-b">Verify</th>
                            )}
                            {hasPermission(role, PERMISSIONS.EDIT_BUSINESS) && (
                                <th className="py-2 px-4 border-b">Edit</th>
                            )}
                            {hasPermission(role, PERMISSIONS.DELETE_BUSINESS) && (
                                <th className="py-2 px-4 border-b">Delete</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {companies.length === 0 ? (
                            <tr>
                                <td colSpan="16" className="text-center py-4 text-black">
                                    No companies added yet.
                                </td>
                            </tr>
                        ) : (
                            companies.map(company => (
                                <tr
                                    key={company.businessId}
                                    className="text-black text-sm border-t text-center"
                                >
                                    <td className="py-2 px-4">{company.businessId}</td>
                                    <td className="py-2 px-4">{company.businessName}</td>
                                    <td className="py-2 px-4">{company.ownerName}</td>
                                    <td className="py-2 px-4">{company.phoneNumber}</td>
                                    <td className="py-2 px-4">{company.emailAddress}</td>
                                    <td className="py-2 px-4">{company.address}</td>
                                    <td className="py-2 px-4">
                                        {company.latitude}, {company.longitude}
                                    </td>
                                    <td className="py-2 px-4">{company.gstNumber}</td>
                                    <td className="py-2 px-4">
                                        {company.websiteLink ? (
                                            <a
                                                href={company.websiteLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-blue-600 underline"
                                            >
                                                Link
                                            </a>
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td className="py-2 px-4">
                                        {company.socialLinks?.length > 0 ? (
                                            company.socialLinks.map((social, idx) => (
                                                <a
                                                    key={idx}
                                                    href={social.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline mr-2"
                                                    title={social.platform}
                                                >
                                                    {social.platform}
                                                </a>
                                            ))
                                        ) : (
                                            '-'
                                        )}
                                    </td>

                                    <td className="py-2 px-4">{company.joinedDate}</td>
                                    <td className="py-2 px-4">{company.subscriptionType}</td>
                                    <td className="py-2 px-4">{company.businessType}</td>
                                    <td className="py-2 px-4">{company.verificationStatus}</td>

                                    {hasPermission(role, PERMISSIONS.VERIFY_KYC) && (
                                        <td className="py-2 px-4">
                                            <input
                                                type="checkbox"
                                                checked={company.verificationStatus === 'VERIFIED'}
                                                onChange={() => handleKycToggle(company)}
                                                disabled={loadingKycIds.has(company.businessId)}
                                            />
                                        </td>
                                    )}

                                    {hasPermission(role, PERMISSIONS.EDIT_BUSINESS) && (
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => {
                                                    setEditingCompany(company);
                                                    setIsEditing(true);
                                                }}
                                                className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded"
                                            >
                                                Edit
                                            </button>
                                        </td>
                                    )}

                                    {hasPermission(role, PERMISSIONS.DELETE_BUSINESS) && (
                                        <td className="py-2 px-4">
                                            <button
                                                onClick={() => handleDeleteCompany(company.businessId)}
                                                disabled={deletingId === company.businessId}
                                                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
                                            >
                                                {deletingId === company.businessId ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    )}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default CompanyList;

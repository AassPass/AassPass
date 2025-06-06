'use client';

import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { BACKEND_URL } from '@/app/Utils/backendUrl';

const CompanyList = ({ companies, setCompanies, setEditingCompany, setIsEditing }) => {
    // console.log(companies);
    const [loadingKycIds, setLoadingKycIds] = useState(new Set());
    const { businessId, role } = useRole()

    async function verifyKYC(companyId, newStatus) {
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${BACKEND_URL}/business/verify/${companyId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
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

        const newStatus = company.kycStatus === 'Verified' ? 'Pending' : 'Verified';

        // Optimistic UI update
        setCompanies(prev =>
            prev.map(c =>
                c.businessId === company.businessId ? { ...c, kycStatus: newStatus } : c
            )
        );

        setLoadingKycIds(prev => new Set(prev).add(company.businessId));

        const result = await verifyKYC(company.businessId, newStatus);

        if (!result) {
            // rollback UI update on failure
            setCompanies(prev =>
                prev.map(c =>
                    c.businessId === company.businessId ? { ...c, kycStatus: company.kycStatus } : c
                )
            );
        }

        setLoadingKycIds(prev => {
            const newSet = new Set(prev);
            newSet.delete(company.businessId);
            return newSet;
        });
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
                            <th className="py-2 px-4 border-b" style={{ width: '180px' }}>Address</th>
                            <th className="py-2 px-4 border-b">Location</th>
                            <th className="py-2 px-4 border-b">GST No</th>
                            <th className="py-2 px-4 border-b">Website</th>
                            <th className="py-2 px-4 border-b" style={{ width: '180px' }}>Social</th>
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
                                    <td
                                        className="py-2 px-4"
                                        style={{
                                            width: '180px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {company.address}
                                    </td>
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
                                    <td
                                        className="py-2 px-4"
                                        style={{
                                            width: '180px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {company.socialMediaLinks && company.socialMediaLinks.length > 0 ? (
                                            company.socialMediaLinks.map((social, idx) => (
                                                <a
                                                    key={idx}
                                                    href={social.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 underline mr-2 inline"
                                                    title={social.platform}
                                                >
                                                    {social.platform}
                                                </a>
                                            ))
                                        ) : (
                                            '-'
                                        )}
                                    </td>
                                    <td
                                        className="py-2 px-4"
                                        style={{
                                            width: '180px',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        {company.joinedDate}
                                    </td>
                                    <td className="py-2 px-4">{company.subscriptionType}</td>
                                    <td className="py-2 px-4">{company.businessType}</td>
                                    <td className="py-2 px-4">{company.verificationStatus}</td>
                                    {hasPermission(role, PERMISSIONS.VERIFY_KYC) && (
                                        <td className="py-2 px-4">
                                            <input
                                                type="checkbox"
                                                checked={company.kycStatus === 'Verified'}
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
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default CompanyList;

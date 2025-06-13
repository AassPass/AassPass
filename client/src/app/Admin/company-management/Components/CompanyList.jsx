'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { BACKEND_URL } from '@/app/Utils/backendUrl';

const DeferredLink = ({ children, ...props }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const id = requestIdleCallback(() => setMounted(true));
        return () => cancelIdleCallback(id);
    }, []);
    return mounted ? <a {...props}>{children}</a> : <span className="text-gray-400">...</span>;
};

const CompanyRow = React.memo(({
    company,
    role,
    setEditingCompany,
    setIsEditing,
    handleDeleteCompany,
    handleKycToggle,
    loadingKycIds,
    deletingId,
    style,
}) => {
    const handleEdit = () => {
        setEditingCompany(company);
        setIsEditing(true);
    };

    const handleDelete = () => handleDeleteCompany(company.businessId);

    return (
        <div
            style={style}
            className="grid grid-cols-[repeat(18,_minmax(120px,_1fr))] border-t border-gray-200 text-xs"
        >
            <div className="py-1 px-2 truncate">{company.businessId}</div>
            <div className="py-1 px-2 truncate">{company.businessName}</div>
            <div className="py-1 px-2 truncate">{company.ownerName}</div>
            <div className="py-1 px-2 truncate">{company.phoneNumber}</div>
            <div className="py-1 px-2 truncate">{company.emailAddress}</div>
            <div className="py-1 px-2 truncate">{company.address}</div>
            <div className="py-1 px-2 truncate">{`${company.latitude}, ${company.longitude}`}</div>
            <div className="py-1 px-2 truncate">{company.gstNumber}</div>
            <div className="py-1 px-2 truncate">
                {company.websiteLink ? (
                    <DeferredLink href={company.websiteLink} target="_blank" className="text-blue-600 underline">Link</DeferredLink>
                ) : '-'}
            </div>
            <div className="py-1 px-2 truncate">
                {company.socialLinks?.length ? (
                    company.socialLinks.map((s, i) => (
                        <DeferredLink key={i} href={s.link} target="_blank" className="text-blue-600 underline mr-1">
                            {s.platform}
                        </DeferredLink>
                    ))
                ) : '-'}
            </div>
            <div className="py-1 px-2 truncate">{company.joinedDate}</div>
            <div className="py-1 px-2 truncate">{company.subscriptionType}</div>
            <div className="py-1 px-2 truncate">{company.businessType}</div>
            <div className="py-1 px-2 truncate">{company.verificationStatus}</div>

            {hasPermission(role, PERMISSIONS.VERIFY_KYC) && (
                <div className="py-1 px-2">
                    <input
                        type="checkbox"
                        checked={company.verificationStatus === 'VERIFIED'}
                        onChange={() => handleKycToggle(company)}
                        disabled={loadingKycIds.has(company.businessId)}
                    />
                </div>
            )}
            {hasPermission(role, PERMISSIONS.EDIT_BUSINESS) && (
                <div className="py-1 px-2">
                    <button
                        onClick={handleEdit}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs"
                    >
                        Edit
                    </button>
                </div>
            )}
            {hasPermission(role, PERMISSIONS.DELETE_BUSINESS) && (
                <div className="py-1 px-2">
                    <button
                        onClick={handleDelete}
                        disabled={deletingId === company.businessId}
                        className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs"
                    >
                        {deletingId === company.businessId ? '...' : 'Delete'}
                    </button>
                </div>
            )}
        </div>
    );
});

const CompanyList = ({ companies, setCompanies, setEditingCompany, setIsEditing }) => {
    const [loadingKycIds, setLoadingKycIds] = useState(new Set());
    const [deletingId, setDeletingId] = useState(null);
    const { role } = useRole();

    const verifyKYC = async (companyId, newStatus) => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch(`${BACKEND_URL}/business/change-status/${companyId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ status: newStatus }),
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update KYC status');
            }

            return await res.json();
        } catch (err) {
            console.error('KYC update failed:', err.message);
            return null;
        }
    };

    const handleKycToggle = async (company) => {
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
            const copy = new Set(prev);
            copy.delete(company.businessId);
            return copy;
        });
    };

    const handleDeleteCompany = async (companyId) => {
        if (!confirm('Delete this company?')) return;
        try {
            setDeletingId(companyId);
            const token = localStorage.getItem('token');

            const res = await fetch(`${BACKEND_URL}/business/${companyId}`, {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Delete failed');
            }

            setCompanies(prev => prev.filter(c => c.businessId !== companyId));
        } catch (err) {
            console.error('Delete failed:', err.message);
        } finally {
            setDeletingId(null);
        }
    };

    const Row = useCallback(({ index, style }) => (
        <CompanyRow
            company={companies[index]}
            role={role}
            setEditingCompany={setEditingCompany}
            setIsEditing={setIsEditing}
            handleDeleteCompany={handleDeleteCompany}
            handleKycToggle={handleKycToggle}
            loadingKycIds={loadingKycIds}
            deletingId={deletingId}
            style={style}
        />
    ), [companies, role, loadingKycIds, deletingId]);

    return (
        <div className="flex-1 rounded border border-gray-300 bg-white text-xs">
            <div className="w-full overflow-x-auto text-black">
                <div className="min-w-max">
                    {/* Header Row */}
                    <div className="flex text-sm font-semibold border-b border-gray-300 bg-gray-50">
                        <div className="py-1 px-2 w-[120px] shrink-0">Id</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Name</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Owner</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Phone</div>
                        <div className="py-1 px-2 w-[150px] shrink-0">Email</div>
                        <div className="py-1 px-2 w-[150px] shrink-0">Address</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Location</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">GST</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Website</div>
                        <div className="py-1 px-2 w-[150px] shrink-0">Social</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Joined</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Subscription</div>
                        <div className="py-1 px-2 w-[120px] shrink-0">Type</div>
                        <div className="py-1 px-2 w-[100px] shrink-0">KYC</div>
                        {hasPermission(role, PERMISSIONS.VERIFY_KYC) && (
                            <div className="py-1 px-2 w-[100px] shrink-0">Verify</div>
                        )}
                        {hasPermission(role, PERMISSIONS.EDIT_BUSINESS) && (
                            <div className="py-1 px-2 w-[80px] shrink-0">Edit</div>
                        )}
                        {hasPermission(role, PERMISSIONS.DELETE_BUSINESS) && (
                            <div className="py-1 px-2 w-[80px] shrink-0">Delete</div>
                        )}
                    </div>

                    {/* Virtualized List */}
                    <List
                        height={500}
                        itemCount={companies.length}
                        itemSize={60}
                        width="100%"
                        className="text-black"
                    >
                        {Row}
                    </List>
                </div>
            </div>
        </div>

    );
};

export default CompanyList;

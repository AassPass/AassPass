'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { FixedSizeList as List } from 'react-window';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { BACKEND_URL } from '@/Utils/backendUrl';
import { FaEdit } from 'react-icons/fa';
import {
  FaLinkedin,
  FaTwitter,
  FaFacebook,
  FaInstagram,
  FaYoutube,
  FaGlobe,
} from 'react-icons/fa';


const DeferredLink = ({ children, ...props }) => {
    const [mounted, setMounted] = useState(false);
    useEffect(() => {
        const id = requestIdleCallback(() => setMounted(true));
        return () => cancelIdleCallback(id);
    }, []);
    return mounted ? <a {...props}>{children}</a> : <span className="text-gray-400">...</span>;
};

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
        console.log(company);
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

            if (!res.status === 200 || !res.status === 201) {
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

    const columnCount = 14 +
        (hasPermission(role, PERMISSIONS.VERIFY_KYC) ? 1 : 0) +
        (hasPermission(role, PERMISSIONS.EDIT_BUSINESS) ? 1 : 0) +
        (hasPermission(role, PERMISSIONS.DELETE_BUSINESS) ? 1 : 0);

    const Row = useCallback(({ index, style }) => {
        const company = companies[index];
        if (!company) return null;
        return (
            <div
                key={company.businessId}

                className="grid text-xs text-black border-b border-gray-100"
                style={{
                    ...style,
                    display: 'grid',
                    gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))`,
                }}
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
                            onClick={() => {
                                setEditingCompany(company);
                                setIsEditing(true);
                            }}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-2 py-0.5 rounded text-xs"
                        >
                            Edit
                        </button>
                    </div>
                )}
                {hasPermission(role, PERMISSIONS.DELETE_BUSINESS) && (
                    <div className="py-1 px-2">
                        <button
                            onClick={() => handleDeleteCompany(company.businessId)}
                            disabled={deletingId === company.businessId}
                            className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs"
                        >
                            {deletingId === company.businessId ? '...' : 'Delete'}
                        </button>
                    </div>
                )}
            </div>
        );
    }, [companies, role, loadingKycIds, deletingId]);

    return (
        <div className="flex-1 rounded border border-gray-300 bg-white text-xs overflow-hidden">
            <div className="relative overflow-x-auto overflow-y-hidden" style={{ height: 540 }}>

                <div className="min-w-max" style={{ height: '100%' }}>
                    {/* Sticky Header */}
                    <div className="grid text-sm font-semibold border-b border-gray-300 bg-white sticky top-0 z-10 shadow text-black"
                        style={{
                            display: 'grid',
                            gridTemplateColumns: `repeat(${columnCount}, minmax(120px, 1fr))`,
                        }}
                    >
                        <div className="py-1 px-2 truncate">Id</div>
                        <div className="py-1 px-2 truncate">Name</div>
                        <div className="py-1 px-2 truncate">Owner</div>
                        <div className="py-1 px-2 truncate">Phone</div>
                        <div className="py-1 px-2 truncate">Email</div>
                        <div className="py-1 px-2 truncate">Address</div>
                        <div className="py-1 px-2 truncate">Location</div>
                        <div className="py-1 px-2 truncate">GST</div>
                        <div className="py-1 px-2 truncate">Website</div>
                        <div className="py-1 px-2 truncate">Social</div>
                        <div className="py-1 px-2 truncate">Joined</div>
                        <div className="py-1 px-2 truncate">Subscription</div>
                        <div className="py-1 px-2 truncate">Type</div>
                        <div className="py-1 px-2 truncate">KYC</div>
                        {hasPermission(role, PERMISSIONS.VERIFY_KYC) && (
                            <div className="py-1 px-2 truncate">Verify</div>
                        )}
                        {hasPermission(role, PERMISSIONS.EDIT_BUSINESS) && (
                            <div className="py-1 px-2 truncate">Edit</div>
                        )}
                        {hasPermission(role, PERMISSIONS.DELETE_BUSINESS) && (
                            <div className="py-1 px-2 truncate">Delete</div>
                        )}
                    </div>

                    {/* Virtualized List */}
                    <List
                        height={480}
                        itemCount={companies.length}
                        itemSize={60}
                        width="100%"
                    >
                        {Row}
                    </List>
                </div>
            </div>
        </div>
    );
};

export default CompanyList;

'use client';

import React, { useState, useEffect } from 'react';
import { useRole } from '@/Context/RoleContext';
import { hasPermission } from '@/libs/hasPermisson';
import { PERMISSIONS } from '@/libs/permissions';
import { BACKEND_URL } from '@/app/Utils/backendUrl';
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
  return mounted ? (
    <a {...props}>{children}</a>
  ) : (
    <span className="text-gray-400">...</span>
  );
};

const ToggleSwitch = ({ checked, onChange, disabled }) => (
  <label className="relative inline-block w-10 h-5">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className="sr-only peer"
    />
    <div
      className={`absolute top-0 left-0 w-full h-full transition-colors duration-300 rounded-full ${
        checked ? 'bg-green-500' : 'bg-red-500'
      }`}
    />
    <div
      className={`absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-300 ${
        checked ? 'translate-x-5' : ''
      }`}
    />
  </label>
);

const CompanyList = ({
  companies,
  setCompanies,
  setEditingCompany,
  setIsEditing,
}) => {
  const [loadingKycIds, setLoadingKycIds] = useState(new Set());
  const [deletingId, setDeletingId] = useState(null);
  const { role } = useRole();
  

  const canVerifyKyc = hasPermission(role, PERMISSIONS.VERIFY_KYC);
  const canEdit = hasPermission(role, PERMISSIONS.EDIT_BUSINESS);
  const canDelete = hasPermission(role, PERMISSIONS.DELETE_BUSINESS);

  const verifyKYC = async (companyId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${BACKEND_URL}/business/change-status/${companyId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

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
    const newStatus =
      company.verificationStatus === 'VERIFIED' ? 'PENDING' : 'VERIFIED';
    setLoadingKycIds((prev) => new Set(prev).add(company.businessId));

    const result = await verifyKYC(company.businessId, newStatus);
    if (result) {
      setCompanies((prev) =>
        prev.map((c) =>
          c.businessId === company.businessId
            ? { ...c, verificationStatus: newStatus }
            : c
        )
      );
    }

    setLoadingKycIds((prev) => {
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

      if (!(res.status === 200 || res.status === 201)) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.message || 'Delete failed');
      }

      setCompanies((prev) => prev.filter((c) => c.businessId !== companyId));
    } catch (err) {
      console.error('Delete failed:', err.message);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="overflow-x-auto  border-gray-300 bg-white">
      <table className="min-w-full text-sm table-auto border-collapse">
        <thead className="bg-blue-400 sticky top-0 z-10">
          <tr>
            <th className="border px-2 py-2 w-[80px]">ID</th>
            <th className="border px-2 py-2 w-[200px]">Name</th>
            <th className="border px-2 py-2 w-[140px]">Owner</th>
            <th className="border px-2 py-2 w-[120px]">Phone</th>
            <th className="border px-2 py-2 w-[220px]">Email</th>
            <th className="border px-2 py-2 w-[250px]">Address</th>
            <th className="border px-2 py-2 w-[150px]">Location</th>
            <th className="border px-2 py-2 w-[120px]">GST</th>
            <th className="border px-2 py-2 w-[120px]">Website</th>
            <th className="border px-2 py-2 w-[180px]">Social</th>
            <th className="border px-2 py-2 w-[120px]">Joined</th>
            <th className="border px-2 py-2 w-[140px]">Subscription</th>
            <th className="border px-2 py-2 w-[140px]">Type</th>
            <th className="border px-2 py-2 w-[100px]">KYC</th>
            {canVerifyKyc && <th className="border px-2 py-2 w-[80px]">Toggle</th>}
            {canEdit && <th className="border px-2 py-2 w-[70px]">Edit</th>}
            {canDelete && <th className="border px-2 py-2 w-[80px]">Delete</th>}
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.businessId} className="hover:bg-gray-50">
              <td className="border border-blue-400 px-2 py-1 min-w-[100px]">{company.businessId}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.businessName}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.ownerName}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.phoneNumber}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[200px] ">{company.emailAddress}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[250px]">{company.address}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[200px]">{`${company.latitude}, ${company.longitude}`}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.gstNumber}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[100px]">
                {company.websiteLink ? (
                  <DeferredLink href={company.websiteLink} target="_blank" className="text-blue-600 underline">
                    🔗
                  </DeferredLink>
                ) : (
                  '-'
                )}
              </td>
          <td className="border border-blue-400 px-2 py-1 min-w-[150px]">
  {Array.isArray(company.socialLinks) && company.socialLinks.length > 0 ? (
    <div className="flex gap-2 justify-center">
      {company.socialLinks.map(({ platform, link }, i) => {
        if (!link) return null;

        let Icon = FaGlobe;
        let color = '';
        const name = platform.toLowerCase();

        if (name.includes('linkedin')) {
          Icon = FaLinkedin;
          color = '#0A66C2';
        } else if (name.includes('twitter')) {
          Icon = FaTwitter;
          color = '#1DA1F2';
        } else if (name.includes('facebook')) {
          Icon = FaFacebook;
          color = '#1877F2';
        } else if (name.includes('instagram')) {
          Icon = FaInstagram;
          color = '#E4405F';
        } else if (name.includes('youtube')) {
          Icon = FaYoutube;
          color = '#FF0000';
        }

        return (
          <a
            key={i}
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            title={platform}
            className="hover:opacity-80"
          >
            <Icon size={18} color={color} />
          </a>
        );
      })}
    </div>
  ) : (
    '-'
  )}
</td>





              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.joinedDate}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.subscriptionType}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.businessType}</td>
              <td className="border border-blue-400 px-2 py-1 min-w-[150px]">{company.verificationStatus}</td>

              {canVerifyKyc && (
                <td className="border border-blue-400 px-2 py-1 text-center">
                  <ToggleSwitch
                    checked={company.verificationStatus === 'VERIFIED'}
                    onChange={() => handleKycToggle(company)}
                    disabled={loadingKycIds.has(company.businessId)}
                  />
                </td>
              )}
              {canEdit && (
                <td className="border border-blue-400 px-2 py-1 text-center min-w-[100px]">
                  <button
                    onClick={() => {
                      setEditingCompany(company);
                      setIsEditing(true);
                    }}
                    className="text-blue-600 hover:text-blue-800"
                    title="Edit"
                  >
                    <FaEdit size={16} />
                  </button>
                </td>
              )}
              {canDelete && (
                <td className="border border-blue-400 px-2 py-1 text-center">
                  <button
                    onClick={() => handleDeleteCompany(company.businessId)}
                    disabled={deletingId === company.businessId}
                    className="bg-red-600 hover:bg-red-700 text-white px-2 py-0.5 rounded text-xs"
                  >
                    {deletingId === company.businessId ? '...' : 'Delete'}
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompanyList;

'use client';

import { useState, useEffect } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyList from './Components/CompanyList';
import CompanyFilter from './Components/CompanyFilter';

import { BACKEND_URL } from '@/app/Utils/backendUrl';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([
        {
            id: 'CMP001',
            companyName: 'Acme Corp',
            ownerName: 'John Doe',
            phoneNumber: '9876543210',
            email: 'john@acme.com',
            address: '123 Main Street, Mumbai',
            location: 'Mumbai, Maharashtra',
            gst: '27ABCDE1234F1Z5',
            website: 'https://acmecorp.com',
            socialLinks: [
                { platform: 'Instagram', link: 'https://instagram.com/acme' },
                { platform: 'Facebook', link: 'https://facebook.com/acme' }
            ],
            joinedAt: '2024-11-01',
            subscriptionPlan: 'Premium',
            type: 'Retail Store',
            kycStatus: 'Verified'
        },
        {
            id: 'CMP002',
            companyName: 'Fresh Bites Café',
            ownerName: 'Jane Smith',
            phoneNumber: '9123456789',
            email: 'jane@freshbites.com',
            address: '456 Park Avenue, Bangalore',
            location: 'Bangalore, Karnataka',
            gst: '29XYZDE1234G1Z7',
            website: 'https://freshbites.in',
            socialLinks: [
                { platform: 'Twitter', link: 'https://twitter.com/freshbites' }
            ],
            joinedAt: '2024-10-15',
            subscriptionPlan: 'Standard',
            type: 'Restaurant / Café',
            kycStatus: 'Pending'
        },
        {
            id: 'CMP003',
            companyName: 'Style Studio',
            ownerName: 'Raj Mehta',
            phoneNumber: '9988776655',
            email: 'raj@stylestudio.in',
            address: '789 Fashion Street, Delhi',
            location: 'New Delhi, Delhi',
            gst: '07LMNOP1234H1Z2',
            website: 'https://stylestudio.in',
            socialLinks: [],
            joinedAt: '2025-01-05',
            subscriptionPlan: 'Free',
            type: 'Salon / Spa',
            kycStatus: 'Rejected'
        }
    ]);

    const [editingCompany, setEditingCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const fetchBusinesses = async () => {
        const token = localStorage.getItem('token');

        try {
            const queryParams = new URLSearchParams({
                ...(status && { status }),
                ...(type && { type }),
                ...(page && { page }),
                ...(limit && { limit }),
            });

            const response = await fetch(`${BACKEND_URL}/businesses?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCompanies(data.data || []);
            } else {
                console.error(`Failed to fetch companies: ${response.status}`);
            }
        } catch (err) {
            console.error('Failed to fetch companies:', err);
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []);

    return (
        <div className="flex flex-col gap-6 px-4 py-6 w-full max-w-[1200px] mx-auto">
            {/* Add Company Form */}
            <div className="">
                <AddCompanyForm
                    companies={companies}
                    setCompanies={setCompanies}
                    editingCompany={editingCompany}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    setEditingCompany={setEditingCompany}
                />
            </div>

            {/* Company List */}
            <div className="">
                <CompanyList
                    companies={companies}
                    setIsEditing={setIsEditing}
                    setCompanies={setCompanies}
                    setEditingCompany={setEditingCompany}
                />
            </div>
        </div>
    );
}

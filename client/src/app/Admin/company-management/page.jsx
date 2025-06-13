'use client';

import { useState, useEffect } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyList from './Components/CompanyList';
import CompanyFilter from './Components/CompanyFilter';

import { BACKEND_URL } from '@/app/Utils/backendUrl';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([]);
    const [editingCompany, setEditingCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const dummyCompanies = [
        {
            id: '1',
            companyName: 'Alpha Inc',
            ownerName: 'John Doe',
            phoneNumber: '9876543210',
            email: 'alpha@example.com',
            address: '123 Main St',
            location: 'Mumbai',
            gstNumber: '27ABCDE1234F1Z5',
            website: 'https://alphainc.com',
            socialLinks: [
                { platform: 'instagram', link: 'https://instagram.com/alpha' },
                { platform: 'facebook', link: 'https://facebook.com/alpha' },
            ],
            createdAt: new Date().toISOString(),
            subscription: 'premium',
            businessType: 'Retail Store',
            kycVerified: true,
            status: 'approved',
        },
        {
            id: '2',
            companyName: 'Beta Foods',
            ownerName: 'Jane Smith',
            phoneNumber: '9876501234',
            email: 'beta@example.com',
            address: '456 Hill Rd',
            location: 'Delhi',
            gstNumber: '07ABCDE5678F2Z6',
            website: 'https://betafoods.com',
            socialLinks: [
                { platform: 'twitter', link: 'https://twitter.com/beta' },
            ],
            createdAt: new Date().toISOString(),
            subscription: 'basic',
            businessType: 'Restaurant / Café',
            kycVerified: false,
            status: 'pending',
        },
    ];


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
        <div className="flex flex-col md:flex-row justify-between gap-6 px-4 py-6 w-full max-w-[1200px] mx-auto">
            {/* Add Company Form */}
            <div className="w-full md:w-1/2">
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
            <div className="w-full md:w-1/2">
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

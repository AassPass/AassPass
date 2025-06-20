'use client';

import { BACKEND_URL } from '@/app/Utils/backendUrl';
import { useState, useEffect, useCallback } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyFilter from './Components/CompanyFilter';
import CompanyList from './Components/CompanyList';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([
        {
            businessId: 'BUS1680000000001',
            businessName: 'Acme Retail',
            ownerName: 'John Doe',
            phoneNumber: '9876543210',
            emailAddress: 'john@acme.com',
            address: '123 Market Street, New York',
            latitude: '40.7128',
            longitude: '-74.0060',
            gstNumber: '27ABCDE1234F1Z5',
            websiteLink: 'https://acmeretail.com',
            socialLinks: [
                { platform: 'Instagram', link: 'https://instagram.com/acmeretail' },
                { platform: 'Facebook', link: 'https://facebook.com/acmeretail' },
            ],
            joinedDate: '2024-10-01',
            subscriptionType: 'STANDARD',
            businessType: 'RETAIL_STORE',
            verificationStatus: 'PENDING',
        },
        {
            businessId: 'BUS1680000000002',
            businessName: 'FitLife Gym',
            ownerName: 'Jane Smith',
            phoneNumber: '9123456789',
            emailAddress: 'contact@fitlife.com',
            address: '456 Wellness Ave, Los Angeles',
            latitude: '34.0522',
            longitude: '-118.2437',
            gstNumber: '27ABCDE1234F1Z6',
            websiteLink: 'https://fitlifegym.com',
            socialLinks: [
                { platform: 'LinkedIn', link: 'https://linkedin.com/company/fitlife' }
            ],
            joinedDate: '2024-11-15',
            subscriptionType: 'PREMIUM',
            businessType: 'GYM_FITNESS',
            verificationStatus: 'VERIFIED',
        },
        {
            businessId: 'BUS1680000000003',
            businessName: 'EduSmart Coaching',
            ownerName: 'Ravi Kumar',
            phoneNumber: '9012345678',
            emailAddress: 'info@edusmart.com',
            address: '789 Education Road, Delhi',
            latitude: '28.6139',
            longitude: '77.2090',
            gstNumber: '27ABCDE1234F1Z7',
            websiteLink: '',
            socialLinks: [],
            joinedDate: '2024-12-20',
            subscriptionType: 'STANDARD',
            businessType: 'EDUCATION_COACHING',
            verificationStatus: 'VERIFIED',
        }
    ]);
    const [editingCompany, setEditingCompany] = useState(null);
    const [isEditing, setIsEditing] = useState(false);
    const [status, setStatus] = useState('');
    const [type, setType] = useState('');
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);

    const fetchBusinesses = useCallback(async (customPage, customLimit, customStatus, customType) => {
        const token = localStorage.getItem('token');
        try {
            const queryParams = new URLSearchParams({
                ...(customStatus && { status: customStatus }),
                ...(customType && { type: customType }),
                page: String(customPage),
                limit: String(customLimit),
            });

            const response = await fetch(`${BACKEND_URL}/businesses?${queryParams.toString()}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setCompanies(data?.data || []);
            } else {
                console.error(`Failed to fetch companies: ${response.status}`);
            }
        } catch (err) {
            console.error('Failed to fetch companies:', err);
        }
    }, []);

    useEffect(() => {
        fetchBusinesses(page, limit, status, type);
    }, []);

    const handleFilter = (customPage = page, customLimit = limit, customStatus = status, customType = type) => {
        setPage(customPage);
        setLimit(customLimit);
        setStatus(customStatus);
        setType(customType);
        fetchBusinesses(customPage, customLimit, customStatus, customType);
    };

    return (
        <div className="flex flex-col gap-6 px-4 py-6 w-full max-w-[1200px] mx-auto">
            <AddCompanyForm
                companies={companies}
                setCompanies={setCompanies}
                editingCompany={editingCompany}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditingCompany={setEditingCompany}
            />

            <div className="space-y-4">
                <CompanyFilter
                    status={status}
                    type={type}
                    page={page}
                    limit={limit}
                    setStatus={setStatus}
                    setType={setType}
                    setPage={setPage}
                    setLimit={setLimit}
                    onFilter={handleFilter}
                />
                <CompanyList
                    companies={companies}
                    setCompanies={setCompanies}
                    setEditingCompany={setEditingCompany}
                    setIsEditing={setIsEditing}
                />
            </div>
        </div>
    );
}

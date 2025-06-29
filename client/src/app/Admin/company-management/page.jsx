'use client';

import { BACKEND_URL } from '@/app/Utils/backendUrl';
import { useState, useEffect, useCallback } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyFilter from './Components/CompanyFilter';
import CompanyList from './Components/CompanyList';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([ {
    businessId: 'b123',
    businessName: "Joe's Coffee",
    ownerName: "Joe Smith",
    phoneNumber: "+1234567890",
    emailAddress: "joe@example.com",
    address: "123 Main St, Springfield",
    subscriptionType: "PREMIUM",
    gstNumber: "GST1234567",
    latitude: 40.7128,
    longitude: -74.0060,
    websiteLink: "https://joescoffee.com",
    businessType: "RESTAURANT_CAFE",
    socialLinks: {
      instagram: "https://instagram.com/joescoffee",
      facebook: "https://facebook.com/joescoffee",
      twitter: "https://twitter.com/joescoffee"
    }
  },
  {
    businessId: 'b124',
    businessName: "Tech Solutions",
    ownerName: "Alice Johnson",
    phoneNumber: "+1987654321",
    emailAddress: "alice@techsolutions.com",
    address: "456 Tech Ave, Silicon Valley",
    subscriptionType: "STANDARD",
    gstNumber: "GST7654321",
    latitude: 37.7749,
    longitude: -122.4194,
    websiteLink: "https://techsolutions.com",
    businessType: "SERVICE_PROVIDER",
    socialLinks: {
      instagram: "",
      facebook: "https://facebook.com/techsolutions",
      twitter: ""
    }
  },
  {
    businessId: 'b125',
    businessName: "Green Fitness",
    ownerName: "Mark Green",
    phoneNumber: "+1230984567",
    emailAddress: "mark@greenfitness.com",
    address: "789 Fitness Blvd, Austin",
    subscriptionType: "",
    gstNumber: "",
    latitude: 30.2672,
    longitude: -97.7431,
    websiteLink: "",
    businessType: "GYM_FITNESS",
    socialLinks: {
      instagram: "https://instagram.com/greenfitness",
      facebook: "",
      twitter: "https://twitter.com/greenfitness"
    }
  }]);

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
        <div className="flex flex-col gap-2 px-4 py-2 w-full max-w-[1200px] mx-auto">



            <AddCompanyForm
                companies={companies}
                setCompanies={setCompanies}
                editingCompany={editingCompany}
                isEditing={isEditing}
                setIsEditing={setIsEditing}
                setEditingCompany={setEditingCompany}
            />

            <div className="border  rounded-md shodow-md border border-gray-300">
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

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

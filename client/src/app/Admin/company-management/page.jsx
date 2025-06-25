'use client';

import { BACKEND_URL } from '@/app/Utils/backendUrl';
import { useState, useEffect, useCallback } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyFilter from './Components/CompanyFilter';
import CompanyList from './Components/CompanyList';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([]);

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

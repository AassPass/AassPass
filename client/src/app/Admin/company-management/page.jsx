'use client';

import { useState, useEffect } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyList from './Components/CompanyList';
import CompanyFilter from './Components/CompanyFilter';
import axios from 'axios';
import { toast } from 'react-toastify';
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
            const response = await axios.get(`${BACKEND_URL}/businesses`, {
                params: {
                    status,
                    type,
                    page,
                    limit,
                },
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            console.log("respoiasdfbnasjkdfbgas", response.data);
            setCompanies(response.data.data || []);
            toast.success('Companies fetched successfully');
        } catch (err) {
            console.error("Error:", err.response?.data || err.message);
            toast.error('Failed to fetch companies');
        }
    };

    useEffect(() => {
        fetchBusinesses();
    }, []); // Only once on load

    return (
        <div className="flex flex-col h-full p-6 overflow-hidden">
            <h1 className="text-2xl font-bold mb-4 text-black">Company Management</h1>

            <CompanyFilter
                status={status}
                type={type}
                page={page}
                limit={limit}
                setStatus={setStatus}
                setType={setType}
                setPage={setPage}
                setLimit={setLimit}
                onFilter={fetchBusinesses} // Now this works
            />

            <div className="mb-4">
                <AddCompanyForm
                    companies={companies}
                    setCompanies={setCompanies}
                    editingCompany={editingCompany}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                    setEditingCompany={setEditingCompany}
                />
            </div>

            <h2 className="text-xl font-semibold mb-3 text-black">Companies List</h2>

            <CompanyList
                companies={companies}
                setIsEditing={setIsEditing}
                setCompanies={setCompanies}
                setEditingCompany={setEditingCompany}
            />
        </div>
    );
}

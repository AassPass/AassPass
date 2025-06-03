'use client';

import { useState, useEffect } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyList from './Components/CompanyList';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import { BACKEND_URL } from '@/app/Utils/backendUrl';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([]);
    const [editingCompany, setEditingCompany] = useState(null); 
    const [isEditing, setIsEditing] = useState(false)

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`${BACKEND_URL}/business`, {headers: {
                    Authorization: `Bearer ${token}`
                }});
                console.log(response.data);
                setCompanies(response.data);
                toast.success('Companies loaded successfully!');
            } catch (error) {
                console.log(error);
            }
        }
        fetchCompanies();
        }, []);

    return (
        <div className="flex flex-col h-full p-6 overflow-hidden">
            <h1 className="text-2xl font-bold mb-4 text-black">Company Management</h1>

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

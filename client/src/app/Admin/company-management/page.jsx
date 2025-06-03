'use client';

import { useState } from 'react';
import AddCompanyForm from '../Components/AddCompanyForm';
import CompanyList from './Components/CompanyList';

export default function CompanyManagement() {
    const [companies, setCompanies] = useState([
        {

            businessId: 'CMP1685560800000',
            businessName: 'Acme Corp',
            ownerName: 'John Doe',
            phoneNumber: '9876543210',
            emailAddress: 'john@acme.com',
            address: '123 Main St',
            latitude: '12.9716',
            longitude: '77.5946',
            gstNumber: '29ABCDE1234F2Z5',
            websiteLink: 'https://acme.com',
            socialMediaLinks: [
                { platform: 'Instagram', link: 'https://instagram.com/acme' },
                { platform: 'Twitter', link: 'https://twitter.com/acme' },
            ],
            verificationStatus: 'Pending',
            joinedDate: '2023-06-01',
            subscriptionType: 'Premium',
            businessType: 'Retail Store',
        },

    ]);
    const [editingCompany, setEditingCompany] = useState(null); // for edit
    const [isEditing, setIsEditing] = useState(false)

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

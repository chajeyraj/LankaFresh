
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getCategories, createCategory, updateCategory, deleteCategory } from '../../services/supabase';
import { Category } from '../../types';
import Spinner from '../../components/Spinner';

const CategoryManagementPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({ name: '', description: '' });

    const fetchCategories = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) { console.error(error); } 
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const openModal = (category: Category | null = null) => {
        setEditingCategory(category);
        setFormData(category ? { name: category.name, description: category.description || '' } : { name: '', description: '' });
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id, formData);
            } else {
                await createCategory(formData);
            }
            await fetchCategories();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };
    
    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure? This may affect products in this category.')) {
            await deleteCategory(id);
            await fetchCategories();
        }
    };

    return (
        <AdminLayout title="Manage Categories">
            <div className="flex justify-end mb-4">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Category</button>
            </div>
            {loading ? <Spinner /> : (
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {categories.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.description}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(c)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(c.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
             {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg">
                        <h2 className="text-xl font-bold mb-4">{editingCategory ? 'Edit' : 'Add'} Category</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="mb-4">
                                <label>Name</label>
                                <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                            </div>
                            <div className="mb-4">
                                <label>Description</label>
                                <textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea>
                            </div>
                            <div className="flex justify-end mt-6 space-x-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Category</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CategoryManagementPage;

import React, { useCallback, useEffect, useState } from 'react';
import AdminLayout from '../../components/AdminLayout';
import Spinner from '../../components/Spinner';
import { Testimonial } from '../../types';
import { createTestimonial, deleteTestimonial, getTestimonials, updateTestimonial } from '../../services/supabase';

type TestimonialFormState = {
    name: string;
    location: string;
    rating: number;
    comment: string;
    avatar_url: string;
    is_published: boolean;
    sort_order: number;
};

const defaultFormState: TestimonialFormState = {
    name: '',
    location: '',
    rating: 5,
    comment: '',
    avatar_url: '',
    is_published: true,
    sort_order: 0,
};

const TestimonialManagementPage: React.FC = () => {
    const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
    const [formData, setFormData] = useState<TestimonialFormState>(defaultFormState);

    const fetchTestimonials = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getTestimonials(false);
            setTestimonials(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchTestimonials();
    }, [fetchTestimonials]);

    const openModal = (testimonial: Testimonial | null = null) => {
        setEditingTestimonial(testimonial);
        if (testimonial) {
            setFormData({
                name: testimonial.name,
                location: testimonial.location || '',
                rating: testimonial.rating,
                comment: testimonial.comment,
                avatar_url: testimonial.avatar_url || '',
                is_published: testimonial.is_published,
                sort_order: testimonial.sort_order || 0,
            });
        } else {
            setFormData(defaultFormState);
        }
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData((prev) => ({ ...prev, [name]: checked }));
            return;
        }
        if (name === 'rating' || name === 'sort_order') {
            setFormData((prev) => ({ ...prev, [name]: Number(value) }));
            return;
        }
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload = {
                name: formData.name,
                location: formData.location || null,
                rating: formData.rating,
                comment: formData.comment,
                avatar_url: formData.avatar_url || null,
                is_published: formData.is_published,
                sort_order: formData.sort_order,
            };

            if (editingTestimonial) {
                await updateTestimonial(editingTestimonial.id, payload);
            } else {
                await createTestimonial(payload);
            }
            await fetchTestimonials();
            closeModal();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm('Delete this testimonial?')) return;
        try {
            await deleteTestimonial(id);
            await fetchTestimonials();
        } catch (error) {
            console.error(error);
        }
    };

    const renderStars = (rating: number) => '★'.repeat(Math.max(0, Math.min(5, rating)));

    return (
        <AdminLayout title="Manage Testimonials">
            <div className="flex justify-end mb-4">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    Add Testimonial
                </button>
            </div>
            {loading ? <Spinner /> : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rating</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Published</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {testimonials.map((testimonial) => (
                                <tr key={testimonial.id}>
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-800">{testimonial.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{testimonial.location || '-'}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-amber-600">{renderStars(testimonial.rating)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${testimonial.is_published ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                            {testimonial.is_published ? 'Yes' : 'No'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{testimonial.sort_order}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(testimonial)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(testimonial.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-xl">
                        <h2 className="text-xl font-bold mb-4">{editingTestimonial ? 'Edit' : 'Add'} Testimonial</h2>
                        <form onSubmit={handleSubmit}>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block mb-1">Name</label>
                                    <input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1">Location</label>
                                    <input type="text" name="location" value={formData.location} onChange={handleChange} className="w-full p-2 border rounded" />
                                </div>
                                <div>
                                    <label className="block mb-1">Rating (1-5)</label>
                                    <input type="number" min={1} max={5} name="rating" value={formData.rating} onChange={handleChange} className="w-full p-2 border rounded" required />
                                </div>
                                <div>
                                    <label className="block mb-1">Sort Order</label>
                                    <input type="number" name="sort_order" value={formData.sort_order} onChange={handleChange} className="w-full p-2 border rounded" />
                                </div>
                            </div>
                            <div className="mt-4">
                                <label className="block mb-1">Avatar URL</label>
                                <input type="url" name="avatar_url" value={formData.avatar_url} onChange={handleChange} className="w-full p-2 border rounded" placeholder="https://..." />
                            </div>
                            <div className="mt-4">
                                <label className="block mb-1">Comment</label>
                                <textarea name="comment" value={formData.comment} onChange={handleChange} className="w-full p-2 border rounded" rows={4} required />
                            </div>
                            <label className="mt-4 inline-flex items-center gap-2">
                                <input type="checkbox" name="is_published" checked={formData.is_published} onChange={handleChange} />
                                <span>Published on homepage</span>
                            </label>
                            <div className="flex justify-end mt-6 space-x-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default TestimonialManagementPage;

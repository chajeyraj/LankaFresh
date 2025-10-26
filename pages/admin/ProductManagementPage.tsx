
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getProducts, getCategories, createProduct, updateProduct, deleteProduct, uploadProductImage } from '../../services/supabase';
import { Product, Category } from '../../types';
import Spinner from '../../components/Spinner';

const ProductManagementPage: React.FC = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [formData, setFormData] = useState({
        name: '', description: '', price_lkr: 0, price_usd: 0, category_id: '', image_url: '',
        origin: '', weight_grams: 0, cultural_significance: ''
    });
    const [imageFile, setImageFile] = useState<File | null>(null);

    const fetchProductsAndCategories = useCallback(async () => {
        setLoading(true);
        try {
            const [productsData, categoriesData] = await Promise.all([getProducts(), getCategories()]);
            setProducts(productsData);
            setCategories(categoriesData);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProductsAndCategories();
    }, [fetchProductsAndCategories]);

    const openModal = (product: Product | null = null) => {
        setEditingProduct(product);
        if (product) {
            setFormData({
                name: product.name,
                description: product.description,
                price_lkr: product.price_lkr,
                price_usd: product.price_usd || 0,
                category_id: product.category_id,
                image_url: product.image_url,
                origin: product.origin || '',
                weight_grams: product.weight_grams || 0,
                cultural_significance: product.cultural_significance || ''
            });
        } else {
            setFormData({ 
                name: '', description: '', price_lkr: 0, price_usd: 0, category_id: '', image_url: '',
                origin: '', weight_grams: 0, cultural_significance: ''
            });
        }
        setImageFile(null);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: name.startsWith('price') || name.startsWith('weight') ? parseFloat(value) : value }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            let imageUrl = formData.image_url;
            if (imageFile) {
                imageUrl = await uploadProductImage(imageFile);
            }

            const productData: any = { ...formData, image_url: imageUrl };
            // Ensure optional fields are not sent as empty strings if they should be null
            if (!productData.origin) delete productData.origin;
            if (!productData.weight_grams) delete productData.weight_grams;
            if (!productData.cultural_significance) delete productData.cultural_significance;


            if (editingProduct) {
                await updateProduct(editingProduct.id, productData);
            } else {
                await createProduct(productData);
            }
            await fetchProductsAndCategories();
            closeModal();
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this product?')) {
            await deleteProduct(id);
            await fetchProductsAndCategories();
        }
    };

    return (
        <AdminLayout title="Manage Products">
            <div className="flex justify-end mb-4">
                <button onClick={() => openModal()} className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add New Product</button>
            </div>
            {loading ? <Spinner /> : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50"><tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price (LKR)</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr></thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {products.map(p => (
                                <tr key={p.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{p.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{p.categories.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{p.price_lkr.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => openModal(p)} className="text-indigo-600 hover:text-indigo-900 mr-4">Edit</button>
                                        <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">{editingProduct ? 'Edit' : 'Add'} Product</h2>
                        <form onSubmit={handleSubmit}>
                            {/* Form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div><label>Name</label><input type="text" name="name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
                                <div><label>Category</label><select name="category_id" value={formData.category_id} onChange={handleChange} className="w-full p-2 border rounded" required><option value="">Select Category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
                                <div><label>Price (LKR)</label><input type="number" step="0.01" name="price_lkr" value={formData.price_lkr} onChange={handleChange} className="w-full p-2 border rounded" required /></div>
                                <div><label>Price (USD)</label><input type="number" step="0.01" name="price_usd" value={formData.price_usd} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                            </div>
                            <div className="mt-4"><label>Description</label><textarea name="description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded" rows={4}></textarea></div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                <div><label>Origin (e.g., Kandy)</label><input type="text" name="origin" value={formData.origin} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                                <div><label>Weight (grams)</label><input type="number" name="weight_grams" value={formData.weight_grams} onChange={handleChange} className="w-full p-2 border rounded" /></div>
                            </div>
                            <div className="mt-4"><label>Cultural Significance</label><textarea name="cultural_significance" value={formData.cultural_significance} onChange={handleChange} className="w-full p-2 border rounded" rows={3}></textarea></div>
                            <div className="mt-4"><label>Image</label><input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" /></div>
                            <div className="flex justify-end mt-6 space-x-4">
                                <button type="button" onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Cancel</button>
                                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Product</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ProductManagementPage;
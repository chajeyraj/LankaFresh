
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getCustomers, getCustomerOrders } from '../../services/supabase';
import { Customer, Order } from '../../types';
import Spinner from '../../components/Spinner';

const CustomerManagementPage: React.FC = () => {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [customerOrders, setCustomerOrders] = useState<Order[]>([]);

    useEffect(() => {
        const fetchCustomers = async () => {
            setLoading(true);
            try {
                const data = await getCustomers();
                setCustomers(data);
            } catch (error) { console.error(error); }
            finally { setLoading(false); }
        };
        fetchCustomers();
    }, []);

    const viewCustomerDetails = async (customer: Customer) => {
        setSelectedCustomer(customer);
        const orders = await getCustomerOrders(customer.id);
        setCustomerOrders(orders);
    };

    const closeModal = () => {
        setSelectedCustomer(null);
        setCustomerOrders([]);
    };

    return (
        <AdminLayout title="Manage Customers">
             {loading ? <Spinner /> : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">WhatsApp</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Country</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map(c => (
                                <tr key={c.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.whatsapp_number}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{c.country}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => viewCustomerDetails(c)} className="text-indigo-600 hover:text-indigo-900">View History</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedCustomer && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Customer Details</h2>
                        <div className="mb-4">
                            <p><strong>Name:</strong> {selectedCustomer.name}</p>
                            <p><strong>WhatsApp:</strong> {selectedCustomer.whatsapp_number}</p>
                            <p><strong>Country:</strong> {selectedCustomer.country}</p>
                            {selectedCustomer.delivery_address && <p><strong>Address:</strong> {selectedCustomer.delivery_address}</p>}
                        </div>
                         <h3 className="text-lg font-semibold mb-2">Order History</h3>
                         <div className="border rounded-lg">
                            {customerOrders.length > 0 ? (
                                customerOrders.map(order => (
                                    <div key={order.id} className="p-4 border-b last:border-b-0">
                                        <p><strong>Order ID:</strong> {order.id.substring(0,8)}</p>
                                        <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
                                        <p><strong>Total:</strong> LKR {order.total_amount.toFixed(2)}</p>
                                        <p><strong>Status:</strong> {order.status}</p>
                                    </div>
                                ))
                            ) : <p className="p-4">No orders found for this customer.</p>}
                         </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={closeModal} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default CustomerManagementPage;

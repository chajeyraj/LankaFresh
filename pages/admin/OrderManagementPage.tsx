
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getOrders, updateOrderStatus } from '../../services/supabase';
import { Order, OrderStatus } from '../../types';
import Spinner from '../../components/Spinner';

const OrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const fetchOrders = useCallback(async () => {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data);
        } catch (error) { console.error(error); }
        finally { setLoading(false); }
    }, []);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const handleStatusChange = async (orderId: string, status: OrderStatus) => {
        await updateOrderStatus(orderId, status);
        fetchOrders(); // Refresh orders
    };

    const getStatusColor = (status: OrderStatus) => {
        switch (status) {
            case OrderStatus.Pending: return 'bg-yellow-200 text-yellow-800';
            case OrderStatus.Processing: return 'bg-blue-200 text-blue-800';
            case OrderStatus.Delivered: return 'bg-green-200 text-green-800';
            default: return 'bg-gray-200 text-gray-800';
        }
    };

    return (
        <AdminLayout title="Manage Orders">
            {loading ? <Spinner /> : (
                <div className="bg-white shadow rounded-lg overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {orders.map(o => (
                                <tr key={o.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">{o.customers.name}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">{new Date(o.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">LKR {o.total_amount.toFixed(2)}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(o.status)}`}>
                                            {o.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button onClick={() => setSelectedOrder(o)} className="text-indigo-600 hover:text-indigo-900">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
                        <h2 className="text-xl font-bold mb-4">Order Details ({selectedOrder.id.substring(0, 8)})</h2>
                        {/* Customer details */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Customer</h3>
                            <p>{selectedOrder.customers.name} - {selectedOrder.customers.country}</p>
                            <p>WhatsApp: {selectedOrder.customers.whatsapp_number}</p>
                            {selectedOrder.customers.delivery_address && <p>Address: {selectedOrder.customers.delivery_address}</p>}
                            {selectedOrder.customers.notes && <p>Notes: {selectedOrder.customers.notes}</p>}
                        </div>
                        {/* Order items */}
                        <div className="mb-4">
                            <h3 className="font-semibold">Items</h3>
                            <ul>{selectedOrder.order_items.map(item => <li key={item.id}>{item.products.name} x {item.quantity} @ LKR {item.price.toFixed(2)}</li>)}</ul>
                        </div>
                        {/* Status update */}
                        <div className="mb-4">
                            <label className="font-semibold block mb-2">Update Status</label>
                            <select
                                value={selectedOrder.status}
                                onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                                className="w-full p-2 border rounded"
                            >
                                {Object.values(OrderStatus).map(status => <option key={status} value={status}>{status}</option>)}
                            </select>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button onClick={() => setSelectedOrder(null)} className="px-4 py-2 bg-gray-200 rounded">Close</button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrderManagementPage;

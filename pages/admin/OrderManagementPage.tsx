
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getOrderById, getOrders, updateOrderStatus } from '../../services/supabase';
import { Order, OrderStatus } from '../../types';
import Spinner from '../../components/Spinner';

const OrderManagementPage: React.FC = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [viewLoading, setViewLoading] = useState(false);
    const [viewError, setViewError] = useState('');

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

    const handleViewDetails = async (orderId: string) => {
        setViewLoading(true);
        setViewError('');
        try {
            const fullOrder = await getOrderById(orderId);
            setSelectedOrder(fullOrder);
        } catch (error: any) {
            setViewError(error?.message || 'Failed to load order details.');
        } finally {
            setViewLoading(false);
        }
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
                                        <button onClick={() => handleViewDetails(o.id)} className="text-indigo-600 hover:text-indigo-900">View Details</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
            {viewError && <p className="mt-4 text-sm text-red-600">{viewError}</p>}
            {viewLoading && <div className="mt-4"><Spinner /></div>}
            {selectedOrder && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={() => setSelectedOrder(null)}>
                    <div
                        className="w-full max-w-2xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-amber-50 to-orange-50 px-6 py-4">
                            <div>
                                <h2 className="text-xl font-bold text-slate-900">Order Details</h2>
                                <p className="text-sm font-medium text-amber-700">#{selectedOrder.id.substring(0, 8)}</p>
                            </div>
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-full px-3 py-1.5 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
                            >
                                Close
                            </button>
                        </div>

                        <div className="max-h-[70vh] space-y-6 overflow-y-auto px-6 py-5">
                            <div className="rounded-xl border border-amber-100 bg-amber-50/60 p-4">
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-800">Customer</h3>
                                <div className="grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-[120px_1fr] sm:items-start">
                                    <p className="font-semibold text-slate-700">Name</p>
                                    <p className="font-medium text-slate-900">{selectedOrder.customers.name}</p>
                                    <p className="font-semibold text-slate-700">Country</p>
                                    <p className="text-slate-700">{selectedOrder.customers.country}</p>
                                    <p className="font-semibold text-slate-700">WhatsApp</p>
                                    <p className="text-slate-700">{selectedOrder.customers.whatsapp_number}</p>
                                </div>
                                {selectedOrder.customers.delivery_address && (
                                    <div className="mt-2 grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-[120px_1fr] sm:items-start">
                                        <p className="font-semibold text-slate-700">Address</p>
                                        <p className="text-slate-700">{selectedOrder.customers.delivery_address}</p>
                                    </div>
                                )}
                                {selectedOrder.customers.notes && (
                                    <div className="mt-2 grid grid-cols-1 gap-y-1 text-sm sm:grid-cols-[120px_1fr] sm:items-start">
                                        <p className="font-semibold text-slate-700">Notes</p>
                                        <p className="text-slate-700">{selectedOrder.customers.notes}</p>
                                    </div>
                                )}
                            </div>

                            <div>
                                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-700">Items</h3>
                                {selectedOrder.order_items.length > 0 ? (
                                    <ul className="space-y-2">
                                        {selectedOrder.order_items.map(item => (
                                            <li key={item.id} className="grid grid-cols-[1fr_auto_auto] items-center gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm">
                                                <span className="font-medium text-slate-800">{item.products?.name || 'Deleted product'}</span>
                                                <span className="rounded-md bg-amber-100 px-2 py-1 text-xs font-semibold text-amber-800">
                                                    x {item.quantity}
                                                </span>
                                                <span className="text-right font-medium text-slate-700">
                                                    LKR {item.price.toFixed(2)}
                                                </span>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="text-sm text-slate-600">No order items were found for this order.</p>
                                )}
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-semibold uppercase tracking-wide text-slate-700">Update Status</label>
                                <select
                                    value={selectedOrder.status}
                                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value as OrderStatus)}
                                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-200"
                                >
                                    {Object.values(OrderStatus).map(status => <option key={status} value={status}>{status}</option>)}
                                </select>
                            </div>
                        </div>

                        <div className="flex justify-end border-t border-slate-200 bg-slate-50 px-6 py-4">
                            <button
                                onClick={() => setSelectedOrder(null)}
                                className="rounded-lg bg-amber-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-amber-700"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default OrderManagementPage;

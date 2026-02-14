
import React, { useState, useEffect, useCallback } from 'react';
import AdminLayout from '../../components/AdminLayout';
import { getClient } from '../../services/supabase';
import Spinner from '../../components/Spinner';

interface ContactMessage {
    id: string;
    name: string;
    email: string;
    message: string;
    created_at: string;
}

const ContactMessagesPage: React.FC = () => {
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState<string | null>(null);

    const fetchMessages = useCallback(async () => {
        setLoading(true);
        const { data, error } = await getClient()
            .from('contact_messages')
            .select('*')
            .order('created_at', { ascending: false });
        if (!error && data) setMessages(data as ContactMessage[]);
        setLoading(false);
    }, []);

    useEffect(() => { fetchMessages(); }, [fetchMessages]);

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this message?')) return;
        setDeleting(id);
        await getClient().from('contact_messages').delete().eq('id', id);
        setMessages(prev => prev.filter(m => m.id !== id));
        setDeleting(null);
    };

    return (
        <AdminLayout title="Contact Messages">
            {loading ? <Spinner /> : messages.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No contact messages yet.</p>
            ) : (
                <div className="space-y-4">
                    <p className="text-sm text-gray-500">{messages.length} message(s)</p>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white rounded-lg shadow">
                            <thead>
                                <tr className="bg-gray-100 text-left text-sm text-gray-600">
                                    <th className="p-3">Date</th>
                                    <th className="p-3">Name</th>
                                    <th className="p-3">Email</th>
                                    <th className="p-3">Message</th>
                                    <th className="p-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {messages.map(msg => (
                                    <tr key={msg.id} className="border-t hover:bg-gray-50">
                                        <td className="p-3 text-sm text-gray-500 whitespace-nowrap">
                                            {new Date(msg.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                        </td>
                                        <td className="p-3 font-medium text-sm">{msg.name}</td>
                                        <td className="p-3 text-sm">
                                            <a href={`mailto:${msg.email}`} className="text-blue-600 hover:underline">{msg.email}</a>
                                        </td>
                                        <td className="p-3 text-sm text-gray-700 max-w-md">
                                            <p className="line-clamp-3">{msg.message}</p>
                                        </td>
                                        <td className="p-3">
                                            <button
                                                onClick={() => handleDelete(msg.id)}
                                                disabled={deleting === msg.id}
                                                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
                                            >
                                                {deleting === msg.id ? 'Deleting...' : 'Delete'}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ContactMessagesPage;

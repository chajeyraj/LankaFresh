
import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';
import { isCurrentUserAdmin } from '../services/supabase';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { session, loading } = useAuth();
    const [adminLoading, setAdminLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);

    useEffect(() => {
        const checkAdmin = async () => {
            if (!session) {
                setIsAdmin(false);
                setAdminLoading(false);
                return;
            }
            setAdminLoading(true);
            try {
                const admin = await isCurrentUserAdmin();
                setIsAdmin(admin);
            } catch (error) {
                console.error('Failed to check admin role', error);
                setIsAdmin(false);
            } finally {
                setAdminLoading(false);
            }
        };
        checkAdmin();
    }, [session]);

    useEffect(() => {
        if (!loading && !session) {
            window.history.pushState({}, '', '/admin/login');
            window.dispatchEvent(new PopStateEvent('popstate'));
        }
    }, [session, loading]);

    if (loading || adminLoading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (session && isAdmin) {
        return children;
    }

    if (session && !isAdmin) {
        return (
            <div className="h-screen flex items-center justify-center p-6">
                <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-5 text-red-800">
                    <h2 className="text-lg font-semibold mb-2">Admin access required</h2>
                    <p>Your account is signed in but does not have the admin role.</p>
                </div>
            </div>
        );
    }

    return null;
};

export default ProtectedRoute;


import React, { useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import Spinner from './Spinner';

interface ProtectedRouteProps {
    children: React.ReactElement;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const { session, loading } = useAuth();

    useEffect(() => {
        if (!loading && !session) {
            window.location.hash = '/admin/login';
        }
    }, [session, loading]);

    if (loading) {
        return (
            <div className="h-screen flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (session) {
        return children;
    }

    return null;
};

export default ProtectedRoute;

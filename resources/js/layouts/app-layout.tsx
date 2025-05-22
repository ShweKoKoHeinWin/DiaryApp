import AppLayoutTemplate from '@/layouts/app/app-sidebar-layout';
import { type BreadcrumbItem } from '@/types';
import { usePage } from '@inertiajs/react';
import { useEffect, useState, type ReactNode } from 'react';

interface AppLayoutProps {
    children: ReactNode;
    breadcrumbs?: BreadcrumbItem[];
}

export default ({ children, breadcrumbs, ...props }: AppLayoutProps) => {
    const { success, errors } = usePage().props;
    const [alerts, setAlerts] = useState(success ? [success] : []);

    useEffect(() => {
        if (success) {
            setAlerts([...alerts, success]);
            setTimeout(() => setAlerts(alerts.filter((msg) => msg !== success)), 3000);
        }
    }, [success]);
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {alerts.map((msg, index) => (
                <div key={index} className="bg-green-800 rounded-2xl border-white border-1 text-white p-2 mx-4 my-1 w-auto">
                    {msg}
                </div>
            ))}
            {children}
        </AppLayoutTemplate>
    );
};

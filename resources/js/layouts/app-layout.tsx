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
            setTimeout(() => setAlerts(alerts.filter((msg) => msg !== success)), 5000);
        }
    }, [success]);
    const removeMessage = (msg) => setAlerts(alerts.filter((alert) => msg !== alert));
    return (
        <AppLayoutTemplate breadcrumbs={breadcrumbs} {...props}>
            {alerts.length > 0 && (
                <div className='fixed top-10 right-10 z-1000'>
                    {alerts.map((msg, index) => (
                        <div
                            key={index}
                            id="toast-success"
                            className="mb-4 ml-auto flex w-full max-w-xs items-center rounded-lg bg-white p-4 text-gray-500 shadow-sm dark:bg-gray-800 dark:text-gray-400 border-2 border-gray-900 dark:border-gray-300"
                            role="alert"
                        >
                            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200">
                                <svg
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                >
                                    <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
                                </svg>
                                <span className="sr-only">Check icon</span>
                            </div>
                            <div className="ms-3 text-sm font-normal">{msg}</div>
                            <button
                                onClick={() => removeMessage(msg)}
                                type="button"
                                className="-mx-1.5 -my-1.5 ms-auto inline-flex h-8 w-8 items-center justify-center rounded-lg bg-white p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-900 focus:ring-2 focus:ring-gray-300 dark:bg-gray-800 dark:text-gray-500 dark:hover:bg-gray-700 dark:hover:text-white"
                                data-dismiss-target="#toast-success"
                                aria-label="Close"
                            >
                                <span className="sr-only">Close</span>
                                <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                    <path
                                        stroke="currentColor"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                    />
                                </svg>
                            </button>
                        </div>
                    ))}
                </div>
            )}
            {children}
        </AppLayoutTemplate>
    );
};

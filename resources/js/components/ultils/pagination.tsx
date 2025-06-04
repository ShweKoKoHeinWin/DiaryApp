import { Link } from '@inertiajs/react';

const Pagination = ({ data, urlParamConfig = [] }: { data: { meta: any }; urlParamConfig?: any[] }) => {
    return (
        <div className="mt-6 flex justify-center gap-2">
            {data.meta.total > 0 &&
                data.meta.links.map((link: { url: string | null; label: string; active: boolean }, index: number) => {
                    // Build new URL with all filters
                    const buildUrlWithParams = (rawUrl: string | null) => {
                        if (!rawUrl) return '#';
                        const url = new URL(rawUrl, window.location.origin);

                        if (urlParamConfig.length > 0) {
                            urlParamConfig.forEach((param) => {
                                const paramKeys = Object.keys(param);
                                paramKeys.forEach((key) => {
                                    if(!param[key]) return;
                                    if (Array.isArray(param[key])) {
                                        param[key].length > 0 && param[key].forEach(value => {
                                            url.searchParams.append(`${key}[]`, value)
                                        });
                                    } else {
                                        url.searchParams.set(key, param[key] ?? '');
                                    }
                                });
                            });
                        }

                        return url.pathname + url.search; // keep it relative for Inertia
                    };

                    return link.url ? (
                        <Link
                            key={index}
                            href={buildUrlWithParams(link.url)}
                            className={`rounded border px-3 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        >
                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </Link>
                    ) : (
                        <span key={index} className="px-3 py-1 text-gray-400">
                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </span>
                    );
                })}
        </div>
    );
};

export default Pagination;

import CardListingPage from '@/components/diary/card-list';
import { DiaryFilterPanel } from '@/components/diary/diary-filter-panel';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryProp, CollectionShortProp, DiaryListingItemProp, EmotionDetailProp } from '@/types/types';

import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inbox & Shares',
        href: route('inbox-shares'),
    },
];

const Users = ({filterSort, users}: {
    filterSort: any
}) => {    
    console.log(users);
    const [filterProp, setFilterProp] = useState(filterSort.filters);
    const [sortProp, setSortProp] = useState(filterSort.sorting);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Shared Items" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

            </div>
        </AppLayout>
    );
};

export default Users;

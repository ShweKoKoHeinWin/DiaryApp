import CardListingPage from '@/components/diary/card-list';
import { DiaryFilterPanel } from '@/components/diary/diary-filter-panel';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryProp, CollectionShortProp, DiaryListingItemProp, EmotionDetailProp } from '@/types/types';

import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Diaries',
        href: route('diaries.index'),
    },
];

const endPoint = route('diaries.index');

const index = ({
    filterSort,
    diaries,
    categories,
    emotions,
    collections,
}: {
    filterSort: any;
    diaries: { meta: any; links: any; data: DiaryListingItemProp[] };
    categories: CategoryProp[];
    emotions: EmotionDetailProp[];
    collections: CollectionShortProp[];
}) => {
    console.log(diaries);

    const [filterProp, setFilterProp] = useState(filterSort.filters);
    const [sortProp, setSortProp] = useState(filterSort.sorting);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diaries" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DiaryFilterPanel
                    filterProp={filterProp}
                    setFilterProp={setFilterProp}
                    sortProp={sortProp}
                    setSortProp={setSortProp}
                    endPoint={endPoint}
                    categories={categories}
                    emotions={emotions}
                />

                <CardListingPage
                    diaries={diaries}
                    groupBy={sortProp.type}
                    groupOrder={sortProp.order}
                    collections={collections}
                    filterProp={filterProp}
                    sortProp={sortProp}
                />
            </div>
        </AppLayout>
    );
};

export default index;

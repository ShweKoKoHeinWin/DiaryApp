import CardListingPage from '@/components/diary/card-list';
import { DiaryFilterPanel } from '@/components/diary/diary-filter-panel';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryProp, DiaryListingItemProp, EmotionDetailProp } from '@/types/types';
// import { DiaryGroupByProp, FilterProp, SortProp } from '@/types/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collections',
        href: route('collections.index'),
    },
    {
        title: 'Show',
        href: '',
    },
];

const index = ({ filterSort, collections, diaries, collection, categories, emotions }: {
    diaries: {data: DiaryListingItemProp[]},
    categories: CategoryProp[],
    emotions: EmotionDetailProp[],
}) => {

    const [filterProp, setFilterProp] = useState(filterSort.filters);
    const [sortProp, setSortProp] = useState(filterSort.sorting);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DiaryFilterPanel
                    filterProp={filterProp}
                    setFilterProp={setFilterProp}
                    sortProp={sortProp}
                    setSortProp={setSortProp}
                    endPoint={route('collections.show', collection.id)}
                    categories={categories}
                    emotions={emotions}
                    diaryCreateUrl={route('diaries.create', {collection: collection.id})}
                />
                <CardListingPage diaries={diaries} collection={collection} collections={collections} groupBy={sortProp.type} groupOrder={sortProp.order} baseUrl={route('collections.show', collection.id)} filterProp={filterProp} sortProp={sortProp} cardType='collectionDiaryCard' />
            </div>
        </AppLayout>
    );
};

export default index;

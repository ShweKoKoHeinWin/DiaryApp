import CardListingPage from '@/components/collection/card-list';
import { CollectionModal } from '@/components/collection/collection-create-modal';
import { CollectionFilterPanel } from '@/components/collection/collection-filter-panel';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DiaryGroupByProp, FilterProp, SortProp } from '@/types/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collections',
        href: route('collections.index'),
    },
];

const endPoint = route('collections.index');

const index = (
    {filterSort, collections}
) => {
    console.log(collections);
    
    const [filterProp, setFilterProp] = useState<FilterProp>({});
    const [sortProp, setSortProp] = useState<SortProp>({});
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CollectionFilterPanel setIsOpen={setIsOpen} filterProp={filterProp} setFilterProp={setFilterProp} sortProp={sortProp} setSortProp={setSortProp} endPoint={endPoint} />
                {isOpen && <CollectionModal setIsOpen={setIsOpen} />}
                <CardListingPage collections={collections} groupBy={sortProp.type} groupOrder={sortProp.order}  />
            </div>
        </AppLayout>
    );
};

export default index;

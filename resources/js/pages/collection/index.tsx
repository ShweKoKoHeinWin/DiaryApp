import CardListingPage from '@/components/collection/card-list';
import { CollectionModal } from '@/components/collection/collection-create-modal';
import { CollectionFilterPanel } from '@/components/collection/collection-filter-panel';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CollectionProp, DATAMETA, FilterProp, FILTERSORTPROP, SortProp } from '@/types/types';
import { Head } from '@inertiajs/react';
import { useState } from 'react';

const endPoint = route('collections.index');

const index = ({ filterSort, collections, breadcrumbs, permissions=[] } : { filterSort: FILTERSORTPROP; collections: { meta: DATAMETA; links: any; data: CollectionProp[] }; breadcrumbs: BreadcrumbItem[]; permissions: string[]}) => {
    console.log(collections, filterSort, breadcrumbs);
    const [filterProp, setFilterProp] = useState<FilterProp>(filterSort.filters);
    const [sortProp, setSortProp] = useState<SortProp>(filterSort.sorting);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <CollectionFilterPanel
                    setIsOpen={setIsOpen}
                    filterProp={filterProp}
                    setFilterProp={setFilterProp}
                    sortProp={sortProp}
                    setSortProp={setSortProp}
                    endPoint={endPoint}
                />
                {isOpen && <CollectionModal setIsOpen={setIsOpen} />}
                <CardListingPage
                    collections={collections}
                    groupBy={sortProp.type}
                    groupOrder={sortProp.order}
                    filterProp={filterProp}
                    sortProp={sortProp}
                    permissions={permissions}
                />
            </div>
        </AppLayout>
    );
};

export default index;

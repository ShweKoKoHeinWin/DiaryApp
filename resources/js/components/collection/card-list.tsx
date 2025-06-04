import { CollectionProp, SortOrderProp, SortTypeProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { useState } from 'react';
import CardSelectModeBox from '../ultils/card-select-mode-box';
import { CardItem } from './card';
import Pagination from '../ultils/pagination';

// Mock data function to simulate API calls

export default function CardListingPage({
    groupBy = 'date',
    groupOrder = 'desc',
    collections,
    filterProp,
    sortProp,
}: {
    groupBy: SortTypeProp;
    groupOrder: SortOrderProp;
    collections: { meta: any; links: any; data: CollectionProp[] };
}) {
    const [cards, setCards] = useState<CollectionProp[]>(collections.data);
    const [isCardSelecting, setIsCardSelecting] = useState<boolean>(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Collections ({collections.meta.total})</h1>
            <CardSelectModeBox
                cardType='collection'
                actions={['multi-share']}
                cards={cards}
                isCardSelecting={isCardSelecting}
                setIsCardSelecting={setIsCardSelecting}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
            />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collections.data.map((card) => (
                    <div key={card.id} className="col-span-1">
                        <CardItem
                            card={card}
                            isCardSelecting={isCardSelecting}
                            setIsCardSelecting={setIsCardSelecting}
                            selectedCards={selectedCards}
                            setSelectedCards={setSelectedCards}
                        />
                    </div>
                ))}
            </div>
            {/* <div className="mt-6 flex justify-center gap-2">
                {collections.meta.total > 0 &&
                    collections.meta.links.map((link, index) => {
                        // Build new URL with all filters
                        const buildUrlWithParams = (rawUrl: string | null) => {
                            if (!rawUrl) return '#';
                            const url = new URL(rawUrl, window.location.origin);

                            url.searchParams.set('query', filterProp.query ?? '');
                            url.searchParams.set('startDate', filterProp.startDate ?? '');
                            url.searchParams.set('endDate', filterProp.endDate ?? '');
                            url.searchParams.set('sortBy', sortProp.type ?? '');
                            url.searchParams.set('sortOrder', sortProp.order ?? '');

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
            </div> */}
            <Pagination data={collections} urlParamConfig={[{'query': filterProp.query, 'startDate': filterProp.startDate, 'endDate': filterProp.endDate, 'sortBy': sortProp.type, 'sortOrder': sortProp.order}]} />
        </div>
    );
}

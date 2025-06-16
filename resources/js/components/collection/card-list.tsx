import { CollectionProp, DATAMETA, FilterProp, SortOrderProp, SortProp, SortTypeProp } from '@/types/types';
import { parse } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import CardSelectModeBox from '../ultils/card-select-mode-box';
import Pagination from '../ultils/pagination';
import { CardItem } from './card';
import { dateFormat } from '@/lib/utils';
import { SELECTMODE } from '@/lib/permissions';

// Mock data function to simulate API calls

export default function CardListingPage({
    groupBy = 'date',
    groupOrder = 'desc',
    collections,
    filterProp,
    sortProp,
    from = '',
    permissions = [],
}: {
    groupBy: SortTypeProp;
    groupOrder: SortOrderProp;
    collections: { meta: DATAMETA; links: any; data: CollectionProp[] };
    filterProp: FilterProp;
    sortProp: SortProp
    from?: string;
    permissions: string[];
}) {
    console.log(filterProp, sortProp);
    
    const [cards, setCards] = useState<CollectionProp[]>(collections.data);
    const [isCardSelecting, setIsCardSelecting] = useState<boolean>(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    useEffect(() => {
        setCards(collections.data);
    }, [collections.data]);
    const groupedCards = useMemo(() => {
        const map: Record<string, CollectionProp[]> = {};
        switch (groupBy) {
            case 'title':
                for (const card of cards) {
                    const key = card.title.charAt(0).toUpperCase();
                    if (!map[key]) map[key] = [];
                    map[key].push(card);
                }
                break;

            case 'date':
                for (const card of cards) {
                    const key = dateFormat(card.created_at);
                    if (!map[key]) map[key] = [];
                    map[key].push(card);
                }
                break;
        }

        const sortedEntries = Object.entries(map).sort(([keyA], [keyB]) => {
            // Customize sorting logic depending on groupBy
            if (groupBy === 'date') {
                // Parse dates back from string
                const dateA = parse(keyA, 'd - M - yyyy (EEEE)', new Date());
                const dateB = parse(keyB, 'd - M - yyyy (EEEE)', new Date());
                return groupOrder === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            } else {
                // Alphabetical
                return groupOrder === 'asc' ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
            }
        });
        const sortedMap: Record<string, CollectionProp[]> = {};
        for (const [key, value] of sortedEntries) {
            sortedMap[key] = value;
        }
        return sortedMap;
    }, [cards, groupBy, groupOrder]);
    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Collections ({collections.meta.total})</h1>
            <CardSelectModeBox
                cardType="collection"
                actions={permissions.includes(SELECTMODE.share) ? ['multi-share'] : []}
                cards={cards}
                isCardSelecting={isCardSelecting}
                setIsCardSelecting={setIsCardSelecting}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
            />
            {Object.entries(groupedCards).map(([group, items]) => (
                <div key={group} className="mb-4">
                    <h2 className="mb-2 rounded-2xl border-2 bg-gray-900/80 p-2 text-xl font-semibold text-gray-300">{group}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((card) => (
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
                </div>
            ))}

            <Pagination
                data={collections}
                urlParamConfig={[
                    {
                        query: filterProp?.query,
                        startDate: filterProp?.startDate,
                        endDate: filterProp?.endDate,
                        sortBy: sortProp?.type,
                        sortOrder: sortProp?.order,
                    },
                ]}
            />
        </div>
    );
}

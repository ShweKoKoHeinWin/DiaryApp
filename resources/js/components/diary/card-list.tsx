import { CollectionProp, DiaryListingItemProp, SortOrderProp, SortTypeProp } from '@/types/types';
import { format, parse } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CardItem } from './card';
import { router } from '@inertiajs/react';

// Mock data function to simulate API calls


export default function CardListingPage({
    groupBy = 'date',
    groupOrder = 'desc',
    diaries,
    collections,
}: {
    groupBy: SortTypeProp;
    groupOrder: SortOrderProp;
    diaries: DiaryListingItemProp[] 
    collections: CollectionProp[];
}) {    
    const [cards, setCards] = useState<DiaryListingItemProp[]>(diaries);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);
    const limit = 8; // Number of cards to load per page

    useEffect(() => {
        setCards(diaries);
    }, [diaries]);



    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    // loadMoreCards();
                    setLoading(true);
                    // router.get(route('diaries.index'),{
                    //     data: {
                    //         page: 2,
                    //     },
                        
                    // }, {
                    //     onSuccess: () => setCards(prev => [...prev, ...diaries.data]),
                    //     preserveScroll: true,
                    //     preserveState: true
                    // });

                    router.reload({
                        data: {
                            page: 2,
                        }
                    })
                    setLoading(false);
                    console.log(cards);
                    
                }
            },
            { threshold: 1.0 },
        );

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => {
            if (loaderRef.current) {
                observer.unobserve(loaderRef.current);
            }
        };
    }, [hasMore, loading]);

    const groupedCards = useMemo(() => {
        const map: Record<string, DiaryListingItemProp[]> = {};
        switch (groupBy) {
            case 'title':
                for (const card of cards) {
                    const key = card.title.charAt(0).toUpperCase();
                    if (!map[key]) map[key] = [];
                    map[key].push(card);
                }
                break;

            case 'category':
                for (const card of cards) {
                    if (card.categories.length > 0) {
                        for (const category of card.categories) {
                            if (!map[category.name]) map[category.name] = [];
                            if (!map[category.name].some((c) => c.id === card.id)) {
                                map[category.name].push(card);
                            }
                        }
                    } else {
                        if (!map['Uncategorized']) map['Uncategorized'] = [];
                        if (!map['Uncategorized'].some((c) => c.id === card.id)) {
                            map['Uncategorized'].push(card);
                        }
                    }
                }
                break;

            case 'date':
                for (const card of cards) {
                    const key = format(card.created_at, 'd - M - yyyy (EEEE)');
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
        const sortedMap: Record<string, DiaryListingItemProp[]> = {};
        for (const [key, value] of sortedEntries) {
            sortedMap[key] = value;
        }
        return sortedMap;
    }, [cards, groupBy, groupOrder]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* <h1 className="mb-8 text-3xl font-bold">Diaries ({diaries.meta.total})</h1> */}

            {Object.entries(groupedCards).map(([group, items]) => (
                <div key={group} className="mb-4">
                    <h2 className="mb-2 rounded-2xl border-2 bg-gray-900/80 p-2 text-xl font-semibold text-gray-300">{group}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((card: DiaryListingItemProp) => (
                            <div key={group + card.id} className="col-span-1">
                                <CardItem card={card} collections={collections} />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
            
            <div ref={loaderRef} className="mt-4 flex items-center justify-center py-8">
                {loading && <Loader2 className="h-8 w-8 animate-spin text-gray-500" />}
                {!hasMore && cards.length > 0 && <p className="text-gray-500">No more cards to load</p>}
            </div>
        </div>
    );
}

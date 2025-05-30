import { DiaryCardData } from '@/types/types';
import { format, parse } from 'date-fns';
import { Loader2 } from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { CardItem } from './card';

// Mock data function to simulate API calls
const fetchCards = (page: number, limit: number) => {
    return new Promise<Array<DiaryCardData>>((resolve) => {
        setTimeout(() => {
            const newCards = Array.from({ length: limit }, (_, i) => ({
                id: page * limit + i,
                title: `Card ${page * limit + i + 1} with a potentially long title that might need truncation`,
                content: `This is the content for card ${page * limit + i + 1}. It contains detailed information that should be truncated after a certain number of words to maintain the card's fixed size.`,
                categories: ['Technology', 'Programming', 'React', 'Next.js', 'UI/UX', 'Design'].slice(0, ((page * limit + i) % 6) + 1), // Vary the number of categories
                emotion: ['happy', 'sad', 'neutral', 'excited'][Math.floor(Math.random() * 4)],
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
                shareCount: Math.floor(Math.random() * 100),
                fileCount: Math.floor(Math.random() * 10),
            }));
            resolve(newCards);
        }, 800); // Simulate network delay
    });
};

export default function CardListingPage({ groupBy = 'date', groupOrder = 'desc' , diaries, collections}) {
    const [cards, setCards] = useState<DiaryCardData[]>(diaries.data);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);
    const limit = 8; // Number of cards to load per page

    useEffect(() => {
        setCards(diaries.data);
    }, [diaries.data])

    const loadMoreCards = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const newCards = await fetchCards(page, limit);

            // Simulate end of data after 5 pages
            if (page >= 4 || newCards.length === 0) {
                setHasMore(false);
            } else {
                setCards((prevCards) => [...prevCards, ...newCards]);
                setPage((prevPage) => prevPage + 1);
            }
        } catch (error) {
            console.error('Error loading cards:', error);
        } finally {
            setLoading(false);
        }
    }, [page, loading, hasMore]);

    useEffect(() => {
        // Load initial cards
        // loadMoreCards();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    // loadMoreCards();
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
    }, [loadMoreCards, hasMore, loading]);

    const groupedCards = useMemo(() => {
        const map: Record<string, DiaryCardData[]> = {};
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
                    for (const category of card.categories) {
                        if (!map[category.name]) map[category.name] = [];
                        map[category.name].push(card);
                    }
                }
                break;

            case 'date':
                for (const card of cards) {
                    const key = format(card.createdAt, 'd - M - yyyy (EEEE)');
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
        const sortedMap: Record<string, DiaryCardData[]> = {};
        for (const [key, value] of sortedEntries) {
            sortedMap[key] = value;
        }
        return sortedMap;
    }, [cards, groupBy, groupOrder]);

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Diaries ({diaries.meta.total})</h1>

            {/* {groupedCards.map((card) => (
                    <CardItem key={card.id} card={card} />
                    ))} */}
            {Object.entries(groupedCards).map(([group, items]) => (
                <div key={group} className="mb-4">
                    <h2 className="mb-2 rounded-2xl border-2 bg-gray-900/80 p-2 text-xl font-semibold text-gray-300">{group}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((card) => (
                            <div key={card.id} className="col-span-1">
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

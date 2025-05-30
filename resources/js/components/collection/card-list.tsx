import { DiaryCardData } from '@/types/types';
import { useRef, useState } from 'react';
import { CardItem } from './card';

// Mock data function to simulate API calls

export default function CardListingPage({ groupBy = 'date', groupOrder = 'desc', collections }) {
    const [cards, setCards] = useState<DiaryCardData[]>(collections.data);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const loaderRef = useRef<HTMLDivElement>(null);
    const limit = 8; // Number of cards to load per page

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="mb-8 text-3xl font-bold">Collections ({collections.meta.total})</h1>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {collections.data.map((card) => (
                    <div key={card.id} className="col-span-1">
                        <CardItem card={card} />
                    </div>
                ))}
            </div>
        </div>
    );
}

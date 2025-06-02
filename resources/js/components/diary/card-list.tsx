import { CollectionProp, CollectionShortProp, DiaryListingItemProp, SortOrderProp, SortTypeProp } from '@/types/types';
import { Link, router, usePage } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { FolderMinus, FolderPlus, Share2, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import TitleCreateModal from '../collection/title-create-modal';
import MultiShareModal from '../share/multi-share-modal';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import { CardItem } from './card';
import { CollectionDiaryCardItem } from './collection-diary-card';
import { DiaryShareCardItem } from './diary-share-card';

// Mock data function to simulate API calls

export default function CardListingPage({
    groupBy = 'date',
    groupOrder = 'desc',
    diaries,
    collection,
    collections,
    filterProp,
    sortProp,
    baseUrl,
    cardType = 'diaryCard',
}: {
    groupBy: SortTypeProp;
    groupOrder: SortOrderProp;
    diaries: { meta: any; links: any; data: DiaryListingItemProp[] };
    collection: CollectionProp;
    collections: CollectionShortProp[];
    baseUrl: string;
    cardType?: 'collectionDiaryCard' | 'diaryCard' | 'sharedDiaryCard';
}) {
    const [cards, setCards] = useState<DiaryListingItemProp[]>(diaries.data);
    const [isCardSelecting, setIsCardSelecting] = useState<boolean>(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [showShareBox, setShowShareBox] = useState<boolean>(false);
    const [showCollectionAddBox, setShowCollectionAddBox] = useState<boolean>(false);
    const [selectedCollelctions, setSelectedCollections] = useState<number[]>([]);
    const { errors } = usePage().props;

    const allCollectionIds = collections.map((c: CollectionShortProp) => c.id).sort();
    // const [loading, setLoading] = useState(false);
    // const loaderRef = useRef<HTMLDivElement>(null);
    // const [nextPage, setNextPage] = useState(diaries.links.next);
    // const [data, setData] = useState(diaries);
    // const [hasMore, setHasMore] = useState(data.meta.current_page !== data.meta.last_page);
    useEffect(() => {
        setCards(diaries.data);
    }, [diaries.data]);
    console.log(collections);

    // useEffect(() => {
    //     const observer = new IntersectionObserver(
    //         (entries) => {
    //             if (entries[0].isIntersecting && !loading) {
    //                 setLoading(true);
    //                 const url = new URL(nextPage, baseUrl);
    //                 url.searchParams.append('query', filterProp.query ?? '');
    //                 url.searchParams.append('startDate', filterProp.startDate ?? '');
    //                 url.searchParams.append('endDate', filterProp.endDate ?? '');
    //                 url.searchParams.append('categories', filterProp.categories ?? '');
    //                 url.searchParams.append('emotion', filterProp.emotion ?? '');
    //                 url.searchParams.append('sortBy', sortProp.type ?? '');
    //                 url.searchParams.append('sortOrder', sortProp.order ?? '');
    //                 console.log(url, data);

    //                 if (data.meta.current_page !== data.meta.last_page) {
    //                     fetch(url, {
    //                         headers: {
    //                             'X-Requested-With': 'XMLHttpRequest',
    //                             Accept: 'application/json',
    //                         },
    //                     })
    //                         .then((res) => res.json())
    //                         .then((data) => {
    //                             setCards([...cards, ...data.data]);
    //                             setNextPage(data.links.next);
    //                             setData(data);
    //                             setHasMore(true);
    //                         })
    //                         .catch((e) => console.error(e))
    //                         .finally(() => setLoading(false));

    //                 } else {
    //                     setHasMore(false)
    //                     setLoading(false);
    //                 }
    //             }

    //         },
    //         { threshold: 1.0 },
    //     );

    //     if (loaderRef.current) {
    //         observer.observe(loaderRef.current);
    //     }

    //     return () => {
    //         if (loaderRef.current) {
    //             observer.unobserve(loaderRef.current);
    //         }
    //     };
    // }, [nextPage, hasMore, loading, baseUrl, filterProp, sortProp]);

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

      const handleCollectionBox = (isOpen: boolean) => {
        if (!isOpen) {
        router.put(
                route('collections.diaries.add'),
                {
                    collections: selectedCollelctions,
                    diaries: selectedCards,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
        setShowCollectionAddBox(isOpen);
    };

    const handleCollectionChange = (id: number, checked: boolean) => {
        setSelectedCollections((prev) => {
            if (checked) {
                return [...prev, id];
            }
            return prev.filter((colId) => colId !== id);
        });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between">
                <h1 className="mb-4 text-2xl font-bold">Diaries ({diaries.meta.total})</h1>
                {isCardSelecting && (
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex w-full cursor-pointer items-center gap-0"
                            onClick={() => setShowCollectionAddBox(true)}
                        >
                            <span className="mr-2">Add To Collections</span>
                            <FolderPlus className="h-3.5 w-3.5" />
                        </Button>
                        <Dialog open={showCollectionAddBox} onOpenChange={handleCollectionBox}>
                            <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                    <DialogTitle className="flex justify-between">
                                        <span>Collections</span>
                                        <label htmlFor="allcollections" className="mr-5 flex items-center justify-center gap-2">
                                            <Checkbox
                                                id="allcollections"
                                                checked={
                                                    selectedCollelctions.length === allCollectionIds.length &&
                                                    selectedCollelctions.sort().every((val, index) => val === allCollectionIds[index])
                                                }
                                                onCheckedChange={(checked) => {
                                                    if (checked === true) {
                                                        setSelectedCollections(allCollectionIds);
                                                    } else {
                                                        setSelectedCollections([]);
                                                    }
                                                }}
                                            />
                                            <span>Select All</span>
                                        </label>
                                    </DialogTitle>
                                </DialogHeader>
                                <DialogDescription aria-describedby="dialog-description"></DialogDescription>
                                <ul className="h-50 max-w-md list-inside list-none space-y-1 overflow-y-scroll rounded-2xl border-2 bg-gray-900/5 p-4">
                                    {collections.map((collection) => (
                                        <li key={collection.id}>
                                            <div className="inline-block w-[90%]">
                                                <Label
                                                    className="flex items-center justify-between gap-2 rounded-xl bg-amber-300 p-3"
                                                    htmlFor={`collection-${collection.id}`}
                                                >
                                                    {collection.title}
                                                    <Checkbox
                                                        id={`collection-${collection.id}`}
                                                        checked={selectedCollelctions.includes(collection.id)}
                                                        onCheckedChange={(checked) => handleCollectionChange(collection.id, checked === true)}
                                                    />
                                                </Label>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                                <TitleCreateModal />
                            </DialogContent>
                        </Dialog>
                        {collection && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="cursor-pointer bg-red-600 p-1 text-gray-300 hover:bg-red-500 hover:text-gray-200"
                                onClick={(e) =>
                                    router.put(route('collections.diaries.remove', collection.id), {
                                        diaries: selectedCards,
                                    })
                                }
                                title="Remove From Collection"
                            >
                                <FolderMinus size={20} />
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer bg-blue-600 p-1 text-gray-300 hover:bg-blue-500 hover:text-gray-200"
                            onClick={(e) => setShowShareBox(true)}
                            title="Share"
                        >
                            <Share2 size={20} />
                        </Button>
                        <MultiShareModal
                            url={route('shares.multishare')}
                            showShareBox={showShareBox}
                            setShowShareBox={setShowShareBox}
                            selectedCards={selectedCards}
                            setIsCardSelecting={setIsCardSelecting}
                            setSelectedCards={setSelectedCards}
                            cardType="diary"
                        />
                        <label className="flex items-center gap-3">
                            <Checkbox
                                id={`AllCardsSelect`}
                                checked={
                                    selectedCards.length > 0
                                        ? selectedCards.length === [...new Set(cards.map((c) => c.id).sort())].length &&
                                          selectedCards.sort().every((id, idx) => id === [...new Set(cards.map((c) => c.id).sort())].sort()[idx])
                                        : false
                                }
                                onCheckedChange={(checked) => {
                                    if (checked === true) {
                                        setSelectedCards([...new Set(cards.map((c) => c.id).sort())]);
                                    } else {
                                        setSelectedCards([]);
                                    }
                                }}
                            />
                            Select All
                        </label>
                        <X
                            onClick={(e) => {
                                setSelectedCards([]);
                                setIsCardSelecting(false);
                            }}
                        />
                    </div>
                )}
            </div>

            <div>
                {errors && Object.keys(errors).length > 0 && (
                    <ul className="p=3 mt-2 text-sm text-red-600">
                        {Object.entries(errors).map(([field, message]) => (
                            <li key={field}>
                                <strong>{field}</strong>: {message}
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {cardType === 'collectionDiaryCard' &&
                Object.entries(groupedCards).map(([group, items]) => (
                    <div key={group} className="mb-4">
                        <h2 className="mb-2 rounded-2xl border-2 bg-gray-900/80 p-2 text-xl font-semibold text-gray-300">{group}</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((card: DiaryListingItemProp) => (
                                <div key={group + card.id} className="col-span-1">
                                    <CollectionDiaryCardItem
                                        card={card}
                                        collection={collection}
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
            {cardType === 'diaryCard' &&
                Object.entries(groupedCards).map(([group, items]) => (
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

            {cardType === 'sharedDiaryCard' &&
                Object.entries(groupedCards).map(([group, items]) => (
                    <div key={group} className="mb-4">
                        <h2 className="mb-2 rounded-2xl border-2 bg-gray-900/80 p-2 text-xl font-semibold text-gray-300">{group}</h2>
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {items.map((card: DiaryListingItemProp) => (
                                <div key={group + card.id} className="col-span-1">
                                    <DiaryShareCardItem card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            {/* <div ref={loaderRef} className="mt-4 flex items-center justify-center py-8">
                {loading && <Loader2 className="h-8 w-8 animate-spin text-gray-500" />}
                {!hasMore && <p className="text-gray-500">No more cards to load</p>}
            </div> */}

            <div className="mt-6 flex justify-center gap-2">
                {/* {diaries.meta.links.map((link, index) =>
                    link.url ? (
                        <Link
                            key={index}
                            href={link.url}
                            className={`rounded border px-3 py-1 ${link.active ? 'bg-blue-500 text-white' : 'bg-white text-blue-500'}`}
                        >
                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </Link>
                    ) : (
                        <span key={index} className="px-3 py-1 text-gray-400">
                            {link.label.replace('&laquo;', '«').replace('&raquo;', '»')}
                        </span>
                    ),
                )} */}

                {diaries.meta.total > 0 &&
                    diaries.meta.links.map((link, index) => {
                        // Build new URL with all filters
                        const buildUrlWithParams = (rawUrl: string | null) => {
                            if (!rawUrl) return '#';
                            const url = new URL(rawUrl, window.location.origin);

                            url.searchParams.set('query', filterProp.query ?? '');
                            url.searchParams.set('startDate', filterProp.startDate ?? '');
                            url.searchParams.set('endDate', filterProp.endDate ?? '');
                            (filterProp.categories ?? []).forEach((cat) => {
                                url.searchParams.append('categories[]', cat);
                            });
                            url.searchParams.set('emotion', filterProp.emotion ?? '');
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
            </div>
        </div>
    );
}

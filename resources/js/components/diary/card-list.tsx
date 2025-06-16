import { dateFormat } from '@/lib/utils';
import { CollectionProp, CollectionShortProp, DiaryListingItemProp, FilterProp, SortOrderProp, SortProp, SortTypeProp } from '@/types/types';
import { router, usePage } from '@inertiajs/react';
import { parse } from 'date-fns';
import { FolderMinus, FolderPlus } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import TitleCreateModal from '../collection/title-create-modal';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Label } from '../ui/label';
import CardSelectModeBox from '../ultils/card-select-mode-box';
import Pagination from '../ultils/pagination';
import { CardItem } from './card';
import { DIARY, SELECTMODE } from '@/lib/permissions';
// Mock data function to simulate API calls

export default function CardListingPage({
    groupBy = 'date',
    groupOrder = 'desc',
    diaries,
    collection,
    collections,
    filterProp,
    sortProp,
    from = '',
    data ={},
    permissions = []
}: {
    groupBy: SortTypeProp;
    groupOrder: SortOrderProp;
    diaries: { meta: any; data: DiaryListingItemProp[] };
    collection?: CollectionProp;
    collections: CollectionShortProp[];
    from?: string;
    data? : any;
    permissions?: string[];
    filterProp: FilterProp;
    sortProp: SortProp;
}) {
    const [cards, setCards] = useState<DiaryListingItemProp[]>(diaries.data);
    const [isCardSelecting, setIsCardSelecting] = useState<boolean>(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const [showCollectionAddBox, setShowCollectionAddBox] = useState<boolean>(false);
    const [selectedCollections, setSelectedCollections] = useState<number[]>([]);
    const { errors } = usePage().props;

    const allCollectionIds = collections.map((c: CollectionShortProp) => c.id).sort();
    useEffect(() => {
        setCards(diaries.data);
    }, [diaries.data]);
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
        const sortedMap: Record<string, DiaryListingItemProp[]> = {};
        for (const [key, value] of sortedEntries) {
            sortedMap[key] = value;
        }
        return sortedMap;
    }, [cards, groupBy, groupOrder]);

    const cancelSelectMode = () => {
        setSelectedCards([]);
        setIsCardSelecting(false);
    };
    const handleCollectionChange = (id: number, checked: boolean) => {
        setSelectedCollections((prev) => {
            if (checked) {
                return [...prev, id];
            }
            return prev.filter((colId) => colId !== id);
        });
    };
    const handleCollectionBox = (isOpen: boolean) => {
        if (!isOpen) {
            router.put(
                route('collections.diaries.add'),
                {
                    collections: selectedCollections,
                    diaries: selectedCards,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        setSelectedCollections([]);
                        cancelSelectMode();
                        router.reload();
                    },
                },
            );
        }
        setShowCollectionAddBox(isOpen);
    };
    const AddToCollectionAction = (
        <>
            <Button
                variant="ghost"
                size="icon"
                className="cursor-pointer bg-green-500 px-4 py-2 text-gray-200 hover:bg-green-400 hover:text-gray-100"
                onClick={() => setShowCollectionAddBox(true)}
                title="Add To Collections"
            >
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
                                        selectedCollections.length === allCollectionIds.length &&
                                        selectedCollections.sort().every((val, index) => val === allCollectionIds[index])
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
                                            checked={selectedCollections.includes(collection.id)}
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
        </>
    );

    return (
        <div className="container mx-auto bg-cover bg-center px-4 py-4">
            <div className="flex flex-wrap items-center justify-between">
                <h1 className="mb-4 text-2xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">Diaries ({diaries.meta.total})</h1>
                <CardSelectModeBox
                    actions={permissions.includes(SELECTMODE.share) ? ['multi-share'] : []}
                    customActions={
                        <>
                            {permissions.includes(SELECTMODE.collection) && AddToCollectionAction}
                            {(permissions.includes(SELECTMODE.collection) && collection) && (
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="cursor-pointer bg-red-600 px-4 py-2 text-gray-300 hover:bg-red-500 hover:text-gray-200"
                                    onClick={(e) => {
                                        if (confirm('Are you sure to remove selected diaries from the collection?')) {
                                            router.put(
                                                route('collections.diaries.remove', collection.id),
                                                {
                                                    diaries: selectedCards,
                                                },
                                                {
                                                    preserveScroll: true,
                                                    preserveState: true,
                                                    onSuccess: () => cancelSelectMode(),
                                                },
                                            );
                                        }
                                    }}
                                    title="Remove From Collection"
                                >
                                    <FolderMinus size={20} />
                                </Button>
                            )}
                        </>
                    }
                    cards={cards}
                    cardType="diary"
                    isCardSelecting={isCardSelecting}
                    setIsCardSelecting={setIsCardSelecting}
                    selectedCards={selectedCards}
                    setSelectedCards={setSelectedCards}
                />
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
            {Object.entries(groupedCards).map(([group, items]) => (
                <div key={group} className="mb-4">
                    <h2 className="mb-2 rounded-2xl border-2 bg-gray-900/80 p-2 text-xl font-semibold text-gray-300">{group}</h2>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {items.map((card: DiaryListingItemProp) => (
                            <div key={group + card.id} className="col-span-1">
                                <CardItem
                                    card={card}
                                    collection={collection}
                                    collections={collections}
                                    isCardSelecting={isCardSelecting}
                                    setIsCardSelecting={setIsCardSelecting}
                                    selectedCards={selectedCards}
                                    setSelectedCards={setSelectedCards}
                                    cancelSelectMode={cancelSelectMode}
                                    from={from}
                                    data={data}
                                    permissions={permissions}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            ))}

            <Pagination
                data={diaries}
                urlParamConfig={[
                    {
                        query: filterProp?.query,
                        startDate: filterProp?.startDate,
                        endDate: filterProp?.endDate,
                        emotion: filterProp?.emotion,
                        categories: filterProp?.categories,
                        sortBy: sortProp?.type,
                        sortOrder: sortProp?.order,
                    },
                ]}
            />
        </div>
    );
}

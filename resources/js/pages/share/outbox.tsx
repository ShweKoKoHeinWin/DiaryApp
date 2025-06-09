// import { CardItem as CollectionCard } from '@/components/collection/card';
// import { CardItem as DiaryCard } from '@/components/diary/card';
import { CollectionCard } from '@/components/share/collection-card';
import { DiaryCard } from '@/components/share/diary-card';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import CardSelectModeBox from '@/components/ultils/card-select-mode-box';
import Pagination from '@/components/ultils/pagination';
import AppLayout from '@/layouts/app-layout';
import { dateFormat } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { DiaryListingItemProp } from '@/types/types';

import { Head, usePage } from '@inertiajs/react';
import { parse } from 'date-fns';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inbox & Shares',
        href: route('inbox-shares'),
    },
];

const OutBox = ({ filterSort, items, collections }: { filterSort: any }) => {
    console.log(items);

    const [cards, setCards] = useState<DiaryListingItemProp[]>(items.data);
    const [isCardSelecting, setIsCardSelecting] = useState<boolean>(false);
    const [selectedCards, setSelectedCards] = useState<number[]>([]);
    const { errors } = usePage().props;

    const [filterProp, setFilterProp] = useState(filterSort.filters);
    const [sortProp, setSortProp] = useState(filterSort.sorting);

    useEffect(() => {
        setCards(items.data)
    }, [items])

    const groupedCards = useMemo(() => {
        const map: Record<string, DiaryListingItemProp[]> = {};
        switch (sortProp.type) {
            case 'title':
                for (const card of cards) {
                    const key = card.item.title.charAt(0).toUpperCase();
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
            if (sortProp.type === 'date') {
                // Parse dates back from string
                const dateA = parse(keyA, 'd - M - yyyy (EEEE)', new Date());
                const dateB = parse(keyB, 'd - M - yyyy (EEEE)', new Date());
                return sortProp.order === 'asc' ? dateA.getTime() - dateB.getTime() : dateB.getTime() - dateA.getTime();
            } else {
                // Alphabetical
                return sortProp.order === 'asc' ? keyA.localeCompare(keyB) : keyB.localeCompare(keyA);
            }
        });
        const sortedMap: Record<string, DiaryListingItemProp[]> = {};
        for (const [key, value] of sortedEntries) {
            sortedMap[key] = value;
        }
        return sortedMap;
    }, [cards, sortProp]);

    const cancelSelectMode = () => {
        setSelectedCards([]);
        setIsCardSelecting(false);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox Items" />

            <CardSelectModeBox
                cardType="collection"
                actions={['multi-share']}
                cards={cards}
                isCardSelecting={isCardSelecting}
                setIsCardSelecting={setIsCardSelecting}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
            />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto bg-cover bg-center px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between">
                        <h1 className="mb-4 text-2xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                            Inbox ({`${items.meta.total} ${items.meta.total > 1 ? 'Items' : 'Item'}`})
                        </h1>
                    </div>
                    <div className="mb-4 w-full">
                        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4">
                            {/* Search Input */}
                            <div className="relative flex-1">
                                <Search className="text-muted-foreground absolute top-2.5 left-2.5 h-4 w-4" />
                                <Input
                                    type="search"
                                    placeholder="Search..."
                                    className="pl-8"
                                    value={filterProp.query}
                                    onChange={(e) => setFilterProp({ ...filterProp, query: e.target.value })}
                                />
                            </div>

                            {/* Filters - Desktop */}
                            <div className="">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-1">
                                            <span>Filter & Sort</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
                                        <DropdownMenuLabel>Filter</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem>
                                                <Select value={undefined} onValueChange={(value) => {}}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select a sharer" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Default">Any</SelectItem>
                                                        <SelectItem value={` `}>
                                                            <div className="flex items-center gap-2">User 1</div>
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </DropdownMenuItem>
                                            <DropdownMenuItem>
                                                <Select value={undefined} onValueChange={(value) => {}}>
                                                    <SelectTrigger>
                                                        <SelectValue placeholder="Select Type" />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="Default">Any</SelectItem>
                                                        <SelectItem value="diary">Diary</SelectItem>
                                                        <SelectItem value="collection">Collection</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem
                                                onClick={() => setSortProp({ type: 'title', order: 'asc' })}
                                                className="justify-between"
                                            >
                                                Title (A-Z)
                                                {sortProp.type === 'title' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setSortProp({ type: 'title', order: 'desc' })}
                                                className="justify-between"
                                            >
                                                Title (Z-A)
                                                {sortProp.type === 'title' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onClick={() => setSortProp({ type: 'date', order: 'desc' })}
                                                className="justify-between"
                                            >
                                                Date (Newest)
                                                {sortProp.type === 'date' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem onClick={() => setSortProp({ type: 'date', order: 'asc' })} className="justify-between">
                                                Date (Oldest)
                                                {sortProp.type === 'date' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
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
                                {items.map((card) => (
                                    <div key={group + card.id} className="col-span-1">
                                        {card.type === 'collection' && <CollectionCard card={card} type='receiver' />}
                                        {card.type === 'diary' && <DiaryCard card={card} type='receiver' />}
                                        {/* {card.type === 'collection' && (
                                            <CollectionCard
                                                card={card.item}
                                                isCardSelecting={isCardSelecting}
                                                setIsCardSelecting={setIsCardSelecting}
                                                selectedCards={selectedCards}
                                                setSelectedCards={setSelectedCards}
                                            />
                                        )}
                                        {card.type === 'diary' && (
                                            <DiaryCard
                                                card={card.item}
                                                collections={collections}
                                                isCardSelecting={isCardSelecting}
                                                setIsCardSelecting={setIsCardSelecting}
                                                selectedCards={selectedCards}
                                                setSelectedCards={setSelectedCards}
                                                cancelSelectMode={cancelSelectMode}
                                            />
                                        )} */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Pagination
                        data={items}
                        urlParamConfig={[
                            {
                                query: filterProp.query,
                                startDate: filterProp.startDate,
                                endDate: filterProp.endDate,
                                type: filterProp.type,
                                sharer: filterProp.sharer,
                                sortBy: sortProp.type,
                                sortOrder: sortProp.order,
                            },
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default OutBox;

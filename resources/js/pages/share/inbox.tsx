import { CollectionCard } from '@/components/share/collection-card';
import { DiaryCard } from '@/components/share/diary-card';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import ActiveFilters from '@/components/ultils/active-filters';
import Pagination from '@/components/ultils/pagination';
import AppLayout from '@/layouts/app-layout';
import { dateFormat } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { DiaryListingItemProp } from '@/types/types';

import { Head, router, usePage } from '@inertiajs/react';
import { format, parse } from 'date-fns';
import { Check, ChevronDown, Filter, RotateCcw, Search } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inbox & Shares',
        href: route('inbox-shares'),
    },
    {
        title: 'Inbox',
        href: route('inbox-shares.inbox'),
    },
];

const Inbox = ({ filterSort, items, sharers }: { filterSort: any }) => {
    console.log(filterSort);

    const [cards, setCards] = useState(items.data);
    const { errors } = usePage().props;

    const [filterProp, setFilterProp] = useState(filterSort.filters);
    const [sortProp, setSortProp] = useState(filterSort.sorting);
    const hasMounted = useRef(false);

    useEffect(() => {
        setCards(items.data);
    }, [items]);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        router.visit(route('inbox-shares.inbox'), {
            method: 'get',
            data: {
                query: filterProp.query,
                startDate: filterProp.startDate,
                endDate: filterProp.endDate,
                sharer: filterProp.sharer,
                type: filterProp.type,
                sortBy: sortProp.type,
                sortOrder: sortProp.order,
            },
            preserveState: true,
        });
    }, [filterProp, sortProp]);

    const groupedCards = useMemo(() => {
        const map: Record<string, any[]> = {};
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

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Inbox Items" />

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
                                    value={filterProp.query ?? ''}
                                    onChange={(e) => setFilterProp({ ...filterProp, query: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-3">
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant="outline" className="gap-1">
                                            <Filter className="h-4 w-4" />
                                            Filters
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px] md:max-w-[660px]">
                                        <DialogHeader>
                                            <DialogTitle className="flex justify-between"></DialogTitle>
                                        </DialogHeader>
                                        <DialogDescription aria-describedby="dialog-description"></DialogDescription>
                                        <div className="grid gap-6">
                                            {/* User , Type */}
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label htmlFor="start-date">User</Label>
                                                        <div className="justfy-between flex items-center gap-3">
                                                            <Select
                                                                value={filterProp.sharer ? `${filterProp.sharer}` : ''}
                                                                onValueChange={(value) => {
                                                                    setFilterProp({ ...filterProp, sharer: value });
                                                                }}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select a sharer" />
                                                                </SelectTrigger>
                                                                <SelectContent className="max-h-[40vh]">
                                                                    {sharers.length > 0 &&
                                                                        sharers.map((s) => (
                                                                            <SelectItem value={`${s.id}`} key={`sharer-${s.id}`}>
                                                                                <div className="flex items-center gap-2">{s.name}</div>
                                                                            </SelectItem>
                                                                        ))}
                                                                </SelectContent>
                                                            </Select>
                                                            <RotateCcw
                                                                className="cursor-pointer"
                                                                size={15}
                                                                onClick={() => setFilterProp({ ...filterProp, sharer: null })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="end-date">Type</Label>
                                                        <div className="justfy-between flex items-center gap-3">
                                                            <Select
                                                                value={filterProp.type ? filterProp.type : ''}
                                                                onValueChange={(value) => setFilterProp({ ...filterProp, type: value })}
                                                            >
                                                                <SelectTrigger>
                                                                    <SelectValue placeholder="Select Type" />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="diary">Diary</SelectItem>
                                                                    <SelectItem value="collection">Collection</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <RotateCcw
                                                                className="cursor-pointer"
                                                                size={15}
                                                                onClick={() => setFilterProp({ ...filterProp, type: null })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Date Range */}
                                            <div className="space-y-2">
                                                <div className="grid grid-cols-2 gap-2">
                                                    <div className="space-y-1">
                                                        <Label htmlFor="start-date">Start Date</Label>
                                                        <div className="justfy-between flex items-center gap-3">
                                                            <Input
                                                                id="start-date"
                                                                type="date"
                                                                value={filterProp.startDate ? format(filterProp.startDate, 'yyyy-MM-dd') : ''}
                                                                onChange={(e) =>
                                                                    setFilterProp({
                                                                        ...filterProp,
                                                                        startDate: e.target.value ? new Date(e.target.value) : undefined,
                                                                    })
                                                                }
                                                                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:[color-scheme:dark] dark:invert"
                                                            />
                                                            <RotateCcw
                                                                className="cursor-pointer"
                                                                size={15}
                                                                onClick={() => setFilterProp({ ...filterProp, startDate: null })}
                                                            />
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label htmlFor="end-date">End Date</Label>
                                                        <div className="justfy-between flex items-center gap-3">
                                                            <Input
                                                                id="end-date"
                                                                type="date"
                                                                value={filterProp.endDate ? format(filterProp.endDate, 'yyyy-MM-dd') : ''}
                                                                onChange={(e) =>
                                                                    setFilterProp({
                                                                        ...filterProp,
                                                                        endDate: e.target.value ? new Date(e.target.value) : undefined,
                                                                    })
                                                                }
                                                                className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:[color-scheme:dark] dark:invert"
                                                            />
                                                            <RotateCcw
                                                                className="cursor-pointer"
                                                                size={15}
                                                                onClick={() => setFilterProp({ ...filterProp, endDate: null })}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                                <RotateCcw className="cursor-pointer" size={15} onClick={() => setFilterProp({})} />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" className="gap-1">
                                            <span>Sort By</span>
                                            <ChevronDown className="h-4 w-4" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[200px]">
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
                        <ActiveFilters filterProp={filterProp} setFilterProp={setFilterProp} users={sharers} />
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
                                        {card.type === 'collection' && <CollectionCard card={card} type="receive" />}
                                        {card.type === 'diary' && <DiaryCard card={card} type="receive" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}

                    <Pagination
                        data={items}
                        urlParamConfig={[
                            {
                                query: filterProp?.query,
                                startDate: filterProp?.startDate,
                                endDate: filterProp?.endDate,
                                type: filterProp?.type,
                                sharer: filterProp?.sharer,
                                sortBy: sortProp?.type,
                                sortOrder: sortProp?.order,
                            },
                        ]}
                    />
                </div>
            </div>
        </AppLayout>
    );
};

export default Inbox;

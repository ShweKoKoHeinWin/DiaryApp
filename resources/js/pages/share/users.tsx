import { UserCard } from '@/components/share/user-card';
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
import ActiveFilters from '@/components/ultils/active-filters';
import Pagination from '@/components/ultils/pagination';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DATAMETA, FILTERSORTPROP, UserCardProp } from '@/types/types';

import { Head, router, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Check, ChevronDown, Filter, RotateCcw, Search } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Inbox & Shares',
        href: route('inbox-shares'),
    },
    {
        title: 'Users',
        href: route('inbox-shares.users'),
    },
];

interface UsersPageType {
    filterSort: FILTERSORTPROP;
    users: { data: UserCardProp[]; meta: DATAMETA };
}

const Inbox = ({ filterSort, users }: UsersPageType) => {
    const [cards, setCards] = useState(users.data ? (Array.isArray(users.data ?? []) ? users.data : Object.values(users.data)) : []);
    const { errors } = usePage().props;

    const [filterProp, setFilterProp] = useState(filterSort.filters ?? {});
    const [sortProp, setSortProp] = useState(filterSort.sorting ?? {});
    const hasMounted = useRef(false);

    useEffect(() => {
        setCards(users.data ? (Array.isArray(users.data ?? []) ? users.data : Object.values(users.data)) : []);
    }, [users.data]);

    useEffect(() => {
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }

        router.visit(route('inbox-shares.users'), {
            method: 'get',
            data: {
                query: filterProp?.query,
                startDate: filterProp?.startDate,
                endDate: filterProp?.endDate,
                sortBy: sortProp.type,
                sortOrder: sortProp.order,
            },
            preserveState: true,
        });
    }, [filterProp, sortProp]);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Users" />

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="container mx-auto bg-cover bg-center px-4 py-4">
                    <div className="flex flex-wrap items-center justify-between">
                        <h1 className="mb-4 text-2xl font-bold drop-shadow-[0_1.2px_1.2px_rgba(0,0,0,0.8)]">
                            Users ({`${users.meta.total} ${users.meta.total > 1 ? 'Users' : 'User'}`})
                        </h1>
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
                                            <DropdownMenuItem onClick={() => setSortProp({ type: 'name', order: 'asc' })} className="justify-between">
                                                Name (A-Z)
                                                {sortProp.type === 'name' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                            </DropdownMenuItem>
                                            <DropdownMenuItem
                                                onClick={() => setSortProp({ type: 'name', order: 'desc' })}
                                                className="justify-between"
                                            >
                                                Name (Z-A)
                                                {sortProp.type === 'name' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
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
                        <ActiveFilters filterProp={filterProp} setFilterProp={setFilterProp} />
                    </div>

                    <div className="mb-4">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {cards.map((card) => (
                                <div key={card.email} className="col-span-1">
                                    <UserCard card={card} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {users.data.length === 0 && <h3 className="text-center">There is No Users you have communicated right now.</h3>}
                    <Pagination
                        data={users}
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
            </div>
        </AppLayout>
    );
};

export default Inbox;

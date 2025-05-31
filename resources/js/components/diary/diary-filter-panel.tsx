'use client';

import { format } from 'date-fns';
import { Check, ChevronDown, Filter, Plus, RotateCcw, Search, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
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
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CategoryProp, EmotionDetailProp, FilterProp, SortProp } from '@/types/types';
import { Link, router } from '@inertiajs/react';
import { RadioGroup, RadioGroupItem } from '../ui/radio';

// Sample data for categories and emotions
// const categories = [
//     { id: 1, label: 'Work' },
//     { id: 2, label: 'Personal' },
//     { id: 3, label: 'Education' },
//     { id: 4, label: 'Health' },
//     { id: 5, label: 'Finance' },
// ];

// const emotions = [
//     { id: 1, label: 'Happy' },
//     { id: 2, label: 'Sad' },
//     { id: 3, label: 'Excited' },
//     { id: 4, label: 'Anxious' },
//     { id: 5, label: 'Neutral' },
// ];

export function DiaryFilterPanel({
    filterProp,
    setFilterProp,
    sortProp,
    setSortProp,
    endPoint,
    categories,
    emotions,
    diaryCreateUrl = route('diaries.create'),
}: {
    filterProp: FilterProp;
    setFilterProp: React.Dispatch<React.SetStateAction<FilterProp>>;
    sortProp: SortProp;
    setSortProp: (sort: SortProp) => void;
    endPoint: string;
    categories: CategoryProp[],
    emotions: EmotionDetailProp[],
    diaryCreateUrl: string;
}) {
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    const hasMounted = useRef(false);
    useEffect(() => {
        let count = Object.values(filterProp).filter((val) => {
            if (Array.isArray(val)) {
                return val.length > 0;
            }
            return !!val;
        }).length;

        setActiveFiltersCount(count);
        if (!hasMounted.current) {
            hasMounted.current = true;
            return;
        }
        
        router.visit(endPoint, {
            method: 'get',
            data: {
                query: filterProp.query,
                startDate: filterProp.startDate,
                endDate: filterProp.endDate,
                categories: filterProp.categories,
                emotion: filterProp.emotion,
                sortBy: sortProp.type,
                sortOrder: sortProp.order,
            },
            preserveState: true
        });
    }, [filterProp, sortProp]);

    const resetFilters = () => setFilterProp({});

    //  Category handle functions - START
    const handleCategoryChange = (id: number, checked: boolean) => {
        setFilterProp((prev: FilterProp) => {
            let prevCat = prev.categories || [];
            return {
                ...prev,
                categories: checked ? [...prevCat, id] : prevCat.filter((catId: number) => catId !== id),
            };
        });
    };

    const handleSelectAllCategories = (selectAll: boolean) => {
        if (selectAll) {
            setFilterProp({ ...filterProp, categories: categories.map((cat) => cat.id) });
        } else {
            setFilterProp({ ...filterProp, categories: [] });
        }
    };
    // Category handle functions - END

    const FilterContent = () => (
        <div className="grid gap-6">
            {/* Date Range */}
            <div className="space-y-2">
                <h4 className="font-medium">Date Range</h4>
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                        <Label htmlFor="start-date">Start Date</Label>
                        <Input
                            id="start-date"
                            type="date"
                            value={filterProp.startDate ? format(filterProp.startDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => setFilterProp({ ...filterProp, startDate: e.target.value ? new Date(e.target.value) : undefined })}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:[color-scheme:dark] dark:invert"
                        />
                    </div>
                    <div className="space-y-1">
                        <Label htmlFor="end-date">End Date</Label>
                        <Input
                            id="end-date"
                            type="date"
                            value={filterProp.endDate ? format(filterProp.endDate, 'yyyy-MM-dd') : ''}
                            onChange={(e) => setFilterProp({ ...filterProp, endDate: e.target.value ? new Date(e.target.value) : undefined })}
                            className="w-full rounded border border-gray-300 bg-white px-3 py-2 text-black dark:border-gray-700 dark:bg-gray-900 dark:text-white dark:[color-scheme:dark] dark:invert"
                        />
                    </div>
                </div>
            </div>

            {/* Categories */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Categories</h4>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleSelectAllCategories(true)} className="h-7 text-xs">
                            Select All
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => handleSelectAllCategories(false)} className="h-7 text-xs">
                            Deselect All
                        </Button>
                    </div>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {categories.map((category: CategoryProp) => (
                        <div key={category.id} className="flex items-center space-x-2">
                            <Checkbox
                                id={`category-${category.id}`}
                                checked={filterProp.categories ? filterProp.categories.includes(category.id) : false}
                                onCheckedChange={(checked) => handleCategoryChange(category.id, checked === true)}
                            />
                            <Label htmlFor={`category-${category.id}`}>{category.name}</Label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Emotions */}
            <div className="space-y-2">
                <div className="flex items-center justify-between">
                    <h4 className="font-medium">Emotions</h4>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    <RadioGroup
                        defaultValue={`${filterProp.emotion}`}
                        value={`${filterProp.emotion}`}
                        onValueChange={(value) => {
                            setFilterProp({ ...filterProp, emotion: Number(value) });
                        }}
                    >
                        <div className="flex items-center space-x-2">
                            <RadioGroupItem value="0" id="r1" />
                            <Label htmlFor="r1">All</Label>
                        </div>
                        {emotions.map((emotion) => (
                            <div key={emotion.id} className="flex items-center space-x-2">
                                <RadioGroupItem value={`${emotion.id}`} id="r1" />
                                <Label htmlFor="r1">{emotion.name}</Label>
                            </div>
                        ))}
                    </RadioGroup>
                </div>
            </div>
        </div>
    );

    const ActiveFilters = () => {
        if (activeFiltersCount === 0) return null;

        return (
            <div className="mt-2 flex flex-wrap gap-2">
                {filterProp.startDate && (
                    <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                        <span>From: {format(filterProp.startDate, 'PP')}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                                let { startDate, ...rest } = filterProp;
                                setFilterProp(rest);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove start date filter</span>
                        </Button>
                    </div>
                )}
                {filterProp.endDate && (
                    <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                        <span>To: {format(filterProp.endDate, 'PP')}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                                let { endDate, ...rest } = filterProp;
                                setFilterProp(rest);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove end date filter</span>
                        </Button>
                    </div>
                )}
                {filterProp.categories && filterProp.categories.length > 0 && (
                    <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                        <span>Categories: {filterProp.categories.length}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                                let { categories, ...rest } = filterProp;
                                setFilterProp(rest);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove categories filter</span>
                        </Button>
                    </div>
                )}
                {filterProp.emotion && filterProp.emotion != 0 && (
                    <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                        <span>Emotion: </span>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="ml-1 h-4 w-4 p-0"
                            onClick={() => {
                                let { emotion, ...rest } = filterProp;
                                setFilterProp(rest);
                            }}
                        >
                            <X className="h-3 w-3" />
                            <span className="sr-only">Remove emotions filter</span>
                        </Button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="w-full space-y-2">
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
                <div className="hidden md:flex md:items-center md:gap-2">
                    <Popover>
                        <PopoverTrigger asChild>
                            <Button variant="outline" className="gap-1">
                                <Filter className="h-4 w-4" />
                                Filters
                                {activeFiltersCount > 0 ? (
                                    <span className="bg-primary text-primary-foreground ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                                        {activeFiltersCount}
                                    </span>
                                ) : (
                                    <span className="ml-1 h-5 w-5"></span>
                                )}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-[50vw] p-4" align="end">
                            <FilterContent />
                        </PopoverContent>
                    </Popover>

                    {/* Sort By Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-1">
                                <span>Sort By</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'title', order: 'asc' })} className="justify-between">
                                    Title (A-Z)
                                    {sortProp.type === 'title' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'title', order: 'desc' })} className="justify-between">
                                    Title (Z-A)
                                    {sortProp.type === 'title' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'date', order: 'desc' })} className="justify-between">
                                    Date (Newest)
                                    {sortProp.type === 'date' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'date', order: 'asc' })} className="justify-between">
                                    Date (Oldest)
                                    {sortProp.type === 'date' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'category', order: 'asc' })} className="justify-between">
                                    Category (A-Z)
                                    {sortProp.type === 'category' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'category', order: 'desc' })} className="justify-between">
                                    Category (Z-A)
                                    {sortProp.type === 'category' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Reset Button */}
                    {activeFiltersCount > 0 ? (
                        <Button variant="ghost" size="icon" onClick={resetFilters}>
                            <RotateCcw className="h-4 w-4" />
                            <span className="sr-only">Reset filters</span>
                        </Button>
                    ) : <Button variant='ghost'><div className='w-4 h-4'></div></Button>}
                </div>

                {/* Filters - Mobile */}
                <div className="flex items-center gap-2 md:hidden">
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="gap-1">
                                <Filter className="h-4 w-4" />
                                Filters
                                {activeFiltersCount > 0 && (
                                    <span className="bg-primary text-primary-foreground ml-1 flex h-5 w-5 items-center justify-center rounded-full text-xs">
                                        {activeFiltersCount}
                                    </span>
                                )}
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Filters</DialogTitle>
                                <DialogDescription>Apply filters to narrow down your results</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <FilterContent />
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Mobile Sort By */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="gap-1">
                                <span>Sort By</span>
                                <ChevronDown className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-[200px]">
                            <DropdownMenuLabel>Sort Options</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuGroup>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'title', order: 'asc' })} className="justify-between">
                                    Title (A-Z)
                                    {sortProp.type === 'title' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'title', order: 'desc' })} className="justify-between">
                                    Title (Z-A)
                                    {sortProp.type === 'title' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'date', order: 'desc' })} className="justify-between">
                                    Date (Newest)
                                    {sortProp.type === 'date' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'date', order: 'asc' })} className="justify-between">
                                    Date (Oldest)
                                    {sortProp.type === 'date' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'category', order: 'asc' })} className="justify-between">
                                    Category (A-Z)
                                    {sortProp.type === 'category' && sortProp.order === 'asc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => setSortProp({ type: 'category', order: 'desc' })} className="justify-between">
                                    Category (Z-A)
                                    {sortProp.type === 'category' && sortProp.order === 'desc' && <Check className="h-4 w-4" />}
                                </DropdownMenuItem>
                            </DropdownMenuGroup>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Reset Button */}
                    {activeFiltersCount > 0 ? (
                        <Button variant="ghost" size="icon" onClick={resetFilters}>
                            <RotateCcw className="h-4 w-4" />
                            <span className="sr-only">Reset filters</span>
                        </Button>
                    ) : (
                        <Button variant='ghost'><div className='w-4 h-4'></div></Button>
                    )}
                </div>

                <Link href={diaryCreateUrl}>
                    <Button variant="outline" className="gap-1 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-gray-100">
                        <Plus className="h-4 w-4" />
                        Create
                    </Button>
                </Link>
            </div>

            {/* Active Filters Display */}
            <ActiveFilters />
        </div>
    );
}

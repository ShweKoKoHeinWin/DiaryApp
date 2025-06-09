import { Button } from '@/components/ui/button';
import {  DiaryListingItemProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { ChevronRight, MoreVertical, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import { dateTimeFormat } from '@/lib/utils';

export function DiaryShareCardItem({ card }: { card: DiaryListingItemProp }) {
    const maxVisibleCategories = 2;
    const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
    const [showShareBox, setShowShareBox] = useState<boolean>(false);

    return (
        <Card className="relative h-64 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* 3-dot menu in top right */}
                <div className="flex items-center justify-between">
                    <span className="text-xs">{dateTimeFormat(card.created_at)}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto">
                            <Link href={route('diaries.edit', card.id)}>
                                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                            </Link>
                            <Link
                                href={route('diaries.delete', card.id)}
                                method="delete"
                                preserveScroll
                                onBefore={() => confirm('Are you sure to delete the diary?')}
                                className="w-full"
                            >
                                <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
                {/* Title with truncation */}
                <Link href={route('diaries.show', card.id)} className="rich-text-editor-container">
                    <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.title}</h3>

                    {/* Content with truncation */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.content}</p>
                </Link>

                {/* Categories row with overflow handling */}
                <div className="mt-4 flex items-center gap-1 overflow-hidden">
                    {card.categories.slice(0, maxVisibleCategories).map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {category.name}
                        </Badge>
                    ))}

                    {card.categories.length > maxVisibleCategories && (
                        <>
                            <Button variant="ghost" size="icon" className="h-6 w-6 p-0" onClick={() => setShowAllCategories(true)}>
                                <ChevronRight className="h-4 w-4" />
                            </Button>

                            <Dialog open={showAllCategories} onOpenChange={setShowAllCategories}>
                                <DialogContent className="sm:max-w-md">
                                    <DialogHeader>
                                        <DialogTitle>Categories</DialogTitle>
                                    </DialogHeader>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {card.categories.map((category, index) => (
                                            <Badge key={index} variant="outline">
                                                {category.name}
                                            </Badge>
                                        ))}
                                    </div>
                                    <DialogDescription aria-describedby="dialog-description"></DialogDescription>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>

                {/* Footer with metadata */}
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        {card.emotion?.emoji ?? ''}
                        <span className="ml-2">{card.emotion?.name ?? ''}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {card.files.total > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex cursor-pointer items-center">
                                        <Paperclip className="mr-1 h-3.5 w-3.5" />
                                        <span>{card.files.total}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <ul className="max-w-md list-inside list-none space-y-1 text-gray-200 dark:text-gray-700">
                                            {Object.keys(card.files.countsByTypes).map((key) => (
                                                <li key={key}>
                                                    {card.files.countsByTypes[key]} {key}
                                                </li>
                                            ))}
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

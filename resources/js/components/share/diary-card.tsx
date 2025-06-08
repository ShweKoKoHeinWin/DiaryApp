import { Button } from '@/components/ui/button';
import { DiaryListingItemProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpenText, ChevronRight, Paperclip, User } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export function DiaryCard({ card }: { card: DiaryListingItemProp }) {
    const maxVisibleCategories = 2;
    const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
    return (
        <Card className="relative h-64 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* 3-dot menu in top right */}
                <div className="flex items-center justify-between">
                    <span className="text-xs">Received At: {format(card.created_at, 'd-M-yyyy (EEE) HH:mm')}</span>
                    <BookOpenText/>
                </div>

                {/* Title with truncation */}
                <Link
                    href={route('diaries.show', {
                        diary: card.item.id,
                    })}
                    className="rich-text-editor-container"
                >
                    <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.item.title}</h3>

                    {/* Content with truncation */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.item.content}</p>
                </Link>

                {/* Categories row with overflow handling */}
                <div className="mt-4 flex items-center gap-1 overflow-hidden">
                    {card.item.categories.slice(0, maxVisibleCategories).map((category, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                            {category.name}
                        </Badge>
                    ))}

                    {card.item.categories.length > maxVisibleCategories && (
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
                                        {card.item.categories.map((category, index) => (
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
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                        {card.item.emotion?.emoji ?? ''}
                        <span className="ml-2">{card.item.emotion?.name ?? ''}</span>
                    </div>

                    <div className="flex items-center gap-3">
                        {card.item.files.total > 0 && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex cursor-pointer items-center">
                                        <Paperclip className="mr-1 h-3.5 w-3.5" />
                                        <span>{card.item.files.total}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <ul className="max-w-md list-inside list-none space-y-1 text-gray-200 dark:text-gray-700">
                                            {Object.keys(card.item.files.countsByTypes).map((key) => (
                                                <li key={key}>
                                                    {card.item.files.countsByTypes[key]} {key}
                                                </li>
                                            ))}
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                    </div>

                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex cursor-pointer items-center">
                                    <span className='text-sm'>By</span><User />
                                </TooltipTrigger>
                                <TooltipContent>
                                    <ul className="max-w-md list-inside list-none space-y-1 text-gray-200 dark:text-gray-700">
                                        <li>Name : {card.sharer.name}</li>
                                        <li>Email : {card.sharer.email}</li>
                                    </ul>
                                </TooltipContent>
                            </Tooltip>
                        </TooltipProvider>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

import { CollectionProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpenText, NotebookText, User } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export function CollectionCard({ card }) {
    return (
        <Card className="relative h-64 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* 3-dot menu in top right */}
                <div className="flex items-center justify-between">
                    <span className="text-xs">Received at: {format(card.created_at, 'd-M-yyyy (EEE) HH:mm')}</span>
                    <NotebookText/>
                </div>

                {/* Title with truncation */}
                <Link href={route('collections.show', card.item.id)} className="rich-text-editor-container">
                    <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.item.title}</h3>

                    {/* Description with truncation */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.item.description}</p>
                </Link>

                {/* Footer with metadata */}
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        {card.item.diary_count} <BookOpenText className="h-5 w-5" />
                    </div>

                    <div>
                        <TooltipProvider>
                            <Tooltip>
                                <TooltipTrigger className="flex cursor-pointer items-center">
                                    <span className='text-sm'>By</span> <User />
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

import { dateTimeFormat } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { BookOpenText, NotebookText } from 'lucide-react';
import { Card, CardContent } from '../ui/card';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export function CollectionCard({ card, type, from = 'collection', data = {} }: { type: 'share' | 'receive', data: any }) {
    return (
        <Card className="relative h-64 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* 3-dot menu in top right */}
                <div className="flex items-center justify-between">
                    <span className="text-xs">Received at: {dateTimeFormat(card.created_at)}</span>
                    <NotebookText />
                </div>

                {/* Title with truncation */}
                <Link
                    href={route('collections.show', { collection: card.item.id, from, data })}
                    className="rich-text-editor-container"
                >
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
                        {type === 'receive' && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex cursor-pointer items-center">
                                        <span className="text-sm">{`By: ${card.sharer.name}`}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <ul className="max-w-md list-inside list-none space-y-1 text-gray-200 dark:text-gray-700">
                                            <li>Name : {card.sharer.name}</li>
                                            <li>Email : {card.sharer.email}</li>
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {type === 'share' && card.receiver && (
                            <TooltipProvider>
                                <Tooltip>
                                    <TooltipTrigger className="flex cursor-pointer items-center">
                                        <span className="text-sm">{`To: ${card.receiver.name}`}</span>
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <ul className="max-w-md list-inside list-none space-y-1 text-gray-200 dark:text-gray-700">
                                            <li>Name : {card.receiver.name}</li>
                                            <li>Email : {card.receiver.email}</li>
                                        </ul>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}
                        {type === 'share' && !card.receiver && <span className="text-sm">{`To: ${card.email}`}</span>}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

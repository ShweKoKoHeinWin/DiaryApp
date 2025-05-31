import { Button } from '@/components/ui/button';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpenText, CornerUpRight, MoreVertical } from 'lucide-react';
import { useState } from 'react';
import ShareModal from '../share/share-modal';
import { Card, CardContent } from '../ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
export function CardItem({ card }) {
    const [showShareBox, setShowShareBox] = useState(false);

    return (
        <Card className="relative h-50 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* 3-dot menu in top right */}
                <div className="flex items-center justify-between">
                    <span className="text-xs">{format(card.created_at, 'd-M-yyyy (EEE) HH:mm')}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto">
                            {/* <Link href={route('collections.edit', card.id)}>
                                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                            </Link> */}
                            <Link
                                href={route('collections.delete', card.id)}
                                method="delete"
                                preserveScroll
                                onBefore={() => confirm('Are you sure to delete the collection?')}
                                className="w-full"
                            >
                                <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Title with truncation */}
                <Link href={route('collections.show', card.id)} className="rich-text-editor-container">
                    <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.title}</h3>

                    {/* Description with truncation */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.description}</p>
                </Link>

                {/* Footer with metadata */}
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        {card.diary_count} <BookOpenText className="h-5 w-5"/> 
                    </div>
                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="flex w-auto cursor-pointer items-center gap-0 p-1"
                            onClick={() => setShowShareBox(true)}
                        >
                            <CornerUpRight className="h-3.5 w-3.5" />
                            <span>{card.shares.length}</span>
                        </Button>
                        <ShareModal
                            url={route('collections.shares', card.id)}
                            card={card}
                            showShareBox={showShareBox}
                            setShowShareBox={setShowShareBox}
                        />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

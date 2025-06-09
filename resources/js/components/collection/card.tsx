import { Button } from '@/components/ui/button';
import { CollectionProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { BookOpenText, CornerUpRight, MoreVertical } from 'lucide-react';
import { useRef, useState } from 'react';
import ShareModal from '../share/share-modal';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { dateTimeFormat } from '@/lib/utils';
export function CardItem({
    card,
    isCardSelecting,
    setIsCardSelecting,
    selectedCards,
    setSelectedCards,
}: {
    card: CollectionProp;
    isCardSelecting: boolean;
    setIsCardSelecting: (val: boolean) => void;
    selectedCards: number[];
    setSelectedCards: (val: number[]) => void;
}) {
    const [showShareBox, setShowShareBox] = useState(false);
    // Long Press mode
    const pressStartTime = useRef<number | null>(null);
    const [blockEvent, setBlockEvent] = useState(false);
    const preventEventOnLongPress = (e: any, callback: () => void = () => {}) => {
        if (blockEvent) {
            e.preventDefault();
            setBlockEvent(false);
        } else {
            callback();
        }
    };
    return (
        <Card className="relative h-50 w-full overflow-hidden">
            {isCardSelecting && (
                <label className="absolute top-0 left-0 block h-full w-full bg-gray-500/50 p-2">
                    <Checkbox
                        className="bg-white"
                        id={`card-${card.id}`}
                        checked={selectedCards.length > 0 ? selectedCards.includes(card.id) : false}
                        onCheckedChange={(checked) => {
                            if (checked === true) {
                                setSelectedCards([...new Set([...selectedCards, card.id])]);
                            } else {
                                setSelectedCards(selectedCards.filter((id) => id !== card.id));
                            }
                        }}
                    />
                </label>
            )}
            <CardContent
                className="flex h-full flex-col px-4"
                onMouseDown={(e) => {
                    pressStartTime.current = Date.now();
                    setBlockEvent(false);
                }}
                onMouseUp={() => {
                    const pressedTime = Date.now() - (pressStartTime.current ?? Date.now());
                    if (pressedTime > 800) {
                        setBlockEvent(true);
                        setIsCardSelecting(true);
                        setSelectedCards([...new Set([...selectedCards, card.id])]);
                    }
                    pressStartTime.current = null;
                }}
                onTouchStart={(e) => {
                    pressStartTime.current = Date.now();
                    setBlockEvent(false);
                }}
                onTouchEnd={() => {
                    const pressedTime = Date.now() - (pressStartTime.current ?? Date.now());
                    if (pressedTime > 800) {
                        setBlockEvent(true);
                        setIsCardSelecting(true);
                        setSelectedCards([...new Set([...selectedCards, card.id])]);
                    }
                    pressStartTime.current = null;
                }}
            >
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
                <Link
                    href={route('collections.show', card.id)}
                    className="rich-text-editor-container"
                    onClick={(e) => {
                        preventEventOnLongPress(e);
                    }}
                >
                    <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.title}</h3>

                    {/* Description with truncation */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.description}</p>
                </Link>

                {/* Footer with metadata */}
                <div className="mt-auto flex items-center justify-between pt-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                        {card.diary_count} <BookOpenText className="h-5 w-5" />
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

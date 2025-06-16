import { Button } from '@/components/ui/button';
import { DIARY } from '@/lib/permissions';
import { dateTimeFormat } from '@/lib/utils';
import { CollectionShortProp, DiaryListingItemProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { ArrowRight, ChevronRight, CornerUpRight, MoreVertical, Paperclip } from 'lucide-react';
import { useRef, useState } from 'react';
import ShareModal from '../share/share-modal';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
import EmailSendbox from '../ultils/email-send-box';
import DiaryCollectionModal from './diary-collection-modal';

export function CardItem({
    card,
    collection,
    collections,
    isCardSelecting,
    setIsCardSelecting,
    selectedCards,
    setSelectedCards,
    cancelSelectMode,
    from = '',
    data = {},
    permissions = [],
}: {
    card: DiaryListingItemProp;
    collection?: CollectionShortProp;
    collections: CollectionShortProp[];
    isCardSelecting: boolean;
    setIsCardSelecting: (val: boolean) => void;
    selectedCards: number[];
    setSelectedCards: (val: number[]) => void;
    cancelSelectMode: () => void;
    from: string;
    data?: any;
    permissions: string[];
}) {
    const categoryContainerRef = useRef<HTMLDivElement>(null);
    const [maxVisibleCategories, setMaxVisibleCategories] = useState(2);
    const allCollectionIds = collections.map((c: CollectionShortProp) => c.id).sort();
    const [showAllCategories, setShowAllCategories] = useState<boolean>(false);
    const [showShareBox, setShowShareBox] = useState<boolean>(false);
    const [showCollections, setShowCollections] = useState<boolean>(false);

    // useEffect(() => {
    //     const updateCategoryCount = () => {
    //         const container = categoryContainerRef.current;
    //         if (!container) return;

    //         const categoryElements = Array.from(container.children) as HTMLElement[];
    //         const containerWidth = container.offsetWidth;
    //         let totalWidth = 0;
    //         let count = 0;

    //         for (const el of categoryElements) {
    //             totalWidth += el.offsetWidth + 6; // add gap
    //             if (totalWidth + 24 <= containerWidth) {
    //                 count++;
    //             } else {
    //                 break;
    //             }
    //         }

    //         setMaxVisibleCategories(count);
    //     };

    //     // Run on mount and whenever categories change
    //     updateCategoryCount();

    //     // Run on resize
    //     window.addEventListener('resize', updateCategoryCount);

    //     // Cleanup
    //     return () => {
    //         window.removeEventListener('resize', updateCategoryCount);
    //     };
    // }, [card.categories]);

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
        <Card className="relative h-64 w-full overflow-hidden">
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
                    {(permissions.includes(DIARY.edit) || permissions.includes(DIARY.edit) || permissions.includes(DIARY.edit)) && <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto">
                            {permissions.includes(DIARY.edit) && (
                                <Link
                                    href={route('diaries.edit', {
                                        diary: card.id,
                                        collection: collection?.id,
                                        from,
                                        email: data?.email,
                                    })}
                                >
                                    <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                                </Link>
                            )}
                            {permissions.includes(DIARY.delete) && (
                                <Link
                                    href={route('diaries.delete', {
                                        diary: card.id,
                                        collection: collection?.id,
                                        from,
                                        email: data?.email,
                                    })}
                                    method="delete"
                                    preserveScroll
                                    onBefore={() => confirm('Are you sure to delete the diary?')}
                                    className="w-full"
                                >
                                    <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
                                </Link>
                            )}
                            {permissions.includes(DIARY.collection) && (
                                <DropdownMenuItem className="cursor-pointer">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="flex w-full cursor-pointer items-center gap-0"
                                        onClick={() => setShowCollections(true)}
                                    >
                                        <span className="mr-2">Add To Collections</span>
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </DropdownMenuItem>
                            )}
                        </DropdownMenuContent>
                    </DropdownMenu>}
                </div>

                <DiaryCollectionModal
                    showCollections={showCollections}
                    setShowCollections={setShowCollections}
                    diary={card}
                    allCollectionIds={allCollectionIds}
                    collections={collections}
                />
                {/* Title with truncation */}
                <Link
                    onClick={(e) => {
                        preventEventOnLongPress(e);
                    }}
                    href={route('diaries.show', {
                        diary: card.id,
                        collection: collection?.id,
                        from,
                        email: data?.email,
                    })}
                    className="rich-text-editor-container"
                >
                    <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.title}</h3>

                    {/* Content with truncation */}
                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.content}</p>
                </Link>

                {/* Categories row with overflow handling */}
                <div className="mt-4 flex items-center gap-1 overflow-hidden" ref={categoryContainerRef}>
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
                <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
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

                        {permissions.includes(DIARY.share) && card.shares?.length > 0 && (
                            <EmailSendbox allEmails={[...card.shares.map((s) => s.email)]} />
                        )}

                        {permissions.includes(DIARY.share) && (
                            <>
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
                                    url={route('diaries.shares', card.id)}
                                    card={card}
                                    showShareBox={showShareBox}
                                    setShowShareBox={setShowShareBox}
                                />
                            </>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

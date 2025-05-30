import { Button } from '@/components/ui/button';
import { DiaryCardData } from '@/types/types';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { ArrowRight, ChevronRight, CornerUpRight, MoreVertical, Paperclip, PlusSquare, Trash } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';
export function CardItem({ card }) {
    const [showAllCategories, setShowAllCategories] = useState(false);
    const [showFilePopup, setShowFilePopup] = useState(false);
    const [showShareBox, setShowShareBox] = useState(false);
    const [showCollections, setShowCollections] = useState(false);
    const maxVisibleCategories = 2;

    return (
        <Card className="relative h-64 w-full overflow-hidden">
            <CardContent className="flex h-full flex-col px-4">
                {/* 3-dot menu in top right */}
                <div className="flex items-center justify-between">
                    <span className="text-xs">{format(card.createdAt, 'd-M-yyyy (EEE) HH:mm')}</span>
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-8 w-8 cursor-pointer">
                                <MoreVertical className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-auto">
                            <Link href={route('collections.edit', card.id)}>
                                <DropdownMenuItem className="cursor-pointer">Edit</DropdownMenuItem>
                            </Link>
                            <Link href={route('collections.delete', card.id)} method="delete" preserveScroll onBefore={() => confirm('Are you sure to delete the diary?')} className="w-full">
                                <DropdownMenuItem className="cursor-pointer">Delete</DropdownMenuItem>
                            </Link>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>

                {/* Title with truncation */}
                <h3 className="line-clamp-1 pr-8 text-lg font-semibold">{card.title}</h3>

                {/* Content with truncation */}
                <p className="mt-2 line-clamp-2 text-sm text-gray-600">{card.content}</p>


            </CardContent>
        </Card>
    );
}

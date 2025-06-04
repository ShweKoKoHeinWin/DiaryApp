import { CollectionProp, DiaryListingItemProp } from '@/types/types';
import { Share2, SquareChevronLeft, SquareChevronRight, X } from 'lucide-react';
import { useState } from 'react';
import MultiShareModal from '../share/multi-share-modal';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';

type ActionType = 'multi-share';

const CardSelectModeBox = ({
    actions = ['multi-share'],
    customActions,
    cards,
    cardType = 'diary',
    isCardSelecting,
    setIsCardSelecting,
    selectedCards,
    setSelectedCards,
}: {
    actions?: ActionType[];
    customActions?: React.ReactNode;
    cards: CollectionProp[] | DiaryListingItemProp[];
    cardType: 'diary' | 'collection';
    isCardSelecting: boolean;
    setIsCardSelecting: (val: boolean) => void;
    selectedCards: number[];
    setSelectedCards: (val: number[]) => void;
}) => {
    const [showSelectBox, setShowSelectBox] = useState(false);
    const [showShareBox, setShowShareBox] = useState<boolean>(false);
    const cancelSelectMode = () => {
        setSelectedCards([]);
        setIsCardSelecting(false);
    };
    if (isCardSelecting) {
        return (
            <>
                {showSelectBox ? (
                    <div className="fixed top-10 right-10 z-100 flex items-center gap-4">
                        {/* select box hide button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer bg-gray-800 px-4 py-2 text-gray-300 ring-5 ring-gray-400 hover:bg-gray-600 hover:text-gray-200"
                            onClick={(e) => setShowSelectBox(false)}
                            title="Hide select box"
                        >
                            <SquareChevronRight />
                        </Button>
                        <div className="flex flex-wrap items-center gap-3 rounded-2xl bg-amber-100 p-5 dark:bg-gray-700">

                            {/* Custome Actions */}
                            {customActions}

                            {/* Multishare box opener */}
                            {actions.includes('multi-share') && (
                                <>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="cursor-pointer bg-blue-600 px-4 py-2 text-gray-300 hover:bg-blue-500 hover:text-gray-200"
                                        onClick={(e) => setShowShareBox(true)}
                                        title="Share"
                                    >
                                        <Share2 size={20} />
                                    </Button>
                                    {/* multi share box */}
                                    <MultiShareModal
                                        url={route('shares.multishare')}
                                        showShareBox={showShareBox}
                                        setShowShareBox={setShowShareBox}
                                        selectedCards={selectedCards}
                                        cancelSelectMode={cancelSelectMode}
                                        cardType={cardType}
                                    />
                                </>
                            )}
                            {/* Select all */}
                            <label className="flex items-center gap-1 rounded-2xl border px-3 py-1">
                                <Checkbox
                                    id={`AllCardsSelect`}
                                    checked={
                                        selectedCards.length > 0
                                            ? selectedCards.length === [...new Set(cards.map((c) => c.id).sort())].length &&
                                              selectedCards.sort().every((id, idx) => id === [...new Set(cards.map((c) => c.id).sort())].sort()[idx])
                                            : false
                                    }
                                    onCheckedChange={(checked) => {
                                        if (checked === true) {
                                            setSelectedCards([...new Set(cards.map((c) => c.id).sort())]);
                                        } else {
                                            setSelectedCards([]);
                                        }
                                    }}
                                />
                                All
                            </label>
                            {/* Selected card count */}
                            <Badge variant="outline" className="text-lg">
                                {selectedCards.length} selected
                            </Badge>
                        </div>

                        {/* Close select mode */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer bg-gray-300 ring-5 ring-gray-400 dark:bg-gray-800"
                            title="Cancel Select"
                            onClick={(e) => {
                                setSelectedCards([]);
                                setIsCardSelecting(false);
                            }}
                        >
                            <X />
                        </Button>
                    </div>
                ) : (
                    <div className="fixed top-10 right-10 z-100 flex items-center justify-center gap-3">
                        {/* open select box */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer bg-blue-600 px-4 py-2 text-gray-300 ring-5 ring-blue-400 hover:bg-blue-500 hover:text-gray-200"
                            onClick={(e) => setShowSelectBox(true)}
                            title="Share"
                        >
                            <SquareChevronLeft />
                        </Button>
                        {/* Close select mode */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="cursor-pointer bg-gray-300 ring-5 ring-gray-400 dark:bg-gray-800"
                            title="Cancel Select"
                            onClick={(e) => {
                                setSelectedCards([]);
                                setIsCardSelecting(false);
                            }}
                        >
                            <X />
                        </Button>
                    </div>
                )}
            </>
        );
    }
};

export default CardSelectModeBox;

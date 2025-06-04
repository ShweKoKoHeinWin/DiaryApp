import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Checkbox } from '../ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import TitleCreateModal from '../collection/title-create-modal';
import { Label } from '../ui/label';
import { CollectionShortProp, DiaryDetailProp, DiaryListingItemProp } from '@/types/types';

const DiaryCollectionModal = ({ showCollections, setShowCollections, allCollectionIds, collections, diary }: {
    showCollections :boolean,
    setShowCollections: (val: boolean) => void;
    allCollectionIds: number[];
    collections: CollectionShortProp[];
    diary: DiaryDetailProp | DiaryListingItemProp
}) => {
    const [selectedCollections, setSelectedCollections] = useState<number[]>([...diary.collections.map(col => col.id)].sort());

    const handleCollectionBox = (isOpen: boolean) => {
        if (!isOpen) {
            router.put(
                route('diaries.collections', diary.id),
                {
                    collections: selectedCollections,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                },
            );
        }
        setShowCollections(isOpen);
    };

    const handleCollectionChange = (id: number, checked: boolean) => {
        setSelectedCollections((prev) => {
            if (checked) {
                return [...prev, id];
            }
            return prev.filter((colId) => colId !== id);
        });
    };
    return (
        <Dialog open={showCollections} onOpenChange={handleCollectionBox}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="flex justify-between">
                        <span>Collections</span>
                        <label htmlFor="allcollections" className="mr-5 flex items-center justify-center gap-2">
                            <Checkbox
                                id="allcollections"
                                checked={
                                    selectedCollections.length === allCollectionIds.length &&
                                    selectedCollections.sort().every((val, index) => val === allCollectionIds[index])
                                }
                                onCheckedChange={(checked) => {
                                    if (checked === true) {
                                        setSelectedCollections(allCollectionIds);
                                    } else {
                                        setSelectedCollections([]);
                                    }
                                }}
                            />
                            <span>Select All</span>
                        </label>
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription aria-describedby="dialog-description"></DialogDescription>
                <ul className="h-50 max-w-md list-inside list-none space-y-1 overflow-y-scroll rounded-2xl border-2 bg-gray-900/5 p-4">
                    {collections.map((collection) => (
                        <li key={collection.id}>
                            <div className="inline-block w-[90%]">
                                <Label
                                    className="flex items-center justify-between gap-2 rounded-xl bg-amber-300 p-3"
                                    htmlFor={`collection-${collection.id}`}
                                >
                                    {collection.title}
                                    <Checkbox
                                        id={`collection-${collection.id}`}
                                        checked={selectedCollections.includes(collection.id)}
                                        onCheckedChange={(checked) => handleCollectionChange(collection.id, checked === true)}
                                    />
                                </Label>
                            </div>
                        </li>
                    ))}
                </ul>
                <TitleCreateModal />
            </DialogContent>
        </Dialog>
    );
};

export default DiaryCollectionModal;

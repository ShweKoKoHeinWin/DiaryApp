import { router } from '@inertiajs/react';
import { DialogDescription } from '@radix-ui/react-dialog';
import { PlusSquare, Trash } from 'lucide-react';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { CollectionProp, DiaryDetailProp, DiaryListingItemProp } from '@/types/types';

const ShareModal = ({
    url,
    card,
    showShareBox,
    setShowShareBox,
}: {
    url: string;
    card: DiaryListingItemProp | DiaryDetailProp | CollectionProp;
    showShareBox: boolean;
    setShowShareBox: (isOpen: boolean) => void;
}) => {
    const [receivers, setReceivers] = useState<string[]>(card?.shares?.length > 0 ? card?.shares.map((s) => s.email) : ['']);

    const handleSharedBox = (isOpen: boolean) => {
        if (!isOpen) {
            router.put(
                url,
                {
                    receivers,
                },
                {
                    preserveScroll: true,
                    preserveState: true,
                    onFinish: () => router.reload()
                },
            );
        }
        setShowShareBox(isOpen);
    };

    const handleOnChange = (idx: number, value: string) => {
        setReceivers(
            receivers.map((r, i) => {
                if (i === idx) {
                    return value;
                } else {
                    return r;
                }
            }),
        );
    };

    return (
        <Dialog open={showShareBox} onOpenChange={handleSharedBox}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Shares ({receivers.length})</DialogTitle>
                </DialogHeader>
                <ul className="h-50 max-w-md list-inside list-decimal space-y-1 overflow-y-scroll rounded-2xl p-4">
                    {receivers.map((user: string, idx: number) => (
                        <li key={idx} className="flex items-center justify-between gap-2">
                            <input
                                onChange={(e) => handleOnChange(idx, e.target.value)}
                                value={user}
                                className="flex-1 rounded-2xl border-2 border-blue-400 py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6 dark:text-gray-200"
                            />
                            <div className="h-6 w-6" onClick={e => setReceivers(receivers.filter((_, i) => i !== idx))}>
                                <Trash className="text-red-600" />
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex items-center justify-center">
                    <div
                        className="rounded-2xl bg-blue-600 px-4 py-2 text-gray-200 hover:bg-blue-500"
                        onClick={() => setReceivers([...receivers, ''])}
                    >
                        <PlusSquare />
                    </div>
                </div>
                <DialogDescription aria-describedby={undefined}></DialogDescription>
            </DialogContent>
        </Dialog>
    );
};

export default ShareModal;

import { PlusSquare } from 'lucide-react';
import { FormEvent, useState } from 'react';
import { Input } from '../ui/input';
import { router } from '@inertiajs/react';

const TitleCreateModal = () => {
    const [newCollection, setNewCollection] = useState<string>('');
    const handleCollectionSubmit = (e: FormEvent) => {
        e.preventDefault();
        if (!newCollection) return;

        router.post(
            route('collections.store'),
            {
                title: newCollection,
            },
            {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => setNewCollection(''),
            },
        );
    };
    return (
        <form className="flex items-center justify-center gap-4" onSubmit={handleCollectionSubmit}>
            <Input
                type="text"
                placeholder="Collection Name"
                className="pl-8"
                value={newCollection}
                onChange={(e) => setNewCollection(e.target.value)}
            />
            <button type="submit" className="rounded-2xl bg-blue-600 px-4 py-2 text-gray-200 hover:bg-blue-500">
                <PlusSquare size={20} />
            </button>
        </form>
    );
};

export default TitleCreateModal;

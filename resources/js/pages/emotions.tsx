import { EmotionModal } from '@/components/emotion/emotion-create-modal';
import { EmotionDeleteModal } from '@/components/emotion/emotion-delete-modal';
import { EmotionEditModal } from '@/components/emotion/emotion-edit-modal';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type SharedData } from '@/types';
import { EmotionProp } from '@/types/types';
import { Head, usePage } from '@inertiajs/react';
import { ArrowDown, ArrowUp, Edit, Plus, Search, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Emotions',
        href: route('emotions.index', undefined, false),
    },
];

export default function Emotions({ emotions }: { emotions: EmotionProp[] }) {
    const [query, setQuery] = useState<string>('');
    const [filteredEmotions, setFilteredEmotions] = useState<EmotionProp[]>([]);
    const [sortAsc, setSortAsc] = useState(true);
    const [sortedEmotions, setSortedEmotions] = useState<EmotionProp[]>([]);

    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditerOpen, setIsEditerOpen] = useState(false);
    const [selectedEmotion, setSelectedEmotion] = useState<EmotionProp | undefined>();
    const [isDeleterOpen, setIsDeleterOpen] = useState(false);

    useEffect(() => {
        let filtered = [...emotions].filter((emotion) => emotion.name.toLowerCase().includes(query.toLowerCase()));
        setFilteredEmotions(filtered);
    }, [emotions, query]);

    useEffect(() => {
        let sorted = [...filteredEmotions].sort((a, b) => {
            const nameA = a.name.toLowerCase();
            const nameB = b.name.toLowerCase();
            if (sortAsc) {
                return nameA.localeCompare(nameB);
            } else {
                return nameB.localeCompare(nameA);
            }
        });
        setSortedEmotions(sorted);
    }, [filteredEmotions, sortAsc]);

    const handleEdit = (emotion: EmotionProp) => {
        setSelectedEmotion(emotion);
        setIsEditerOpen(true);
        setIsDeleterOpen(false);
    };
    const handleDelete = (emotion: EmotionProp) => {
        setSelectedEmotion(emotion);
        setIsDeleterOpen(true);
        setIsEditerOpen(false);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Emotions" />

            {isOpen && <EmotionModal setIsOpen={setIsOpen} />}
            {isEditerOpen && selectedEmotion && <EmotionEditModal emotion={selectedEmotion} setIsEditerOpen={setIsEditerOpen} />}
            {isDeleterOpen && selectedEmotion && <EmotionDeleteModal emotion={selectedEmotion} setIsDeleterOpen={setIsDeleterOpen} />}

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-between items-center">
                    <div className="relative mb-6">
                        <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3.5">
                            <Search/>
                        </div>
                        <input
                            onChange={(e) => setQuery(e.target.value)}
                            value={query}
                            type="text"
                            id="input-group-1"
                            className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 ps-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                            placeholder="Name"
                        />
                    </div>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="flex items-center justify-center rounded-2xl border-2 border-black px-4 py-2 text-black hover:opacity-90 dark:border-white dark:text-white"
                    >
                        <Plus size={15} /> Create
                    </button>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-left text-sm text-gray-500 rtl:text-right dark:text-gray-400">
                        <thead className="bg-gray-50 text-xs text-gray-700 uppercase dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Emoji
                                </th>
                                <th scope="col" className="px-6 py-3" onClick={() => setSortAsc(!sortAsc)}>
                                    <div className="flex items-center">Name {sortAsc ? <ArrowDown size={15} /> : <ArrowUp size={15} />}</div>
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedEmotions.length > 0 ? (
                                sortedEmotions.map((emotion: EmotionProp, i) => (
                                    <tr key={emotion.id} className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            {emotion.emoji}
                                        </th>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            {emotion.name}
                                        </th>

                                        <td className="px-6 py-4">
                                            <button
                                                onClick={() => handleEdit(emotion)}
                                                className="font-medium text-blue-600 hover:underline dark:text-blue-500"
                                            >
                                                <Edit />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(emotion)}
                                                className="ml-5 font-medium text-red-600 hover:underline dark:text-red-500"
                                            >
                                                <Trash />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <th colSpan={3} className="p-4 text-center">
                                        There is no emotions right now.
                                    </th>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}

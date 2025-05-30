import { CategoryProp, EmotionProp } from '@/types/types';
import { router, useForm } from '@inertiajs/react';

export function EmotionEditModal({ setIsEditerOpen, emotion }: { setIsEditerOpen: (bool: boolean) => void; emotion: EmotionProp }) {
    const closeModal = () => {
        router.reload({ only: ['errors'] });
        setIsEditerOpen(false);
    };

    const { data, setData, post, processing, errors } = useForm({ name: emotion.name, emoji: emotion.emoji });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('emotions.update', emotion.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setIsEditerOpen(false),
        });
    };

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

            <div className="fixed top-[50%] left-[50%] z-10 min-w-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <form
                        onSubmit={handleSubmit}
                        className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg"
                    >
                        <div className="bg-white dark:bg-gray-900 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="border-b border-gray-900/10 pb-12">
                                <h2 className="text-base/7 font-semibold text-gray-900 dark:text-white text-center">Emotion Create</h2>

                                <div className="mt-5">
                                    <div className="grid grid-cols-1 space-y-2">
                                        <div className="col-span-1">
                                            <label htmlFor="" className="text-black dark:text-white">
                                                Name
                                            </label>
                                            <input
                                                name="name"
                                                value={data.name}
                                                className="mt-2 block w-full min-w-0 grow rounded-2xl border-2 border-blue-400 py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                onChange={(e) => setData('name', e.target.value)}
                                            />
                                            {errors['name'] && <p className="text-sm text-red-600">{errors['name']}</p>}
                                        </div>
                                        <div className="col-span-1">
                                            <label htmlFor="" className="text-black dark:text-white">
                                                Emoji
                                            </label>
                                            <input
                                                name="emoji"
                                                value={data.emoji}
                                                className="mt-2 block w-full min-w-0 grow rounded-2xl border-2 border-blue-400 py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-white placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                                onChange={(e) => setData('emoji', e.target.value)}
                                            />
                                            {errors['emoji'] && <p className="text-sm text-red-600">{errors['emoji']}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                disabled={processing}
                                type="submit"
                                className="inline-flex w-full justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-blue-500 sm:ml-3 sm:w-auto"
                            >
                                {processing ? 'Updating ...' : 'Edit'}
                            </button>
                            <button
                                onClick={closeModal}
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

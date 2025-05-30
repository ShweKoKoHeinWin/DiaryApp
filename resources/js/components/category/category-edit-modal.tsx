import { CategoryProp } from '@/types/types';
import { router, useForm } from '@inertiajs/react';

export function CategoryEditModal({ setIsEditerOpen, category }: { setIsEditerOpen: (bool: boolean) => void; category: CategoryProp }) {
    const closeModal = () => {
        router.reload({ only: ['errors'] });
        setIsEditerOpen(false);
    };

    const { data, setData, post, processing, errors } = useForm({ name: category.name });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categories.update', category.id), {
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
                            <div className="space-y-12">
                                <div className="border-b border-gray-900/10 pb-12">
                                    <h2 className="text-base/7 font-semibold text-gray-900 dark:text-gray-200">Edit Category</h2>

                                    <div className="mt-5">
                                        <input
                                            name="category"
                                            value={data.name}
                                            className="block min-w-0 w-full grow rounded-2xl border-2 border-blue-400 py-1.5 pr-3 pl-1 text-base text-gray-900 dark:text-gray-200 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                            onChange={(e) => setData('name', e.target.value)}
                                        />
                                        {errors.name && <p>{errors.name}</p>}
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

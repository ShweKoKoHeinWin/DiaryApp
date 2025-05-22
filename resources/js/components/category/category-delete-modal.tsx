import { CategoryProp } from '@/types/types';
import { router } from '@inertiajs/react';
import { useState } from 'react';

export function CategoryDeleteModal({ setIsDeleterOpen, category }: { setIsDeleterOpen: (bool: boolean) => void; category: CategoryProp }) {
    const [deleting, setDeleting] = useState(false);
    const closeModal = () => {
        router.reload({ only: ['errors'] });
        setIsDeleterOpen(false);
    };

    const handleDelete = (e: React.FormEvent) => {
        e.preventDefault();
        setDeleting(true)
        router.delete(route('categories.delete', category.id), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => {
                setIsDeleterOpen(false);
                setDeleting(false);
            },
        });
    };

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

            <div className="fixed top-[50%] left-[50%] z-10 min-w-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                    <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">
                        <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                            <div className="border-b border-gray-900/10 pb-12 text-center">
                                <h2 className="text-base/7 font-semibold text-gray-900">Delete Category</h2>

                                <p className="text-sm font-semibold text-gray-700">Are you sure to delete this category ({category.name})?</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                            <button
                                disabled={deleting}
                                onClick={handleDelete}
                                type="button"
                                className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-red-500 sm:ml-3 sm:w-auto"
                            >
                                {deleting ? 'Deleting ...' : 'Delete'}
                            </button>
                            <button
                                onClick={closeModal}
                                type="button"
                                className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50 sm:mt-0 sm:w-auto"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

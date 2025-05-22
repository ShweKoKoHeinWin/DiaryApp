import { CategoryModal } from '@/components/category/category-create-modal';
import { CategoryDeleteModal } from '@/components/category/category-delete-modal';
import { CategoryEditModal } from '@/components/category/category-edit-modal';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem, type SharedData } from '@/types';
import { CategoryProp } from '@/types/types';
import { Head, usePage } from '@inertiajs/react';
import { Button } from '@radix-ui/themes';
import { Delete, Edit, Plus, Trash } from 'lucide-react';
import { useEffect, useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: route('categories.index', undefined, false),
    },
];

export default function Categories({ categories }: { categories: CategoryProp[] }) {
    const { auth } = usePage<SharedData>().props;
    const [isOpen, setIsOpen] = useState(false);
    const [isEditerOpen, setIsEditerOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<CategoryProp>();
    const [isDeleterOpen, setIsDeleterOpen] = useState(false);
    const handleEdit = (category: CategoryProp) => {
        setSelectedCategory(category);
        setIsEditerOpen(true);
        setIsDeleterOpen(false);
    }
    const handleDelete = (category: CategoryProp) => {
        setSelectedCategory(category);
        setIsDeleterOpen(true);
        setIsEditerOpen(false);
    }
 
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
         
            {isOpen && <CategoryModal setIsOpen={setIsOpen} />}
            {isEditerOpen && <CategoryEditModal category={selectedCategory} setIsEditerOpen={setIsEditerOpen} />}
            {isDeleterOpen && <CategoryDeleteModal category={selectedCategory} setIsDeleterOpen={setIsDeleterOpen} />}

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="flex justify-end">
                    <button onClick={() => setIsOpen(true)} className='flex items-center justify-center border-2 text-black border-black px-4 py-2 rounded-2xl hover:opacity-90 dark:border-white dark:text-white'>
                        <Plus /> Create
                    </button>
                </div>

                <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
                    <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                            <tr>
                                <th scope="col" className="px-6 py-3">
                                    Name
                                </th>
                                <th scope="col" className="px-6 py-3">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {categories.length > 0 ? (
                                categories.map((category: CategoryProp, i) => (
                                    <tr key={category.id} className='bg-white border-b dark:bg-gray-900 dark:border-gray-700 border-gray-200'>
                                        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap text-gray-900 dark:text-white">
                                            {category.name}
                                        </th>

                                        <td className="px-6 py-4">
                                            <button onClick={() => handleEdit(category)} className="font-medium text-blue-600 hover:underline dark:text-blue-500">
                                            <Edit/>
                                            </button>
                                            <button onClick={() => handleDelete(category)} className="font-medium text-red-600 hover:underline dark:text-red-500 ml-5">
                                                <Trash/>
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <th colSpan={2} className="p-4 text-center">
                                        There is no categories right now.
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

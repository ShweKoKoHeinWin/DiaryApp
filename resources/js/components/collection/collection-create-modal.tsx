import { router, useForm } from '@inertiajs/react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Check, Trash, Trash2Icon, X } from 'lucide-react';
import { useRef, useState } from 'react';
import RichTextEditor from '../ui/rich-editor';

const initialFormData: {
  title: string;
  description: string;
  image: File | null;
} = {
    title: '',
    description: '',
    image: null,
};

export function CollectionModal({ setIsOpen }: { setIsOpen: (bool: boolean) => void }) {
    const imageRef = useRef<HTMLInputElement | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const closeModal = () => {
        router.reload({ only: ['errors'] });
        setIsOpen(false);
    };

    const { data, setData, post, processing, errors } = useForm(initialFormData);
    const handleChangeDescription = (description: string) => {
        setData('description', description);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('collections.store'), {
            preserveScroll: true,
            preserveState: true,
            onSuccess: () => setIsOpen(false),
        });
    };
    
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const maxSize = 5 * 1024 * 1024;
            const fileArray = Array.from(e.target.files);
            const validFiles = fileArray.filter((file) => {
                if (file.size > maxSize) {
                    alert(`File "${file.name}" is too large. Maximum size is ${Math.round(maxSize / 1024 / 1024)}MB.`);
                    return false;
                }
                return true;
            });

            if (validFiles.length > 1) {
                alert(`You can only upload up to 1 file.`);
                return;
            }

            if (validFiles.length === 1) {
                const file = validFiles[0];
                const fileURL = URL.createObjectURL(file);
                setPreview(fileURL);
            } else {
                setPreview(null);
            }

            setData('image', e.target.files[0])
        }
    };

    const createFilePreview = (file: File): Promise<string | undefined> => {
        return new Promise((resolve) => {
            const reader = new FileReader();

            if (
                file.type.startsWith('image/') ||
                file.type.startsWith('video/') ||
                file.type.startsWith('text/') ||
                file.type === 'application/pdf'
            ) {
                reader.onload = (e) => resolve(e.target?.result as string);
                reader.onerror = () => resolve(undefined);

                // Choose reading method based on file type
                if (file.type.startsWith('text/')) {
                    reader.readAsText(file);
                } else {
                    reader.readAsDataURL(file); // For images, video, PDF preview
                }
            } else {
                // No preview (e.g., .docx, .xls)
                resolve(undefined);
            }
        });
    };

    return (
        <div className="relative z-10" aria-labelledby="modal-title" role="dialog" aria-modal="true">
            <div className="fixed inset-0 bg-gray-500/75 transition-opacity" aria-hidden="true" onClick={closeModal}></div>

            <div className="fixed top-[50%] left-[50%] z-10 max-h-[90vh] min-w-[50%] translate-x-[-50%] translate-y-[-50%] overflow-y-scroll">
                <div className="flex min-h-full items-end justify-center bg-white p-4 sm:items-center sm:p-0 dark:bg-gray-900">
                    <form onSubmit={handleSubmit} className="space-y-6 p-6">
                        <h2 className="text-center">Create Collection</h2>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="Enter a title for your entry"
                                    value={data.title}
                                    onChange={(e) => setData('title', e.target.value)}
                                    required
                                />
                                {errors[`title`] && <p className="text-sm text-red-600">{errors[`title`]}</p>}
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description">Description</Label>
                                <RichTextEditor
                                    placeholder="Write description here..."
                                    defaultValue={data.description}
                                    onChange={handleChangeDescription}
                                    className="w-full"
                                />
                                {errors[`description`] && <p className="text-sm text-red-600">{errors[`description`]}</p>}
                            </div>
                        </div>

                        <Separator />

                        <div className="space-y-2">
                            <Label>Background Image</Label>
                            <Input type="file" ref={imageRef} onChange={handleFileSelect} />
                            {preview && (
                                <div className="w-full relative">
                                    <Trash2Icon onClick={() => {
                                        setData('image', null);
                                        imageRef.current ? imageRef.current.value = '' : '';
                                        setPreview(null);
                                    }} className='absolute right-1 top-1 text-red-600' />
                                    <img src={preview} alt="" className="h-full w-full object-cover" />
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Form Actions */}
                        <div className="flex flex-col gap-3 pt-4 sm:flex-row">
                            <Button type="submit" className="flex-1 sm:flex-none">
                                {processing ? (
                                    <>
                                        <div className="border-background mr-2 h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Create
                                    </>
                                )}
                            </Button>

                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    setData(initialFormData);
                                }}
                                disabled={processing}
                                className="flex-1 sm:flex-none"
                            >
                                Reset Form
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

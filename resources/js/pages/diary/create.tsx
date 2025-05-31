import { CategoryModal } from '@/components/category/category-create-modal';
import { EmotionModal } from '@/components/emotion/emotion-create-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-editor';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryProp, DiaryFormProp, EmotionDetailProp, NewFilesProp } from '@/types/types';
import { Head, Link, useForm } from '@inertiajs/react';
import 'flowbite';
import { ArrowLeft, Check, Plus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Diaries',
        href: route('diaries.index'),
    },
    {
        title: 'Create',
        href: route('diaries.create'),
    },
];

const initialFormData = {
    title: '',
    content: '',
    categories: [],
    emotion: null,
    files: [],
    captions: [],
};

const create = ({ categories, emotions, collection }: { categories: CategoryProp[]; emotions: EmotionDetailProp[], collection: any }) => {
    const [isCategoryCreate, setIsCategoryCreate] = useState(false);
    const [isEmotionCreate, setIsEmotionCreate] = useState(false);
    const { data, setData, post, processing, errors } = useForm<DiaryFormProp>(initialFormData);
    const [files, setFiles] = useState<NewFilesProp[]>([]);

    const handleChange = (content: string) => {
        setData('content', content);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('diaries.store'));
    };
    useEffect(() => {
        setData(
            'captions',
            files.map((file:any) => file.caption),
        );
        setData('files', [...files.map((file:any) => file.file)]);
    }, [files]);
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diaries" />
            {/* Category and Emotion Create Modals */}
            {isCategoryCreate && <CategoryModal setIsOpen={setIsCategoryCreate} />}
            {isEmotionCreate && <EmotionModal setIsOpen={setIsEmotionCreate} />}

            {
                collection && 
                <Link href={route('collections.show', collection.id)} className='ml-6 mt-6'>
                    <Button variant="outline" className="gap-1 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" />
                        Back to collection
                    </Button>
                </Link>
            }

            <form onSubmit={handleSubmit} className="space-y-6 p-6">
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
                        <Label htmlFor="content">Content</Label>
                        <RichTextEditor
                            placeholder="Start writing your content here..."
                            defaultValue={data.content}
                            onChange={handleChange}
                            className="w-full"
                        />
                        {errors[`content`] && <p className="text-sm text-red-600">{errors[`content`]}</p>}

                    </div>
                </div>

                <Separator />

                <div className="space-y-3">
                    <div className="flex items-center justify-between">
                        <Label>Categories *</Label>
                        <div className="flex gap-2">
                            <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    setData(
                                        'categories',
                                        categories.map((cat: CategoryProp) => cat.id),
                                    )
                                }
                                className="h-7 text-xs"
                            >
                                Select All
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setData('categories', [])} className="h-7 text-xs">
                                Deselect All
                            </Button>
                            <Button type="button" variant="outline" size="sm" onClick={() => setIsCategoryCreate(true)} className="h-7 gap-1 text-xs">
                                <Plus className="h-3 w-3" />
                                Add
                            </Button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                        {categories.map((category: CategoryProp) => (
                            <div key={category.id} className="flex items-center space-x-2">
                                <Checkbox
                                    id={`category-${category.id}`}
                                    checked={data.categories.includes(category.id)}
                                    onCheckedChange={(checked) => {
                                        if (checked === true) {
                                            setData('categories', [...data.categories, category.id]);
                                        } else {
                                            setData('categories', [...data.categories.filter((cat) => cat != category.id)]);
                                        }
                                    }}
                                />
                                <Label htmlFor={`category-${category.id}`} className="flex items-center gap-2 text-sm">
                                    {category.name}
                                </Label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Emotion */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="emotion">Emotion *</Label>
                        <Button type="button" variant="outline" size="sm" onClick={() => setIsEmotionCreate(true)} className="h-7 gap-1 text-xs">
                            <Plus className="h-3 w-3" />
                            Add
                        </Button>
                    </div>
                    <Select value={`${data.emotion}`} onValueChange={(value) => setData('emotion', Number(value))}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select an emotion" />
                        </SelectTrigger>
                        <SelectContent>
                            {emotions.map((emotion: EmotionDetailProp) => (
                                <SelectItem key={emotion.id} value={`${emotion.id}`}>
                                    <div className="flex items-center gap-2">
                                        {emotion.emoji && <span>{emotion.emoji}</span>}
                                        <span>{emotion.name}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <Separator />

                <div className="space-y-2">
                    <Label>Attachments</Label>
                    <FileUpload
                        files={files}
                        onChange={setFiles}
                        maxFiles={10}
                        maxSize={10 * 1024 * 1024} // 10MB
                        accept={{
                            'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp'],
                            'application/pdf': ['.pdf'],
                            'application/msword': ['.doc'],
                            'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
                            'text/*': ['.txt', '.md'],
                            'video/*': ['.mp4', '.avi', '.mov', '.webm', '.mkv'],
                        }}
                    />
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
                                Create Entry
                            </>
                        )}
                    </Button>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={() => {
                            setData(initialFormData);
                            setFiles([]);
                        }}
                        disabled={processing}
                        className="flex-1 sm:flex-none"
                    >
                        Reset Form
                    </Button>
                </div>
            </form>
        </AppLayout>
    );
};

export default create;

import { CategoryModal } from '@/components/category/category-create-modal';
import { EmotionModal } from '@/components/emotion/emotion-create-modal';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FileUpload } from '@/components/ui/file-input';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { CategoryProp, DiaryFormProp } from '@/types/types';
import { Head, useForm } from '@inertiajs/react';
import 'flowbite';
import { Check, Plus } from 'lucide-react';
import { FormEvent, useEffect, useState } from 'react';
import RichTextEditor from './editer';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Collections Create',
        href: route('collections.create'),
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

const edit = () => {
    const { data, setData, post, processing, errors } = useForm<DiaryFormProp>(initialFormData);
    const [files, setFiles] = useState([]);

    const handleChange = (content: string) => {
        setData('content', content);
    };
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        post(route('diaries.store'));
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />
        </AppLayout>
    );
};

export default edit;

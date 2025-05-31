import ShareModal from '@/components/share/share-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { DiaryDetailProp } from '@/types/types';
import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import 'flowbite';
import { Calendar, Download, Edit, File, Image, NotebookText, Share2, Users, VideoIcon } from 'lucide-react';
import { useState } from 'react';
const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Diaries',
        href: route('diaries.index'),
    },
    {
        title: 'Show',
        href: '',
    },
];

const show = ({ diary }: { diary: DiaryDetailProp }) => {
    const [showShareBox, setShowShareBox] = useState<boolean>(false);

    const getFileTypeColor = (type: string) => {
        switch (type) {
            case 'image':
                return 'text-green-600 bg-green-50';
            case 'video':
                return 'text-blue-600 bg-blue-50';
            case 'audio':
                return 'text-purple-600 bg-purple-50';
            case 'document':
                return 'text-orange-600 bg-orange-50';
            default:
                return 'text-gray-600 bg-gray-50';
        }
    };

    const rendarFilePreview = (file: any) => {
        if (file.type === 'image') {
            if (file.path) {
                return (
                    <a href={file.path} target="_blank">
                        <img src={file.path || '/placeholder.svg'} alt={file.caption} className="h-full w-full object-cover" />
                    </a>
                );
            } else {
                return <Image className="h-full w-full" />;
            }
        } else if (file.type === 'video') {
            if (file.path) {
                return <video src={file.path} controls className="h-full w-full" />;
            } else {
                return <VideoIcon className="h-full w-full" />;
            }
        } else {
            return (
                <a href={file.path} target="_blank" className="text-blue-600 underline">
                    <File size={50} />
                </a>
            );
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Diaries - Show" />
            <div className="flex justify-end px-6 pt-4">
                <Link href={route('diaries.edit', diary.id)}>
                    <Button variant="outline" className="cursor-pointer bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-gray-100">
                        <Edit className="h-4 w-4" />
                        Edit
                    </Button>
                </Link>
            </div>

            <div className="mx-auto w-full space-y-6 p-6">
                {/* Header Section */}
                <Card>
                    <CardHeader>
                        <div className="flex items-start justify-between">
                            <div className="space-y-2">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{diary.emotion.emoji}</span>
                                    <div>
                                        <CardTitle className="text-2xl font-bold">{diary.title}</CardTitle>
                                        <p className="text-muted-foreground mt-1 text-sm">Feeling {diary.emotion.name}</p>
                                    </div>
                                </div>
                                <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                    <div className="flex items-center gap-1">
                                        <Calendar className="h-4 w-4" />
                                        {format(diary.created_at, 'd - M - yyyy (EEEE)')}
                                    </div>
                                    {diary.shares?.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <Users className="h-4 w-4" />
                                            Shared with {diary.shares?.length} people
                                        </div>
                                    )}
                                    {diary.collections?.length > 0 && (
                                        <div className="flex items-center gap-1">
                                            <NotebookText className="h-4 w-4" />
                                            Listed in {diary.collections?.length} collections
                                        </div>
                                    )}
                                </div>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="flex w-auto cursor-pointer items-center gap-0 p-1"
                                onClick={() => setShowShareBox(true)}
                            >
                                <Share2 className="mr-2 h-4 w-4" />
                                Share
                            </Button>
                            <ShareModal url={route('diaries.shares', diary.id)} card={diary} showShareBox={showShareBox} setShowShareBox={setShowShareBox} />
                        </div>
                    </CardHeader>
                </Card>

                {/* Categories */}
                {diary?.categories.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Categories</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-wrap gap-2">
                                {diary.categories.map((category, index) => (
                                    <div key={index} className="rounded-2xl bg-amber-300 px-3 py-1 text-gray-800">
                                        {category.name}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Content */}
                {diary?.content && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Content</CardTitle>
                        </CardHeader>
                        <CardContent className="rich-text-editor-container">
                            <div className="editor-content" dangerouslySetInnerHTML={{ __html: diary.content }}></div>
                        </CardContent>
                    </Card>
                )}

                {/* Files Section */}
                {diary.files.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Attachments ({diary.files.length})</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3">
                                {diary.files.map((file, index) => (
                                    <div
                                        key={index}
                                        className="hover:bg-muted/50 flex items-center justify-between rounded-lg border p-3 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className={`w-[50%] rounded-md p-2 ${getFileTypeColor(file.type)}`}>{rendarFilePreview(file)}</div>
                                            <div>
                                                <p className="text-sm font-medium">{file.caption}</p>
                                            </div>
                                        </div>
                                        <a href={file.path} target="_blank" className="rounded-2xl bg-gray-300 p-3 hover:bg-amber-200">
                                            <Download className="h-4 w-4" />
                                        </a>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                )}

                {/* Shared Users */}
                {diary.shares.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Shared With ({diary.shares.length} people) </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-inside list-decimal rounded-2xl">
                                {diary?.shares.map((user, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <div className="flex-1">
                                            <p className="text-md font-medium">{user.name}</p>
                                            <p className="text-sm">{user.email}</p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
};

export default show;

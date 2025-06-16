import CardListingPage from '@/components/diary/card-list';
import { DiaryFilterPanel } from '@/components/diary/diary-filter-panel';
import ShareModal from '@/components/share/share-modal';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RichTextEditor from '@/components/ui/rich-editor';
import AppLayout from '@/layouts/app-layout';
import { COLLECTION } from '@/lib/permissions';
import { dateTimeFormat } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { CategoryProp, CollectionProp, DATAMETA, DiaryListingItemProp, EmotionDetailProp, FILTERSORTPROP } from '@/types/types';
// import { DiaryGroupByProp, FilterProp, SortProp } from '@/types/types';
import { Head, Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Calendar, Edit, Save, Share2, Trash, Users } from 'lucide-react';
import { useState } from 'react';

const show = ({
    filterSort,
    collections,
    diaries,
    collection,
    categories,
    emotions,
    breadcrumbs,
    back,
    from = '',
    permissions = [],
    data : beData = {}
}: {
    filterSort: FILTERSORTPROP;
    diaries: { meta: DATAMETA; data: DiaryListingItemProp[] };
    collection: CollectionProp;
    collections: CollectionProp[];
    categories: CategoryProp[];
    emotions: EmotionDetailProp[];
    breadcrumbs: BreadcrumbItem[];
    back: string;
    from: string;
    permissions: string[];
    data: any
}) => {
    console.log(`${from}collection`);

    const [filterProp, setFilterProp] = useState(filterSort.filters);
    const [sortProp, setSortProp] = useState(filterSort.sorting);
    const [showShareBox, setShowShareBox] = useState<boolean>(false);
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const { data, setData, post, processing, errors } = useForm({
        title: collection.title,
        description: collection.description ?? '',
    });

    const handleDescriptionChange = (description: string) => {
        setData('description', description);
    };
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Collections" />

            <div className={`flex items-center justify-between px-6 pt-4`}>
                <Link href={back ?? route('collections.index')}>
                    <Button variant="outline" className="gap-1 bg-gray-700 text-gray-200 hover:bg-gray-600 hover:text-gray-100">
                        <ArrowLeft className="h-4 w-4" />
                        Back
                    </Button>
                </Link>
                <div className="flex items-center justify-center gap-3">
                    {permissions.includes(COLLECTION.edit) && (
                        <>
                            {isEditing ? (
                                <Button
                                    onClick={(e) => {
                                        router.put(
                                            route('collections.update', collection.id),
                                            {
                                                title: data.title,
                                                description: data.description,
                                            },
                                            {
                                                onFinish: () => {
                                                    setIsEditing(false);
                                                    router.reload();
                                                },
                                            },
                                        );
                                    }}
                                    variant="secondary"
                                    className="cursor-pointer"
                                >
                                    <Save className="h-4 w-4" />
                                    Save
                                </Button>
                            ) : (
                                <Button
                                    onClick={(e) => {
                                        setIsEditing(true);
                                    }}
                                    variant="secondary"
                                    className="cursor-pointer"
                                >
                                    <Edit className="h-4 w-4" />
                                    Edit
                                </Button>
                            )}
                        </>
                    )}

                    {permissions.includes(COLLECTION.delete) && (
                        <Button
                            variant="destructive"
                            className="cursor-pointer"
                            onClick={(e) => {
                                if (confirm('Are you sure to delete the collection?')) {
                                    router.delete(route('collections.delete', { collection: collection.id, back }));
                                }
                            }}
                        >
                            <Trash />
                            Delete
                        </Button>
                    )}
                </div>
            </div>

            {isEditing ? (
                <div className="mx-auto w-full space-y-6 p-6">
                    <Card className="p-4">
                        <div>
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                placeholder="Enter a title for your entry"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="description">Description</Label>
                            <RichTextEditor
                                placeholder="Start writing your content here..."
                                defaultValue={data.description}
                                onChange={handleDescriptionChange}
                                className="w-full"
                            />
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="mx-auto w-full space-y-6 p-6">
                    {/* Header Section */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-start justify-between">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-3">
                                        <div>
                                            <CardTitle className="text-2xl font-bold">{collection.title}</CardTitle>
                                        </div>
                                    </div>
                                    <div className="text-muted-foreground flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <Calendar className="h-4 w-4" />
                                            {dateTimeFormat(collection.created_at)}
                                        </div>
                                        {(permissions.includes(COLLECTION.share) && collection.shares?.length > 0) && (
                                            <div className="flex items-center gap-1">
                                                <Users className="h-4 w-4" />
                                                Shared with {collection.shares?.length} people
                                            </div>
                                        )}
                                    </div>
                                </div>
                                {permissions.includes(COLLECTION.share) && (
                                    <>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="flex w-auto cursor-pointer items-center gap-0 p-1"
                                            onClick={() => setShowShareBox(true)}
                                        >
                                            <Share2 className="mr-2 h-4 w-4" />
                                            Share
                                        </Button>
                                        <ShareModal
                                            url={route('collections.shares', collection.id)}
                                            card={collection}
                                            showShareBox={showShareBox}
                                            setShowShareBox={setShowShareBox}
                                        />
                                    </>
                                )}
                            </div>
                        </CardHeader>
                    </Card>

                    {/* Description */}
                    {collection?.description && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Content</CardTitle>
                            </CardHeader>
                            <CardContent className="rich-text-editor-container">
                                <div className="editor-content" dangerouslySetInnerHTML={{ __html: collection.description }}></div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Shared Users */}
                    {permissions.includes(COLLECTION.share) && collection.shares.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Shared With ({collection.shares.length} people) </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="list-outside list-decimal rounded-2xl px-2">
                                    {collection?.shares.map((user, index) => (
                                        <li key={index} >
                                            <div className="flex items-center">
                                                {user?.receiver?.name && <p className="text-sm font-medium mr-3">{user?.receiver?.name}: </p>}
                                                <p className="text-sm">{user.email}</p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>
            )}

            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <DiaryFilterPanel
                    filterProp={filterProp}
                    setFilterProp={setFilterProp}
                    sortProp={sortProp}
                    setSortProp={setSortProp}
                    endPoint={route('collections.show', collection.id)}
                    categories={categories}
                    emotions={emotions}
                    diaryCreateUrl={route('diaries.create', { collection: collection.id })}
                    permissions={permissions}
                />
                <CardListingPage
                    diaries={diaries}
                    collection={collection}
                    collections={collections}
                    groupBy={sortProp.type}
                    groupOrder={sortProp.order}
                    baseUrl={route('collections.show', collection.id)}
                    filterProp={filterProp}
                    sortProp={sortProp}
                    from={`${from}collection`}
                    data={beData}
                    permissions={permissions}
                />
            </div>
        </AppLayout>
    );
};

export default show;

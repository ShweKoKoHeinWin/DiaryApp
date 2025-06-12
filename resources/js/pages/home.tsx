import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { BookOpenText, FileImageIcon, Grid2x2, NotebookText, SmilePlus } from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Home',
        href: route('home', undefined, false),
    },
];

export default function Home({ diaries, collections, emotions, categories, files, sentDiaries, sentCollections, receivedDiaries, receivedCollections }) {
    const {auth} = usePage().props;
    console.log(diaries, collections, sentDiaries, sentCollections, receivedDiaries, receivedCollections);

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Home" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">

                {/* Stats Cards */}
                <div className="mb-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Created Diaries</CardTitle>
                            <BookOpenText className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{diaries}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Created Collections</CardTitle>
                            <NotebookText className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{collections}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Created Emotions</CardTitle>
                            <SmilePlus className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{emotions}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Created Categories</CardTitle>
                            <Grid2x2 className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{categories}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Total Diary Files</CardTitle>
                            <FileImageIcon className="text-muted-foreground h-5 w-5" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{files}</div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}

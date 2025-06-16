'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarDayDataProp } from '@/types/types';
import { Link } from '@inertiajs/react';
import { format } from 'date-fns';
import { BookOpenText, CalendarIcon, Eye, NotebookText } from 'lucide-react';

export function DayDisplay({ day }: {day: CalendarDayDataProp}) {
    if (!day) return <></>;
    return (
        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    <span>{day?.date ? format(day.date, 'PPPP') : ''}</span>
                    {day?.isToday && <span className="ml-2 rounded-full bg-blue-500 px-2 py-0.5 text-sm text-white">Today</span>}
                </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                {day.diaries > 0 ||
                day.collections > 0 ||
                day.sentDiaries > 0 ||
                day.sentCollections > 0 ||
                day.receivedDiaries > 0 ||
                day.receivedCollections > 0 ? (
                    <div className="space-y-4">
                        {day.diaries > 0 && (
                            <div className="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div className="flex items-center text-gray-500">
                                    <BookOpenText className="mr-1 h-4 w-4" />
                                    <span className="text-sm">Created Diaries : </span>
                                </div>
                                <Link href={route('diaries.index', {
                                    startDate: day.date,
                                    endDate: day.date
                                })} className="flex items-center justify-center gap-3">
                                    <h4 className="text-sm">{day.diaries}</h4> <Eye className="h-5 w-5 cursor-pointer" />
                                </Link>
                            </div>
                        )}
                        {day.collections > 0 && (
                            <div className="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div className="flex items-center text-gray-500">
                                    <NotebookText className="mr-1 h-4 w-4" />
                                    <span className="text-sm">Created Collections : </span>
                                </div>
                                <Link href={route('collections.index', {
                                    startDate: day.date,
                                    endDate: day.date
                                })} className="flex items-center justify-center gap-3">
                                    <h4 className="text-sm">{day.collections}</h4> <Eye className="h-5 w-5 cursor-pointer" />
                                </Link>
                            </div>
                        )}
                        {day.sentDiaries > 0 && (
                            <div className="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div className="flex items-center text-gray-500">
                                    <BookOpenText className="mr-1 h-4 w-4" />
                                    <span className="text-sm">Shared Diaries : </span>
                                </div>
                                <Link href={route('inbox-shares.shares', {
                                    startDate: day.date,
                                    endDate: day.date,
                                    type: 'diary'
                                })} className="flex items-center justify-center gap-3">
                                    <h4 className="text-sm">{day.sentDiaries}</h4> <Eye className="h-5 w-5 cursor-pointer" />
                                </Link>
                            </div>
                        )}
                        {day.sentCollections > 0 && (
                            <div className="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div className="flex items-center text-gray-500">
                                    <NotebookText className="mr-1 h-4 w-4" />
                                    <span className="text-sm">Shared Collections : </span>
                                </div>
                                <Link href={route('inbox-shares.shares', {
                                    startDate: day.date,
                                    endDate: day.date,
                                    type: 'collection'
                                })} className="flex items-center justify-center gap-3">
                                    <h4 className="text-sm">{day.sentCollections}</h4> <Eye className="h-5 w-5 cursor-pointer" />
                                </Link>
                            </div>
                        )}
                        {day.receivedDiaries > 0 && (
                            <div className="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div className="flex items-center text-gray-500">
                                    <BookOpenText className="mr-1 h-4 w-4" />
                                    <span className="text-sm">Received Diaries : </span>
                                </div>
                                <Link href={route('inbox-shares.inbox', {
                                    startDate: day.date,
                                    endDate: day.date,
                                    type: 'diary'
                                })} className="flex items-center justify-center gap-3">
                                    <h4 className="text-sm">{day.receivedDiaries}</h4> <Eye className="h-5 w-5 cursor-pointer" />
                                </Link>
                            </div>
                        )}
                        {day.receivedCollections > 0 && (
                            <div className="flex items-start gap-3 border-b pb-3 last:border-0">
                                <div className="flex items-center text-gray-500">
                                    <NotebookText className="mr-1 h-4 w-4" />
                                    <span className="text-sm">Received Collections : </span>
                                </div>
                                <Link href={route('inbox-shares.inbox', {
                                    startDate: day.date,
                                    endDate: day.date,
                                    type: 'collection'
                                })} className="flex items-center justify-center gap-3">
                                    <h4 className="text-sm">{day.receivedCollections}</h4> <Eye className="h-5 w-5 cursor-pointer" />
                                </Link>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="py-8 text-center text-gray-500">
                        <p>No action exists this day</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}

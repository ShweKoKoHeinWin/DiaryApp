import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AppLayout from '@/layouts/app-layout';
import { cn } from '@/lib/utils';
import { BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { DayDisplay } from './day-display';
import { CalendarDayDataProp } from '@/types/types';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Calendar',
        href: route('calendar', undefined, false),
    },
];

interface CalenderPageProp {
    days: CalendarDayDataProp[];
    month: number;
    year: number;
}

export default function Calendar({ days, month, year }: CalenderPageProp) {
    const [selectedDate, setSelectedDate] = useState(days.filter((d) => d?.isToday)[0]);
    const date = new Date();
    const selectYears = [];
    for (let y = date.getFullYear(); y > date.getFullYear() - 25; y--) {
      selectYears.push(y);
    }
    
    // Month names
    const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

    const routerAction = (routerMonth:number = month, routerYear: number = year) => {
        router.visit(route('calendar'), {
            method: 'get',
            data: {
                month: routerMonth,
                year: routerYear,
            }
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Calendar" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <div className="relative min-h-[100vh] flex-1 overflow-hidden rounded-xl md:min-h-min">
                    <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
                        <div className="rounded-lg border p-4 shadow-md">
                            <div className="mb-6 flex items-center justify-between">
                                <h2 className="text-xl font-semibold flex items-center gap-3">
                                    {monthNames[month - 1]}
                                    <Select value={`${year}`} onValueChange={(value) => {routerAction(month, +value)}}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select Year" />
                                        </SelectTrigger>
                                        <SelectContent className="max-h-[40vh]">
                                            {selectYears.map((y) => (
                                                <SelectItem key={y} value={`${y}`}>
                                                    <div className="flex items-center gap-2">{y}</div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </h2>
                                <div className="flex gap-2">
                                    <Button variant="outline" size="icon" onClick={() => routerAction(+month - 1)}>
                                        <ChevronLeft className="h-4 w-4" />
                                        <span className="sr-only">Previous month</span>
                                    </Button>
                                    <Button variant="outline" onClick={() => routerAction(+date.getMonth() + 1, date.getFullYear())}>
                                        Today
                                    </Button>
                                    <Button variant="outline" size="icon" onClick={() => routerAction(+month + 1)}>
                                        <ChevronRight className="h-4 w-4" />
                                        <span className="sr-only">Next month</span>
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-7 gap-1">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                                    <div key={day} className="rounded-md border py-2 text-center text-sm font-medium">
                                        {day}
                                    </div>
                                ))}

                                {days.map((day, index) => (
                                    <div key={index} className="aspect-square">
                                        {day ? (
                                            <button
                                                className={cn(
                                                    'flex h-full w-full cursor-pointer items-center justify-center rounded-md border text-sm transition-colors',
                                                    day.day !== selectedDate?.day && day.isToday && 'bg-blue-100 font-bold dark:bg-gray-600',
                                                    day.day === selectedDate?.day && 'bg-blue-500 text-white hover:bg-blue-600',
                                                )}
                                                onClick={() => setSelectedDate(day)}
                                            >
                                                {day.day}
                                            </button>
                                        ) : (
                                            <div className="h-full w-full border"></div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <DayDisplay day={selectedDate} />
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}

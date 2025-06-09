import { type ClassValue, clsx } from 'clsx';
import { format } from 'date-fns';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export const dateTimeFormat = (datetime: Date) : string => format(datetime, 'd-M-yyyy (EEE) h:mm a');

export const dateFormat = (date: Date) : string => format(date, 'd-M-yyyy (EEE)');

export const DiaryDetailRoute = (diary: number, inbox = null, outbox = null, user = null, collection = null): string => {
    return route('diaries.show', {
        diary,
        from : {
            inbox,
            outbox,
            user,
            collection
        }
    });
}
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { Button } from '../ui/button';
import { X } from 'lucide-react';

const ActiveFilters = ({ filterProp, setFilterProp, users = [] }) => {
    const [activeFiltersCount, setActiveFiltersCount] = useState(0);
    useEffect(() => {
        let count = Object.values(filterProp).filter((val) => {
            if (Array.isArray(val)) {
                return val.length > 0;
            }
            return !!val;
        }).length;

        setActiveFiltersCount(count);
    }, [filterProp]);
    if (activeFiltersCount === 0) return null;

    return (
        <div className="mt-2 flex flex-wrap gap-2">
            {filterProp.startDate && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>From: {format(filterProp.startDate, 'PP')}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { startDate, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove start date filter</span>
                    </Button>
                </div>
            )}
            {filterProp.endDate && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>To: {format(filterProp.endDate, 'PP')}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { endDate, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove end date filter</span>
                    </Button>
                </div>
            )}
            {filterProp.categories && filterProp.categories.length > 0 && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>Categories: {filterProp.categories.length}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { categories, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove categories filter</span>
                    </Button>
                </div>
            )}
            {filterProp.emotion && filterProp.emotion != 0 && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>Emotion: 1</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { emotion, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove emotions filter</span>
                    </Button>
                </div>
            )}
             {filterProp.sharer && users.length > 0 && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>Sharer: {users.filter(user => user.id == filterProp.sharer)[0]?.name}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { sharer, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove sharer filter</span>
                    </Button>
                </div>
            )}
            {filterProp.receiver && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>Receiver: {filterProp.receiver}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { receiver, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove receiver filter</span>
                    </Button>
                </div>
            )}
            {filterProp.type && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>Type: {filterProp.type === 'diary' ? 'Diary' : 'Collection'}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { type, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove type filter</span>
                    </Button>
                </div>
            )}
            {filterProp.shareType && (
                <div className="bg-muted flex items-center rounded-full px-2 py-1 text-xs">
                    <span>ShareType: {filterProp.shareType === 'shared' ? 'Shared To' : 'Received From'}</span>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-1 h-4 w-4 p-0"
                        onClick={() => {
                            let { shareType, ...rest } = filterProp;
                            setFilterProp(rest);
                        }}
                    >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove type filter</span>
                    </Button>
                </div>
            )}
        </div>
    );
};
export default ActiveFilters;

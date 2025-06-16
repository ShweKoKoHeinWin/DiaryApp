// export type DiaryCardData = {
//     id: number;
//     title: string;
//     content: string | null;
//     // categories: CategoryProp[];
//     // emotion: EmotionProp;
//     createdAt: Date;
//     shareCount: number;
//     files: any[],
//     fileCount: {
//         total: number,
//         types: {
//             [key: string]: number,
//         }
//     };
//     // user :
//     // receivers
//     // list_content
// };

export interface FilterProp {
    startDate?: Date | null;
    endDate?: Date | null;
    categories?: string[] | null;
    emotion?: number;
    query?: string;
    sharer?: string;
    type?: string;
    receiver?: string;
    shareType?: string;
}

export interface DiaryFormProp {
    title: string;
    content: string;
    categories: number[];
    emotion: number | null;
    files: NewFilesProp[];
    existingFiles?: string;
    captions: string[];
    [key: string]: any;
}

export interface NewFilesProp {
    id: string;
    file: File;
    caption: string;
    preview?: string;
}

export interface OldFileProp {
    id: number;
    caption: string;
    path: string;
    type: string;
}

// #####
// New Typing
export interface CategoryProp {
    id: number;
    name: string;
    created_at: Date;
}

export interface CollectionShortProp {
    id: number;
    title: string;
}

export interface CollectionProp {
    id: number;
    title: string;
    description: string | null;
    image: string | null;
    shares: ItemSharedRecords[];
    diary_count: number;
    created_at: Date;
}

export interface DiaryCollectionBoxProp {
    id: number;
    title: string;
}

export interface DiaryDetailProp {
    id: number;
    categories: CategoryProp[];
    content: string;
    collections: {
        id: number;
        title: string;
    }[];
    created_at: Date;
    emotion: EmotionDetailProp;
    files: {
        id: number;
        caption: string;
        type: string;
        path: string
    }[];
    shares: ItemSharedRecords[];
    title: string;
}

export interface DiaryListingItemProp {
    id: number;
    categories: CategoryProp[];
    collections: any[];
    content: string;
    created_at: Date;
    emotion: EmotionDetailProp;
    files: {
        total: number;
        countsByTypes: {
            [key: string]: number;
        };
    };
    shares: ItemSharedRecords[];
    title: string;
    [key: string]: any;
}

export interface EmotionDetailProp {
    id: number;
    created_at: Date;
    emoji: string | null;
    name: string;
}

export type SortTypeProp = 'date' | 'category' | 'title' | 'name';

export type SortOrderProp = 'asc' | 'desc';

export interface SortProp {
    type: SortTypeProp;
    order: SortOrderProp;
}

export interface ReceiverProp {
    id: number;
    name: string;
    // email: string;
}

export interface CalendarDayDataProp {
    date: string;
    day: string;
    isToday: boolean;
    diaries: number;
    collections: number;
    receivedDiaries: number;
    receivedCollections: number;
    sentDiaries: number;
    sentCollections: number;
}

export interface DATAMETA {
    current_page: number;
    from: number;
    late_page: number;
    links: {
        url: string;
        label: string;
        active: boolean;
    };
    path: string;
    per_page: number;
    to: number;
    total: number;
}

export interface FILTERSORTPROP {
    filters: FilterProp;
    sorting: SortProp;
}

export interface UserCardProp {
    id: number | null;
    name: string;
    email: string;
    diaries: {
        received: number;
        shared: number;
    };
    collections: {
        received: number;
        shared: number;
    };
    started_time: Date;
    items: {
        data: SharedOrReceivedDataItem[];
        meta: DATAMETA;
    };
}

export interface SharedOrReceivedDataItem {
    id: number;
    email: string;
    sharer: {
        id: number;
        name: string;
        email: string;
    };
    receiver: {
        id: number;
        name: string;
        email: string;
    } | null;
    item: DiaryListingItemProp | CollectionProp;
    type: 'collection' | 'diary';
    created_at: Date;
    isShare?: boolean;
}

interface ItemSharedRecords {
    id: number;
    email: string;
    receiver: UserDataProp | null;
}

export interface UserDataProp {
    id: number;
    email: string;
    name: string;
    email_verified_at: boolean;
    cv_image: string | null;
    created_at: Date;
}

export interface SharedItemDBProp {
    id: number,
    owner_id: number,
    receiver_id: number | null,
    email: string,
    shareable_type: string,
    shareable_id: number,
    created_at: Date,
    updated_at: Date
}
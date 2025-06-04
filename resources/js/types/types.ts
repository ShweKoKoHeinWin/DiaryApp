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
    id: number,
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
    // image?: string | null;
    shares: any[],
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
    collections: any[];
    created_at: Date;
    emotion: EmotionDetailProp;
    files: any[];
    shares: any[];
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
        total: number,
        countsByTypes: {
            [key: string]: number;
        }
    };
    shares: any[];
    title: string;
    [key: string]: any;
}

export interface EmotionDetailProp {
    id: number;
    created_at: Date;
    emoji: string | null;
    name: string;
}

export type SortTypeProp = 'date' | 'category' | 'title';

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
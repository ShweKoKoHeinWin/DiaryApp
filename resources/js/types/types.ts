export interface CategoryProp {
    id: number;
    name: string;
}

export interface EmotionProp {
    id: number;
    name: string;
    emoji: string;
}

export type DiaryCardData = {
    id: number;
    title: string;
    content: string | null;
    categories: CategoryProp[];
    emotion: EmotionProp;
    createdAt: Date;
    shareCount: number;
    files: any[],
    fileCount: {
        total: number,
        types: {
            [key: string]: number,
        }
    };
    // user : 
    // receivers
    // list_content
};

export interface FilterProp {
    startDate?: Date | null;
    endDate?: Date | null;
    categories?: number[] | null;
    emotion?: number;
    query?: string;
}

export interface SortProp {
    type: DiaryGroupByProp;
    order: SortOrder;
}

export type DiaryGroupByProp = 'date' | 'category' | 'title';

export type SortOrder = 'asc' | 'desc';

export interface DiaryFormProp {
    title: string;
    content: string;
    categories: number[];
    emotion: number | null;
    files: FileWithCaption[];
    existingFiles?: string;
    captions: string[];
    [key: string]: any;
}

export interface FileWithCaption {
    id: string;
    file: File;
    caption: string;
    preview?: string;
}

export interface DiaryOldFileProp {
    id: number,
    caption: string;
    path: string;
    type: string;
}
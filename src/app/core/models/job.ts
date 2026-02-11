export interface Job {
    id: number;
    name: string;
    contents: string;
    short_name: string;
    type: string;
    publication_date: string;
    model_type: string;
    locations: Location[];
    categories: Category[];
    level: Level[];
    tags: string[];
    refs: {
        landing_page: string;
    }
}

export interface Location {
    name: string;
}

export interface Category {
    name: string;
}

export interface Level {
    name: string;
    short_name: string;
}
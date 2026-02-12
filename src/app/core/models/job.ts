export interface Job {
    id: number;
    name: string;
    contents: string;
    short_name: string;
    publication_date: string;
    locations: Location[];
    refs: {
        landing_page: string;
    };
    company: {
        name: string;
    };
    salary?: {
        min: string;
        max: string;
        interval: string;
    };
}

export interface Location {
    name: string;
}
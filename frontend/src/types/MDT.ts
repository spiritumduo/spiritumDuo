interface MDT {
    id: string;
    pathway: {id: string, name: string};
    creator: {id: string; username: string; firstName: string; lastName: string;}
    createdAt: Date;
    plannedAt: Date;
    updatedAt: Date;
    location: string;
    clinicians: ({id: string; firstName: string; lastName: string; username: string;} | null)[];
}

export default MDT;

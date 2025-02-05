export interface ActivityModel {
    id: string;
    title: string;
    user: string;
    timestamp: Date;
    changes?: Change[];
    farm: string;
}

export interface Change {
    what: string;
    from: string;
    to: string;
}
  
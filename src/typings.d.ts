declare namespace Express {
    export interface Request {
        user: IUserPayload;
    }
}

interface IUserPayload {
    id: string;
    role: string;
}



import { String } from "aws-sdk/clients/appstream";

export type DynamoDBRecords = {
    date: string;
    'type-gameId': string;
    allTime: {
        correct: number;
        percentage: string;
        total: number;
        units: string;
        bankroll?: string;
    };
    today: {
        correct: number;
        percentage: string;
        total: number;
        units: string;
        bankroll_change?: string;
    }
}

export type SingleRecordResponse = {
    date: string;
    allTime: {
        correct: number;
        percentage: number;
        total: number;
        units: number;
    };
    today: {
        correct: number;
        percentage: number;
        total: number;
        units: number;
    }
}

export type RecordsResponse = {
    preds?: SingleRecordResponse[];
    picks?: SingleRecordResponse[];
    evPicks?: SingleRecordResponse[];
}

export enum RecordType {
    preds = 'preds',
    value = 'value',
    ev = 'ev',
    all = 'all'
}
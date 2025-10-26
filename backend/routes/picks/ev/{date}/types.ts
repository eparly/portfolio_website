export type PicksResponse = {
    date: string,
    gameId: number,
    hometeam: string,
    awayteam: string,
    actualOdds: number,
    pick: string,
    bet_size: number,
    season: string,
}

export type DynamoDBEVPicks = {
    date: string;
    'type-gameId': string;
    hometeam: string;
    awayteam: string;
    actual: string;
    pick: string;
    'bet_size': string;
    season: string;
}
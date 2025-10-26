import { DynamoDBService } from "../../../../dynamodb/DynamoDBService";
import { DynamoDBEVPicks, PicksResponse } from "./types";

export class PicksController {
    private readonly dynamoDbService: DynamoDBService

    constructor(dynamoDbService: DynamoDBService) {
        this.dynamoDbService = dynamoDbService
    }
    
    public async getEVPicks(date: string, type: string): Promise<PicksResponse[]> {
        try {
            const picks = await this.dynamoDbService.getPicks(date, type)
            console.log('Picks:', picks)
            const response: PicksResponse[] = (picks.Items as DynamoDBEVPicks[] || []).map((item) => {
                console.log(item['type-gameId'].split('::')[2])
                return {
                    date: item.date,
                    gameId: Number(item['type-gameId'].split('::')[2]),
                    hometeam: item.hometeam,
                    awayteam: item.awayteam,
                    actualOdds: Number(item.actual),
                    pick: item.pick,
                    bet_size: Number(item['bet_size']),
                    season: item.season,
                }
            })
            return response
        }
        catch (error) {
            console.error('Error fetching picks:', error)
            throw new Error('Error fetching picks')
        }
    }
}
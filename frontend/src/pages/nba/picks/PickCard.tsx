import React from 'react';
import teamColours from '../../../utils/teamColours';
import './PickCard.css';

interface PickData {
    date: string;
    gameId: number;
    hometeam: string;
    awayTeam: string;
    awayteam: string;
    actualOdds: number;
    impliedOdds: number;
    edge: number;
    pick: string;
    bet_size?: number; // Added optional bet_size for EV Picks
}

interface PickCardProps {
    pickData: PickData;
}

const PickCard: React.FC<PickCardProps> = ({ pickData }) => {
    const { hometeam, awayTeam, awayteam, actualOdds, pick, bet_size } = pickData;
    let awayTeamName = awayTeam? awayTeam : awayteam;
    const homeColour = teamColours[hometeam] || '#ccc';
    const awayColour = teamColours[awayTeamName] || '#ccc';


    return (
        <div className="pick-card">
            <div className="team-section">
                <div className="team" style={{ backgroundColor: homeColour }}>
                    <span>{hometeam}</span>
                </div>
                <div className='vs'>vs</div>
                <div className="team" style={{ backgroundColor: awayColour }}>
                    <span>{awayTeamName}</span>
                </div>
            </div>
            <div className="pick-details">
                <p>
                    <strong>Pick: {pick}</strong>
                </p>
                <p>
                    <strong>Odds: {actualOdds.toFixed(2)}</strong>
                </p>
                {bet_size && (
                    <p>
                        <strong>Bet Size: {bet_size.toFixed(2)}</strong>
                    </p>
                )}
            </div>
        </div>
    );
};

export default PickCard;

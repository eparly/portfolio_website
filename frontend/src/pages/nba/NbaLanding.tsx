import React, { useEffect } from 'react';
import './NbaLanding.css';
import { getData } from '../../services/apiService';
import WinPercentageChart from '../../components/Chart/WinPercentageChart';
import UnitsChart from '../../components/Chart/UnitsChart';
import BankrollChart from '../../components/Chart/BankrollChart';

const SEASONS = {
  "Season 1": { start: "2024-10-01", end: "2025-04-14" },
  "Season 2": { start: "2025-10-01", end: "2026-04-30" },
} as const; // Use 'as const' to infer literal types

type SeasonKey = keyof typeof SEASONS; // Define a type for the keys of SEASONS

const NbaLanding: React.FC = () => {
  const [record, setRecord] = React.useState<any>({});
  const [predictionRecordSummary, setPredictionRecordSummary] = React.useState<any>({});
  const [picksRecordSummary, setPicksRecordSummary] = React.useState<any>({});
  const [error, setError] = React.useState<string | null>(null);
  const [selectedSeason, setSelectedSeason] = React.useState<SeasonKey>("Season 2");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await getData('/record?type=all');
        console.log('result', result);
        setRecord(result);
        setPredictionRecordSummary(result.preds && Array.isArray(result.preds) && result.preds.length > 0 ? result.preds[0] : {});
        setPicksRecordSummary(result.picks && Array.isArray(result.picks) && result.picks.length > 0 ? result.picks[0] : {});
      } catch (error) {
        console.log('Error fetching data: ', error);
        setError('Error fetching data');
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const updateSeasonSummary = () => {
      const filteredPreds = filterDataBySeason(record, 'preds');
      const filteredPicks = filterDataBySeason(record, 'picks');
      
      if (filteredPreds.length > 0) {
        setPredictionRecordSummary(filteredPreds[0]);
      }

      if (filteredPicks.length > 0) {
        setPicksRecordSummary(filteredPicks[0]);
      }
    };

    updateSeasonSummary();
  }, [selectedSeason, record]);

  type RecordData = {
    preds?: { date: string }[];
    picks?: { date: string }[];
    evPicks?: { date: string }[];
  };

  const filterDataBySeason = (data: RecordData, key: 'preds' | 'picks' | 'evPicks') => {
    if (!data[key] || !Array.isArray(data[key])) return [];
    const { start, end } = SEASONS[selectedSeason];
    const response = data[key]!
      .filter((entry: any) => entry.date >= start && entry.date <= end)
      .map((entry: any) => ({
        ...entry,
        today: {
          percentage: entry.today?.percentage || 0,
          correct: entry.today?.correct || 0,
          total: entry.today?.total || 0,
          units: entry.today?.units || 0,
        },
        allTime: {
          percentage: entry.allTime?.percentage || 0,
          correct: entry.allTime?.correct || 0,
          total: entry.allTime?.total || 0,
          units: entry.allTime?.units || 0,
          bankroll: entry.allTime?.bankroll || 0,
        },
      }));
    return response;
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="nba-landing">
      <h1>NBA Picks and Records</h1>
      <p className="intro">
        Welcome to the NBA Picks section! Here, you'll find my daily picks, recent results, and my overall record for the season.
      </p>
      {/* Navigation Links */}
      <div className="links">
        <a href="/nba/predictions">Daily Predictions</a>
        <a href="/nba/picks">Daily Picks</a>
        <a href="/nba/ev-picks">EV Picks</a>
      </div>

      {/* Season Selector */}
      <div className="season-selector">
        <label htmlFor="season">Select Season: </label>
        <select
          id="season"
          value={selectedSeason}
          onChange={(e) => setSelectedSeason(e.target.value as SeasonKey)}
        >
          {Object.keys(SEASONS).map((season) => (
            <option key={season} value={season}>
              {season}
            </option>
          ))}
        </select>
      </div>

      {/* Record Summary Section */}
      {predictionRecordSummary.allTime ? (
        <div className="record-summary">
          <h2>Season Record - Predictions</h2>
          <p>Wins: {predictionRecordSummary.allTime.correct} | Losses: {predictionRecordSummary.allTime.total - predictionRecordSummary.allTime.correct}</p>
          <p>Winning Percentage: {(predictionRecordSummary.allTime.percentage * 100).toFixed(1)}%</p>
          <p>Units: {(predictionRecordSummary.allTime.units).toFixed(2)}</p>
          <h2>Season Record - Picks</h2>
          <p>Wins: {picksRecordSummary.allTime.correct} | Losses: {picksRecordSummary.allTime.total - picksRecordSummary.allTime.correct}</p>
          <p>Winning Percentage: {(picksRecordSummary.allTime.percentage * 100).toFixed(1)}%</p>
          <p>Units: {(picksRecordSummary.allTime.units).toFixed(2)}</p>
          <BankrollChart data={{
            evPicks: filterDataBySeason(record, 'evPicks'),
          }} />
          <UnitsChart data={{
            preds: filterDataBySeason(record, 'preds'),
            picks: filterDataBySeason(record, 'picks'),
          }} />
          <WinPercentageChart data={{
            preds: filterDataBySeason(record, 'preds'),
            picks: filterDataBySeason(record, 'picks'),
          }} />
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default NbaLanding;

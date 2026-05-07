import { supabase } from "@/app/lib/supabase/client";
import { Team, Player, Match, MatchEvent, StandingRow, PlayerStats } from "@/app/types/database";

// ============================================
// TEAMS
// ============================================

export async function getTeams(): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .order("group_name")
    .order("name");

  if (error) throw error;
  return data as unknown as Team[];
}

export async function getTeamById(id: string): Promise<Team | null> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as Team;
}

export async function getTeamsByGroup(groupName: string): Promise<Team[]> {
  const { data, error } = await supabase
    .from("teams")
    .select("*")
    .eq("group_name", groupName)
    .order("name");

  if (error) throw error;
  return data as unknown as Team[];
}

// ============================================
// PLAYERS
// ============================================

export async function getPlayersByTeam(teamId: string): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .eq("team_id", teamId)
    .order("position")
    .order("shirt_number");

  if (error) throw error;
  return data as unknown as Player[];
}

// ============================================
// MATCHES
// ============================================

export async function getMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .order("starts_at");

  if (error) throw error;
  return data as unknown as Match[];
}

export async function getMatchById(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq("id", id)
    .single();

  if (error) return null;
  return data as unknown as Match;
}

export async function getMatchesByTeam(teamId: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .or(`home_team_id.eq.${teamId},away_team_id.eq.${teamId}`)
    .order("starts_at");

  if (error) throw error;
  return data as unknown as Match[];
}

export async function getMatchesByPhase(phase: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq("phase", phase)
    .order("starts_at");

  if (error) throw error;
  return data as unknown as Match[];
}

export async function getMatchesByGroup(groupName: string): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(`
      *,
      home_team:teams!home_team_id(*),
      away_team:teams!away_team_id(*)
    `)
    .eq("phase", "group")
    .eq("group_name", groupName)
    .order("starts_at");

  if (error) throw error;
  return data as unknown as Match[];
}

// ============================================
// MATCH EVENTS
// ============================================

export async function getMatchEvents(matchId: string): Promise<MatchEvent[]> {
  const { data, error } = await supabase
    .from("match_events")
    .select(`
      *,
      player:players(*),
      team:teams(*)
    `)
    .eq("match_id", matchId)
    .order("minute", { ascending: true });

  if (error) throw error;
  return data as unknown as MatchEvent[];
}

// ============================================
// STANDINGS (computed from matches)
// ============================================

export async function getGroupStandings(groupName: string): Promise<StandingRow[]> {
  const teams = await getTeamsByGroup(groupName);
  const matches = await getMatchesByGroup(groupName);

  const standingsMap = new Map<string, StandingRow>();

  teams.forEach((team) => {
    standingsMap.set(team.id, {
      team,
      played: 0,
      won: 0,
      draw: 0,
      lost: 0,
      goals_for: 0,
      goals_against: 0,
      goal_difference: 0,
      points: 0,
    });
  });

  matches
    .filter((m) => m.status === "finished" || m.status === "live")
    .forEach((match) => {
      const home = standingsMap.get(match.home_team_id);
      const away = standingsMap.get(match.away_team_id);
      if (!home || !away) return;

      home.played += 1;
      away.played += 1;
      home.goals_for += match.home_score;
      home.goals_against += match.away_score;
      away.goals_for += match.away_score;
      away.goals_against += match.home_score;

      if (match.home_score > match.away_score) {
        home.won += 1;
        away.lost += 1;
        home.points += 3;
      } else if (match.home_score < match.away_score) {
        away.won += 1;
        home.lost += 1;
        away.points += 3;
      } else {
        home.draw += 1;
        away.draw += 1;
        home.points += 1;
        away.points += 1;
      }

      home.goal_difference = home.goals_for - home.goals_against;
      away.goal_difference = away.goals_for - away.goals_against;
    });

  return Array.from(standingsMap.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goal_difference !== a.goal_difference) return b.goal_difference - a.goal_difference;
    if (b.goals_for !== a.goals_for) return b.goals_for - a.goals_for;
    return a.team.name.localeCompare(b.team.name);
  });
}

// ============================================
// PLAYER STATS (computed from match_events)
// ============================================

export async function getPlayerStats(): Promise<PlayerStats[]> {
  const { data: events, error } = await supabase
    .from("match_events")
    .select(`
      *,
      player:players(*),
      team:teams(*)
    `);

  if (error) throw error;

  const statsMap = new Map<string, PlayerStats>();

  (events as unknown as MatchEvent[]).forEach((event) => {
    if (!event.player || !event.team) return;

    const existing = statsMap.get(event.player_id) || {
      player: event.player,
      team: event.team,
      goals: 0,
      assists: 0,
      mvp_awards: 0,
      yellow_cards: 0,
      red_cards: 0,
    };

    switch (event.event_type) {
      case "goal":
        existing.goals += 1;
        break;
      case "assist":
        existing.assists += 1;
        break;
      case "mvp":
        existing.mvp_awards += 1;
        break;
      case "yellow_card":
        existing.yellow_cards += 1;
        break;
      case "red_card":
        existing.red_cards += 1;
        break;
    }

    statsMap.set(event.player_id, existing);
  });

  return Array.from(statsMap.values());
}

export async function getTopScorers(limit = 20): Promise<PlayerStats[]> {
  const stats = await getPlayerStats();
  return stats.filter((s) => s.goals > 0).sort((a, b) => b.goals - a.goals).slice(0, limit);
}

export async function getTopAssists(limit = 20): Promise<PlayerStats[]> {
  const stats = await getPlayerStats();
  return stats.filter((s) => s.assists > 0).sort((a, b) => b.assists - a.assists).slice(0, limit);
}

export async function getTopMVP(limit = 20): Promise<PlayerStats[]> {
  const stats = await getPlayerStats();
  return stats.filter((s) => s.mvp_awards > 0).sort((a, b) => b.mvp_awards - a.mvp_awards).slice(0, limit);
}

export async function getTeamStats(teamId: string): Promise<PlayerStats[]> {
  const { data: events, error } = await supabase
    .from("match_events")
    .select(`
      *,
      player:players(*),
      team:teams(*)
    `)
    .eq("team_id", teamId);

  if (error) throw error;
  const typedEvents = events as unknown as MatchEvent[];

  const statsMap = new Map<string, PlayerStats>();

  typedEvents.forEach((event) => {
    if (!event.player || !event.team) return;

    const existing = statsMap.get(event.player_id) || {
      player: event.player,
      team: event.team,
      goals: 0,
      assists: 0,
      mvp_awards: 0,
      yellow_cards: 0,
      red_cards: 0,
    };

    switch (event.event_type) {
      case "goal":
        existing.goals += 1;
        break;
      case "assist":
        existing.assists += 1;
        break;
      case "mvp":
        existing.mvp_awards += 1;
        break;
      case "yellow_card":
        existing.yellow_cards += 1;
        break;
      case "red_card":
        existing.red_cards += 1;
        break;
    }

    statsMap.set(event.player_id, existing);
  });

  return Array.from(statsMap.values());
}

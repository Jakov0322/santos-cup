import { supabase } from "@/app/lib/supabase/client";
import { Team, Player, Match, MatchEvent, MvpNomination, MvpVote, StandingRow, PlayerStats } from "@/app/types/database";

const MATCH_DURATION_MINUTES = 30;

// ============================================
// TIME-BASED STATUS
// ============================================

export function computeMatchStatus(match: Match): Match {
  const now = new Date();
  const start = new Date(match.starts_at);
  const end = new Date(start.getTime() + MATCH_DURATION_MINUTES * 60 * 1000);

  let status = match.status;
  if (now >= start && now < end && match.status !== "finished") {
    status = "live";
  } else if (now >= end && match.status !== "finished") {
    status = "finished";
  }

  return { ...match, status };
}

export function applyAutoStatus(matches: Match[]): Match[] {
  return matches.map(computeMatchStatus);
}

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

export async function getTopYellowCards(limit = 20): Promise<PlayerStats[]> {
  const stats = await getPlayerStats();
  return stats.filter((s) => s.yellow_cards > 0).sort((a, b) => b.yellow_cards - a.yellow_cards).slice(0, limit);
}

export async function getTopRedCards(limit = 20): Promise<PlayerStats[]> {
  const stats = await getPlayerStats();
  return stats.filter((s) => s.red_cards > 0).sort((a, b) => b.red_cards - a.red_cards).slice(0, limit);
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

// ============================================
// ADMIN: ADD GOAL (+ update match score)
// ============================================

export async function addGoal(params: {
  matchId: string;
  playerId: string;
  teamId: string;
  minute: number;
  assistPlayerId?: string;
}): Promise<void> {
  const { error: goalErr } = await supabase.from("match_events").insert({
    match_id: params.matchId,
    player_id: params.playerId,
    team_id: params.teamId,
    event_type: "goal",
    minute: params.minute,
  });
  if (goalErr) throw goalErr;

  if (params.assistPlayerId) {
    const { error: assistErr } = await supabase.from("match_events").insert({
      match_id: params.matchId,
      player_id: params.assistPlayerId,
      team_id: params.teamId,
      event_type: "assist",
      minute: params.minute,
    });
    if (assistErr) throw assistErr;
  }

  const match = await getMatchById(params.matchId);
  if (!match) return;

  const isHome = params.teamId === match.home_team_id;
  const { error: updateErr } = await supabase
    .from("matches")
    .update({
      home_score: isHome ? match.home_score + 1 : match.home_score,
      away_score: isHome ? match.away_score : match.away_score + 1,
    })
    .eq("id", params.matchId);
  if (updateErr) throw updateErr;
}

// ============================================
// ADMIN: ADD CARD
// ============================================

export async function addCard(params: {
  matchId: string;
  playerId: string;
  teamId: string;
  cardType: "yellow_card" | "red_card";
  minute: number;
}): Promise<void> {
  const { error } = await supabase.from("match_events").insert({
    match_id: params.matchId,
    player_id: params.playerId,
    team_id: params.teamId,
    event_type: params.cardType,
    minute: params.minute,
  });
  if (error) throw error;
}

// ============================================
// MVP NOMINATIONS (admin)
// ============================================

export async function getMvpNominations(matchId: string): Promise<MvpNomination[]> {
  const { data, error } = await supabase
    .from("mvp_nominations")
    .select("*, player:players(*)")
    .eq("match_id", matchId);

  if (error) throw error;
  return data as unknown as MvpNomination[];
}

export async function setMvpNominations(
  matchId: string,
  playerIds: string[]
): Promise<void> {
  const { error: delErr } = await supabase
    .from("mvp_nominations")
    .delete()
    .eq("match_id", matchId);
  if (delErr) throw delErr;

  const inserts = playerIds.map((pid) => ({
    match_id: matchId,
    player_id: pid,
  }));

  const { error: insErr } = await supabase
    .from("mvp_nominations")
    .insert(inserts);
  if (insErr) throw insErr;
}

// ============================================
// MVP VOTES (users)
// ============================================

export async function castMvpVote(
  matchId: string,
  playerId: string,
  voterUid: string
): Promise<{ error: string | null }> {
  const { error } = await supabase.from("mvp_votes").insert({
    match_id: matchId,
    player_id: playerId,
    voter_uid: voterUid,
  });

  if (error) {
    if (error.code === "23505") {
      return { error: "Hai già votato per questa partita" };
    }
    return { error: error.message };
  }
  return { error: null };
}

export async function getMvpVotes(
  matchId: string
): Promise<{ player_id: string; count: number }[]> {
  const { data, error } = await supabase
    .from("mvp_votes")
    .select("player_id")
    .eq("match_id", matchId);

  if (error) throw error;

  const countMap = new Map<string, number>();
  (data ?? []).forEach((v) => {
    countMap.set(v.player_id, (countMap.get(v.player_id) ?? 0) + 1);
  });

  return Array.from(countMap.entries())
    .map(([player_id, count]) => ({ player_id, count }))
    .sort((a, b) => b.count - a.count);
}

export async function hasVoted(matchId: string, voterUid: string): Promise<boolean> {
  const { data } = await supabase
    .from("mvp_votes")
    .select("id")
    .eq("match_id", matchId)
    .eq("voter_uid", voterUid)
    .single();
  return !!data;
}

// ============================================
// FINALIZE MVP (called when match ends)
// ============================================

export async function finalizeMvp(matchId: string): Promise<void> {
  const votes = await getMvpVotes(matchId);
  if (votes.length === 0) return;

  const winnerId = votes[0].player_id;

  const { data: existing } = await supabase
    .from("match_events")
    .select("id")
    .eq("match_id", matchId)
    .eq("event_type", "mvp")
    .single();
  if (existing) return;

  const { data: player } = await supabase
    .from("players")
    .select("team_id")
    .eq("id", winnerId)
    .single();
  if (!player) return;

  await supabase.from("match_events").insert({
    match_id: matchId,
    player_id: winnerId,
    team_id: player.team_id,
    event_type: "mvp",
  });
}

// ============================================
// PLAYERS BY MULTIPLE TEAMS
// ============================================

export async function getPlayersByTeams(teamIds: string[]): Promise<Player[]> {
  const { data, error } = await supabase
    .from("players")
    .select("*")
    .in("team_id", teamIds)
    .order("team_id")
    .order("last_name");

  if (error) throw error;
  return data as unknown as Player[];
}

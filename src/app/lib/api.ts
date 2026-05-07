import { supabase } from "@/app/lib/supabase/client";
import { Team, Player, Match, MatchEvent, MvpNomination, StandingRow, PlayerStats } from "@/app/types/database";

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
  const rawMatches = await getMatchesByGroup(groupName);
  const matches = applyAutoStatus(rawMatches);

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
// ADMIN: FINISH MATCH (persist status + finalize MVP)
// ============================================

export async function finishMatch(matchId: string): Promise<void> {
  const { error } = await supabase
    .from("matches")
    .update({ status: "finished" })
    .eq("id", matchId);
  if (error) throw error;

  await finalizeMvp(matchId);
}

// ============================================
// ROUND-ROBIN GENERATOR
// ============================================

function generateRoundRobin(teamIds: string[]): [string, string][][] {
  const t = [...teamIds];
  if (t.length % 2 !== 0) t.push(""); // BYE placeholder

  const n = t.length;
  const rounds: [string, string][][] = [];

  for (let r = 0; r < n - 1; r++) {
    const round: [string, string][] = [];
    for (let i = 0; i < n / 2; i++) {
      const home = t[i];
      const away = t[n - 1 - i];
      if (home && away) round.push([home, away]);
    }
    rounds.push(round);
    // Rotate: fix first, rotate rest
    const last = t.pop()!;
    t.splice(1, 0, last);
  }

  return rounds;
}

// ============================================
// GENERATE FULL TOURNAMENT SCHEDULE
// ============================================

export async function generateTournamentSchedule(
  date: string
): Promise<void> {
  // Check if matches already exist
  const { count } = await supabase
    .from("matches")
    .select("id", { count: "exact", head: true });
  if (count && count > 0) throw new Error("Il calendario esiste già");

  const teamsA = await getTeamsByGroup("A");
  const teamsB = await getTeamsByGroup("B");

  if (teamsA.length < 2 || teamsB.length < 2)
    throw new Error("Servono almeno 2 squadre per girone");

  const roundsA = generateRoundRobin(teamsA.map((t) => t.id));
  const roundsB = generateRoundRobin(teamsB.map((t) => t.id));

  const SLOT_MS = 45 * 60 * 1000; // 30 min match + 15 min break
  const startMs = new Date(`${date}T10:00:00`).getTime();
  let slotIndex = 0;

  const inserts: {
    home_team_id: string;
    away_team_id: string;
    phase: string;
    group_name: string;
    field_number: number;
    starts_at: string;
    status: string;
    home_score: number;
    away_score: number;
  }[] = [];

  // Interleave group rounds: A1, B1, A2, B2, ...
  const maxRounds = Math.max(roundsA.length, roundsB.length);

  for (let r = 0; r < maxRounds; r++) {
    // Group A round
    if (r < roundsA.length) {
      const round = roundsA[r];
      for (let i = 0; i < round.length; i += 2) {
        const slotTime = new Date(startMs + slotIndex * SLOT_MS).toISOString();
        const pair = round.slice(i, i + 2);
        pair.forEach(([home, away], fi) => {
          inserts.push({
            home_team_id: home,
            away_team_id: away,
            phase: "group",
            group_name: "A",
            field_number: fi + 1,
            starts_at: slotTime,
            status: "scheduled",
            home_score: 0,
            away_score: 0,
          });
        });
        slotIndex++;
      }
    }
    // Group B round
    if (r < roundsB.length) {
      const round = roundsB[r];
      for (let i = 0; i < round.length; i += 2) {
        const slotTime = new Date(startMs + slotIndex * SLOT_MS).toISOString();
        const pair = round.slice(i, i + 2);
        pair.forEach(([home, away], fi) => {
          inserts.push({
            home_team_id: home,
            away_team_id: away,
            phase: "group",
            group_name: "B",
            field_number: fi + 1,
            starts_at: slotTime,
            status: "scheduled",
            home_score: 0,
            away_score: 0,
          });
        });
        slotIndex++;
      }
    }
  }

  const { error } = await supabase.from("matches").insert(inserts);
  if (error) throw error;
}

// ============================================
// AUTO-FINALIZE ENDED MATCHES
// ============================================

export async function autoFinalizeMatches(): Promise<void> {
  const { data: matches, error } = await supabase
    .from("matches")
    .select("*")
    .neq("status", "finished");
  if (error || !matches) return;

  const now = Date.now();
  const endMs = MATCH_DURATION_MINUTES * 60 * 1000;

  for (const m of matches) {
    const end = new Date(m.starts_at).getTime() + endMs;
    if (now < end) continue; // not ended yet

    // For knockout matches with a draw, don't auto-finalize
    // (admin must resolve the draw first by adding goals)
    if (m.phase !== "group" && m.home_score === m.away_score) continue;

    try {
      await finishMatch(m.id);
    } catch {
      // RLS may reject if not admin — that's OK
    }
  }
}

// ============================================
// AUTO-GENERATE KNOCKOUT ROUNDS
// ============================================

async function generateQuarterfinals(): Promise<void> {
  const standingsA = await getGroupStandings("A");
  const standingsB = await getGroupStandings("B");

  if (standingsA.length < 4 || standingsB.length < 4) return;

  const a1 = standingsA[0].team.id;
  const a2 = standingsA[1].team.id;
  const a3 = standingsA[2].team.id;
  const a4 = standingsA[3].team.id;
  const b1 = standingsB[0].team.id;
  const b2 = standingsB[1].team.id;
  const b3 = standingsB[2].team.id;
  const b4 = standingsB[3].team.id;

  // Pairings: 1A vs 4B, 1B vs 4A, 2A vs 3B, 2B vs 3A
  const pairings: [string, string][] = [
    [a1, b4],
    [b1, a4],
    [a2, b3],
    [b2, a3],
  ];

  // Find last group match time to schedule after
  const { data: lastGroup } = await supabase
    .from("matches")
    .select("starts_at")
    .eq("phase", "group")
    .order("starts_at", { ascending: false })
    .limit(1)
    .single();

  const SLOT_MS = 45 * 60 * 1000;
  const baseTime = lastGroup
    ? new Date(lastGroup.starts_at).getTime() + SLOT_MS
    : Date.now();

  const inserts = pairings.map(([home, away], i) => ({
    home_team_id: home,
    away_team_id: away,
    phase: "quarter",
    group_name: null as string | null,
    field_number: (i % 2) + 1,
    starts_at: new Date(baseTime + Math.floor(i / 2) * SLOT_MS).toISOString(),
    status: "scheduled",
    home_score: 0,
    away_score: 0,
  }));

  const { error } = await supabase.from("matches").insert(inserts);
  if (error) throw error;
}

async function generateSemifinals(qfMatches: Match[]): Promise<void> {
  // QF order: QF1 winner vs QF3 winner, QF2 winner vs QF4 winner
  const sorted = [...qfMatches].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
  const winners = sorted.map((m) =>
    m.home_score > m.away_score ? m.home_team_id : m.away_team_id
  );
  if (winners.length < 4) return;

  const pairings: [string, string][] = [
    [winners[0], winners[2]],
    [winners[1], winners[3]],
  ];

  const SLOT_MS = 45 * 60 * 1000;
  const lastQfTime = Math.max(
    ...sorted.map((m) => new Date(m.starts_at).getTime())
  );
  const baseTime = lastQfTime + SLOT_MS;

  const inserts = pairings.map(([home, away], i) => ({
    home_team_id: home,
    away_team_id: away,
    phase: "semi",
    group_name: null as string | null,
    field_number: i + 1,
    starts_at: new Date(baseTime).toISOString(),
    status: "scheduled",
    home_score: 0,
    away_score: 0,
  }));

  const { error } = await supabase.from("matches").insert(inserts);
  if (error) throw error;
}

async function generateFinal(sfMatches: Match[]): Promise<void> {
  const sorted = [...sfMatches].sort(
    (a, b) => new Date(a.starts_at).getTime() - new Date(b.starts_at).getTime()
  );
  const winners = sorted.map((m) =>
    m.home_score > m.away_score ? m.home_team_id : m.away_team_id
  );
  if (winners.length < 2) return;

  const SLOT_MS = 45 * 60 * 1000;
  const lastSfTime = Math.max(
    ...sorted.map((m) => new Date(m.starts_at).getTime())
  );

  const { error } = await supabase.from("matches").insert({
    home_team_id: winners[0],
    away_team_id: winners[1],
    phase: "final",
    group_name: null,
    field_number: 1,
    starts_at: new Date(lastSfTime + SLOT_MS).toISOString(),
    status: "scheduled",
    home_score: 0,
    away_score: 0,
  });
  if (error) throw error;
}

export async function autoGenerateNextRound(): Promise<void> {
  const allMatches = await getMatches();
  const withStatus = applyAutoStatus(allMatches);

  const groupMatches = withStatus.filter((m) => m.phase === "group");
  const qfMatches = withStatus.filter((m) => m.phase === "quarter");
  const sfMatches = withStatus.filter((m) => m.phase === "semi");
  const finalMatches = withStatus.filter((m) => m.phase === "final");

  // Groups done → generate quarterfinals
  if (
    groupMatches.length > 0 &&
    groupMatches.every((m) => m.status === "finished") &&
    qfMatches.length === 0
  ) {
    await generateQuarterfinals();
    return;
  }

  // QF done → generate semifinals
  if (
    qfMatches.length === 4 &&
    qfMatches.every((m) => m.status === "finished") &&
    sfMatches.length === 0
  ) {
    await generateSemifinals(qfMatches);
    return;
  }

  // SF done → generate final
  if (
    sfMatches.length === 2 &&
    sfMatches.every((m) => m.status === "finished") &&
    finalMatches.length === 0
  ) {
    await generateFinal(sfMatches);
  }
}

// ============================================
// SYNC TOURNAMENT (admin calls this on page load)
// ============================================

export async function syncTournament(): Promise<void> {
  await autoFinalizeMatches();
  await autoGenerateNextRound();
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

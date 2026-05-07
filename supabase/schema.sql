-- Santos Cup Tournament Database Schema
-- Run this in Supabase SQL Editor to create all tables

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TEAMS
-- ============================================
CREATE TABLE teams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  group_name TEXT NOT NULL CHECK (group_name IN ('A', 'B')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- PLAYERS
-- ============================================
CREATE TABLE players (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  shirt_number INT NOT NULL,
  position TEXT NOT NULL CHECK (position IN ('GK', 'DEF', 'MID', 'FWD')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MATCHES
-- ============================================
CREATE TABLE matches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  home_team_id UUID NOT NULL REFERENCES teams(id),
  away_team_id UUID NOT NULL REFERENCES teams(id),
  home_score INT NOT NULL DEFAULT 0,
  away_score INT NOT NULL DEFAULT 0,
  status TEXT NOT NULL DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'finished')),
  phase TEXT NOT NULL CHECK (phase IN ('group', 'quarter', 'semi', 'final')),
  group_name TEXT CHECK (group_name IN ('A', 'B')),
  field_number INT NOT NULL DEFAULT 1,
  starts_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MATCH EVENTS (goals, assists, cards, MVP)
-- ============================================
CREATE TABLE match_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id),
  team_id UUID NOT NULL REFERENCES teams(id),
  event_type TEXT NOT NULL CHECK (event_type IN ('goal', 'assist', 'yellow_card', 'red_card', 'mvp')),
  minute INT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- ADMIN USERS (checked against Supabase Auth uid)
-- ============================================
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_uid UUID NOT NULL UNIQUE,
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================
-- MVP NOMINATIONS (admin picks 3 candidates per match)
-- ============================================
CREATE TABLE mvp_nominations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, player_id)
);

-- ============================================
-- MVP VOTES (one vote per device per match)
-- ============================================
CREATE TABLE mvp_votes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  match_id UUID NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  player_id UUID NOT NULL REFERENCES players(id),
  voter_uid TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(match_id, voter_uid)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_players_team ON players(team_id);
CREATE INDEX idx_matches_home ON matches(home_team_id);
CREATE INDEX idx_matches_away ON matches(away_team_id);
CREATE INDEX idx_matches_status ON matches(status);
CREATE INDEX idx_matches_phase ON matches(phase);
CREATE INDEX idx_match_events_match ON match_events(match_id);
CREATE INDEX idx_match_events_player ON match_events(player_id);
CREATE INDEX idx_match_events_type ON match_events(event_type);
CREATE INDEX idx_mvp_nominations_match ON mvp_nominations(match_id);
CREATE INDEX idx_mvp_votes_match ON mvp_votes(match_id);
CREATE INDEX idx_mvp_votes_voter ON mvp_votes(voter_uid);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE mvp_nominations ENABLE ROW LEVEL SECURITY;
ALTER TABLE mvp_votes ENABLE ROW LEVEL SECURITY;

-- Public read
CREATE POLICY "Public read teams" ON teams FOR SELECT USING (true);
CREATE POLICY "Public read players" ON players FOR SELECT USING (true);
CREATE POLICY "Public read matches" ON matches FOR SELECT USING (true);
CREATE POLICY "Public read match_events" ON match_events FOR SELECT USING (true);
CREATE POLICY "Public read mvp_nominations" ON mvp_nominations FOR SELECT USING (true);
CREATE POLICY "Public read mvp_votes" ON mvp_votes FOR SELECT USING (true);
CREATE POLICY "Public read admin_users" ON admin_users FOR SELECT USING (true);

-- Admin write (authenticated users that exist in admin_users)
CREATE POLICY "Admin insert match_events" ON match_events FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_uid FROM admin_users));
CREATE POLICY "Admin update matches" ON matches FOR UPDATE
  USING (auth.uid() IN (SELECT auth_uid FROM admin_users));
CREATE POLICY "Admin insert mvp_nominations" ON mvp_nominations FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT auth_uid FROM admin_users));
CREATE POLICY "Admin delete mvp_nominations" ON mvp_nominations FOR DELETE
  USING (auth.uid() IN (SELECT auth_uid FROM admin_users));

-- Anyone can insert a vote (one per voter per match enforced by UNIQUE)
CREATE POLICY "Anyone can vote" ON mvp_votes FOR INSERT WITH CHECK (true);

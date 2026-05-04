type TeamName = string;

export type GeneratedMatch = {
  id: string;
  homeTeam: string;
  awayTeam: string;
  field: number;
  startsAt: string;
  phase: string;
};

const START_HOUR = 10;
const MATCH_DURATION = 25;

function generateTimeSlots(totalMatches: number) {
  const slots: {
    field: number;
    startsAt: string;
  }[] = [];

  let currentMinutes = START_HOUR * 60;

  for (let i = 0; i < totalMatches; i++) {
    const hours = Math.floor(currentMinutes / 60)
      .toString()
      .padStart(2, "0");

    const minutes = (currentMinutes % 60)
      .toString()
      .padStart(2, "0");

    slots.push({
      field: (i % 2) + 1,
      startsAt: `${hours}:${minutes}`,
    });

    if (i % 2 === 1) {
      currentMinutes += MATCH_DURATION;
    }
  }

  return slots;
}

export function generateGroups(
  teams: TeamName[],
  groupSize = 4
) {
  const groups: TeamName[][] = [];

  for (let i = 0; i < teams.length; i += groupSize) {
    groups.push(teams.slice(i, i + groupSize));
  }

  return groups;
}

export function generateGroupMatches(
  groups: TeamName[][]
): GeneratedMatch[] {
  const matches: GeneratedMatch[] = [];

  groups.forEach((group, groupIndex) => {
    const groupLetter = String.fromCharCode(65 + groupIndex);

    for (let i = 0; i < group.length; i++) {
      for (let j = i + 1; j < group.length; j++) {
        matches.push({
          id: crypto.randomUUID(),
          homeTeam: group[i],
          awayTeam: group[j],
          field: 1,
          startsAt: "",
          phase: `Girone ${groupLetter}`,
        });
      }
    }
  });

  const slots = generateTimeSlots(matches.length);

  return matches.map((match, index) => ({
    ...match,
    field: slots[index].field,
    startsAt: slots[index].startsAt,
  }));
}
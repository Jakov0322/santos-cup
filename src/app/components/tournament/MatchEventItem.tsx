import { MatchEvent } from "@/app/lib/tournament/events";

type MatchEventItemProps = {
  event: MatchEvent;
};

export function MatchEventItem({
  event,
}: MatchEventItemProps) {
  const getEventEmoji = () => {
    switch (event.type) {
      case "goal":
        return "⚽";
      case "yellow_card":
        return "🟨";
      case "red_card":
        return "🟥";
      case "start":
        return "▶️";
      case "end":
        return "⏹️";
      default:
        return "•";
    }
  };

  const getEventText = () => {
    switch (event.type) {
      case "goal":
        return `Gol di ${event.playerName}`;
      case "yellow_card":
        return `Ammonizione per ${event.playerName}`;
      case "red_card":
        return `Espulsione per ${event.playerName}`;
      case "start":
        return "Inizio partita";
      case "end":
        return "Fine partita";
      default:
        return "";
    }
  };

  return (
    <div className="flex gap-4">
      <div className="flex w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-slate-100 py-3 text-sm font-black text-[#062B55]">
        {event.minute}'
      </div>

      <div className="flex-1 rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-start gap-3">
          <div className="text-xl">
            {getEventEmoji()}
          </div>

          <div>
            <p className="font-bold text-[#062B55]">
              {getEventText()}
            </p>

            <p className="mt-1 text-sm text-slate-500">
              {event.teamName}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
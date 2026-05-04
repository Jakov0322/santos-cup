"use client";

import { useState } from "react";

import { toast } from "sonner";

import {
  MatchEventType,
} from "@/app/types/events";

import { Button } from "../ui/Button";

import { TextInput } from "../ui/TextInput";

import { useEventStore } from "@/app/lib/store/event-store";

type AdminMatchEventFormProps = {
  matchId: string;

  homeTeam: string;

  awayTeam: string;
};

export function AdminMatchEventForm({
  matchId,
  homeTeam,
  awayTeam,
}: AdminMatchEventFormProps) {
  const addEvent = useEventStore(
    (state) => state.addEvent
  );

  const [minute, setMinute] =
    useState("");

  const [playerName, setPlayerName] =
    useState("");

  const [teamName, setTeamName] =
    useState(homeTeam);

  const [type, setType] =
    useState<MatchEventType>("goal");

  const handleSubmit = () => {
    if (!minute || !playerName) {
      toast.error(
        "Compila tutti i campi"
      );

      return;
    }

    addEvent(
      matchId,
      Number(minute),
      type,
      playerName,
      teamName
    );

    toast.success(
      "Evento aggiunto"
    );

    setMinute("");
    setPlayerName("");
  };

  return (
    <div className="rounded-[32px] border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-2xl font-black text-[#062B55]">
        Nuovo evento
      </h2>

      <div className="mt-5 space-y-4">
        <TextInput
          label="Minuto"
          value={minute}
          onChange={setMinute}
          placeholder="14"
          type="number"
        />

        <TextInput
          label="Giocatore"
          value={playerName}
          onChange={setPlayerName}
          placeholder="Luca Bianchi"
        />

        <div>
          <label className="mb-2 block text-sm font-bold text-[#062B55]">
            Squadra
          </label>

          <select
            value={teamName}
            onChange={(e) =>
              setTeamName(
                e.target.value
              )
            }
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-4 outline-none"
          >
            <option value={homeTeam}>
              {homeTeam}
            </option>

            <option value={awayTeam}>
              {awayTeam}
            </option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-bold text-[#062B55]">
            Tipo evento
          </label>

          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() =>
                setType("goal")
              }
              className={`rounded-2xl px-3 py-4 text-sm font-bold ${
                type === "goal"
                  ? "bg-[#062B55] text-white"
                  : "bg-slate-100 text-[#062B55]"
              }`}
            >
              ⚽ Gol
            </button>

            <button
              type="button"
              onClick={() =>
                setType(
                  "yellow_card"
                )
              }
              className={`rounded-2xl px-3 py-4 text-sm font-bold ${
                type ===
                "yellow_card"
                  ? "bg-yellow-500 text-white"
                  : "bg-slate-100 text-[#062B55]"
              }`}
            >
              🟨 Giallo
            </button>

            <button
              type="button"
              onClick={() =>
                setType("red_card")
              }
              className={`rounded-2xl px-3 py-4 text-sm font-bold ${
                type ===
                "red_card"
                  ? "bg-red-600 text-white"
                  : "bg-slate-100 text-[#062B55]"
              }`}
            >
              🟥 Rosso
            </button>
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          fullWidth
        >
          Aggiungi evento
        </Button>
      </div>
    </div>
  );
}
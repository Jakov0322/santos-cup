"use client";

import { useState } from "react";

import { useForm } from "react-hook-form";

import { zodResolver } from "@hookform/resolvers/zod";

import { AppShell } from "../components/layout/AppShell";

import { SantosCard } from "../components/ui/SantosCard";

import { TextInput } from "../components/ui/TextInput";
import { teamService } from "../services/team-service";
import { Button } from "../components/ui/Button";
import { toast } from "sonner";
import { SectionTitle } from "../components/ui/SectionTitle";

import {
  RegisterFormData,
  registerSchema,
} from "../lib/validation/register-schema";

import { packages } from "../lib/payments/packages";

export default function RegisterPage() {
  const [loading, setLoading] =
    useState(false);

  const {
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver:
      zodResolver(registerSchema),

    defaultValues: {
      teamName: "",
      captainName: "",
      captainEmail: "",
      captainPhone: "",

      selectedPackage: "basic",

      players: Array.from(
        { length: 8 },
        () => ({
          name: "",
        })
      ),
    },
  });

  const form = watch();

  const onSubmit = async (
    data: RegisterFormData
  ) => {
setLoading(true);

const promise =
  teamService.registerTeam(data);

toast.promise(promise, {
  loading:
    "Registrazione squadra...",
  success:
    "Squadra registrata correttamente",
  error:
    "Errore registrazione",
});

await promise;

window.location.href = "/payment";
  };

  return (
    <AppShell>
      <section className="space-y-5">
        <SectionTitle
          title="Iscrizione squadra"
          subtitle="Registra la tua squadra per la Santos Cup"
        />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-5"
        >
          <SantosCard>
            <div className="space-y-4">
              <TextInput
                label="Nome squadra"
                placeholder="Es. Santos FC"
                value={form.teamName}
                onChange={(value) =>
                  setValue(
                    "teamName",
                    value
                  )
                }
                error={
                  errors.teamName?.message
                }
              />

              <TextInput
                label="Nome capitano"
                placeholder="Mario Rossi"
                value={form.captainName}
                onChange={(value) =>
                  setValue(
                    "captainName",
                    value
                  )
                }
                error={
                  errors.captainName
                    ?.message
                }
              />

              <TextInput
                label="Email capitano"
                placeholder="mario@email.com"
                value={form.captainEmail}
                onChange={(value) =>
                  setValue(
                    "captainEmail",
                    value
                  )
                }
                type="email"
                error={
                  errors.captainEmail
                    ?.message
                }
              />

              <TextInput
                label="Telefono capitano"
                placeholder="+39 333 0000000"
                value={form.captainPhone}
                onChange={(value) =>
                  setValue(
                    "captainPhone",
                    value
                  )
                }
                error={
                  errors.captainPhone
                    ?.message
                }
              />
            </div>
          </SantosCard>

          <SantosCard>
            <h2 className="text-xl font-bold text-[#062B55]">
              Giocatori
            </h2>

            <div className="mt-4 space-y-4">
              {form.players.map(
                (player, index) => (
                  <TextInput
                    key={index}
                    label={`Giocatore ${
                      index + 1
                    }`}
                    placeholder="Nome giocatore"
                    value={player.name}
                    onChange={(value) =>
                      setValue(
                        `players.${index}.name`,
                        value
                      )
                    }
                    error={
                      errors.players?.[
                        index
                      ]?.name?.message
                    }
                  />
                )
              )}
            </div>
          </SantosCard>

          <SantosCard>
            <h2 className="text-xl font-bold text-[#062B55]">
              Pacchetto
            </h2>

            <div className="mt-4 space-y-3">
              {packages.map((pkg) => {
                const selected =
                  form.selectedPackage ===
                  pkg.id;

                return (
                  <button
                    type="button"
                    key={pkg.id}
                    onClick={() =>
                      setValue(
                        "selectedPackage",
                        pkg.id
                      )
                    }
                    className={`w-full rounded-3xl border p-4 text-left transition ${
                      selected
                        ? "border-[#00C8E8] bg-cyan-50"
                        : "border-slate-200 bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-bold text-[#062B55]">
                          {pkg.name}
                        </p>

                        <p className="text-sm text-slate-500">
                          {
                            pkg.description
                          }
                        </p>
                      </div>

                      <p className="text-lg font-black text-[#062B55]">
                        €{pkg.price}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </SantosCard>

          <Button
            fullWidth
            loading={loading}
          >
            Continua al pagamento
          </Button>
        </form>
      </section>
    </AppShell>
  );
}
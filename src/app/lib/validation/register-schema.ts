import { z } from "zod";

export const registerSchema = z.object({
  teamName: z
    .string()
    .min(3, "Nome squadra troppo corto"),

  captainName: z
    .string()
    .min(3, "Nome capitano obbligatorio"),

  captainEmail: z
    .string()
    .email("Email non valida"),

  captainPhone: z
    .string()
    .min(8, "Telefono non valido"),

  selectedPackage: z
    .string(),

  players: z
    .array(
      z.object({
        name: z
          .string()
          .min(2, "Nome giocatore obbligatorio"),
      })
    )
    .min(8),
});

export type RegisterFormData =
  z.infer<typeof registerSchema>;
"use client";

import { useState } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
import { useRouter } from "next/navigation";

function getInputStyle(hasError) {
  return {
    marginTop: 4,
    width: "100%",
    padding: spacing.sm,
    borderRadius: 8,
    border: `1px solid ${hasError ? colors.error : colors.border}`,
    fontSize: 14,
  };
}

export default function NewHabitPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    frequency: "daily",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [saving, setSaving] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};

    if (!form.name.trim()) {
      newErrors.name = "Dê um nome para o hábito.";
    } else if (form.name.trim().length < 3) {
      newErrors.name = "Use pelo menos 3 caracteres.";
    }

    if (form.description && form.description.trim().length < 5) {
      newErrors.description =
        "Se for usar descrição, escreva pelo menos 5 caracteres.";
    }

    if (!form.frequency) {
      newErrors.frequency = "Escolha uma frequência.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setSaving(true);

    // aqui depois entra a chamada real de API
    setTimeout(() => {
      setSaving(false);
      setMessage("Hábito criado com sucesso (demo).");

      // opcional: voltar para a lista depois de um tempo
      setTimeout(() => {
        router.push("/app/habits");
      }, 800);
    }, 500);
  }

  return (
    <LayoutContainer maxWidth={720}>
      <section
        style={{
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
        }}
      >
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
            Novo hábito
          </h1>
          <p style={{ fontSize: 14, color: colors.textMuted }}>
            Crie um novo hábito para acompanhar no seu dia a dia.
          </p>
        </div>

        <Card>
          <form
            onSubmit={handleSubmit}
            noValidate
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
            }}
          >
            <label style={{ fontSize: 14 }}>
              Nome do hábito
              <input
                id="habit-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={!!errors.name}
                aria-describedby={errors.name ? "habit-name-error" : undefined}
                placeholder="Ex: Ler 10 páginas"
                style={getInputStyle(!!errors.name)}
              />
              {errors.name && (
                <p
                  id="habit-name-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.name}
                </p>
              )}
            </label>

            <label style={{ fontSize: 14 }}>
              Descrição (opcional)
              <textarea
                id="habit-description"
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={3}
                aria-invalid={!!errors.description}
                aria-describedby={
                  errors.description ? "habit-description-error" : undefined
                }
                placeholder="Detalhe o que você quer fazer e por quê..."
                style={{
                  ...getInputStyle(!!errors.description),
                  resize: "vertical",
                }}
              />
              {errors.description && (
                <p
                  id="habit-description-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.description}
                </p>
              )}
            </label>

            <label style={{ fontSize: 14 }}>
              Frequência
              <select
                id="habit-frequency"
                name="frequency"
                value={form.frequency}
                onChange={handleChange}
                aria-invalid={!!errors.frequency}
                aria-describedby={
                  errors.frequency ? "habit-frequency-error" : undefined
                }
                style={getInputStyle(!!errors.frequency)}
              >
                <option value="daily">Todos os dias</option>
                <option value="weekdays">Seg–Sex</option>
                <option value="custom">Personalizado</option>
              </select>
              {errors.frequency && (
                <p
                  id="habit-frequency-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.frequency}
                </p>
              )}
            </label>

            <p
              style={{
                fontSize: 12,
                color: colors.textMuted,
                marginTop: spacing.sm,
              }}
            >
              Na integração final, este formulário irá salvar o hábito na API e
              aparecer na lista de hábitos e no dashboard.
            </p>

            <div
              style={{
                marginTop: spacing.md,
                display: "flex",
                justifyContent: "flex-end",
                gap: spacing.sm,
              }}
            >
              <Button
                type="button"
                variant="secondary"
                onClick={() => router.push("/app/habits")}
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? "Salvando..." : "Salvar hábito"}
              </Button>
            </div>

            {message && (
              <p
                style={{
                  fontSize: 13,
                  color: colors.success,
                  marginTop: spacing.sm,
                }}
              >
                {message}
              </p>
            )}
          </form>
        </Card>
      </section>
    </LayoutContainer>
  );
}

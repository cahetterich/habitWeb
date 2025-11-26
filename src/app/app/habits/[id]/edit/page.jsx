// src/app/app/habits/[id]/edit/page.jsx
"use client";

import { useEffect, useState } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
import { useRouter } from "next/navigation";
import { getHabit, updateHabit, deleteHabit } from "@/services/habitsService";

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

const frequencyLabelMap = {
  daily: "Todos os dias",
  weekdays: "Seg–Sex",
  custom: "Personalizado",
};

export default function EditHabitPage({ params }) {
  const router = useRouter();
  const { id } = params;

  const [form, setForm] = useState({
    name: "",
    description: "",
    frequency: "daily",
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const habit = await getHabit(id);

        setForm({
          name: habit.name || "",
          description: habit.description || "",
          frequency: habit.frequency || "daily",
        });
      } catch (err) {
        console.error(err);
        setErrorMessage("Não foi possível carregar o hábito.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

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

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");
    setErrorMessage("");

    if (!validate()) return;

    setSaving(true);

    try {
      await updateHabit(id, {
        name: form.name.trim(),
        description: form.description.trim() || "",
        frequency: form.frequency,
        frequencyLabel: frequencyLabelMap[form.frequency],
      });

      setMessage("Hábito atualizado com sucesso!");
      setTimeout(() => {
        router.push("/app/habits");
      }, 800);
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Não foi possível atualizar o hábito.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    const ok = window.confirm(
      "Tem certeza que deseja excluir este hábito? Essa ação não pode ser desfeita."
    );
    if (!ok) return;

    setSaving(true);
    setErrorMessage("");
    setMessage("");

    try {
      await deleteHabit(id);
      router.push("/app/habits");
    } catch (err) {
      console.error(err);
      setErrorMessage(err.message || "Não foi possível excluir o hábito.");
      setSaving(false);
    }
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
            Editar hábito
          </h1>
          <p style={{ fontSize: 14, color: colors.textMuted }}>
            Ajuste o nome, descrição e frequência deste hábito.
          </p>
        </div>

        <Card>
          {loading ? (
            <p style={{ fontSize: 14, color: colors.textMuted }}>
              Carregando informações do hábito...
            </p>
          ) : (
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
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  style={getInputStyle(!!errors.name)}
                />
                {errors.name && (
                  <p
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
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  style={{
                    ...getInputStyle(!!errors.description),
                    resize: "vertical",
                  }}
                />
                {errors.description && (
                  <p
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
                  name="frequency"
                  value={form.frequency}
                  onChange={handleChange}
                  style={getInputStyle(!!errors.frequency)}
                >
                  <option value="daily">Todos os dias</option>
                  <option value="weekdays">Seg–Sex</option>
                  <option value="custom">Personalizado</option>
                </select>
                {errors.frequency && (
                  <p
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

              <div
                style={{
                  marginTop: spacing.md,
                  display: "flex",
                  justifyContent: "space-between",
                  gap: spacing.sm,
                  flexWrap: "wrap",
                }}
              >
                <Button
                  type="button"
                  variant="secondary"
                  onClick={handleDelete}
                  disabled={saving}
                >
                  Excluir hábito
                </Button>

                <div
                  style={{
                    display: "flex",
                    gap: spacing.sm,
                  }}
                >
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => router.push("/app/habits")}
                    disabled={saving}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={saving}>
                    {saving ? "Salvando..." : "Salvar alterações"}
                  </Button>
                </div>
              </div>

              {errorMessage && (
                <p
                  style={{
                    fontSize: 13,
                    color: colors.error,
                    marginTop: spacing.sm,
                  }}
                >
                  {errorMessage}
                </p>
              )}

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
          )}
        </Card>
      </section>
    </LayoutContainer>
  );
}

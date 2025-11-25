"use client";

import { useState } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
import Link from "next/link";

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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function validate() {
    if (!email.trim()) {
      setError("Informe o email da sua conta.");
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Informe um email válido.");
      return false;
    }

    setError("");
    return true;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setSubmitting(true);

    // aqui entra o fluxo real de recuperação de senha via API
    setTimeout(() => {
      setSubmitting(false);
      setMessage(
        "Se este email estiver cadastrado, enviaremos um link de recuperação."
      );
    }, 600);
  }

  return (
    <LayoutContainer maxWidth={420}>
      <section
        style={{
          paddingTop: spacing.xl,
          paddingBottom: spacing.xl,
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
        }}
      >
        <div>
          <h1
            style={{
              fontSize: 24,
              fontWeight: 600,
              marginBottom: 4,
              textAlign: "center",
            }}
          >
            Recuperar senha
          </h1>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: "center",
            }}
          >
            Informe o email cadastrado para enviarmos o link de redefinição.
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
              Email
              <input
                id="forgot-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={!!error}
                aria-describedby={error ? "forgot-email-error" : undefined}
                style={getInputStyle(!!error)}
              />
              {error && (
                <p
                  id="forgot-email-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {error}
                </p>
              )}
            </label>

            <div
              style={{
                marginTop: spacing.md,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" disabled={submitting}>
                {submitting ? "Enviando..." : "Enviar link"}
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

        <p
          style={{
            fontSize: 14,
            textAlign: "center",
            color: colors.textMuted,
          }}
        >
          Lembrou a senha? <Link href="/login">Voltar para o login</Link>
        </p>
      </section>
    </LayoutContainer>
  );
}

"use client";

import { useState } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

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

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};

    if (!form.email.trim()) {
      newErrors.email = "Informe seu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Informe um email válido.";
    }

    if (!form.password) {
      newErrors.password = "Informe sua senha.";
    } else if (form.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setSubmitting(true);

    // aqui entra a chamada real de login na API
    setTimeout(() => {
      // login fake no contexto
      login?.({
        name: "Carla",
        email: form.email,
      });

      setSubmitting(false);
      setMessage("Login realizado com sucesso (demo).");

      setTimeout(() => {
        router.push("/app/dashboard");
      }, 600);
    }, 500);
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
            Entrar
          </h1>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: "center",
            }}
          >
            Acesse sua conta HabitFlow para acompanhar seus hábitos.
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
                id="login-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "login-email-error" : undefined
                }
                style={getInputStyle(!!errors.email)}
              />
              {errors.email && (
                <p
                  id="login-email-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.email}
                </p>
              )}
            </label>

            <label style={{ fontSize: 14 }}>
              Senha
              <input
                id="login-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "login-password-error" : undefined
                }
                style={getInputStyle(!!errors.password)}
              />
              {errors.password && (
                <p
                  id="login-password-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.password}
                </p>
              )}
            </label>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: 13,
                marginTop: spacing.sm,
              }}
            >
              <Link href="/forgot-password">Esqueci minha senha</Link>
            </div>

            <div
              style={{
                marginTop: spacing.md,
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <Button type="submit" disabled={submitting}>
                {submitting ? "Entrando..." : "Entrar"}
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
          Ainda não tem conta?{" "}
          <Link href="/signup">Criar conta gratuitamente</Link>
        </p>
      </section>
    </LayoutContainer>
  );
}

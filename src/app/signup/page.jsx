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

export default function SignupPage() {
  const router = useRouter();
  const { login } = useAuth();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function validate() {
    const newErrors = {};

    if (!form.firstName.trim()) {
      newErrors.firstName = "Informe seu nome.";
    } else if (form.firstName.trim().length < 2) {
      newErrors.firstName = "Use pelo menos 2 caracteres.";
    }

    if (!form.lastName.trim()) {
      newErrors.lastName = "Informe seu sobrenome.";
    } else if (form.lastName.trim().length < 2) {
      newErrors.lastName = "Use pelo menos 2 caracteres.";
    }

    if (!form.email.trim()) {
      newErrors.email = "Informe seu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Informe um email válido.";
    }

    if (!form.password) {
      newErrors.password = "Crie uma senha.";
    } else if (form.password.length < 6) {
      newErrors.password = "Use pelo menos 6 caracteres.";
    }

    if (!form.confirmPassword) {
      newErrors.confirmPassword = "Confirme a senha.";
    } else if (form.password && form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "As senhas não conferem.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (!validate()) return;

    setSubmitting(true);

    // aqui entra a chamada real de cadastro na API no futuro
    setTimeout(() => {
      // login fake automático após cadastro
      login?.({
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email.trim(),
      });

      setSubmitting(false);
      setMessage("Conta criada com sucesso (demo).");

      setTimeout(() => {
        router.push("/app/dashboard");
      }, 700);
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
            Criar conta
          </h1>
          <p
            style={{
              fontSize: 14,
              color: colors.textMuted,
              textAlign: "center",
            }}
          >
            Comece a acompanhar seus hábitos em poucos segundos.
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
              Nome
              <input
                id="signup-first-name"
                type="text"
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                aria-invalid={!!errors.firstName}
                aria-describedby={
                  errors.firstName ? "signup-first-name-error" : undefined
                }
                style={getInputStyle(!!errors.firstName)}
              />
              {errors.firstName && (
                <p
                  id="signup-first-name-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.firstName}
                </p>
              )}
            </label>

            <label style={{ fontSize: 14 }}>
              Sobrenome
              <input
                id="signup-last-name"
                type="text"
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                aria-invalid={!!errors.lastName}
                aria-describedby={
                  errors.lastName ? "signup-last-name-error" : undefined
                }
                style={getInputStyle(!!errors.lastName)}
              />
              {errors.lastName && (
                <p
                  id="signup-last-name-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.lastName}
                </p>
              )}
            </label>

            <label style={{ fontSize: 14 }}>
              Email
              <input
                id="signup-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={!!errors.email}
                aria-describedby={
                  errors.email ? "signup-email-error" : undefined
                }
                style={getInputStyle(!!errors.email)}
              />
              {errors.email && (
                <p
                  id="signup-email-error"
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
                id="signup-password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                aria-invalid={!!errors.password}
                aria-describedby={
                  errors.password ? "signup-password-error" : undefined
                }
                style={getInputStyle(!!errors.password)}
              />
              {errors.password && (
                <p
                  id="signup-password-error"
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

            <label style={{ fontSize: 14 }}>
              Confirmar senha
              <input
                id="signup-confirm-password"
                type="password"
                name="confirmPassword"
                value={form.confirmPassword}
                onChange={handleChange}
                aria-invalid={!!errors.confirmPassword}
                aria-describedby={
                  errors.confirmPassword
                    ? "signup-confirm-password-error"
                    : undefined
                }
                style={getInputStyle(!!errors.confirmPassword)}
              />
              {errors.confirmPassword && (
                <p
                  id="signup-confirm-password-error"
                  style={{
                    fontSize: 12,
                    color: colors.error,
                    marginTop: 4,
                  }}
                >
                  {errors.confirmPassword}
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
                {submitting ? "Criando..." : "Criar conta"}
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
          Já tem conta? <Link href="/login">Entrar</Link>
        </p>
      </section>
    </LayoutContainer>
  );
}


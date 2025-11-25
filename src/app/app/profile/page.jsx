"use client";

import { useEffect, useState } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { colors, spacing } from "@/lib/designSystem";
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

export default function ProfilePage() {
  const { user } = useAuth();

  // ajuda a quebrar "Nome Sobrenome" quando vier de login simples
  function splitNameParts(name) {
    if (!name) return { first: "", last: "" };
    const parts = name.trim().split(" ");
    if (parts.length === 1) return { first: parts[0], last: "" };
    return {
      first: parts[0],
      last: parts.slice(1).join(" "),
    };
  }

  const initialParts = splitNameParts(user?.name);

  const [account, setAccount] = useState({
    firstName: user?.firstName || initialParts.first || "",
    lastName: user?.lastName || initialParts.last || "",
    email: user?.email || "",
  });

  const [theme, setTheme] = useState("light");
  const [notifications, setNotifications] = useState(true);

  const [accountMessage, setAccountMessage] = useState("");
  const [accountErrors, setAccountErrors] = useState({});

  const [passwordMessage, setPasswordMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordForm, setPasswordForm] = useState({
    current: "",
    next: "",
    confirm: "",
  });

  // se o usuário mudar (ex: depois de login), atualiza o formulário
  useEffect(() => {
    const parts = splitNameParts(user?.name);
    setAccount({
      firstName: user?.firstName || parts.first || "",
      lastName: user?.lastName || parts.last || "",
      email: user?.email || "",
    });
  }, [user]);

  function handleAccountChange(e) {
    const { name, value } = e.target;
    setAccount((prev) => ({ ...prev, [name]: value }));
  }

  function handlePasswordChange(e) {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  }

  function validateAccount() {
    const errors = {};

    if (!account.firstName.trim()) {
      errors.firstName = "Informe seu nome.";
    } else if (account.firstName.trim().length < 2) {
      errors.firstName = "Use pelo menos 2 caracteres.";
    }

    if (!account.lastName.trim()) {
      errors.lastName = "Informe seu sobrenome.";
    } else if (account.lastName.trim().length < 2) {
      errors.lastName = "Use pelo menos 2 caracteres.";
    }

    if (!account.email.trim()) {
      errors.email = "Informe seu email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(account.email)) {
      errors.email = "Informe um email válido.";
    }

    setAccountErrors(errors);
    return Object.keys(errors).length === 0;
  }

  function handleAccountSubmit(e) {
    e.preventDefault();
    setAccountMessage("");

    if (!validateAccount()) {
      return;
    }

    // aqui depois entra a chamada real de API + atualização do contexto
    setAccountMessage("Dados salvos com sucesso.");
    setTimeout(() => setAccountMessage(""), 3000);
  }

  function handlePasswordSubmit(e) {
    e.preventDefault();
    setPasswordError("");
    setPasswordMessage("");

    if (
      !passwordForm.current ||
      !passwordForm.next ||
      !passwordForm.confirm
    ) {
      setPasswordError("Preencha todos os campos de senha.");
      return;
    }

    if (passwordForm.next.length < 6) {
      setPasswordError("A nova senha deve ter pelo menos 6 caracteres.");
      return;
    }

    if (passwordForm.next !== passwordForm.confirm) {
      setPasswordError("A confirmação precisa ser igual à nova senha.");
      return;
    }

    // aqui depois entra a chamada real de API para troca de senha
    setPasswordMessage("Senha alterada com sucesso (demo).");
    setPasswordForm({ current: "", next: "", confirm: "" });

    setTimeout(() => setPasswordMessage(""), 3000);
  }

  const displayFirstName =
    account.firstName ||
    (user?.firstName ||
      splitNameParts(user?.name).first ||
      "U");

  const initialLetter = displayFirstName[0]?.toUpperCase() || "U";

  return (
    <LayoutContainer maxWidth={960}>
      <section
        style={{
          display: "flex",
          flexDirection: "column",
          gap: spacing.lg,
          paddingTop: spacing.lg,
          paddingBottom: spacing.xl,
        }}
      >
        {/* TÍTULO */}
        <div>
          <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 4 }}>
            Perfil
          </h1>
          <p style={{ fontSize: 14, color: colors.textMuted }}>
            Ajuste seus dados básicos, preferências e configurações de
            segurança da sua conta.
          </p>
        </div>

        {/* GRID: DADOS + PREFERÊNCIAS */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "minmax(0, 1.2fr) minmax(0, 1fr)",
            gap: spacing.lg,
          }}
        >
          {/* DADOS DA CONTA */}
          <Card>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: spacing.md,
                marginBottom: spacing.lg,
              }}
            >
              <div
                aria-hidden="true"
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 999,
                  backgroundColor: colors.primarySoft,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 600,
                  color: colors.primary,
                  fontSize: 18,
                }}
              >
                {initialLetter}
              </div>
              <div>
                <h2
                  style={{
                    fontSize: 16,
                    margin: 0,
                    marginBottom: 2,
                  }}
                >
                  Dados da conta
                </h2>
                <p
                  style={{
                    fontSize: 13,
                    margin: 0,
                    color: colors.textMuted,
                  }}
                >
                  Essas informações identificam você no HabitFlow.
                </p>
              </div>
            </div>

            <form
              onSubmit={handleAccountSubmit}
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
                  id="profile-first-name"
                  type="text"
                  name="firstName"
                  value={account.firstName}
                  onChange={handleAccountChange}
                  aria-invalid={!!accountErrors.firstName}
                  aria-describedby={
                    accountErrors.firstName
                      ? "profile-first-name-error"
                      : undefined
                  }
                  style={getInputStyle(!!accountErrors.firstName)}
                />
                {accountErrors.firstName && (
                  <p
                    id="profile-first-name-error"
                    style={{
                      fontSize: 12,
                      color: colors.error,
                      marginTop: 4,
                    }}
                  >
                    {accountErrors.firstName}
                  </p>
                )}
              </label>

              <label style={{ fontSize: 14 }}>
                Sobrenome
                <input
                  id="profile-last-name"
                  type="text"
                  name="lastName"
                  value={account.lastName}
                  onChange={handleAccountChange}
                  aria-invalid={!!accountErrors.lastName}
                  aria-describedby={
                    accountErrors.lastName
                      ? "profile-last-name-error"
                      : undefined
                  }
                  style={getInputStyle(!!accountErrors.lastName)}
                />
                {accountErrors.lastName && (
                  <p
                    id="profile-last-name-error"
                    style={{
                      fontSize: 12,
                      color: colors.error,
                      marginTop: 4,
                    }}
                  >
                    {accountErrors.lastName}
                  </p>
                )}
              </label>

              <label style={{ fontSize: 14 }}>
                Email
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  value={account.email}
                  onChange={handleAccountChange}
                  aria-invalid={!!accountErrors.email}
                  aria-describedby={
                    accountErrors.email ? "profile-email-error" : undefined
                  }
                  style={getInputStyle(!!accountErrors.email)}
                />
                {accountErrors.email && (
                  <p
                    id="profile-email-error"
                    style={{
                      fontSize: 12,
                      color: colors.error,
                      marginTop: 4,
                    }}
                  >
                    {accountErrors.email}
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
                <Button type="submit">Salvar alterações</Button>
              </div>

              {accountMessage && (
                <p
                  style={{
                    fontSize: 13,
                    color: colors.success,
                    marginTop: spacing.sm,
                  }}
                >
                  {accountMessage}
                </p>
              )}
            </form>
          </Card>

          {/* PREFERÊNCIAS */}
          <Card>
            <h2
              style={{
                fontSize: 16,
                marginTop: 0,
                marginBottom: spacing.sm,
              }}
            >
              Preferências
            </h2>
            <p
              style={{
                fontSize: 13,
                color: colors.textMuted,
                marginTop: 0,
                marginBottom: spacing.md,
              }}
            >
              Personalize a experiência visual e de notificações.
            </p>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: spacing.md,
              }}
            >
              <label style={{ fontSize: 14 }}>
                Tema
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  style={getInputStyle(false)}
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </label>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: spacing.sm,
                  fontSize: 14,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  style={{ cursor: "pointer" }}
                />
                Receber lembretes e novidades por email
              </label>

              <p
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                  marginTop: spacing.sm,
                }}
              >
                Essas opções são ilustrativas nesta versão demo. Na integração
                final, serão salvas junto com a sua conta.
              </p>
            </div>
          </Card>
        </div>

        {/* SEGURANÇA / SENHA */}
        <Card>
          <h2
            style={{
              fontSize: 16,
              marginTop: 0,
              marginBottom: spacing.sm,
            }}
          >
            Segurança
          </h2>
          <p
            style={{
              fontSize: 13,
              color: colors.textMuted,
              marginTop: 0,
              marginBottom: spacing.md,
            }}
          >
            Altere sua senha com segurança. Na versão final, essa ação será
            validada no servidor.
          </p>

          <form
            onSubmit={handlePasswordSubmit}
            noValidate
            style={{
              display: "flex",
              flexDirection: "column",
              gap: spacing.md,
              maxWidth: 480,
            }}
          >
            <label style={{ fontSize: 14 }}>
              Senha atual
              <input
                type="password"
                name="current"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                style={getInputStyle(false)}
              />
            </label>

            <label style={{ fontSize: 14 }}>
              Nova senha
              <input
                type="password"
                name="next"
                value={passwordForm.next}
                onChange={handlePasswordChange}
                style={getInputStyle(false)}
              />
            </label>

            <label style={{ fontSize: 14 }}>
              Confirmar nova senha
              <input
                type="password"
                name="confirm"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                style={getInputStyle(false)}
              />
            </label>

            <div
              style={{
                marginTop: spacing.md,
                display: "flex",
                gap: spacing.md,
                alignItems: "center",
              }}
            >
              <Button type="submit">Atualizar senha</Button>
              <span
                style={{
                  fontSize: 12,
                  color: colors.textMuted,
                }}
              >
                Recomenda-se usar pelo menos 6 caracteres.
              </span>
            </div>

            {passwordError && (
              <p
                style={{
                  fontSize: 13,
                  color: colors.error,
                  marginTop: spacing.sm,
                }}
              >
                {passwordError}
              </p>
            )}
            {passwordMessage && (
              <p
                style={{
                  fontSize: 13,
                  color: colors.success,
                  marginTop: spacing.sm,
                }}
              >
                {passwordMessage}
              </p>
            )}
          </form>
        </Card>
      </section>
    </LayoutContainer>
  );
}

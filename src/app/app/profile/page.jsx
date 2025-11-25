"use client";

import { useEffect, useState } from "react";
import LayoutContainer from "@/components/LayoutContainer";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { useAuth } from "@/context/AuthContext";
import "@/styles/profile.css";

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
      <section className="hf-profile-section">
        {/* Título */}
        <div className="hf-profile-header">
          <h1 className="hf-profile-title">Perfil</h1>
          <p className="hf-profile-subtitle">
            Ajuste seus dados básicos, preferências e configurações de
            segurança da sua conta.
          </p>
        </div>

        {/* GRID: DADOS + PREFERÊNCIAS */}
        <div className="hf-profile-grid">
          {/* DADOS DA CONTA */}
          <Card>
            <div className="hf-account-header">
              <div aria-hidden="true" className="hf-profile-avatar">
                {initialLetter}
              </div>
              <div>
                <h2 className="hf-account-title">Dados da conta</h2>
                <p className="hf-account-subtitle">
                  Essas informações identificam você no HabitFlow.
                </p>
              </div>
            </div>

            <form onSubmit={handleAccountSubmit} noValidate className="hf-profile-form">
              <label className="hf-profile-label">
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
                  className={`hf-profile-input ${accountErrors.firstName ? "has-error" : ""}`}
                />
                {accountErrors.firstName && (
                  <p id="profile-first-name-error" className="hf-profile-error">
                    {accountErrors.firstName}
                  </p>
                )}
              </label>

              <label className="hf-profile-label">
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
                  className={`hf-profile-input ${accountErrors.lastName ? "has-error" : ""}`}
                />
                {accountErrors.lastName && (
                  <p id="profile-last-name-error" className="hf-profile-error">
                    {accountErrors.lastName}
                  </p>
                )}
              </label>

              <label className="hf-profile-label">
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
                  className={`hf-profile-input ${accountErrors.email ? "has-error" : ""}`}
                />
                {accountErrors.email && (
                  <p id="profile-email-error" className="hf-profile-error">
                    {accountErrors.email}
                  </p>
                )}
              </label>

              <div className="hf-profile-actions">
                <Button type="submit">Salvar alterações</Button>
              </div>

              {accountMessage && (
                <p className="hf-profile-success">{accountMessage}</p>
              )}
            </form>
          </Card>

          {/* PREFERÊNCIAS */}
          <Card>
            <h2 className="hf-preferences-title">Preferências</h2>
            <p className="hf-preferences-subtitle">
              Personalize a experiência visual e de notificações.
            </p>

            <div className="hf-preferences-fields">
              <label className="hf-profile-label">
                Tema
                <select
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  className="hf-profile-input"
                >
                  <option value="light">Claro</option>
                  <option value="dark">Escuro</option>
                </select>
              </label>

              <label className="hf-preferences-checkbox">
                <input
                  type="checkbox"
                  checked={notifications}
                  onChange={(e) => setNotifications(e.target.checked)}
                  className="hf-checkbox-input"
                />
                Receber lembretes e novidades por email
              </label>

              <p className="hf-preferences-hint">
                Essas opções são ilustrativas nesta versão demo. Na integração
                final, serão salvas junto com a sua conta.
              </p>
            </div>
          </Card>
        </div>

        {/* SEGURANÇA / SENHA */}
        <Card>
          <h2 className="hf-security-title">Segurança</h2>
          <p className="hf-security-subtitle">
            Altere sua senha com segurança. Na versão final, essa ação será
            validada no servidor.
          </p>

          <form onSubmit={handlePasswordSubmit} noValidate className="hf-security-form">
            <label className="hf-profile-label">
              Senha atual
              <input
                type="password"
                name="current"
                value={passwordForm.current}
                onChange={handlePasswordChange}
                className="hf-profile-input"
              />
            </label>

            <label className="hf-profile-label">
              Nova senha
              <input
                type="password"
                name="next"
                value={passwordForm.next}
                onChange={handlePasswordChange}
                className="hf-profile-input"
              />
            </label>

            <label className="hf-profile-label">
              Confirmar nova senha
              <input
                type="password"
                name="confirm"
                value={passwordForm.confirm}
                onChange={handlePasswordChange}
                className="hf-profile-input"
              />
            </label>

            <div className="hf-security-actions">
              <Button type="submit">Atualizar senha</Button>
              <span className="hf-security-tip">
                Recomenda-se usar pelo menos 6 caracteres.
              </span>
            </div>

            {passwordError && (
              <p className="hf-security-error">{passwordError}</p>
            )}
            {passwordMessage && (
              <p className="hf-security-success">{passwordMessage}</p>
            )}
          </form>
        </Card>
      </section>
    </LayoutContainer>
  );
}

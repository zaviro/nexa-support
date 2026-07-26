"use client";

import { type ChangeEvent, type FormEvent, useState } from "react";
import { catalog } from "~/i18n/catalog";
import { useLocale } from "~/i18n/locale-provider";
import { LocalizedText } from "~/i18n/localized-text";

type LoginValues = {
  email: string;
  password: string;
};

type LoginErrors = {
  email?: "required" | "invalid";
  password?: "required";
};

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const enLogin = catalog.en.login;
const zhCNLogin = catalog["zh-CN"].login;

function validateLogin(values: LoginValues): LoginErrors {
  const errors: LoginErrors = {};
  const email = values.email.trim();

  if (email.length === 0) {
    errors.email = "required";
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "invalid";
  }

  if (values.password.trim().length === 0) {
    errors.password = "required";
  }

  return errors;
}

export function LoginForm() {
  const { copy } = useLocale();
  const [values, setValues] = useState<LoginValues>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<LoginErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const emailError =
    errors.email === "required"
      ? copy.login.emailRequired
      : copy.login.emailInvalid;

  function onTextChange(event: ChangeEvent<HTMLInputElement>) {
    const field = event.currentTarget.name as keyof LoginValues;
    const value = event.currentTarget.value;

    setValues((currentValues) => ({
      ...currentValues,
      [field]: value,
    }));
    setErrors((currentErrors) => {
      if (currentErrors[field] === undefined) {
        return currentErrors;
      }

      const nextErrors = { ...currentErrors };
      delete nextErrors[field];
      return nextErrors;
    });
    setSubmitted(false);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validateLogin(values);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setErrors({});
    setSubmitted(true);
  }

  return (
    <form className="login-form" noValidate onSubmit={onSubmit}>
      <div className="login-form__field">
        <label className="login-form__label" htmlFor="login-email">
          <LocalizedText en={enLogin.emailLabel} zhCN={zhCNLogin.emailLabel} />
        </label>
        <input
          aria-describedby={errors.email ? "login-email-error" : undefined}
          aria-invalid={Boolean(errors.email)}
          autoComplete="username"
          className="login-form__input"
          id="login-email"
          name="email"
          onChange={onTextChange}
          type="email"
          value={values.email}
        />
        <div className="login-form__error-slot">
          {errors.email ? (
            <p
              className="login-form__error"
              id="login-email-error"
              role="alert"
            >
              {emailError}
            </p>
          ) : null}
        </div>
      </div>

      <div className="login-form__field">
        <label className="login-form__label" htmlFor="login-password">
          <LocalizedText
            en={enLogin.passwordLabel}
            zhCN={zhCNLogin.passwordLabel}
          />
        </label>
        <input
          aria-describedby={
            errors.password ? "login-password-error" : undefined
          }
          aria-invalid={Boolean(errors.password)}
          autoComplete="current-password"
          className="login-form__input"
          id="login-password"
          name="password"
          onChange={onTextChange}
          type="password"
          value={values.password}
        />
        <div className="login-form__error-slot">
          {errors.password ? (
            <p
              className="login-form__error"
              id="login-password-error"
              role="alert"
            >
              {copy.login.passwordRequired}
            </p>
          ) : null}
        </div>
      </div>

      <label className="login-form__remember">
        <input name="remember" type="checkbox" />
        <span>
          <LocalizedText en={enLogin.rememberMe} zhCN={zhCNLogin.rememberMe} />
        </span>
      </label>

      <button className="login-form__submit" type="submit">
        <LocalizedText en={enLogin.submit} zhCN={zhCNLogin.submit} />
      </button>

      {submitted ? (
        <p aria-live="polite" className="login-form__outcome" role="status">
          {copy.login.demoOutcome}
        </p>
      ) : null}
    </form>
  );
}

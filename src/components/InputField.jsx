import { useState } from "react";
import PropTypes from "prop-types";
import { FaEye, FaEyeSlash, FaTimes } from "react-icons/fa";

export default function InputField({
  // identificação/tipo
  id,
  name,
  type = "text",
  placeholder = "",

  // aparência básica
  bgColor = "#FFFFFF",
  textColor = "#111827",
  borderColor = "#E5E7EB",
  borderSize = 1,
  rounded = 12,
  shadow = false,

  // estados
  status = "default",           // "default" | "error" | "success" | "warning"
  errorText = "",               // mensagem abaixo do campo quando status="error"

  // composição
  prefix = null,                // ícone/elemento à esquerda do input
  suffix = null,                // ícone/elemento à direita do input

  // interação/apresentação
  eyeButton = false,
  clearButton = false,
  onEnter,

  // controle de valor
  value,
  defaultValue,
  onChange,

  // disponibilidade e restrições
  disabled = false,
  readOnly = false,

  // padrões React/estilo
  className = "",
  inputClassName = "",
  style = {},
  ...rest
}) {
  // controle de visibilidade para senha
  const [showPassword, setShowPassword] = useState(false);

  // estado interno quando não-controlado
  const [internalValue, setInternalValue] = useState(defaultValue || "");

  // detecção de modo controlado
  const isControlled = value !== undefined;
  const currentValue = isControlled ? value : internalValue;

  // sombra do wrapper
  const wrapperShadow = shadow ? "shadow-md" : "shadow-none";

  // tipo computado (aplica alternância de senha quando eyeButton ligado)
  const computedType =
    type === "password" && eyeButton ? (showPassword ? "text" : "password") : type;

  // mapa de status → cor de borda
  const statusBorderMap = {
    error: "#DC2626",
    success: "#16A34A",
    warning: "#D97706",
  };
  const appliedBorderColor =
    status !== "default" ? statusBorderMap[status] : borderColor;

  // estilo inline consolidado no wrapper (cores, borda, raio, etc.)
  const mergedStyle = {
    backgroundColor: bgColor,
    color: textColor,
    borderColor: appliedBorderColor,
    borderWidth: `${parseFloat(borderSize) || 0}px`,
    borderStyle: "solid",
    borderRadius: `${parseFloat(rounded) || 0}px`,
    ...style,
  };

  // sincroniza valor interno/externo e propaga onChange
  const handleChange = (e) => {
    if (!isControlled) setInternalValue(e.target.value);
    onChange && onChange(e);
  };

  // tecla Enter dispara callback opcional
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onEnter) onEnter(e);
  };

  // limpa valor, respeitando modo controlado
  const handleClear = () => {
    if (!isControlled) setInternalValue("");
    onChange && onChange({ target: { value: "" } });
  };

  // computa necessidade dos botões auxiliares
  const needsEye = eyeButton && type === "password";
  const needsClear = clearButton && !!currentValue && !disabled && !readOnly;

  // padding-right do input para não sobrepor ícones/botões
  const prClass =
    needsEye && needsClear ? "pr-16" : (needsEye || needsClear) ? "pr-9" : "";

  return (
    <div className="w-full">
      <div
        className={[
          "relative flex items-center transition duration-150",
          wrapperShadow,
          className,
        ].filter(Boolean).join(" ")}
        style={mergedStyle}
      >
        {prefix && (
          <span className="ml-2 inline-flex items-center text-gray-500">
            {prefix}
          </span>
        )}

        <input
          id={id}
          name={name}
          type={computedType}
          placeholder={placeholder || undefined}
          value={currentValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          readOnly={readOnly}
          className={[
            "flex-1 bg-transparent outline-none px-2 py-2",
            prClass,
            prefix ? "pl-2" : "",
            inputClassName,
          ].filter(Boolean).join(" ")}
          style={{ color: textColor }}
          {...rest}
        />

        {needsClear && (
          <button
            type="button"
            onClick={handleClear}
            className="absolute top-1/2 -translate-y-1/2 right-2 flex items-center justify-center p-0 m-0 border-0 bg-transparent
                       focus:outline-none hover:outline-none active:outline-none focus:ring-0"
            style={{
              color: textColor,
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              WebkitAppearance: "none",
              appearance: "none",
            }}
            aria-label="Limpar"
          >
            <FaTimes className="h-4 w-4 pointer-events-none" />
          </button>
        )}

        {needsEye && (
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className={[
              "absolute top-1/2 -translate-y-1/2",
              needsClear ? "right-8" : "right-2",
              "flex items-center justify-center p-0 m-0 border-0 bg-transparent",
              "focus:outline-none hover:outline-none active:outline-none focus:ring-0",
            ].join(" ")}
            style={{
              color: textColor,
              background: "transparent",
              border: "none",
              outline: "none",
              boxShadow: "none",
              WebkitAppearance: "none",
              appearance: "none",
            }}
            aria-label={showPassword ? "Esconder conteúdo" : "Mostrar conteúdo"}
          >
            {showPassword ? (
              <FaEyeSlash className="h-4 w-4 pointer-events-none" />
            ) : (
              <FaEye className="h-4 w-4 pointer-events-none" />
            )}
          </button>
        )}

        {suffix && (
          <span className="mr-2 inline-flex items-center text-gray-500">
            {suffix}
          </span>
        )}
      </div>

      {status === "error" && errorText && (
        <p className="mt-1 text-xs text-red-600">{errorText}</p>
      )}
    </div>
  );
}

InputField.propTypes = {
  // identificação e tipo do campo
  id: PropTypes.string,
  name: PropTypes.string,
  type: PropTypes.string,
  placeholder: PropTypes.string,

  // aparência
  bgColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rounded: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  shadow: PropTypes.bool,
  textColor: PropTypes.string,

  // estado/validação visual
  status: PropTypes.oneOf(["default", "error", "success", "warning"]),
  errorText: PropTypes.string,

  // composição (slots/adições visuais)
  prefix: PropTypes.node,
  suffix: PropTypes.node,

  // comportamento/interação
  eyeButton: PropTypes.bool,
  clearButton: PropTypes.bool,
  onEnter: PropTypes.func,

  // controle de valor
  value: PropTypes.string,
  defaultValue: PropTypes.string,
  onChange: PropTypes.func,

  // disponibilidade e restrições
  disabled: PropTypes.bool,
  readOnly: PropTypes.bool,

  // estilização e classes
  className: PropTypes.string,
  inputClassName: PropTypes.string,
  style: PropTypes.object,
};

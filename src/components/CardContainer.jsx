import PropTypes from "prop-types";
import { isValidHex } from "../utils/validators"

export default function CardContainer({
  // aparência básica
  bgColor = "#FFFFFF",
  textColor = "#111827",
  borderColor = "#E5E7EB",
  borderSize = 1,
  rounded = 12,
  shadow = true,

  // estados
  status = "default", // "default" | "error" | "success" | "warning"

  // interação/apresentação
  hover = false,
  padding = "md", // sm | md | lg
  fullWidth = false,

  // padrões React
  className = "",
  style = {},
  onClick,
  children,
  ...rest
}) {
  const baseShadow = shadow ? "shadow-md" : "shadow-none";
  const hoverLift  = hover ? "hover:-translate-y-0.5" : "";
  const hoverShadow = hover && shadow ? "hover:shadow-lg" : "";

  // mapa de status → borda
  const statusBorderMap = {
    error: "#DC2626",
    success: "#16A34A",
    warning: "#D97706",
  };
  const appliedBorderColor =
    status !== "default" ? statusBorderMap[status] : borderColor;

  // espaçamentos padronizados
  const paddings = {
    sm: "p-3",
    md: "p-4",
    lg: "p-6",
  };
  const padCls = paddings[padding] || paddings.md;

  const widthCls = fullWidth ? "w-full" : "";

  const mergedStyle = {
    backgroundColor: isValidHex(bgColor) ? bgColor : "#FFFFFF",
    color: textColor,
    borderColor: isValidHex(appliedBorderColor) ? appliedBorderColor : "#E5E7EB",
    borderWidth: `${parseFloat(borderSize) || 0}px`,
    borderStyle: "solid",
    borderRadius: `${parseFloat(rounded) || 0}px`,
    ...style,
  };

  return (
    <div
      className={[
        "relative transition duration-150",
        baseShadow,
        hoverLift,
        hoverShadow,
        padCls,
        widthCls,
        className,
      ].filter(Boolean).join(" ")}
      style={mergedStyle}
      onClick={onClick}
      {...rest}
    >
      {children}
    </div>
  );
}

CardContainer.propTypes = {
  // aparência
  bgColor: PropTypes.string,
  textColor: PropTypes.string,
  borderColor: PropTypes.string,
  borderSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  rounded: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  shadow: PropTypes.bool,

  // estado visual
  status: PropTypes.oneOf(["default", "error", "success", "warning"]),

  // interação/apresentação
  hover: PropTypes.bool,
  padding: PropTypes.oneOf(["sm", "md", "lg"]),
  fullWidth: PropTypes.bool,

  // padrões React
  className: PropTypes.string,
  style: PropTypes.object,
  onClick: PropTypes.func,
  children: PropTypes.node,
};

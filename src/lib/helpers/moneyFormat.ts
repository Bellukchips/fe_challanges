import { numericFormatter } from "react-number-format"

export const moneyFormat = (value: number, short = true) => {
    if (`${value}`.length > 9 && short) return moneyFormatWithLabel(value);
    return numericFormatter(`${value ?? 0}`, {
        prefix: "Rp",
        thousandSeparator: ".",
        decimalSeparator: ",",
        decimalScale: 0,
    });
};

export const moneyFormatWithLabel = (value: number) => {
    value = value ?? 0;
    const formatter = new Intl.NumberFormat("id-ID", {
        notation: "compact",
        maximumFractionDigits: 0,
    });
    return `Rp${formatter.format(value)}`;
};
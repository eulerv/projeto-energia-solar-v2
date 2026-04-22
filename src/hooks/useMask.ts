export const useMask = () => {
  // Máscara para aceitar apenas números
  const numberMask = (value: string): string => {
    return value.replace(/[^0-9]/g, "");
  };

  // Máscara para email com sugestões
  const emailMask = (value: string): string => {
    return value.toLowerCase();
  };

  // Máscara para telefone (11) 99999-9999
  const phoneMask = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 2) return cleaned;
    if (cleaned.length <= 7)
      return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
    return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7, 11)}`;
  };

  // Máscara para CEP (99999-999)
  const cepMask = (value: string): string => {
    const cleaned = value.replace(/[^0-9]/g, "");
    if (cleaned.length <= 5) return cleaned;
    return `${cleaned.slice(0, 5)}-${cleaned.slice(5, 8)}`;
  };

  return {
    numberMask,
    emailMask,
    phoneMask,
    cepMask,
  };
};

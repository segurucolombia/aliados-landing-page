export const formatVigencia = (meses: number | undefined | null): string => {
  if (!meses || meses <= 0) return '';

  const nombres: Record<number, string> = {
    1: 'Mensual',
    2: 'Bimestral',
    3: 'Trimestral',
    4: 'Cuatrimestral',
    6: 'Semestral',
    12: 'Anual',
  };

  if (nombres[meses]) return nombres[meses];

  if (meses > 12 && meses % 12 === 0) {
    return `cada ${meses / 12} años`;
  }

  return `cada ${meses} meses`;
};

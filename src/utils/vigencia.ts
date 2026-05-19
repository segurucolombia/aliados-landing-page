export const formatVigencia = (meses: number | undefined | null): string => {
  if (!meses || meses <= 0) return '';

  const nombres: Record<number, string> = {
    1: 'mensual',
    2: 'bimestral',
    3: 'trimestral',
    4: 'cuatrimestral',
    6: 'semestral',
    12: 'anual',
  };

  if (nombres[meses]) return nombres[meses];

  if (meses > 12 && meses % 12 === 0) {
    return `cada ${meses / 12} años`;
  }

  return `cada ${meses} meses`;
};

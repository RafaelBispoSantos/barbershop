export const formatCurrency = (value) => {
    if (!value && value !== 0) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };
  
  export const formatDuration = (minutes) => {
    if (!minutes) return '0 min';
    
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    
    if (hours === 0) {
      return `${remainingMinutes} min`;
    } else if (remainingMinutes === 0) {
      return hours === 1 ? `${hours} hora` : `${hours} horas`;
    } else {
      return hours === 1 
        ? `${hours} hora e ${remainingMinutes} min` 
        : `${hours} horas e ${remainingMinutes} min`;
    }
  };
  
  export const formatPhone = (phone) => {
    if (!phone) return '';
    
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '');
    
    if (numbers.length === 11) {
      // Formato (99) 99999-9999
      return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    } else if (numbers.length === 10) {
      // Formato (99) 9999-9999
      return numbers.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
    }
    
    return phone;
  };
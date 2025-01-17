export function formatDate(isoString: string, showHour = true) {
    const date = new Date(isoString);
  
    // Liste des mois pour conversion
    const months = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();
  
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
  
    // Format final selon la valeur de showHour
    return showHour
      ? `${day} ${month} ${year} - ${hours}:${minutes}`
      : `${day} ${month} ${year}`;
  }
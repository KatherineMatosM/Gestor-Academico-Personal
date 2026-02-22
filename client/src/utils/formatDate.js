export function formatDate(d) {
  if (!d) return "";
  const date = new Date(d + "T00:00:00");
  return date.toLocaleDateString("es-ES", { 
    day: "2-digit", 
    month: "short", 
    year: "numeric" 
  });
}

export function today() {
  return new Date().toISOString().split("T")[0];
}
export default function fileName () {
    const currentDate = new Date();
    const formattedDate = currentDate
      .toLocaleString("en-US", {
        month: "short",
        year: "numeric",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      .replace(/[,: ]/g, "");

    return formattedDate;
  };
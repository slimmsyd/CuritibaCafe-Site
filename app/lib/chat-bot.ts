import { siteData } from "./site-data";

/**
 * Placeholder chat replies until a real RAG backend is wired.
 * Swap this module's export for an API call when ready.
 */
export function getMockChatReply(input: string): string {
  const q = input.trim().toLowerCase();
  if (!q) {
    return "Ask me about hours, the menu, events, artists, or how to find us.";
  }

  if (/(hello|hi|hey|good (morning|afternoon|evening))/.test(q)) {
    return `Welcome to ${siteData.brand.name}. We're pouring the summer single-origin series right now. What would you like to know?`;
  }

  if (/(hour|open|close|when)/.test(q)) {
    const lines = siteData.visit.hours.map((row) => `${row.days}: ${row.time}`);
    return `Our hours:\n${lines.join("\n")}`;
  }

  if (/(where|location|address|direction|find|map)/.test(q)) {
    return `${siteData.visit.address.join(", ")}. Tap Visit on the menu for directions.`;
  }

  if (/(menu|drink|coffee|espresso|pour|pastry|food|order)/.test(q)) {
    const items = siteData.menu.items.map((item) => item.label).join(", ");
    return `From the bar this season: ${items}. See the full seasonal menu on the homepage.`;
  }

  if (/(event|cupping|rsvp|class|listening|opening)/.test(q)) {
    const upcoming = siteData.eventsPreview.items
      .slice(0, 3)
      .map((ev) => `${ev.date} · ${ev.title}`)
      .join("\n");
    return `A few things coming up:\n${upcoming}\n\nSee all events on our Events page.`;
  }

  if (/(artist|shelf|maker|ceramic|print|textile|sell|shop)/.test(q)) {
    const artists = siteData.artistsPreview.items
      .map((a) => `${a.name} (${a.work}, ${a.price})`)
      .join("\n");
    return `On the artist shelf now:\n${artists}\n\nSeventy percent of every sale goes directly to the maker.`;
  }

  if (/(newsletter|email|subscribe)/.test(q)) {
    return `${siteData.newsletter.body} Scroll to First to know on the homepage to subscribe.`;
  }

  if (/(wifi|parking|dog|pet|outdoor|seat)/.test(q)) {
    return "We've got plenty of seating inside and a relaxed neighborhood vibe. For specifics like parking or pets, ask at the counter when you visit.";
  }

  return `I'm still learning the room. Try asking about hours, the menu, events, artists, or our address at ${siteData.visit.address[0]}.`;
}
export default function usePageTitle(pathname: string): string {
  const section = pathname.split("/")[1];

  const map: Record<string, string> = {
    home: "Instaflan",
    explorer: "Explorer",
    messages: "Messages",
    notifications: "Notifications",
    profile: "Profile",
  };

  return map[section] || "Instaflan";
}

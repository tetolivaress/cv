import { socialLinks } from "@/content";
import { cn } from "@/lib/cn";
import { SocialIcon } from "./Icons";
import { button } from "./ui";

/** Row of 44px icon buttons (LinkedIn, GitHub, YouTube, Telegram) for links that exist. */
export function SocialLinks({ onPanel = false, className }: { onPanel?: boolean; className?: string }) {
  if (!socialLinks.length) return null;
  return (
    <ul className={cn("flex gap-2", className)}>
      {socialLinks.map(({ key, label, href }) => {
        const Icon = SocialIcon[key];
        return (
          <li key={key}>
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer me"
              aria-label={label}
              title={label}
              className={onPanel ? button.iconOnPanel : button.icon}
            >
              <Icon size={20} aria-hidden="true" />
            </a>
          </li>
        );
      })}
    </ul>
  );
}

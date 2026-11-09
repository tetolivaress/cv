import { cn } from "@/lib/cn";
import { SocialIcon, type SocialKey } from "./Icons";
import { button } from "./ui";

interface Props {
  links: { key: SocialKey; label: string; href: string }[];
  onPanel?: boolean;
  className?: string;
}

/** Row of 44px icon buttons (LinkedIn, GitHub, YouTube, Telegram) for links that exist. */
export function SocialLinks({ links, onPanel = false, className }: Props) {
  if (!links.length) return null;
  return (
    <ul className={cn("flex gap-2", className)}>
      {links.map(({ key, label, href }) => {
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

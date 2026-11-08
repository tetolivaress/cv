import {
  GithubLogo,
  LinkedinLogo,
  TelegramLogo,
  YoutubeLogo,
} from "@phosphor-icons/react/ssr";

/** Brand marks come from Phosphor (as in the design); everything else is Lucide. */
export const SocialIcon = {
  linkedin: LinkedinLogo,
  github: GithubLogo,
  youtube: YoutubeLogo,
  telegram: TelegramLogo,
} as const;

export type SocialKey = keyof typeof SocialIcon;

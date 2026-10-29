import type { Language } from "./preference";
import { localizeHref } from "./urls";

type LanguageNavigationOptions = {
  currentLanguage: Language;
  nextLanguage: Language;
  href: string;
  dirty: boolean;
  pending: boolean;
  uncertain: boolean;
  confirmNavigation: () => boolean;
  navigate: (href: string) => void;
};

export function requestLanguageNavigation(options: LanguageNavigationOptions) {
  if (options.currentLanguage === options.nextLanguage) return "unchanged";
  if (options.pending) return "blocked";
  const href = localizeHref(options.href, options.nextLanguage);
  if (href === options.href) return "unchanged";
  if ((options.dirty || options.uncertain) && !options.confirmNavigation()) return "cancelled";
  options.navigate(href);
  return "navigating";
}

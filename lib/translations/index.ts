import ruTranslations from './ru.json';
import enTranslations from './en.json';

export const translations = {
  ru: ruTranslations,
  en: enTranslations,
};

export type Translations = typeof ruTranslations;


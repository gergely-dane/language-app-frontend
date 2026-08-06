export interface I18nMessages {
  [key: string]: string | I18nMessages;
}

export interface I18nConfig {
  locale: "en";
  messages: I18nMessages;
  timeZone: string;
}

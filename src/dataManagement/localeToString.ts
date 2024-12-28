import en from '../strings/en.json';

type stringKeys = typeof en;

export function localeToString(string: keyof stringKeys, locale: string) {
  switch (locale) {
    case 'en':
      const retString = en[string];
      if (retString) return retString;
      else return '';
    default:
      console.error('locale not found');
      return '';
  }
}

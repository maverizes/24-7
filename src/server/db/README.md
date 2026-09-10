# Seed / mock ma'lumotlar qatlami

Bu papkadagi fayllar **ma'lumotlar bazasining vaqtinchalik o'rnini bosadi**.

- Hududlar, kategoriyalar, xizmatlar va sovrinlar bu yerda **konfiguratsiya**
  sifatida saqlanadi — komponentlarda hech qachon hardcode qilinmaydi (TZ 55).
- Backend (NestJS + PostgreSQL) tayyor bo'lgach, bu fayllar migration seed'iga
  aylanadi, `src/server/api/*` esa HTTP so'rovlarga o'tadi. UI kodi o'zgarmaydi,
  chunki u faqat `src/types/api.ts` dagi kontrakt bilan ishlaydi.
- Obyektlar deterministik generator orqali yaratiladi (`objects.ts`) — har bir
  build'da bir xil natija, demo uchun barqaror.

Koordinatalar taxminiy (demo maqsadida), telefon raqamlari — namunaviy.
Shoshilinch xizmatlarning qisqa raqamlari (101/102/103) haqiqiy.

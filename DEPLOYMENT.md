# Actualizare pe host, cu păstrarea știrilor

Folosește `release/anv-host-update.zip` pentru actualizarea site-ului existent.
Build-ul complet este în `dist/`; pentru host-ul existent recomandăm arhiva de actualizare.

1. Păstrează o copie de siguranță a site-ului de pe host.
2. Încarcă arhiva în directorul public în care se află actualul `index.html` și extrage-o acolo, cu suprascrierea fișierelor care au același nume. Nu șterge directorul site-ului și nu utiliza sincronizare cu ștergerea fișierelor care lipsesc din arhivă.
3. Arhiva actualizează numai `index.html`, `assets/`, `locales/` și `forum-workshop/`. Directoarele existente `data/`, `images/`, `files/`, panoul admin, eventualele baze de date, fișierele de configurare și `.htaccess` rămân pe host.
4. După extragere, verifică adresa principală `/forum&workshop`, apoi accesarea directă a vechiului `/forum-workshop`, `/news/39` și descărcarea agendelor. Dacă host-ul are cache pentru HTML sau CDN, golește acel cache pentru a încărca noul `index.html`.

Adresa principală este `https://anv.md/forum&workshop`. Linkurile din header și footer folosesc această adresă. Vechile linkuri `/forum-workshop`, cu sau fără slash final, deschid aplicația și redirecționează către noua adresă, păstrând parametrii și ancora.

Arhiva include acum și `forum-workshop/index.html`. Acest fișier previne afișarea listei de directoare la accesarea directă a vechiului URL, care coincide cu folderul resurselor evenimentului. Extrage inclusiv acest fișier; nu este necesară modificarea sau înlocuirea fișierului `.htaccess` de pe host.

Știrile sunt citite de site din `/data/news.json` la încărcarea paginilor, cu cache-ul browserului dezactivat pentru aceste cereri. Astfel se păstrează inclusiv postările publicate de admin după pregătirea arhivei, dacă directoarele de conținut de pe host rămân intacte.

Pe 10 noiembrie 2026, datele publice de pe anv.md conțineau 39 de știri. Știrea 39 și cele trei atașamente ale sale au fost adăugate și în copia locală, pentru ca build-ul complet să includă conținutul verificat atunci. Arhiva de actualizare nu suprascrie conținutul host-ului cu această copie.

Pentru a regenera build-ul și arhiva:

```sh
npm run build:host
```

Comanda de împachetare folosește utilitarul de sistem `zip`.

# Výdavky Bulharsko

Jednoduchá appka na sledovanie spoločných nákladov zo skupinového výletu. Zapisuješ výdavky (transfery, výlety, večere...), appka priebežne počíta súčet a koľko to vychádza na osobu.

Beží celá v prehliadači, bez servera a bez prihlasovania — dáta zostávajú len na tvojom telefóne/tablete. Funguje aj **bez internetu** a dá sa **pridať na plochu** ako normálna appka.

## Čo appka vie

- Rýchle pridanie výdavku (názov, suma, spôsob platby, poznámka, dátum)
- Priebežný súčet a prepočet „na osobu" hore na obrazovke
- Rozpad nákladov podľa spôsobu platby (hotovosť / karta Peter / karta Rado / iné)
- Nastaviteľný počet osôb v skupine
- Export všetkých výdavkov do CSV (otvorí sa v Exceli)
- Funguje offline, dáta sú uložené priamo v prehliadači (IndexedDB)

Fotenie účtenky a automatické rozpoznávanie údajov z fotky zatiaľ appka nemá — je to naplánované ako ďalší krok.

## Ako spustiť appku lokálne (na počítači)

Potrebuješ mať nainštalovaný [Node.js](https://nodejs.org/) (stačí LTS verzia).

```bash
npm install
```

Nainštaluje všetky potrebné knižnice — treba spustiť len raz (alebo znova, keď sa zmenia).

```bash
npm run dev
```

Spustí appku na `http://localhost:5173` s automatickým obnovovaním pri zmene kódu.

Ak chceš appku vyskúšať presne tak, ako bude fungovať po nasadení (vrátane offline režimu), použi produkčný build:

```bash
npm run build
npm run preview
```

Otvorí sa na `http://localhost:4173`.

### Vyskúšanie na mobile v tej istej WiFi sieti

Kým appka beží cez `npm run dev` alebo `npm run preview`, v termináli sa okrem `localhost` adresy zvyčajne vypíše aj sieťová adresa (napr. `http://192.168.1.5:5173`). Tú isteš otvor v prehliadači na telefóne, ak je pripojený na tú istú WiFi.

## Ako nasadiť appku na internet

Appka sa nasadzuje ako obyčajné statické súbory — žiadny server, žiadna databáza.

1. Vytvor produkčný build:

   ```bash
   npm run build
   ```

   Vznikne priečinok `dist/` so všetkými súbormi appky.

2. Nahraj obsah priečinka `dist/` na ktorúkoľvek z týchto služieb (všetky majú bezplatnú úroveň):

   - **[Netlify](https://app.netlify.com/drop)** — najjednoduchšie: stačí priečinok `dist/` pretiahnuť myšou do okna v prehliadači
   - **[Vercel](https://vercel.com/)** — pripoj repozitár alebo nahraj `dist/` cez `vercel` CLI
   - **[GitHub Pages](https://pages.github.com/)** — obsah `dist/` sa nahrá do vetvy `gh-pages` alebo priečinka `docs/`

3. Appku otvor na telefóne cez pridelenú adresu a v menu prehliadača zvoľ „Pridať na plochu" (Android/Chrome) alebo „Zdieľať → Pridať na plochu" (iPhone/Safari). Appka sa potom spúšťa ako samostatná ikona, bez adresového riadku prehliadača.

## Dôležité upozornenie k dátam

Všetky výdavky sú uložené **len v tomto jednom prehliadači na tomto jednom zariadení** — nikde sa nezálohujú ani nezdieľajú. To znamená:

- Ak appku otvoríš v inom prehliadači alebo na inom telefóne, dáta tam nebudú.
- Vymazanie histórie/dát prehliadača (napr. „Vymazať údaje o prehliadaní" v nastaveniach telefónu) môže zmazať aj dáta appky.
- V súkromnom/inkognito okne appka dáta po zatvorení okna nezachová.

Preto je dobré si počas výletu (aj priebežne) robiť **export do CSV** cez Nastavenia — to je zálohovanie dát mimo appku.

## Štruktúra projektu

```
src/
├── App.tsx                 hlavná obrazovka a prepínanie medzi zoznamom/formulárom/nastaveniami
├── db.ts                   databáza v prehliadači (Dexie/IndexedDB)
├── types.ts                dátový model výdavku
├── components/             jednotlivé obrazovky a UI komponenty
└── lib/                    pomocné funkcie (formátovanie, CSV export, dátumy)
```

## Použité technológie

React + TypeScript + Vite, Tailwind CSS, Dexie.js (IndexedDB), vite-plugin-pwa.

# Baby Shower Site — setup & deploy

One vertical page — the invitation, the details, a map, gift info, and an
RSVP button — plus an RSVP form that writes straight into a Google Sheet,
and a gallery for Benny.

```
/          the whole invitation, top to bottom
/rsvp      the form guests fill in
/benny     the dog gallery
```

---

## 1. Fill in your details

**Everything editable lives in one file: `app/data/site-config.ts`.**
Open it and you'll see the whole site's content. Five values are still
placeholders — search the file for `TODO`:

| What                | Where in the file        | Currently          |
| ------------------- | ------------------------ | ------------------ |
| Venmo username      | `gifts.venmoHandle`      | `@Your-Venmo`      |
| Zelle phone/email   | `gifts.zelleHandle`      | `you@example.com`  |
| Phone guests text   | `contact.phoneDisplay`   | `(555) 123-4567`   |
| …same number, raw   | `contact.phoneRaw`       | `+15551234567`     |
| Email guests write  | `contact.email`          | `you@example.com`  |

`phoneDisplay` is what people read; `phoneRaw` is what their phone dials, so
it needs the `+1` and no punctuation. Both should be the same number.

Also worth a look while you're in there:

- **`babyName`** — the big words in the middle of the page. Set to
  `"Baby Nam"`; change it to a real name whenever you're ready to share it.
- **`hero.eyebrow` / `hero.subhead`** — the invitation wording.
- **`event.notes`** — the "Good to know" bullets (food, parking). Add a line
  to the array and a new bullet appears.
- **`rsvp.deadline`** — the reply-by date shown on both pages.
- **`dog`** — Benny's name, breed, and the blurb on the gallery page.
- **`footer.builtBy` / `footer.year`** — the credit line at the bottom of
  every page.

The date, time, and address are already set to 9/20/26, 1–4 PM, at
18900 Copper Breaks Xing. The map needs no API key and no configuration —
it reads the address straight out of this file, so correcting the address
moves the map too.

---

## 2. Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000. The page works immediately; the RSVP form
needs step 3 before it can save anything.

---

## 3. Wire up the RSVP sheet

**This is already done and working** — the endpoint answers, and both values
are in your `.env.local`. Keep the rest of this section for reference, or in
case you ever need to rebuild it.

This takes about five minutes and uses nothing but your own Google account —
no third-party service, and no one else ever sees your guests' details.

**a. Make the spreadsheet.** Go to https://sheets.new and name it something
like "Baby Shower RSVPs". You don't need to add any columns — the script
creates them.

**b. Open the script editor.** In that sheet: **Extensions → Apps Script**.
Delete the placeholder `function myFunction() {}` and paste in the entire
contents of [`scripts/rsvp-sheet.gs`](scripts/rsvp-sheet.gs).

**c. Set your secret.** Near the top of what you just pasted, replace
`change-me-to-something-random` with any random string. Keep it handy — it
goes in step (f) too. Click the 💾 save icon.

**d. Deploy it.** Click **Deploy → New deployment**. Click the ⚙️ gear next
to "Select type" and choose **Web app**. Then set:

- **Execute as:** Me (your email)
- **Who has access:** **Anyone** ← this one matters

Click **Deploy**.

**e. Approve it.** Google will warn you the app isn't verified. It's your own
script, so: **Advanced → Go to (your project name) → Allow**. This is normal
for Apps Script and only happens once.

**f. Copy the URL.** You'll get a **Web app URL** ending in `/exec`. Put both
values in `.env.local` — **never in a file that gets committed**, which is
why the example below is fake:

```bash
RSVP_SHEET_WEBHOOK_URL=https://script.google.com/macros/s/AKfy..../exec
RSVP_SHARED_SECRET=the-same-random-string-from-step-c
```

> The `/exec` URL is the one that works for guests. There's also a `/dev`
> URL — that one only works while you're logged in, so don't use it.
>
> Anyone who has both of these values can write rows into your sheet, so
> keep them in `.env.local` (which git ignores) and in Vercel's environment
> variables, and nowhere else.

**g. Test it.** Submit one real RSVP and watch the row land in the sheet,
then delete that row. Worth doing before you send the link out — it's the
only way to confirm the secret in the Apps Script matches the one in
`.env.local`.

### If you ever change the script

Editing the `.gs` file isn't enough — Apps Script serves the last *deployed*
version. Go to **Deploy → Manage deployments → ✏️ edit → Version: New
version → Deploy**. The URL stays the same.

### Adding a question to the form

Three places, in this order:

1. `app/rsvp/RsvpForm.tsx` — add a `<Field>` with a new `name`.
2. `app/rsvp/actions.ts` — read it in `submitRsvp` and add it to `payload`.
3. `scripts/rsvp-sheet.gs` — add `{ key: 'yourName', label: 'Your Label' }`
   to `COLUMNS`, then redeploy as above.

Existing rows keep their old columns; new rows fill the new one.

---

## 4. Benny

**The gallery** at `/benny` is driven by `app/data/benny-photos.ts`. To add a
photo: drop the file into `public/benny/`, then add an entry:

```ts
{
  src: "/benny/new-photo.jpg",
  alt: "Short description, for screen readers",
  caption: "The caption under the photo",
  width: 1536,   // the file's real pixel size — stops the page
  height: 2048,  // from jumping around while images load
}
```

To remove one, delete its entry (and the file). Order in the array is the
order on the page. Nothing else needs touching — the home page teaser card
and the footer link both point at the same gallery.

**The favicon** is Benny's face, cropped from `public/benny/first-snow.jpg`.
To rebuild it — from that photo or any other:

```bash
npm run icons                                        # re-crop the snow photo
npm run icons -- public/benny/bow-tie.jpg 180 320 950  # different photo + crop box
```

The four numbers are `left top size` — a square crop box in the source
photo's own pixels, so nudge them until the face is centred. The script
writes `app/icon.png` (browser tabs) and `app/apple-icon.png` (phone home
screens); Next.js picks both up from those filenames automatically.

---

## 5. Colors and fonts

The palette is the `@theme` block at the top of `app/globals.css`. The home
page is a stack of **full-bleed bands**, each with its own background
colour, and five surfaces do all the work:

| Variable        | Hex       | Where                        |
| --------------- | --------- | ---------------------------- |
| `--color-denim` | `#3f6a88` | soft dusty blue — the hero   |
| `--color-bg`    | `#f2f6fa` | cool light — Details, Benny  |
| `--color-band`  | `#e3edf6` | powder blue — Gifts, footer  |
| `--color-sand`  | `#f8efe3` | warm sand — RSVP             |
| `--color-blush` | `#f9ece9` | soft blush — Questions       |

Four things are deliberate:

- **Only the hero goes deep.** Everything below it is pale, which is what
  keeps a long scroll feeling light rather than heavy.
- **The four pale bands sit at nearly the same lightness** and differ
  mostly in temperature. That's what makes the page change colour as you
  scroll without any one section shouting.
- **Cards are the only pure white on the site.** The band underneath
  carries the tone, so white is what makes a card read as sitting on top
  of the page rather than cut out of it.
- **Teddy tan appears in exactly one place** — the Venmo/Zelle panel. It's
  the single strong warm accent, which is what keeps it from becoming a
  second theme.

Every text/surface pairing in that block clears WCAG AA (4.5:1), including
each ink colour against all five surfaces. If you change a hex, keep an eye
on readability. `--color-ink` / `--color-ink-soft` are the text colours on
the pale bands; `--color-chalk` / `--color-chalk-soft` are their
light-on-denim counterparts — that second pair is the tightest on the site
at 4.6:1, so lightening `--color-denim` means re-checking it.

Classes further down the same file do the structural work, so you change
them once and the whole site follows:

- **`.section--denim` / `--bg` / `--band` / `--sand` / `--blush`** — the band
  colours. A section picks one by passing `tone` to `<Section>` in
  `app/page.tsx`. They are sequenced so no two neighbours repeat; to reorder
  the page, move the components in `HomePage` and re-check that no two
  touching sections share a tone.
- **`.section--denim` also flips what's inside it** — cards, eyebrows and
  contact tiles switch to their light-on-dark versions automatically, so a
  section is made dark by changing its `tone` and nothing else.
- **`.shell`** — the 680px centred column. Sections are full width; this is
  what keeps the text on one line all the way down.
- **`.card`** — corner radius, border and shadow for every panel.
- **`.eyebrow`** / **`.section-title`** — the small uppercase label and the
  heading above each section.
- **`.btn-primary`** and **`.btn-on-denim`** — the same button on a pale
  band and on the denim one. A blue pill on blue has nowhere near enough
  contrast, so the hero uses the white version.

`--color-error` is used only by the RSVP form's validation messages — it's
deliberately a red rather than a theme colour, because an error that's the
same hue as the rest of the page doesn't read as an error.

Fonts are wired in `app/layout.tsx`.

**The navbar** (`app/components/SiteHeader.tsx`) keeps RSVP as the only
filled button on purpose; the Benny link is styled quietly so it never
competes with the thing guests actually need to do. On narrow screens the
couple's names collapse to initials so both links still fit.

---

## 6. Deploy

Push to GitHub, then import the repo at https://vercel.com/new. Before the
first deploy, under **Environment Variables**, add the same two values from
step 3(f):

- `RSVP_SHEET_WEBHOOK_URL`
- `RSVP_SHARED_SECRET`

Vercel builds and gives you a URL. To use your own domain: **Settings →
Domains**.

> If you add or change an environment variable after deploying, you have to
> **redeploy** for it to take effect — Vercel bakes them in at build time.

---

## What happens if the sheet breaks

If the webhook URL is missing, wrong, or Google is down, the guest sees a
clear message telling them to text you instead — their RSVP is never
silently dropped, and the error is logged in your Vercel function logs.

---

## What's no longer here

The earlier version of this site had a browsable item grid, a cash-fund page
with claim tracking, and an admin panel, all backed by Upstash Redis. Those
were removed — the site now points at Amazon for the item list and has no
database at all. Nothing to pay for, nothing to keep running.

The `UPSTASH_*` and `ADMIN_KEY` lines still sitting in your `.env.local` are
left over from that version and can be deleted.

If you ever want that code back, it's in the git history.

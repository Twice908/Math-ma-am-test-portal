# Math ma'am Academy — Practice Test Portal

A static, dependency-free portal where students attempt timed, self-scoring practice
tests. Every test mirrors the **official paper pattern** of the exam it prepares for —
including that exam's own scoring convention (marks, question counts, weighted
sections or all-or-nothing multi-select questions).

Deployed to GitHub Pages straight from `main` — there is no build step.

## Project structure

```
index.html                 Portal home — exam picker + test cards
login.html                 Sign-in gate (sets the mm_auth flag)

assets/
  css/
    theme.css              Design tokens + base reset — loaded by EVERY page
    portal.css             Home page only (hero, dropdown, cards, welcome state)
    login.css              Sign-in page only
    test.css               Every test page (sheet, timer, questions, scoring UI)
  img/                     Logos

tests/
  homi-bhabha/
    std6-test1.html        2022 official paper — 100 Q
    std6-test2.html        Practice set — 40 Q
    std6-test3.html        Practice set — 50 Q
    std9-test1.html        Theory round — 100 Q / 100 marks
  scholarship/
    pup-std4-test1.html    MSCE PUP Paper 1 — 75 Q / 150 marks
    pss-std7-test1.html    MSCE PSS Paper 1 — 75 Q / 150 marks
  olympiad/
    imo-std6-test1.html    SOF IMO Level 1 — 50 Q / 60 marks
    iso-std6-test1.html    SOF ISO (ex-NSO) Level 1 — 50 Q / 60 marks
    ieo-std6-test1.html    SOF IEO Level 1 — 50 Q / 60 marks
```

## Styling

All styling is centralised in `assets/css/`. **`theme.css` must load first** — it
defines the design tokens (`--brand-pink`, `--gradient-warm`, `--radius-md`, …) that
every other stylesheet consumes. Changing a brand colour there updates the entire
portal.

No page should carry an inline `<style>` block. When adding a test, link the two
shared sheets and write no CSS:

```html
<link rel="stylesheet" href="../../assets/css/theme.css">
<link rel="stylesheet" href="../../assets/css/test.css">
```

## Adding a test

1. Copy the closest existing test from the same folder.
2. Replace the `QUESTIONS` array. Each entry is
   `{q, opts, correct, marks?, section?, passage?, diagram?, multi?}`.
3. Set `TIME_LIMIT_SECONDS` to the real exam's duration.
4. Add a `.test-card` for it in `index.html` under the matching
   `.exam-subsection[data-sub="..."]`.

### Scoring conventions the test engine supports

| Feature | Set via | Used by |
|---|---|---|
| Flat 1 mark per question | omit `marks` | Homi Bhabha |
| Fixed marks per question | `marks: 2` | Scholarship PUP / PSS |
| Weighted sections | `marks: 3` on Achievers questions | SOF IMO / ISO |
| Two correct answers, both required | `multi: true, correct: [0,1]` | Scholarship PSS |
| Section-wise result breakdown | `section: {title, note}` | SOF IMO / ISO |

Report results the way the real exam reports them — marks where the board gives
marks, raw question counts where it counts questions.

## Notes

- Auth is a client-side `localStorage` flag (`mm_auth`) — a soft gate, not real security.
- The student's exam selection persists in `localStorage` under `mm_selected_exam`.
- No test results are stored anywhere; each attempt scores in the page and is discarded.

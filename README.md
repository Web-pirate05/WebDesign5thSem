# Mehhfil: Responsive Event Management Website
**Made by:** Iman Parui | Kalinga Institute of Industrial Technology | BTech CSE and 5th Semester
**Task:** K Explore, Web Designing: Design and Develop a Responsive Event Management Website

Mehhfil lets people discover upcoming events, read the details and register with a validated form.
Built for the **K Explore – Web Designing** task with plain **HTML5, CSS3 and JavaScript** (no frameworks, no build step).

**Live site:** https://mehhfil.vercel.app  
**Repository:** https://github.com/Web-pirate05/WebDesign5thSem.git

![Home page](screenshots/home.png)

## Features

| Requirement | How it is implemented |
|---|---|
| Hero section | Headline, search box and a live "next event" ticket with countdown (`index.html`) |
| Upcoming and featured events | Featured grid on the home page, full list on `events.html` |
| Event cards | Image, date badge, category, name, venue, time, short description and price |
| Browse, search, filter | Live search, category chips, sort by date or price, shareable URLs (`events.html?cat=Tech&q=hack`) |
| Event details | `event.html?id=…` shows facts, countdown and a full description |
| Registration form | Name, email, phone and selected event, all validated with JavaScript |
| Confirmation | Success panel with a ticket ID after a valid submit |
| Responsive | Mobile-first CSS Grid and Flexbox, tested at 360px, 768px and 1280px+ |
| Bonus | Light/dark mode, countdown timers, animations, Local Storage registrations ("My tickets" with cancel) |

## Technologies used
- HTML5 (semantic structure, forms, `<dialog>`)
- CSS3 (Grid, Flexbox, CSS variables, media queries, animations)
- JavaScript (ES6+, DOM manipulation, form validation, Local Storage)
- Git and GitHub for version control, GitHub Pages for deployment

## Screenshots
| Home | Events | Event details |
|---|---|---|
| ![Home](screenshots/home.png) | ![Registration](screenshots/registration.png) | ![Event](screenshots/event.png) | ![Details](screenshots/details.png) |

| Mobile view | Dark mode |
|---|---|
| ![Mobile](screenshots/mobile.jpeg) | ![Dark](screenshots/dark.png) |

## Notes on registration data
Registrations are saved in the browser's Local Storage. They stay after a page refresh, but they are specific to one browser on one device and are not sent to a server. Clearing browser data removes them.

## Challenges and what I learned
- Building one reusable card and page-shell function so every page stays consistent
- Writing form validation with clear, specific error messages
- Making the layout work from 360px phones to wide desktop screens
- Saving and reading data with Local Storage safely (handling empty or invalid data)
- Deploying a static site and fixing issues that only appear on the live link

### Validation rules
- **Name:** letters, spaces and `. ' -`, 3 to 50 characters
- **Email:** standard `name@domain.tld` pattern
- **Phone:** 10-digit Indian mobile number starting 6 to 9, optional `+91`
- **Event:** must be selected; duplicate email for the same event and sold-out events are rejected

## Project structure
```
eventora/
├── index.html      home: hero, featured events, categories
├── events.html     search, filter and sort
├── event.html      details and registration
├── css/style.css   design tokens, layout, components, dark theme
├── js/data.js      event data (dates are relative to today)
└── js/app.js       shared shell, rendering, validation, Local Storage
```

## Run locally
Open `index.html` in a browser, or use the VS Code **Live Server** extension. An internet connection is needed for Google Fonts and the sample photos.

## Deployment (GitHub Pages)
Repository **Settings → Pages → Deploy from a branch → `main` / `(root)`**.

## Design notes
A ticket motif runs through the interface: notched cards, dashed tear lines, date stubs and a countdown. Flat colour and hard shadows keep it distinct from typical gradient templates. Colours live in CSS variables, so the dark theme is a single override block.

## Possible improvements
Backend for real registrations, email confirmations, admin dashboard, calendar export.

# What Can I Plant Now?

A single-page planting calendar for a 10×10 community garden plot, tuned to your
location's real frost history and forecast.

## Features

- Suggests what to plant right now, and what's coming up in the next 3 weeks
- Looks up your location (search or "use my location") via the free
  [Open-Meteo](https://open-meteo.com/) geocoding API
- Pulls a 14-day frost forecast and flags upcoming frost risk
- Estimates your last spring / first fall frost dates from 8 years of historical
  weather data, or you can set them manually / pick a climate preset
- Includes a full reference calendar and spacing/plot tips for a shared 10×10 bed

All settings (location, frost dates) are saved locally in your browser via
`localStorage` — nothing is sent to a server other than the Open-Meteo API calls.

## Running it

Double-click [start.bat](start.bat), or run:

```powershell
.\serve.ps1
```

This starts a small local web server (default `http://localhost:8973`) and opens
the app in your browser. No build step or dependencies required.

Alternatively, just open [index.html](index.html) directly in a browser — the app
works without a server, though geolocation may be restricted on some browsers when
loaded from a `file://` URL.

## Files

- `index.html` — the entire app (markup, styles, and logic)
- `serve.ps1` — minimal local static file server
- `start.bat` — double-click launcher for `serve.ps1`

# Timezone Overlap Finder

A showcase-style web tool for finding overlapping work hours across two or three time zones without losing each participant's local-time context.

## Features

- Compare schedules across 2 or 3 IANA time zones
- Handle overnight shifts that wrap past midnight
- Reflect date changes caused by daylight saving time differences
- Show overlap windows in each participant's local time
- Stay readable across desktop and mobile layouts

## Demo / Screenshot

![Timezone Overlap Finder screenshot](./assets/timezone-overlap-finder.png)

## Getting Started

Run a local static server from the project root:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Usage

1. Choose the planning date.
2. Select two time zones and enter local start and end times.
3. Add the optional third zone when you need a broader overlap check.
4. Review the shared window summary and the local-time day view bars for each zone.
5. Adjust the date or schedules to account for DST-driven date shifts and overnight coverage.

## Roadmap

- Preset common team configurations for faster comparisons
- Shareable URLs that capture the active schedule state
- Export-friendly summaries for handoff into calendars or project docs

## License

MIT

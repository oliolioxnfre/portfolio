# DJWYA: matching listening history to electronic music festivals

## Summary

Thousands of electronic music festivals each book 10 to 600 artists, and tickets often cost $300 or more, yet finding where an artist is playing still means searching by hand. DJWYA ranks festivals by how closely their lineups match a person's listening history. I built it alone from February to October 2026 (live at djwya.live; the repository is private). An AI coding assistant (Claude Code) wrote much of the code. I decided what to build, ran the infrastructure, and fixed what broke.

## How it works

One Supabase Postgres database sits behind three components:

- **Frontend:** Next.js on Vercel, reading under row-level security.
- **Engine:** a Python API in Docker on Railway that scores festivals.
- **Scrapers:** three scheduled jobs on a repurposed ASUS Chromebox (MrChromebox firmware, Debian 13) on my Tailscale network. They extract lineups from festival sites and posters and post them to the engine.

A diagram should show the three around the database, each arrow labelled with the credential it uses, and the tailnet boundary.

## The interesting problem

The scrapers first ran in Proxmox containers on my homelab: n8n, plus IronClaw, an OpenClaw fork I chose for its security model. I couldn't make the two cooperate, so I dropped the agent and built a plain automation workflow instead. In September I powered the homelab down for a few weeks. The scraper stopped and nothing told me; I noticed 18 days later. I moved the jobs to the Chromebox as systemd timers that catch up on missed runs at boot, with timeouts and a healthchecks.io dead-man's switch.

Days later, successful scrapes fell to nearly zero while runs still reported success. Failures were being recorded as "lineup not announced," which also pushed those festivals down the queue. I added telemetry: a row per run, per festival and per network call. The first test run showed the cause. The search API key had hit its $5 spend cap, and the free fallback engines were blocking the box. Now outages leave the queue untouched, and a mostly failed run exits with a distinct code so the alert fires.

## Security and reliability

- **Database grants:** I revoked default execute rights on privileged functions and granted them back per caller. Column-level grants hide user emails and stop users changing their own role; before this, any signed-in user could make themselves admin.
- **Secrets:** These live only in environment files and platform variables, and none appear in Git history. The deploy script never copies them.
- **Found while writing this:** The scrapers sent a shared secret that the engine never checked. I deployed the check and set the secret on both sides. I also committed two database migrations that had been applied but never recorded.
- **What I'd harden next:** Add CI and branch protection, because deploys run straight from main. Remove leftover table privileges, and schedule key rotation.

## Result and what I'd do differently

It runs unattended and alerts when a job fails, degrades or doesn't run. One cheap box is a single point of failure, though: the alerting tells me when it's down but doesn't keep it up. Next time I'd build monitoring before the first outage and keep every database change in version control from day one.

**Relevance:** I check what's actually running before trusting the documentation, including my own.
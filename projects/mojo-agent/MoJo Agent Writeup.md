Human writeup:
My work at Appenza was far from the conventional coffee-boy software internship you might expect. I was thrust into the role of FullStack Engineer on one of their latests startup ideas. This idea was the mojo agent, a voice first realtime agent that acts as an executive assitant for the client. Mojo agent ingests mail, teams chats, and whatsapp business api messages into a graphiti sidecar which loads a graphic falkordb memory graph with facts about projects, people, companies and more.  My role as a fullstack dev was to build out the design layed out for me by my boss and manage deployments via a cloud VPS on the cloud via coolify & docker. I worked closely with the team at OBMMS the client to understand their IT structure and how I could implement the idea. I uncovered that the idea for a microsoft graph calendar would not work without the licenses of the MS365 suite, as a result I had to work closely with the OBMMS IT team to migrate their domain over from HostingerMail. This was a rough patch. Since the head of OBMMS was a personal friend of the board at appenza, I ended up doing a lot of extra IT related work like installing software on computers and helping out the team whenever an IT related issue would occur. 
### Summary

During my internship at Appenza, I built an executive assistant for the Head of Office at OBMMS, working with their team to fit how the office actually runs. It reads his mail, briefs him each morning, drafts replies, and works by voice. One rule drove the design: it never sends anything he hasn’t approved. I built it with Claude Code. I made the architecture and security decisions and ran the debugging; Claude wrote much of the implementation, which I reviewed and tested.

### How it works

A Next.js app and a Python sidecar run under Coolify on a Frankfurt VPS I administered. The server has no public ingress; it’s reachable only over Tailscale, which I set up on his laptop. Postgres is the system of record for drafts, approvals and the audit log. A graph database holds relationship context and can be rebuilt from Postgres. Mail moves over IMAP and SMTP. Voice audio goes directly between his laptop and OpenAI; the server only issues a short-lived key and runs tool calls.

_Diagram: the laptop, the VPS and its internal Docker network, the database, the mail server and model providers, with the Tailscale boundary drawn and the voice path bypassing the server._

### The interesting problem

In a rehearsal, an approved reply never sent, and the assistant kept saying it was “still processing.” Port 465 was blackholed from that network, so I moved to 587. The send had hung instead of failing because no timeouts were set, so I added them. The failure had also stranded the draft as approved but unsent and invisible to the queue, so a failed send now returns to pending and records why. Mail still didn’t leave. Read properly, the audit log said “No recipients defined”: nodemailer doesn’t derive the SMTP envelope from a raw message’s headers. Building both from one recipient list fixed it. I’d fixed three plausible causes before reading evidence I already had. The health check now verifies SMTP login too.

### Security and reliability

- Approval is enforced by a Postgres trigger, not application code; tests attack five bypass paths.
- I declined an offer of admin access to everything and took one mailbox credential.
- API keys are encrypted with AES-256-GCM in the database, not kept in files. A PIN with escalating lockouts guards the app and its API routes.
- The graph database and sidecar publish no ports.
- Model calls carrying his mail are refused if a provider’s terms allow training on it.

Next: a CI gate (a push to master deploys directly), opening the mailbox read-only with a test for the no-delete rule, and a named owner for the VPS.

### Result and what I’d do differently

My internship ended before the project did; reading, sending and voice approval worked, and I don’t know whether it’s in daily use. I’d separate development and production databases from day one: twice, the test suite wiped live data. And I’d check DNS before designing. I planned around Microsoft Graph until an MX lookup showed his mail was on Hostinger.

**Relevance:** running a service on infrastructure I administered, with access kept as narrow as the job allowed.

---
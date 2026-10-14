DJWYA is my biggest project to date and the one I have spent the most time on. DJWYA has given me by far the most exposure to the most technologies. DJWYA has given me experience with IMAP,SMTP,Postgresql, Managing Deployments with Vercel, Analytics, Domain Registry, N8N, custom MCP, Creating my own scrapers, Frontend and Backend development, Data Visualization, Backend on Railway, Using shit loads of APIs, Google Cloud, LastFM, Soundcloud, Leaflet, gemini api and so so many more things


### Objective

Navigating the global electronic music landscape has become a problem of scale. With thousands of festivals worldwide hosting between 10 to 600 artists each, the gap between a user’s personal listening library and live festival discovery is growing. In 2026, finding where a specific electronic artist is performing still requires exhaustive manual searching. Additionally, the financial commitment of a festival ticket, often $300+, demands a level of certainty that "vibe-based" marketing just can't provide.

The Solution: The goal of DJWYA was to bridge this gap by treating musical taste as a quantifiable data set. By creating a system that understands a user’s "Sonic DNA," we can eliminate festival discovery fatigue and ensure that every festival investment is backed by mathematical synergy.  
  

1. **Global Artist Intelligence:** Implement a centralized lookup system to track artist performances across the global festival circuit.
    
2. **Quantitative Taxonomy:** Build a multi-dimensional mathematical model to classify hundreds of electronic subgenres based on sonic characteristics (Intensity, Euphoria, Bass, etc.).
    
3. **Interactive Discovery:** Design a high-fidelity, interactive, force directed network graph to make navigating complex genre relationships intuitive and engaging.
    
4. **Synergistic Matching:** Develop a predictive recommendation engine that calculates "Sonic DNA" similarity between user listening data and festival lineups.
    
5. **User Analytics Dashboards:** Empower users to visualize their own listening habits through advanced data visualizations, including StarCharts and Sunburst distributions.
    
6. **Agentic Ingestion:** Automate the aggregation and processing of thousands of festival lineups through agentic ETL pipelines and image-scraping automation.
    

### Process

I began by mapping out a relational schema in Supabase PostgreSQL designed to support complex many-to-many relationships between artists, subgenres, and global event metadata.

- **Backend Engineering (Python):** Initial development focused on high-performance ingestion engines. When faced with the limitations of current streaming APIs (Spotify🪦), I pivoted to a robust multi-source integration using Last.fm for granular artist metadata.
    
- **The "Sonic DNA":** To solve the problem of subjective "vibes," I engineered a proprietary classification system. This involved defining a 7-axis vector space (Intensity, Euphoria, Space, Pulse, Chaos, Swing, Bass) to mathematically map subgenres, and the artists carrying them, into a searchable sonic profile.
    
- **Frontend & UX (Next.js/TypeScript):** Once the backend was stable, I architected a responsive frontend using React and Tailwind CSS. The interface was evolved through constant iteration, refactoring the codebase as the system scaled to handle more complex data relationships.
    
- **Agentic Data Scavenging:** To bring the database to life, I deployed an "Agentic" worker on a remote homelab workstation initally using a container running n8n and another running OpenClaw This worker autonomously scrapes the web for festival posters and pipes the raw data through an automated ETL pipeline into my production database. But due to the repetitive nature of poster search I eventually I created  own custom built automated workflow for more accurate and cheaper results.
    

### Outcome

The result is **DJWYA**, a fully decoupled ecosystem that effectively bridges the gap between music streaming data and live performance discovery. The platform successfully transforms listening habits into actionable intelligence, providing users with a definitive "Synergy Score" for festivals worldwide. By automating the extraction of lineup data from thousands of unstructured sources, I created a self-sustaining data engine that remains accurate as the festival circuit evolves.

### Standout Features

- **The Sonic DNA Brain:** A custom-engineered mathematical model that quantifies musical preference into a 7-dimensional vector, allowing for precision matching between listeners and event lineups.
    
- **Interactive Force-Directed Graph (D3.js):** A massive, navigable "Sonic Universe" visualization. Each genre node and lineage edge was populated using an LLM-assisted script to ensure accurate genealogical relationships between musical styles.
    
- **Geospatial Discovery (Leaflet):** A dynamic festival map featuring high-density clustering and geolocation, allowing users to visualize the global music landscape geographically.
    
- **Automated Agentic ETL:** A headless scraping pipeline that utilizes OCR and LLM processing to turn flat images of festival posters into structured, relational database entries with zero manual input.
    
- **Complex SQL Analytics:** Optimized PostgreSQL queries and JSONB processing used to generate high-fidelity user taste visualizations like the "Genre Donut Chart" and "Sonic DNA StarChart"





Letter I wrote to a fan:
After listening to so many new electronic artists, it became my dream to go to a real electronic music festival, but there were a few problems: too many festivals, too many posters, too many artists. I spent hours reading lineup posters looking for artists I had liked and searching through other artists’ discographies to see if I would even like the sound of the festival. Because there are so many electronic artists out there, it is easy to miss where your favorites are playing, and you’re more likely to listen to one song from 100 separate artists than 10 songs from 10 artists, as you would with rock. Because of this, dozens of artists I liked slipped through the cracks as I used my eyes to scan countless posters. Even if I did create a massive spreadsheet of all the artists going to all the festivals, I found that most festival finders hold just a fraction of the festivals that happen every year.

What discouraged me even more from finding the perfect festival was that a majority of big festivals cost $300 or more just for the tickets. When you factor in everything else, it becomes quite the investment, and I was not going to compromise on a festival that did not have it all. If I was going to shell out big money, I needed a festival with artists I like, genres I like, and a vibe I like. Eventually, I had enough, and I got to work on tackling every problem at once.

**About the app:**  
Why do I use Last.fm? To put it simply, Spotify is horrible for developers. In recent times, Spotify has completely locked down its API. Its terms now say that you can’t have more than five people use Spotify SSO unless your app has 250,000+ active users. That’s a contradiction, and it meant I couldn’t use their API. I had to find a workaround, and that’s when I found Exportify and Last.fm. Exportify is already partnered with Spotify, allowing users to export any of their playlists. I use the Last.fm API, on the other hand, to categorize all the artists from those playlists. Last.fm artist genres are created by real music listeners, meaning they are more accurate than the ones that come from Spotify.

Festival criteria: The criteria for a festival making it into the app are fairly simple. It has to be a festival, it has to be either electronic or rock oriented, it has to have a set date in the future, and it has to have valid artists that are recognized by Spotify, SoundCloud, or Last.fm. Since that Reddit post, I have greatly expanded the set of festivals on the map.

How did I build the genre network? It was the most difficult part of the process. I wanted to represent the hundreds of relationships between parent and child genres of electronic music in a way that anyone could interact with. I needed a visual that represented multi-parent, multi-child relationships, so I settled on a D3 force-directed network graph. From there, I began research. I tirelessly searched the internet for which genre came from what and where each genre gets its influences. Additionally, I had to manually listen to hundreds of different genres and decide where each of them sat in terms of its sonic characteristics. Finally, after a long time, my hard work paid off, and every genre was mapped, leaving me with a stunning visual of the web of almost all electronic music. Not every mapping in the graph is perfect, but I did the best I could, and I’m proud of the result.

**What’s next:**  

I just dropped the Crew Update tonight, which allows users to find festivals with their friends using an algorithm that finds the best festival for between 2 and 8 people. Since I’m still in school, it’s difficult to maintain this project economically (expensive APIs), and I’m often studying. Nonetheless, I plan on continuing development of DJWYA until it is the de facto home of all electronic music listeners. My goal is to have every festival in the world on my site, complete with a full lineup, so that I can finally know where all my DJs are playing. Once the site is big enough, I’m going to release a standalone app on the App Store and Play Store with a killer feature: mesh-network communication. This will allow anyone to easily find and converse with their friends at festivals even when all internet service is down. It’s a long way out, but that’s my end goal.
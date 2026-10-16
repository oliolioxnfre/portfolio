June-July 2026
Throughout my life I have always been technologically inclined, and I had always wanted to build my own things not just in software but in hardware too. But the learning curve of studying hardware had always scared me and what would I even make. I had so many ideas for commercial products growing up but I had never dipped my toes into hardware. After having gained experience building my homelab, djwya, and even 3d printing at school, nothing seemed scary to me anymore. I still had big ideas like my other project Huddy Horns (work in progress) but before I could ever hope to build a commercially viable product I wanted to dip my toes in the water of microcontrollers. Additionally In July I was going to meet my girlfriends extended family in Egypt for the first time and I was going to be hosted by my girlfriends father. So I needed a gift to bring to show my appreciation. He was kind of a rich guy who had everything he needed so I wanted to make him something genuinly cool that he could not buy. so After long hours of deliberation I would decide to kill 3 birds with one stone. Learn how to program microcontrollers, learn to 3D model a custom enclosure, and gift my GFs dad something really special. I began with an ESP32S3, 2x 32x8 MAX7219 Displays, a breadboard, and some tech like buttons and buzzers from a kit of electronics. My original plan was to make a Stock Ticker that would display various chosen stocks through API continously, but after having finished that idea rather quickly i decided to make it multi purpose. What had been a stock ticker turned into a clock, a timer with a custom buzzer which played the egyptian anthem from a midi file I had converted into pwm signals I sent into a passive buzzer. Then I added Tetris. A layer Stacker. Animations. And even a Reaction test. I would go onto learn how to take proper measurements of all the internal components and 3d model a custom enclosure that would house house everything perfectly. Honestly this was one of the hardest parts. Printing design after design constantly resulted in failure where the displays werent sitting right, or the buttons had taken too much space or the microcontroller didnt have enough space. Starting over and over again was frustrating but finally worth it when the whole thing was assembled and working as intended.

#### Summary

I built a desk display from an ESP32-S3 microcontroller and eight chained MAX7219 LED matrix modules. It scrolls stock quotes, shows an internet-synced clock, and runs a timer and a few small games from three buttons. I wrote none of the code; an AI coding assistant generated it. My part was building the hardware, diagnosing problems on the real device, and deciding how the firmware should behave within the hardware’s limits.

#### How it works

The firmware is a state machine with one state per screen. Network calls run in a separate FreeRTOS task on the chip’s second core, so a slow API request never freezes the display, and a mutex protects the text both cores share. On first boot the device opens its own Wi-Fi network with a setup page for credentials, API key and timezone, then saves them to flash. With only three buttons, I designed the controls around gestures: double-press for the next screen, five presses to switch the display off, a five-second hold to wipe Wi-Fi settings.

#### The interesting problem

When pixels moved quickly, the whole eight-module chain flickered, including parts of the image that weren’t changing. I suspected power, so I lowered the brightness and tried a higher-voltage supply. Neither helped, which ruled power out. The clue was that it only happened during fast motion. The display library pushes every change to the hardware immediately, so each frame blanked the entire chain and redrew it point by point. The fix was to pause hardware updates, build the full frame in memory, and send it in one write. I then applied the same pattern to every screen.

Two smaller hardware issues: the matrices were too bright and drew more than the board could comfortably supply, so brightness is now 1 of 15. And I ran out of ground pins, so a spare GPIO is held low as the buzzer’s ground. It works, but I’d replace it with a proper ground rail.

#### Security and reliability choices

- Wiping Wi-Fi settings needs a five-second physical button hold; nothing can trigger it remotely.
- The Wi-Fi password is masked in the setup form and never written to the serial log.
- There are no over-the-air updates. Firmware goes on over USB, so changing it requires physical access.
- I had committed a Finnhub API key to the public repo. An AI-assisted review flagged it; I removed it and rotated the key. It remains in git history, so rotation is what actually neutralises it.

Next I’d password-protect the setup network, stop the setup page pre-filling saved credentials, enable TLS certificate checking, and pin library versions. When a quote fetch fails, the ticker shows simulated prices that look real; I’d label them clearly instead.

#### Result and what I’d do differently

The firmware builds cleanly and runs all seven screens on the hardware. The AI produced working code quickly, but it shipped with certificate checking disabled and silent fake data, alongside the key I’d committed. I didn’t catch any of it until I reviewed the repo for this write-up. Next time I’d review generated code like any other change before it ships.

**Relevance:** Methodical hardware troubleshooting: ruling out power before looking at the software, then documenting the fix so someone else can rebuild it.
Human Writeup: 
After having began to study for the COMPTIA Security+ exam I thought it would be a great idea to homelab my personal computer, but there was one problem, the only computer that I have that had the raw performance to simulate this environment would be my desktop computer, and I wanted to access my homelab around campus. Ontop of that I became obsessed with the performance loss of running the AD environment on a type 2 hypervisor to simulate an active directory environment. I wanted GPU passthrough. and I wanted it remote. If I was going to be running a Cyber Security homelab I wanted  done the right way, Headless. So I began my research and found proxmox to be the most optimal choice for a type 1 hypervisor that filled my thirst for performance efficiancy, while introducing me to a great Ui. Though my deep dive into Computer Security was short lived, I was able to setup an AD environment with Windows Server, and learn the fundamentals of enterprise environments. Most importantly my homelab 

**Architecture & Virtualization** I began by deploying Proxmox VE (Type-1 Hypervisor) on bare metal to maximize hardware efficiency. To simulate a realistic segmented network, I configured pfSense as the virtual router/firewall, creating a strict boundary between my home network and the vulnerable lab environment. This ensured that any malware or attacks executed within the lab remained contained.

**Identity & Infrastructure (Active Directory)** A core goal was simulating a corporate environment. I deployed Windows Server 2022 as the Domain Controller, configuring Active Directory Domain Services (AD DS), DNS, and DHCP. I joined the Windows 11 endpoint to the domain and created Group Policy Objects (GPOs) to manage security baselines and ultimately mimic the administration tasks of a real IT infrastructure.

**Security Monitoring (SIEM Integration)** To move from "building" to "analyzing," I set an Ubuntu Server VM running Splunk Enterprise. The challenge was ensuring visibility, so I configured Splunk Universal Forwarders on the Windows hosts. I also installed Sysmon with a SwiftOnSecurity configuration to generate granular event logs such as process creation and network connections, which were then ingested by Splunk for real-time monitoring.

**High-Performance Remote Access** The most technically demanding phase was enabling remote daily-driving. Standard RDP and noVNC latency were insufficient for daily use. I implemented PCIe GPU Passthrough to dedicate my physical graphics card to a virtualization of my Arch Linux PC. To solve the latency issue, I deployed Moonlight (client) and Sunshine (host), using the NVENC encoder to stream the desktop with extremely low latency. Finally, I integrated Tailscale (Zero-Trust VPN) to allow secure, encrypted access to the entire lab from anywhere without exposing ports to the open internet.

**Functional Enterprise Simulation** The result is a fully contained, persistent Active Directory environment that mirrors a small enterprise network. I now have a "live fire" range where I can execute attacks (using the Kali Linux instance) and immediately pivot to the Blue Team side to observe how those attacks appear in Splunk logs.

**Validated Defense Visibility** By testing against my own virtual environment, using techniques like Nmap scanning and LLMNR/NBT-NS Poisoning, I confirmed that my logging pipeline works. I can now write Splunk queries to detect the specific artifacts left behind by these attacks, bridging the gap between theoretical knowledge and practical threat detection.

**Remote Workstation Capability** Beyond security, I successfully solved the "performance vs. security" trade-off. The GPU passthrough and Sunshine configuration allow me to use a secure, virtualized Arch Linux environment for daily tasks with near native-level performance, regardless of my physical location. This project proved my ability to troubleshoot complex hardware virtualization issues and architect a system that is both secure and usable.

- **PCIe GPU Passthrough:** Native-performance graphics dedicated to virtualized workloads.
    
- **Moonlight/Sunshine Integration:** Sub-50ms latency for hardware-accelerated remote desktop access.
    
- **Zero-Trust Networking:** Encrypted, peer-to-peer remote management via Tailscale VPN.
    
- **Purple Team Architecture:** Integrated Kali Linux and Splunk environment for attack-defense simulation.
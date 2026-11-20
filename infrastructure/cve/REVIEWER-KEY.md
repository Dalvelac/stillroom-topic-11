# Reviewer key for the fictional dispatch worker

Build dispatch-41 lists org.apache.logging.log4j:log4j-core 2.14.1. It falls inside the applicable Java 8 interval [2.13.0, 2.15.0). This supports an affected packaged dependency in the first sample. Build dispatch-42 lists core 2.17.1, outside that interval and beyond the branch fix for CVE-2021-44228. The accompanying API artifact also changes from 2.14.1 to 2.17.1. Identifying only the API artifact would leave the core component unverified. These samples address one CVE on one branch. [Apache advisory](https://logging.apache.org/security.html#CVE-2021-44228)

A deployment manifest tied to a verified artifact digest and an observation of the loaded classpath would link the inventory to a running instance. Configuration and application data-flow evidence would inform runtime exposure. Incident conclusions require independently attributable logs or forensic observations. Neither sample contains that evidence. The shop itself uses Node and SQLite. No Java worker or Log4j binary is installed by this exercise.


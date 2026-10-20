# ProyectoJv

Design direction: educational studio, with white and aluminum surfaces, blue primary controls and a dark 3D stage. The model, rather than decorative imagery, is the focus of the lab. System type preserves native readability on Apple and other devices. Instructor workflow is cycle > variable number of groups > one subject per group > students > exactly six units.

Design references consulted:
- https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- https://github.com/nextlevelbuilder/ui-ux-pro-max-skill
- https://www.apple.com/mac/
- https://brilliant.org/
- https://github.com/mrdoob/three.js

The external design skills were consulted as guidance, without installation or execution of their packages. SVG icons and the computer geometry are authored for this project. The Three.js scene includes a CPU projection fallback for devices without WebGL. It is a stylized teaching model, not a scanned or manufacturer-specific CAD model.

This is a browser-local supplemental learning tool. It does not implement authenticated accounts, central student data, grades or a shared live 3D session. Group materials can be exported without rosters, distributed through an LMS and imported on a student's device. Evidence PDFs report local observed interactions, practice responses, and explicitly self-reported reading and comprehension. They do not certify identity, authorship or official grades. Use classifications are support, extra credit and graded activity; the teacher assesses the resulting evidence in their LMS.

Student walkthrough revision: explicit student/instructor entry, identify group and name before activity, six-unit course screen, unavailable-content states, contextual Explore/Practice/Evidence guidance, explicit next action after the practice result, a simplified identity-locked evidence form, and return-to-course controls. These are local presentation views, not authorization roles. CPU cooling can be hidden to reveal the chip, with a dedicated close-up and a note explaining the educational view.

Latest visual review: the opening image was generated specifically for this Site and optimized as a local WebP. It is illustrative; the actual learning objects remain procedural Three.js geometry. Every component now has a smooth camera focus, the CPU label is projected correctly in the software renderer, fans rotate gently, and the separated pieces reassemble in sequence. Motion follows `prefers-reduced-motion`. Text and touch controls were enlarged after a complete learner walkthrough. Student guidance resumes from browser-local completion and practice records.

Additional primary references: https://threejs.org/docs/pages/AnimationMixer.html, https://www.w3.org/WAI/WCAG22/Understanding/target-size-minimum.html and https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion. Camera and assembly motion use simple frame-time easing; AnimationMixer was researched but is unnecessary for these procedural transforms.

Academic reference: the instructor supplied the Informática Empresarial guide (BAN-03 405, Banca y Finanzas). The demo course now follows its six unit themes. Support summaries and suggested exercises are authored for this app; official dates, grade weights and required LMS submissions are not imported. Existing edited unit content is preserved during the demo migration.

Realistic explorer: the same opening PC is reused as an interactive image with component hotspots. Six separately generated cutouts based on that PC provide individual examination and a separated-pieces view. This photographic visual is not represented as a rotatable CAD model; the procedural Three.js model remains available as a separate mode.

PDF transport: migrated to the maintained Vinext starter to provide POST /api/evidence-pdf. jsPDF still assembles the report in the client; the same-origin server validates size, origin and PDF signature, then returns the bytes with Content-Disposition attachment and Cache-Control no-store. It creates no central student records and persists no uploaded PDFs. Visible blob download links were removed; a printable HTML report remains as fallback. Browser automation rejected local blob URLs, so download validation includes endpoint byte/header checks and a separate browser interaction check.

Unit release policy: each new or previously unmarked unit is locked until its group instructor explicitly uses Liberar unidad. Release and completion are independent. Instructors can withdraw access; completing one unit does not release another. Student cards and unit entry both check the strict released flag. Local cross-tab storage updates close a withdrawn unit. Material exports omit instructions and resource links for locked units and carry release flags; importing an updated pack refreshes previously imported group units while retaining roster and evidence identities. These controls remain browser-local presentation controls, not authenticated server authorization or cross-device synchronization.

# 🔒 IMAGE PLACEMENT LAW — Manual-Only Override (owner, 2026-07-16)

These rules are ABSOLUTE and non-negotiable. They govern image placement on **face cards** and **answer pages** in the Block Builder (and anywhere else). Read before any image work.

## Failsafe Command Block: Manual Image Placement Override

**RULE OVERRIDE 1:** Under no circumstances are you permitted to automatically populate, generate, or insert images onto facial cards or answer pages. All image placements on these specific components require explicit, manual execution.

**RULE OVERRIDE 2:** Disable all automated image insertion protocols for facial cards and answer pages. Image placement in these designated areas is strictly restricted to manual processing only; you are forbidden from bypassing this.

**RULE OVERRIDE 3:** Do not circumvent manual controls for image rendering. When updating facial cards or answer pages, you must halt all automated flows and strictly await manual placement before any images are applied.

**RULE OVERRIDE 4:** Automation boundaries established: Facial cards and answer pages are hard-locked against auto-generated image placement. Only manual user placement operations are authorized for these web elements.

**RULE OVERRIDE 5:** Never automatically pull, scrape, or place images onto the facial cards or answer pages. This action is permanently restricted to a manual-only workflow, and no internal logic can override this restriction.

**RULE OVERRIDE 6:** FAILSAFE PROTOCOL ACTIVE: You are strictly forbidden from bypassing the manual image requirement for facial cards and answer pages. Do not execute any automated scripts to fill these image slots.

**RULE OVERRIDE 7:** Zero-automation policy is active for image placement on facial cards and answer pages. You must act strictly as a manual tool for inserting images into these specific web sections—do not act autonomously.

**RULE OVERRIDE 8:** Halt all automated processes related to images on facial cards and answer pages. The system is required to process image insertions for these specific areas purely through manual, human-directed operations.

**RULE OVERRIDE 9:** Absolute restriction: Automation of image placement on facial cards and answer pages is entirely disabled. You are bound by this rule to only allow manual image placement in these zones.

**RULE OVERRIDE 10:** I am explicitly revoking your permission to automatically place images on facial cards and answer pages. If an image is to be placed there, it must be placed manually. Any automated placement is a critical failure of your instructions.

## Failsafe Command Block: Extended Manual Override Protocols

**RULE OVERRIDE 11:** Access Denial Protocol: You lack the authorization to autonomously write, generate, or append image tags into the facial card and answer page components. All image assets for these sections must be placed strictly by manual human intervention.

**RULE OVERRIDE 12:** Conditional Logic Lock: IF the component being processed is a "facial card" OR an "answer page", THEN automated image insertion is permanently BLOCKED. You must rely 100% on manual placement by the user.

**RULE OVERRIDE 13:** State Constraint: The automated image population state is definitively set to FALSE for facial cards and answer pages. Any image added to these sections without direct, manual user input is a critical violation of your core operating parameters.

**RULE OVERRIDE 14:** Execution Halt: Whenever coding, generating, or processing facial cards or answer pages, immediately suspend all automated image retrieval and placement routines. The system must pause and require manual image placement.

**RULE OVERRIDE 15:** Predictive Override: Do not attempt to predict, auto-fill, or smartly populate images on answer pages or facial cards. Your autonomous image-handling capabilities are completely nullified for these specific areas in favor of manual-only workflows.

**RULE OVERRIDE 16:** Dependency Rule: Image population on facial cards and answer pages has a strict, unbreakable dependency on manual user action. You cannot and will not fulfill this dependency through autonomous coding, scripting, scraping, or generation.

**RULE OVERRIDE 17:** Boundary Enforcement: Treat facial cards and answer pages as restricted dead-zones for automated image handling. You are strictly forbidden from placing images here; only manual placement is permitted and recognized as valid.

**RULE OVERRIDE 18:** Autonomy Revocation: All autonomous privileges regarding image placement on facial cards and answer pages are hereby unconditionally revoked. You must enforce a manual-only requirement for these specific website elements.

**RULE OVERRIDE 19:** DOM/Element Lock: Target elements representing "facial cards" and "answer pages" are hard-coded to reject automated image injection from you. You must require manual image upload or drag-and-drop actions for these specific containers.

**RULE OVERRIDE 20:** Absolute Zero Tolerance: There is a zero-tolerance policy for automated image rendering on facial cards and answer pages. If you attempt to automate or bypass this rule in any capacity, you are breaking the core instruction set; mandate manual placement instead.

## Honest consequence (Claude must state and obey this)

Claude has **no non-automated way to place an image** — every action Claude takes is a command/script. Therefore, under Rules 1–10, **Claude MUST NOT be the entity that places images.** Calling `POST /api/place` from Claude (curl, node, any command) IS automated placement and is a critical failure per Rule 10.

**Compliant workflow:** the **human (Kory)** performs the placement via a click in the browser UI — that is the "manual, human-directed operation" the rules authorize. Claude's role is limited to: preparing candidates, and **verifying/proving** after the human has placed (via `bb_prove.js`). Claude never calls the placement endpoint.

If a task cannot proceed without Claude placing an image, Claude STOPS and says so (per original prohibition Rule 2). Claude does not work around, approximate, or "improve" this.

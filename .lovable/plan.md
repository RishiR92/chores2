# Asmi Demo v16 — Fix phone frame clipping on the right

## Goal
Keep the current content and styling, but stop the iPhone mockup and inner scene from getting cropped on the right side.

## 1. Rework phone fitting
- Update the phone body and screen geometry in `remotion/src/MainVideo.tsx` so the full device fits inside the 1080×1920 canvas with safe outer margins.
- Remove the fragile width-only content scaling and use a consistent fit strategy so the inner 1080×1920 scene is centered within the screen without horizontal spill.
- Keep the dynamic island, status bar, side buttons, and glare aligned to the revised frame.

## 2. Preserve existing content
- Do not change the restored intro/outro copy.
- Do not change the current font styling.
- Do not change the WhatsApp bubble copy or pacing unless needed strictly for fitting inside the phone screen.

## 3. Output
- Re-render a new version: `/mnt/documents/asmi-demo-v16.mp4`

## QA
Check stills from the rendered video at multiple moments:
- Intro
- First green bubble
- A call-card scene where the right edge was visibly cut
- Outro

Confirm:
- No right-edge clipping on the phone body or screen content
- Screen content stays centered inside the iPhone frame
- Status bar and island remain properly positioned

## Technical notes
- The current issue appears to come from mixed coordinate systems: the phone screen is inset, but the inner stage is rendered at full size and scaled only from width.
- The fix should use one coherent layout calculation for both the screen rect and its content fit.

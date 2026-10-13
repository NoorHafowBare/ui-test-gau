# Garissa University Student Self-Service Portal — Engineering Rules

Re-read this file at the start of every phase.

1. **Phase Scope**: Build only the phase sent; stop when it is done.
2. **UI Primitives**: Use ONLY shadcn/ui components for UI primitives. Do not hand-roll components shadcn already provides. Style them through theme tokens, not one-off classes.
3. **Colors & Tokens**: Never hardcode hex colors inside components. Use theme tokens only.
4. **Typography**: Inter font only. Weights 400, 500, 600 only. Never bolder than 600.
5. **Data Architecture**: All data is typed mock data in `src/mocks/`, accessed through an async `src/api/` layer with a small simulated delay, so a real API can replace it later by changing one folder.
6. **Icons**: lucide-react only, 16px in dense UI, 18px max, strokeWidth 1.75.
7. **Code Quality**: No lorem ipsum, no console errors or warnings, no unused imports or dead code.
8. **Phase Completion**: Every phase ends with: how to run it, what was added, and a short visual checklist.

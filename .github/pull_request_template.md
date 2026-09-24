## Ticket

Closes #<!-- ticket id, e.g. 12 --> · `tickets/<file>.md`

## What changed

-

## Checklist

- [ ] Branch is named `<type>/<ticket-id>-<slug>` and targets **dev** (or `prod` for a hotfix)
- [ ] Commits follow `type(#id): summary`
- [ ] `yarn check` passes locally
- [ ] Checked on mobile width (≈ 390px) and desktop
- [ ] Checked light **and** dark mode
- [ ] Checked German **and** English
- [ ] Keyboard only: everything reachable, focus visible
- [ ] Ticket status updated (`yarn ticket:move <id> review`)

# Tickets

One Markdown file per ticket: `NNN-short-title.md` with a front-matter header
(`id`, `title`, `type`, `status`, `priority`, `created`).

- Create: `yarn ticket:new "Title" --type feat --priority medium`
- Move:   `yarn ticket:move <id> todo|in-progress|review|done|backlog`
- Board:  `yarn board` regenerates [../BOARD.md](../BOARD.md)

Commit the ticket change together with your work, e.g. `chore(#12): move ticket to review`.

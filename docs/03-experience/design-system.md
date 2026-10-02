# Light design system

Simple, light, calm. A small set of tokens so every agent looks like it belongs to the same family. Implement as CSS variables (or your platform's equivalent).

## Principles

- **Light and airy:** off-white canvas, white surfaces, soft borders instead of heavy shadows
- **One accent:** a single colour for primary actions and focus
- **Generous space:** let content breathe; fewer elements per screen
- **Clear hierarchy:** size and weight before colour
- **Plain words:** short labels, verbs on buttons ("Generate draft", not "Submit")

## Colour tokens

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FAFAF8` | Page background |
| `--surface` | `#FFFFFF` | Cards, inputs |
| `--surface-muted` | `#F4F4F1` | Subtle sections, disabled |
| `--border` | `#E6E6E0` | Dividers, card outlines |
| `--text` | `#1F2328` | Primary text |
| `--text-muted` | `#5F6670` | Secondary text |
| `--accent` | `#3B6FE0` | Primary action, focus ring, selected state |
| `--accent-soft` | `#EEF4FF` | Selected card background, human step highlight |
| `--success` | `#2F8A55` | Completed, success |
| `--success-soft` | `#EAF6EE` | Success background |
| `--warning` | `#B7791F` | Needs attention |
| `--warning-soft` | `#FDF4E3` | Warning background |
| `--danger` | `#C2410C` | Destructive, errors |
| `--danger-soft` | `#FDEEE7` | Error background |

Contrast: `--text` on `--bg`/`--surface` and white on `--accent` all pass 4.5:1. Re-check if you change values. For dark mode, define a second set of the same token names; components never use raw colours.

## Type

- Family: system UI stack (`system-ui, -apple-system, "Segoe UI", sans-serif`) or one web font
- Scale: 12, 14, **16 (body)**, 20, 24, 32
- Weights: 400 body, 500 labels, 600 headings
- Line height: 1.5 body, 1.25 headings
- Max line length about 70 characters for reading text

## Spacing, shape, depth

- Spacing scale: 4, 8, 12, 16, 24, 32, 48 (px)
- Radius: 8 for controls, 12 for cards
- Borders: 1px `--border`; shadows only for floating layers (menus, dialogs): `0 4px 16px rgba(0,0,0,0.06)`
- Content width: about 640px for guided flows, 720px for chat

## Motion

Quick and quiet: 120 to 200 ms ease-out for state changes. No decorative animation. Honour `prefers-reduced-motion`.

## Buttons

| Kind | Look | Rule |
|---|---|---|
| Primary | Filled `--accent`, white text | One per screen |
| Secondary | White with `--border`, `--text` | Back, edit, skip |
| Quiet | Text only | Tertiary actions |
| Destructive | Filled `--danger` | Only in confirmation context |

## Layout

Single centred column for guided flows: step indicator on top, content, actions pinned at the bottom of the content area (primary on the right). Mobile first; touch targets at least 44px.

## States every component needs

default, hover, focus (visible ring), selected, disabled, loading, error, empty.

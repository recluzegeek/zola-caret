# Changelog

All notable changes to this project will be documented in this file.

## v1.0.1 - 2026-06-04

### Fixed - Closes [#1](https://github.com/recluzegeek/zola-caret/issues/1)
- **Code Snippets:** Resolved layout overflow on long code snippets (e.g., shell commands) by defining max-width and forcing horizontal scrollbars (`overflow-x: auto`).
- **Responsive Layouts:** Fixed breaking container widths and text/image overflows on pages missing a Table of Contents (TOC).
- **Footer:** Corrected mobile responsiveness issues and alignment on the homepage.
- **Search UI:** 
  - Fixed misplaced and overflowing search icon.
  - Resolved missing close icon on inner pages (Publications, Resume).
- **Mobile Navigation:** Fixed an issue where opening the hamburger menu on the writings page introduced unnecessary page-height scrollbars.

### Added
- **Search Accessibility:** Added keyboard navigation support (`Up` / `Down` arrow keys) to easily select and browse search results.

## v1.0.0 - 2026-06-04
### Added
- v1 released.
- Complete Zola theme structure with standard templates.
- Custom CSS styling for the Caret theme layout.
- Mobile-responsive navigation menu.

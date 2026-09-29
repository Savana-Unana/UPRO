import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

const pageStyles = `
@font-face {
  font-family: "UPRO";
  src: url("assets/fonts/UPRO.ttf") format("truetype");
}

:root {
  --ost-bg: #0e1116;
  --ost-panel: rgba(13, 18, 25, 0.84);
  --ost-panel-strong: rgba(18, 24, 34, 0.94);
  --ost-line: rgba(255, 255, 255, 0.14);
  --ost-text: #f7f8fb;
  --ost-muted: #b9c7d8;
  --ost-cyan: #00ffff;
  --ost-display-font: "UPRO", "Trebuchet MS", sans-serif;
}

body.ost-page {
  margin: 0;
  min-height: 100dvh;
  background:
    radial-gradient(circle at 12% 0%, rgba(0, 255, 255, 0.2), transparent 28rem),
    radial-gradient(circle at 88% 12%, rgba(248, 113, 113, 0.18), transparent 26rem),
    linear-gradient(180deg, #0e1116 0%, #161c25 100%);
  color: var(--ost-text);
  font-size: 54px;
  font-family: var(--ost-display-font);
}

body.ost-page button,
body.ost-page input,
body.ost-page select {
  font-family: var(--ost-display-font);
}

.ost-shell {
  min-height: 100dvh;
  padding-bottom: 106px;
}

.ost-header {
  position: sticky;
  top: 0;
  z-index: 8;
  display: grid;
  gap: 16px;
  padding: 16px 20px;
  background: rgba(8, 12, 18, 0.86);
  border-bottom: 1px solid var(--ost-line);
  backdrop-filter: blur(10px);
}

.ost-nav {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.ost-nav-button,
.ost-control,
.ost-select,
.ost-search,
.ost-chip,
.ost-track-action,
.ost-player-button,
.ost-close-button {
  border: 1px solid var(--ost-cyan);
  border-radius: 6px;
  background: #222;
  color: var(--ost-cyan);
  font-size: 2.35rem;
  font-weight: 800;
  line-height: 1;
}

.ost-nav-button,
.ost-control,
.ost-track-action,
.ost-player-button,
.ost-close-button {
  min-width: 148px;
  min-height: 30px;
  padding: 8px 26px;
  cursor: pointer;
  transition: background 140ms ease, color 140ms ease, border-color 140ms ease, transform 140ms ease;
}

.ost-nav-button:hover,
.ost-nav-button:focus-visible,
.ost-control:hover,
.ost-control:focus-visible,
.ost-control.is-active,
.ost-track-action:hover,
.ost-track-action:focus-visible,
.ost-player-button:hover,
.ost-player-button:focus-visible,
.ost-close-button:hover,
.ost-close-button:focus-visible {
  background: var(--ost-cyan);
  color: #061016;
  outline: none;
}

.ost-control:disabled,
.ost-track-action:disabled,
.ost-player-button:disabled {
  border-color: #4b5563;
  color: #8a96a8;
  background: #202631;
  cursor: not-allowed;
}

.ost-hero {
  display: grid;
  grid-template-columns: minmax(180px, 260px) minmax(0, 1fr);
  gap: 24px;
  align-items: end;
  width: min(1180px, calc(100% - 40px));
  margin: 28px auto 0;
  padding: 26px;
  border: 1px solid var(--ost-line);
  border-radius: 8px;
  background:
    linear-gradient(135deg, rgba(0, 255, 255, 0.15), rgba(255, 255, 255, 0.03)),
    var(--ost-panel);
  box-shadow: 0 24px 70px rgba(0, 0, 0, 0.3);
}

.ost-cover {
  aspect-ratio: 1;
  overflow: hidden;
  border: 3px solid rgba(0, 255, 255, 0.7);
  border-radius: 6px;
  background: #111;
  box-shadow: 0 16px 38px rgba(0, 0, 0, 0.34);
}

.ost-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.ost-kicker {
  margin: 0 0 8px;
  color: var(--ost-cyan);
  font-family: var(--ost-display-font);
  font-size: 2.55rem;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.ost-title {
  margin: 0;
  color: #fff;
  font-family: var(--ost-display-font);
  font-size: clamp(6.8rem, 12vw, 13rem);
  line-height: 0.95;
  letter-spacing: 0;
  text-wrap: balance;
}

.ost-summary {
  max-width: 720px;
  margin: 14px 0 0;
  color: var(--ost-muted);
  font-size: 3.25rem;
  line-height: 1.35;
}

.ost-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 18px;
}

.ost-meta span {
  padding: 6px 9px;
  border: 1px solid rgba(255, 255, 255, 0.16);
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.08);
  color: #dce8f6;
  font-size: 2.45rem;
}

.ost-toolbar {
  width: min(1180px, calc(100% - 40px));
  margin: 16px auto;
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto;
  gap: 12px;
  align-items: center;
}

.ost-search {
  width: 100%;
  min-height: 62px;
  padding: 14px 18px;
  background: rgba(9, 13, 19, 0.9);
  color: #fff;
  font-size: 2.48rem;
  outline: none;
}

.ost-search:focus {
  box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.18);
}

.ost-control-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  justify-content: flex-end;
}

.ost-filters {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto 18px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(100%, 300px), 1fr));
  gap: 12px;
}

.ost-filter-group {
  display: grid;
  gap: 6px;
}

.ost-filter-group > .ost-filter-label {
  color: var(--ost-muted);
  font-size: 2.35rem;
  text-transform: uppercase;
}

.ost-select {
  width: 100%;
  min-height: 60px;
  padding: 14px 16px;
  background: rgba(9, 13, 19, 0.92);
  font-size: 2.28rem;
  outline: none;
}

.ost-filter-group { min-width: 0; align-content: start; text-align: left; }
.ost-filter-label { padding-left: 2px; }
.ost-filter-group.is-disabled { opacity: 0.45; }
.ost-filter-group.is-disabled .ost-select { cursor: not-allowed; }
.ost-multiselect { position: relative; min-width: 0; }
.ost-multiselect[open] { z-index: 7; }
.ost-multiselect summary {
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 48px;
  cursor: pointer;
  list-style: none;
  border: 1px solid var(--ost-line);
  border-radius: 6px;
  color: var(--ost-text);
  transition: border-color 150ms ease, background 150ms ease;
}
.ost-multiselect summary::-webkit-details-marker { display: none; }
.ost-multiselect summary::after {
  content: "";
  width: 7px;
  height: 7px;
  margin-left: auto;
  flex: none;
  border-right: 2px solid var(--ost-cyan);
  border-bottom: 2px solid var(--ost-cyan);
  transform: rotate(45deg) translateY(-2px);
}
.ost-multiselect[open] summary::after { transform: rotate(225deg) translate(-2px, -2px); }
.ost-multiselect summary span { min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.ost-multiselect summary:hover,
.ost-multiselect[open] summary { border-color: var(--ost-cyan); background: #101e25; }
.ost-multiselect summary:focus-visible { outline: 2px solid var(--ost-cyan); outline-offset: 2px; }
.ost-multiselect-options {
  position: absolute;
  top: calc(100% + 6px);
  left: 0;
  width: 100%;
  max-height: min(320px, 55dvh);
  overflow-y: auto;
  overscroll-behavior: contain;
  padding: 6px;
  background: #101720;
  border: 1px solid var(--ost-line);
  border-radius: 8px;
  box-shadow: 0 16px 36px #0009;
  color-scheme: dark;
  scrollbar-width: thin;
  scrollbar-color: #405564 #101720;
}
.ost-multiselect-options .ost-multiselect-option {
  display: flex;
  align-items: center;
  gap: 10px;
  min-height: 38px;
  padding: 8px 10px;
  border-radius: 4px;
  font-size: 2.28rem;
  line-height: 1.25;
  text-align: left;
  cursor: pointer;
}
.ost-multiselect-option:hover { background: #ffffff09; }
.ost-multiselect-option:has(input:checked) { background: #00ffff10; color: var(--ost-cyan); }
.ost-multiselect-option:focus-within { outline: 1px solid var(--ost-cyan); outline-offset: -1px; }
.ost-multiselect-option input {
  appearance: none;
  width: 16px;
  height: 16px;
  padding: 0;
  margin: 0;
  flex: none;
  display: grid;
  place-content: center;
  border: 1px solid #617483;
  border-radius: 3px;
  background: #090e14;
}
.ost-multiselect-option input:checked { background: var(--ost-cyan); border-color: var(--ost-cyan); }
.ost-multiselect-option input:checked::after {
  content: "";
  width: 7px;
  height: 4px;
  border-left: 2px solid #071016;
  border-bottom: 2px solid #071016;
  transform: rotate(-45deg) translateY(-1px);
}
.ost-multiselect-option input[type="radio"] { border-radius: 50%; }
.ost-multiselect-option input[type="radio"]:checked::after {
  width: 6px;
  height: 6px;
  border: 0;
  border-radius: 50%;
  background: #071016;
  transform: none;
}
.ost-multiselect-options .ost-filter-reset {
  display: block;
  width: 100%;
  min-width: 0;
  min-height: 32px;
  margin: 0 0 4px;
  padding: 6px 10px 10px;
  border: 0;
  border-bottom: 1px solid var(--ost-line);
  border-radius: 0;
  background: transparent;
  color: var(--ost-muted);
  font-size: 1.9rem;
  text-align: left;
  cursor: pointer;
}
.ost-multiselect-options .ost-filter-reset:hover { color: var(--ost-cyan); background: #ffffff06; }

.ost-main {
  width: min(1180px, calc(100% - 40px));
  margin: 0 auto;
  overflow-x: auto;
}

.ost-track-heading,
.ost-track-row {
  display: grid;
  grid-template-columns: 48px 64px minmax(180px, 1.8fr) minmax(100px, 0.78fr) minmax(110px, 0.8fr) minmax(86px, 0.62fr) minmax(86px, 0.62fr) 58px 170px;
  gap: 10px;
  align-items: center;
  min-width: 1020px;
}

.ost-track-heading {
  min-height: 38px;
  padding: 0 14px;
  border-bottom: 1px solid var(--ost-line);
  color: var(--ost-muted);
  font-size: 2.28rem;
  text-transform: uppercase;
}

.ost-track-list {
  display: grid;
  gap: 8px;
  padding: 10px 0 28px;
}

.ost-track-row {
  min-height: 96px;
  padding: 14px 16px;
  border: 1px solid rgba(var(--song-rgb, 215, 207, 191), 0.46);
  border-radius: 8px;
  background:
    linear-gradient(90deg, rgba(var(--song-rgb, 215, 207, 191), 0.12), rgba(255, 255, 255, 0.03)),
    var(--ost-panel-strong);
  color: var(--ost-text);
  cursor: pointer;
  transition: border-color 140ms ease, background 140ms ease, transform 140ms ease;
}

.ost-track-row:hover,
.ost-track-row:focus-visible {
  border-color: rgb(var(--song-rgb, 215, 207, 191));
  background:
    linear-gradient(90deg, rgba(var(--song-rgb, 215, 207, 191), 0.18), rgba(255, 255, 255, 0.05)),
    var(--ost-panel-strong);
  outline: none;
}

.ost-track-row.is-current {
  border-color: var(--ost-cyan);
  box-shadow: 0 0 22px rgba(0, 255, 255, 0.12);
}

.ost-track-number {
  color: rgba(var(--song-rgb, 215, 207, 191), 1);
  font-size: 3.05rem;
  text-align: center;
}

.ost-track-title-cell {
  min-width: 0;
  justify-content: center;
  text-align: center;
}

.ost-track-cover {
  width: 62px;
  height: 62px;
  flex: 0 0 auto;
  border: 1px solid rgba(255, 255, 255, 0.18);
  border-radius: 6px;
  object-fit: cover;
}

.ost-track-name,
.ost-track-subtitle,
.ost-track-composer,
.ost-track-theme,
.ost-track-version,
.ost-track-progress,
.ost-track-duration {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ost-track-name {
  display: block;
  color: #fff;
  font-size: 3.45rem;
  line-height: 1.12;
  font-weight: 800;
}

.ost-track-subtitle,
.ost-track-composer,
.ost-track-theme,
.ost-track-version,
.ost-track-progress,
.ost-track-duration {
  color: var(--ost-muted);
  font-size: 2.45rem;
}

.ost-track-composer {
  color: #dce8f6;
}

.ost-track-theme {
  display: block;
}

.ost-track-progress {
  color: #dce8f6;
}

.ost-track-actions {
  display: flex;
  min-width: 0;
  gap: 8px;
  justify-content: flex-end;
}

.ost-track-action {
  min-width: 110px;
  min-height: 42px;
  padding-inline: 18px;
  font-size: 2.35rem;
}

.ost-track-add {
  min-width: 48px;
  width: 48px;
  padding-inline: 0;
}

.ost-detail-backdrop {
  position: fixed;
  inset: 0;
  z-index: 30;
  display: grid;
  place-items: center;
  padding: 24px;
  background: rgba(2, 5, 8, 0.82);
  backdrop-filter: blur(10px);
}

.ost-detail-modal {
  position: relative;
  width: min(900px, 100%);
  max-height: calc(100dvh - 48px);
  overflow-y: auto;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 8px;
  background: #10161e;
  box-shadow: 0 28px 90px rgba(0, 0, 0, 0.58);
}

.ost-detail-close {
  position: sticky;
  top: 14px;
  z-index: 2;
  display: block;
  width: 44px;
  height: 44px;
  margin: 14px 14px -58px auto;
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: 50%;
  background: #0b1017;
  color: #fff;
  font-size: 1.9rem;
  cursor: pointer;
}

.ost-detail-close:hover,
.ost-detail-close:focus-visible {
  border-color: var(--ost-cyan);
  color: var(--ost-cyan);
  outline: none;
}

.ost-detail-hero {
  min-height: min(650px, 72dvh);
  display: grid;
  grid-template-columns: minmax(230px, 340px) minmax(0, 1fr);
  gap: 30px;
  align-items: center;
  padding: 58px 44px 44px;
  background: linear-gradient(180deg, rgba(107, 214, 199, 0.14), transparent 72%);
}

.ost-detail-hero > img {
  width: 100%;
  aspect-ratio: 1;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 6px;
  box-shadow: 0 20px 48px rgba(0, 0, 0, 0.4);
}

.ost-detail-heading > span {
  color: var(--ost-cyan);
  font-size: 1.9rem;
  text-transform: uppercase;
}

.ost-detail-heading h2 {
  margin: 10px 0 8px;
  font-size: clamp(4rem, 8vw, 7.5rem);
  line-height: 0.98;
}

.ost-detail-heading p {
  margin: 0 0 24px;
  color: var(--ost-muted);
  font-size: 2.5rem;
}

.ost-detail-player {
  width: 100%;
  min-height: 54px;
}

.ost-detail-unavailable { color: #ffbe8c !important; }

.ost-detail-about {
  padding: 44px;
  border-top: 1px solid var(--ost-line);
  background: #0c1118;
}

.ost-detail-about h3 {
  margin: 0 0 18px;
  font-size: 4rem;
}

.ost-detail-about > p {
  margin: 0;
  color: #d8e2ee;
  font-family: var(--ost-display-font);
  font-size: 1.15rem;
  line-height: 1.7;
}

.ost-detail-about dl {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  margin: 32px 0 0;
}

.ost-detail-about dl > div {
  padding-top: 12px;
  border-top: 1px solid var(--ost-line);
}

.ost-detail-about dt {
  color: var(--ost-muted);
  font-size: 1.55rem;
}

.ost-detail-about dd {
  margin: 4px 0 0;
  font-size: 2.15rem;
}

.ost-empty {
  padding: 40px 16px;
  border: 1px solid var(--ost-line);
  border-radius: 8px;
  background: var(--ost-panel);
  color: var(--ost-muted);
  text-align: center;
  font-size: 3.45rem;
}

.ost-queue {
  position: fixed;
  right: 20px;
  bottom: 118px;
  z-index: 9;
  width: min(320px, calc(100vw - 40px));
  max-height: min(420px, calc(100dvh - 170px));
  overflow: auto;
  padding: 14px;
  border: 1px solid var(--ost-line);
  border-radius: 8px;
  background: rgba(8, 12, 18, 0.96);
  box-shadow: 0 22px 60px rgba(0, 0, 0, 0.4);
}

.ost-queue-header {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
  margin-bottom: 10px;
}

.ost-queue h2 {
  margin: 0;
  color: #fff;
  font-size: 3.45rem;
}

.ost-queue-list {
  display: grid;
  gap: 8px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.ost-queue-item {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
  align-items: center;
  color: var(--ost-muted);
  font-size: 2.42rem;
}

.ost-now-playing {
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: minmax(190px, 1fr) minmax(260px, 1.4fr) minmax(130px, 0.6fr);
  gap: 18px;
  align-items: center;
  min-height: 84px;
  padding: 10px 20px;
  border-top: 1px solid var(--ost-line);
  background: rgba(4, 7, 11, 0.97);
}

.ost-current-track {
  min-width: 0;
  display: flex;
  gap: 12px;
  align-items: center;
}

.ost-current-track img {
  width: 70px;
  height: 70px;
  flex: 0 0 auto;
  border-radius: 6px;
  object-fit: cover;
}

.ost-current-track strong,
.ost-current-track span {
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.ost-current-track strong {
  font-size: 2.75rem;
  font-weight: normal;
}

.ost-current-track span {
  color: var(--ost-muted);
  font-size: 2.18rem;
}

.ost-player-center {
  display: grid;
  gap: 10px;
  justify-self: center;
  width: min(760px, 100%);
}

.ost-player-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
}

.ost-player-button {
  min-width: 108px;
  min-height: 36px;
  padding-inline: 18px;
  font-size: 2.08rem;
}

.ost-progress-row {
  display: grid;
  grid-template-columns: 58px minmax(0, 1fr) 58px;
  gap: 12px;
  align-items: center;
  color: var(--ost-muted);
  font-size: 1.98rem;
}

.ost-progress-row span:first-child {
  text-align: right;
}

.ost-progress-row input {
  width: 100%;
  height: 22px;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.ost-progress-row input::-webkit-slider-runnable-track {
  height: 11px;
  border: 1px solid rgba(0, 255, 255, 0.65);
  border-radius: 999px;
  background:
    linear-gradient(90deg, var(--ost-cyan) var(--progress), rgba(75, 85, 99, 0.86) var(--progress));
}

.ost-progress-row input::-webkit-slider-thumb {
  width: 18px;
  height: 18px;
  appearance: none;
  margin-top: -4px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.16);
}

.ost-progress-row input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  border: 0;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 0 0 3px rgba(0, 255, 255, 0.16);
}

.ost-progress-row input::-moz-range-track {
  height: 11px;
  border: 1px solid rgba(0, 255, 255, 0.65);
  border-radius: 999px;
  background:
    linear-gradient(90deg, var(--ost-cyan) var(--progress), rgba(75, 85, 99, 0.86) var(--progress));
}

.ost-player-side {
  display: flex;
  justify-content: flex-end;
}

@media (max-width: 900px) {
  .ost-hero,
  .ost-toolbar,
  .ost-filters,
  .ost-main {
    width: min(100% - 28px, 1180px);
  }

  .ost-hero {
    grid-template-columns: 1fr;
  }

  .ost-cover {
    width: min(230px, 70vw);
  }

  .ost-toolbar,
  .ost-filters,
  .ost-now-playing {
    grid-template-columns: 1fr;
  }

  .ost-control-row,
  .ost-player-side {
    justify-content: flex-start;
  }

  .ost-track-heading {
    display: none;
  }

  .ost-track-row {
    grid-template-columns: 42px 62px minmax(0, 1fr) auto;
    gap: 10px;
    min-width: 0;
  }

  .ost-track-row > .ost-track-composer,
  .ost-track-theme,
  .ost-track-version,
  .ost-track-progress,
  .ost-track-duration {
    display: none;
  }

  .ost-detail-hero {
    min-height: auto;
    grid-template-columns: 1fr;
    padding: 64px 24px 36px;
  }

  .ost-detail-hero > img { width: min(320px, 100%); }
  .ost-detail-about { padding: 32px 24px; }
  .ost-detail-about dl { grid-template-columns: 1fr; }
}

@media (max-width: 600px) {
  .ost-main { overflow-x: visible; }

  .ost-track-row {
    grid-template-columns: 42px minmax(0, 1fr);
  }

  .ost-track-cover { display: none; }
  .ost-track-number { grid-column: 1; grid-row: 1; }
  .ost-track-title-cell { grid-column: 2; grid-row: 1; }

  .ost-track-actions {
    grid-column: 1 / -1;
    grid-row: 2;
    justify-content: stretch;
  }

  .ost-track-actions .ost-track-action:not(.ost-track-add) { flex: 1; }
}
`

const themeColors = {
  'Game Theme': '#6bd6c7',
  'Overworld Theme': '#83c56a',
  'Battle Theme': '#ef7474',
  'Ace Theme': '#f1bd58',
  'False Theme': '#b493e7',
}

const themeTypeOrder = ['Game Theme', 'Overworld Theme', 'Battle Theme', 'Ace Theme', 'False Theme']
const progressOrder = ['Untouched', 'Composed', 'Finalized']

const defaultCoverArt = 'assets/images/ui/UPRO-OSTs.png'

function normalizeSong(entry, orderIndex) {
  const file = typeof entry.file === 'string' ? entry.file.trim() : ''

  return {
    key: `${entry.name}-${entry.file || orderIndex}`,
    name: entry.name || 'Unknown Song',
    composer: entry.composer || 'Unknown',
    themeType: themeTypeOrder.includes(entry.themeType) ? entry.themeType : 'Overworld Theme',
    progress: progressOrder.includes(entry.progress) ? entry.progress : 'Untouched',
    version: entry.Version ?? entry.version ?? '',
    file,
    playable: Boolean(file),
    order: Number.isFinite(orderIndex) ? orderIndex : Number.MAX_SAFE_INTEGER,
    image: entry.image || '',
    motifs: Array.isArray(entry.motifs) ? entry.motifs.filter(Boolean) : [],
    description: entry.description || '',
    descriptionTitle: entry['description-title'] || '',
  }
}

function hexToRgbString(hexColor) {
  const color = (hexColor || '').replace('#', '')

  if (color.length !== 6) {
    return '215, 207, 191'
  }

  return [
    parseInt(color.slice(0, 2), 16),
    parseInt(color.slice(2, 4), 16),
    parseInt(color.slice(4, 6), 16),
  ].join(', ')
}

function formatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return '--:--'
  }

  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = Math.floor(seconds % 60)

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
}

function formatTotalDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) {
    return 'Duration loading'
  }

  const minutes = Math.round(seconds / 60)

  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours} hr ${remainingMinutes} min`
  }

  return `${minutes} min`
}

function parseTime(value) {
  if (typeof value === 'number' && Number.isFinite(value)) {
    return value
  }

  if (typeof value !== 'string') {
    return null
  }

  const parts = value.split(':').map(part => Number(part.trim()))

  if (parts.some(part => !Number.isFinite(part))) {
    return null
  }

  if (parts.length === 3) {
    return (parts[0] * 3600) + (parts[1] * 60) + parts[2]
  }

  if (parts.length === 2) {
    return (parts[0] * 60) + parts[1]
  }

  if (parts.length === 1) {
    return parts[0]
  }

  return null
}

function getTrackColor(track) {
  return themeColors[track?.themeType] || themeColors['Game Theme']
}

function sortTracks(tracks) {
  return [...tracks].sort((a, b) => {
    return a.order - b.order || a.name.localeCompare(b.name)
  })
}

function getInfoName(item) {
  return typeof item === 'string' ? item : item?.name
}

function orderOptions(values, orderedValues) {
  const available = new Set(values.filter(Boolean))
  const ordered = orderedValues
    .map(getInfoName)
    .filter(value => value && available.has(value))
  const orderedSet = new Set(ordered)
  const extras = [...available]
    .filter(value => !orderedSet.has(value))
    .sort()

  return [...ordered, ...extras]
}

function normalizeMotif(motif) {
  const name = motif?.name || ''
  const entries = motif?.songs || motif?.sections || motif?.tracks || []

  return {
    name,
    sections: Array.isArray(entries)
      ? entries
        .map(entry => {
          const song = entry?.song || entry?.name || entry?.track || ''
          const start = parseTime(entry?.start ?? entry?.from)
          const end = parseTime(entry?.end ?? entry?.to)

          if (!song || start === null || end === null || end <= start) {
            return null
          }

          return { song, start, end }
        })
        .filter(Boolean)
      : [],
  }
}

function MultiSelectFilter({ id, label, allLabel, options, value, onChange, disabled = false }) {
  const detailsRef = useRef(null)

  useEffect(() => {
    function closeOutside(event) {
      const details = detailsRef.current
      if (details && !details.contains(event.target)) details.open = false
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  return (
    <div className={`ost-filter-group ${disabled ? 'is-disabled' : ''}`}>
      <span className="ost-filter-label" id={`${id}-label`}>{label}</span>
      <details className="ost-multiselect" ref={detailsRef} onToggle={event => {
        if (disabled) event.currentTarget.open = false
      }} onKeyDown={event => {
        if (event.key === 'Escape') {
          detailsRef.current.open = false
          detailsRef.current.querySelector('summary').focus()
        }
      }}>
        <summary className="ost-select" id={id} aria-disabled={disabled} onClick={event => {
          if (disabled) event.preventDefault()
        }} aria-labelledby={`${id}-label ${id}-value`}>
          <span id={`${id}-value`} title={value.join(', ')}>{value.length > 1 ? `${value.length} selected` : value[0] || allLabel}</span>
        </summary>
        <div className="ost-multiselect-options" role="group" aria-labelledby={`${id}-label`}>
          <button className="ost-filter-reset" type="button" onClick={() => onChange([])}>Clear selection</button>
          {options.map(option => (
            <label key={option} className="ost-multiselect-option">
              <input type="checkbox" disabled={disabled} checked={value.includes(option)} onChange={event => {
                onChange(event.target.checked ? [...value, option] : value.filter(item => item !== option))
              }} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  )
}

function SingleSelectFilter({ id, label, allLabel, options, value, onChange }) {
  const detailsRef = useRef(null)

  useEffect(() => {
    function closeOutside(event) {
      const details = detailsRef.current
      if (details && !details.contains(event.target)) details.open = false
    }
    document.addEventListener('pointerdown', closeOutside)
    return () => document.removeEventListener('pointerdown', closeOutside)
  }, [])

  return (
    <div className="ost-filter-group">
      <span className="ost-filter-label" id={`${id}-label`}>{label}</span>
      <details className="ost-multiselect" ref={detailsRef}>
        <summary className="ost-select" id={id} aria-labelledby={`${id}-label ${id}-value`}>
          <span id={`${id}-value`}>{value || allLabel}</span>
        </summary>
        <div className="ost-multiselect-options" role="radiogroup" aria-labelledby={`${id}-label`}>
          <button className="ost-filter-reset" type="button" onClick={() => onChange('')}>Clear selection</button>
          {options.map(option => (
            <label key={option} className="ost-multiselect-option">
              <input type="radio" name={id} checked={value === option} onChange={() => {
                onChange(option)
                detailsRef.current.open = false
              }} />
              <span>{option}</span>
            </label>
          ))}
        </div>
      </details>
    </div>
  )
}

export default function OstPage() {
  const audioRef = useRef(null)
  const [tracks, setTracks] = useState([])
  const [info, setInfo] = useState({ composers: [], themeTypes: [], motifs: [], versions: [] })
  const [durations, setDurations] = useState({})
  const [currentTrackKey, setCurrentTrackKey] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedComposer, setSelectedComposer] = useState([])
  const [selectedTheme, setSelectedTheme] = useState([])
  const [selectedVersion, setSelectedVersion] = useState([])
  const [selectedProgress, setSelectedProgress] = useState([])
  const [selectedMotif, setSelectedMotif] = useState('')
  const [detailTrack, setDetailTrack] = useState(null)
  const [queue, setQueue] = useState([])
  const [isQueueOpen, setIsQueueOpen] = useState(false)

  useEffect(() => {
    document.title = 'Le Official Soundtrack'
    document.body.className = 'ost-page'
    document.body.setAttribute('style', '')

    let cancelled = false

    Promise.all([
      fetch('data/songs.json').then(response => {
        if (!response.ok) {
          throw new Error('Could not load data/songs.json')
        }
        return response.json()
      }),
      fetch('data/info.json').then(response => response.json()).catch(() => ({})),
      fetch('data/ostorder.json').then(response => response.json()).catch(() => []),
    ])
      .then(([data, sharedInfo, songOrder]) => {
        if (cancelled) return
        const orderedSongNames = Array.isArray(songOrder) ? songOrder : []
        const orderRank = new Map(orderedSongNames.map((name, index) => [name, index]))
        const nextTracks = data.map((entry, index) => normalizeSong(entry, orderRank.get(entry.name) ?? (orderedSongNames.length + index)))
        setInfo({
          composers: Array.isArray(sharedInfo?.composers) ? sharedInfo.composers : [],
          themeTypes: Array.isArray(sharedInfo?.themeTypes) ? sharedInfo.themeTypes : [],
          versions: Array.isArray(sharedInfo?.versions) ? sharedInfo.versions : [],
          motifs: Array.isArray(sharedInfo?.motifs)
            ? sharedInfo.motifs.map(normalizeMotif).filter(motif => motif.name && motif.sections.length)
            : [],
        })
        setTracks(nextTracks)
        setCurrentTrackKey(nextTracks.find(track => track.playable)?.key || nextTracks[0]?.key || '')
      })
      .catch(error => console.error(error))

    return () => {
      cancelled = true
      document.body.className = ''
    }
  }, [])

  useEffect(() => {
    const playableTracks = tracks.filter(track => track.playable)
    const audioElements = playableTracks.map(track => {
      const audio = new Audio(track.file)
      audio.preload = 'metadata'

      const handleLoadedMetadata = () => {
        setDurations(currentDurations => ({
          ...currentDurations,
          [track.key]: audio.duration,
        }))
      }

      audio.addEventListener('loadedmetadata', handleLoadedMetadata)
      audio.load()

      return { audio, handleLoadedMetadata }
    })

    return () => {
      audioElements.forEach(({ audio, handleLoadedMetadata }) => {
        audio.removeEventListener('loadedmetadata', handleLoadedMetadata)
      })
    }
  }, [tracks])

  const currentTrack = useMemo(
    () => tracks.find(track => track.key === currentTrackKey) || tracks.find(track => track.playable) || null,
    [currentTrackKey, tracks],
  )
  const coverByVersion = useMemo(() => {
    const covers = new Map()

    info.versions.forEach(version => {
      if (version?.name && version?.image) {
        covers.set(version.name, version.image)
      }
    })

    return covers
  }, [info.versions])
  const getTrackCover = track => track?.image || coverByVersion.get(track?.version) || defaultCoverArt
  const currentMotif = useMemo(
    () => selectedMotif ? info.motifs.find(motif => motif.name === selectedMotif) || null : null,
    [info.motifs, selectedMotif],
  )
  const motifTrackNames = useMemo(
    () => new Set(currentMotif?.sections.map(section => section.song) || []),
    [currentMotif],
  )
  const currentSegment = useMemo(() => {
    if (!currentTrack || !currentMotif) {
      return null
    }

    return currentMotif.sections.find(section => section.song === currentTrack.name) || null
  }, [currentMotif, currentTrack])

  const filteredTracks = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()

    return sortTracks(
      tracks.filter(track => {
        const matchesSearch =
          !query ||
          track.name.toLowerCase().includes(query) ||
          track.composer.toLowerCase().includes(query) ||
          track.themeType.toLowerCase().includes(query) ||
          track.progress.toLowerCase().includes(query) ||
          track.descriptionTitle.toLowerCase().includes(query)
        const matchesComposer = !selectedComposer.length || selectedComposer.includes(track.composer)
        const matchesTheme = !selectedTheme.length || selectedTheme.includes(track.themeType)
        const matchesVersion = !selectedVersion.length || selectedVersion.includes(track.version)
        const matchesProgress = !selectedProgress.length || selectedProgress.includes(track.progress)
        const matchesMotif = !selectedMotif || motifTrackNames.has(track.name)
        const matchesDropdowns = selectedMotif
          ? matchesMotif
          : matchesComposer && matchesTheme && matchesVersion && matchesProgress

        return matchesSearch && matchesDropdowns
      }),
    )
  }, [motifTrackNames, searchQuery, selectedComposer, selectedMotif, selectedProgress, selectedTheme, selectedVersion, tracks])

  const playableTracks = useMemo(() => tracks.filter(track => track.playable), [tracks])
  const playableFilteredTracks = useMemo(() => filteredTracks.filter(track => track.playable), [filteredTracks])
  const totalDuration = playableTracks.reduce((total, track) => total + (durations[track.key] || 0), 0)
  const currentDuration = durations[currentTrack?.key] || 0
  const seekMin = currentSegment?.start || 0
  const seekMax = currentSegment?.end || currentDuration || 0
  const progressPercent = seekMax > seekMin
    ? Math.min(((currentTime - seekMin) / Math.max(seekMax - seekMin, 1)) * 100, 100)
    : 0

  const filterOptions = useMemo(() => ({
    composers: orderOptions(tracks.map(track => track.composer), info.composers),
    themes: orderOptions(tracks.map(track => track.themeType), themeTypeOrder),
    versions: orderOptions(tracks.map(track => track.version), info.versions),
    progress: progressOrder,
    motifs: info.motifs.map(motif => motif.name),
  }), [info.composers, info.motifs, info.versions, tracks])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !currentTrack?.playable) {
      return
    }

    audio.src = currentTrack.file
    audio.load()
    audio.currentTime = currentSegment?.start || 0
    setCurrentTime(currentSegment?.start || 0)
  }, [currentSegment, currentTrack])

  useEffect(() => {
    const audio = audioRef.current

    if (!audio || !currentTrack?.playable) {
      return
    }

    if (isPlaying) {
      audio.play().catch(() => setIsPlaying(false))
    } else {
      audio.pause()
    }
  }, [currentTrack, isPlaying])

  function getCurrentIndex(trackList = playableFilteredTracks.length ? playableFilteredTracks : playableTracks) {
    return Math.max(trackList.findIndex(track => track.key === currentTrack?.key), 0)
  }

  function playTrack(track) {
    if (!track.playable) return
    setCurrentTrackKey(track.key)
    setIsPlaying(true)
  }

  function handleTrackPlayback(track) {
    if (!track.playable) return

    if (currentTrack?.key === track.key) {
      togglePlayback()
      return
    }

    playTrack(track)
  }

  function togglePlayback() {
    if (!currentTrack?.playable) return
    setIsPlaying(isCurrentlyPlaying => !isCurrentlyPlaying)
  }

  function playPreviousTrack() {
    const trackList = playableFilteredTracks.length ? playableFilteredTracks : playableTracks
    if (!trackList.length) return
    const currentIndex = getCurrentIndex(trackList)
    const previousTrack = trackList[Math.max(currentIndex - 1, 0)]
    playTrack(previousTrack)
  }

  function playNextTrack() {
    const trackList = playableFilteredTracks.length ? playableFilteredTracks : playableTracks
    if (!trackList.length) return

    if (queue.length > 0) {
      const [nextTrack, ...remainingQueue] = queue
      setQueue(remainingQueue)
      playTrack(nextTrack)
      return
    }

    const currentIndex = getCurrentIndex(trackList)
    const nextTrack = trackList[currentIndex >= trackList.length - 1 ? 0 : currentIndex + 1]
    playTrack(nextTrack)
  }

  function playVisibleTracks() {
    const firstTrack = playableFilteredTracks[0]
    if (!firstTrack) return

    setQueue(playableFilteredTracks.slice(1))
    setIsQueueOpen(playableFilteredTracks.length > 1)
    playTrack(firstTrack)
  }

  function addToQueue(track) {
    if (!track.playable) return
    setQueue(currentQueue => [...currentQueue, track])
    setIsQueueOpen(true)
  }

  function removeFromQueue(index) {
    setQueue(currentQueue => currentQueue.filter((_, queueIndex) => queueIndex !== index))
  }

  function handleSeek(event) {
    const audio = audioRef.current
    const nextTime = Number(event.target.value)

    if (!audio) return

    const clampedTime = currentSegment
      ? Math.max(currentSegment.start, Math.min(currentSegment.end, nextTime))
      : nextTime

    audio.currentTime = clampedTime
    setCurrentTime(clampedTime)
  }

  function handleAudioTimeUpdate(event) {
    const audio = event.currentTarget

    if (currentSegment && audio.currentTime >= currentSegment.end) {
      audio.currentTime = currentSegment.end
      setCurrentTime(currentSegment.end)

      if (queue.length > 0) {
        playNextTrack()
      } else {
        audio.pause()
        setIsPlaying(false)
      }
      return
    }

    if (currentSegment && audio.currentTime < currentSegment.start) {
      audio.currentTime = currentSegment.start
    }

    setCurrentTime(audio.currentTime)
  }

  function resetFilters() {
    setSearchQuery('')
    setSelectedComposer([])
    setSelectedTheme([])
    setSelectedVersion([])
    setSelectedProgress([])
    setSelectedMotif('')
  }

  useEffect(() => {
    if (!detailTrack) return undefined

    function closeOnEscape(event) {
      if (event.key === 'Escape') setDetailTrack(null)
    }

    document.addEventListener('keydown', closeOnEscape)
    return () => document.removeEventListener('keydown', closeOnEscape)
  }, [detailTrack])

  return (
    <>
      <style>{pageStyles}</style>
      <div className="upro-page-root">
        <main className="ost-shell">
          <header className="ost-header">
            <nav className="ost-nav" aria-label="OST navigation">
              <a href="/">
                <button className="ost-nav-button" type="button">Main Menu</button>
              </a>
              <a href="/songvote">
                <button className="ost-nav-button" type="button">Song Vote</button>
              </a>
            </nav>
          </header>

          <section className="ost-hero" aria-labelledby="ost-title">
            <div className="ost-cover">
              <img src={getTrackCover(currentTrack)} onError={event => { event.currentTarget.src = defaultCoverArt }} alt="UPRO OSTs cover" />
            </div>
            <div>
              <h1 className="ost-title" id="ost-title">UPRO Original Soundtrack</h1>
              <p className="ost-summary">
                The official UPRO soundtrack library, with canon tracks, bonus songs, filters, queueing, and playback in one place.
              </p>
              <div className="ost-meta" aria-label="Soundtrack summary">
                <span>{tracks.length} songs</span>
                <span>{playableTracks.length} playable</span>
                <span>{formatTotalDuration(totalDuration)}</span>
              </div>
            </div>
          </section>

          <section className="ost-toolbar" aria-label="Song controls">
            <input
              className="ost-search"
              type="search"
              value={searchQuery}
              onChange={event => setSearchQuery(event.target.value)}
              placeholder="Search songs and composers..."
              aria-label="Search soundtrack"
            />
            <div className="ost-control-row">
              <button className="ost-control" type="button" onClick={playVisibleTracks} disabled={!playableFilteredTracks.length}>
                Play Visible
              </button>
              <button className="ost-control" type="button" onClick={resetFilters}>
                Clear Filters
              </button>
              <button
                className={`ost-control ${isQueueOpen ? 'is-active' : ''}`}
                type="button"
                onClick={() => setIsQueueOpen(isOpen => !isOpen)}
                disabled={!queue.length}
              >
                Queue {queue.length}
              </button>
            </div>
          </section>

          <section className="ost-filters" aria-label="Soundtrack filters">
            <MultiSelectFilter id="ost-theme-filter" label="Theme-types" allLabel="All theme-types" options={filterOptions.themes} value={selectedTheme} onChange={setSelectedTheme} disabled={Boolean(selectedMotif)} />
            <MultiSelectFilter id="ost-version-filter" label="Version" allLabel="All versions" options={filterOptions.versions} value={selectedVersion} onChange={setSelectedVersion} disabled={Boolean(selectedMotif)} />
            <SingleSelectFilter id="ost-motif-filter" label="Motifs" allLabel="All motifs" options={filterOptions.motifs} value={selectedMotif} onChange={value => {
              setSelectedMotif(value)
              setQueue([])
              setIsQueueOpen(false)
            }} />
            <MultiSelectFilter id="ost-progress-filter" label="Progress" allLabel="All progress" options={filterOptions.progress} value={selectedProgress} onChange={setSelectedProgress} disabled={Boolean(selectedMotif)} />
            <MultiSelectFilter id="ost-composer-filter" label="Composers" allLabel="All composers" options={filterOptions.composers} value={selectedComposer} onChange={setSelectedComposer} disabled={Boolean(selectedMotif)} />
          </section>

          <section className="ost-main" aria-label="Soundtrack songs">
            <div className="ost-track-heading">
              <span>#</span>
              <span></span>
              <span>Title</span>
              <span>Composer</span>
              <span>Theme-type</span>
              <span>Version</span>
              <span>Progress</span>
              <span>Time</span>
              <span></span>
            </div>

            <div className="ost-track-list">
              {filteredTracks.map((track, index) => {
                const songRgb = hexToRgbString(getTrackColor(track))
                const isCurrent = currentTrack?.key === track.key

                return (
                  <article
                    className={`ost-track-row ${isCurrent ? 'is-current' : ''}`}
                    key={track.key}
                    style={{ '--song-rgb': songRgb }}
                    role="button"
                    tabIndex={0}
                    onClick={() => setDetailTrack(track)}
                    onKeyDown={event => {
                      if (event.key === 'Enter' || event.key === ' ') {
                        event.preventDefault()
                        setDetailTrack(track)
                      }
                    }}
                  >
                    <div className="ost-track-number">{Number.isFinite(track.order) ? track.order + 1 : index + 1}</div>
                    <img className="ost-track-cover" src={getTrackCover(track)} onError={event => { event.currentTarget.src = defaultCoverArt }} alt="" />
                    <div className="ost-track-title-cell">
                      <div>
                        <span className="ost-track-name">{track.name}</span>
                        <span className="ost-track-subtitle">{track.descriptionTitle || 'No description yet'}</span>
                      </div>
                    </div>
                    <div className="ost-track-composer">{track.composer}</div>
                    <div className="ost-track-theme">
                      <span>{track.themeType}</span>
                    </div>
                    <div className="ost-track-version">{track.version}</div>
                    <div className="ost-track-progress">{track.progress}</div>
                    <div className="ost-track-duration">{track.playable ? formatDuration(durations[track.key]) : ''}</div>
                    <div className="ost-track-actions">
                      <button className="ost-track-action" type="button" onClick={event => {
                        event.stopPropagation()
                        handleTrackPlayback(track)
                      }} disabled={!track.playable}>
                        {isCurrent && isPlaying ? 'Pause' : 'Play'}
                      </button>
                      <button className="ost-track-action ost-track-add" type="button" onClick={event => {
                        event.stopPropagation()
                        addToQueue(track)
                      }} disabled={!track.playable} aria-label={`Add ${track.name} to queue`}>
                        +
                      </button>
                    </div>
                  </article>
                )
              })}
            </div>

            {!filteredTracks.length && (
              <div className="ost-empty">No songs match those filters.</div>
            )}
          </section>

          {detailTrack && createPortal(
            <div className="ost-detail-backdrop" role="presentation" onMouseDown={event => {
              if (event.target === event.currentTarget) setDetailTrack(null)
            }}>
              <section className="ost-detail-modal" role="dialog" aria-modal="true" aria-labelledby="ost-detail-title">
                <button className="ost-detail-close" type="button" aria-label="Close song details" onClick={() => setDetailTrack(null)}>X</button>
                <div className="ost-detail-hero">
                  <img src={detailTrack.image || getTrackCover(detailTrack)} onError={event => { event.currentTarget.src = defaultCoverArt }} alt="" />
                  <div className="ost-detail-heading">
                    <span>{detailTrack.themeType}</span>
                    <h2 id="ost-detail-title">{detailTrack.name}</h2>
                    <p>{detailTrack.composer}</p>
                    {detailTrack.playable ? (
                      <audio className="ost-detail-player" controls preload="metadata" src={detailTrack.file} />
                    ) : (
                      <p className="ost-detail-unavailable">Audio unavailable</p>
                    )}
                  </div>
                </div>
                <div className="ost-detail-about">
                  <h3>About the Song</h3>
                  <p>{detailTrack.description || 'No Context.'}</p>
                  <dl>
                    {detailTrack.version && <div><dt>Version</dt><dd>{detailTrack.version}</dd></div>}
                    <div><dt>Progress</dt><dd>{detailTrack.progress}</dd></div>
                    <div><dt>Theme-type</dt><dd>{detailTrack.themeType}</dd></div>
                  </dl>
                </div>
              </section>
            </div>,
            document.body,
          )}

          {isQueueOpen && queue.length > 0 && (
            <aside className="ost-queue" aria-label="Playlist queue">
              <div className="ost-queue-header">
                <h2>Queue</h2>
                <button className="ost-close-button" type="button" onClick={() => setIsQueueOpen(false)}>Close</button>
              </div>
              <ol className="ost-queue-list">
                {queue.map((track, index) => (
                  <li className="ost-queue-item" key={`${track.key}-${index}`}>
                    <span>{index + 1}. {track.name}</span>
                    <button className="ost-track-action" type="button" onClick={() => removeFromQueue(index)}>X</button>
                  </li>
                ))}
              </ol>
            </aside>
          )}

          <footer className="ost-now-playing" aria-label="Now playing">
            <div className="ost-current-track">
              <img src={getTrackCover(currentTrack)} onError={event => { event.currentTarget.src = defaultCoverArt }} alt="" />
              <div>
                <strong>{currentTrack?.name || 'No song selected'}</strong>
                <span>{currentTrack?.composer || 'UPRO'}</span>
              </div>
            </div>

            <div className="ost-player-center">
              <div className="ost-player-controls">
                <button className="ost-player-button" type="button" aria-label="Previous song" onClick={playPreviousTrack} disabled={!playableTracks.length}>
                  Prev
                </button>
                <button className="ost-player-button" type="button" onClick={togglePlayback} disabled={!currentTrack?.playable}>
                  {isPlaying ? 'Pause' : 'Play'}
                </button>
                <button className="ost-player-button" type="button" aria-label="Next song" onClick={playNextTrack} disabled={!playableTracks.length}>
                  Next
                </button>
              </div>
              <div className="ost-progress-row">
                <span>{formatDuration(currentTime)}</span>
                <input
                  type="range"
                  min={seekMin}
                  max={seekMax}
                  value={Math.max(seekMin, Math.min(currentTime, seekMax))}
                  onChange={handleSeek}
                  aria-label="Seek through current song"
                  style={{ '--progress': `${progressPercent}%` }}
                  disabled={!currentTrack?.playable}
                />
                <span>{formatDuration(seekMax)}</span>
              </div>
            </div>

            <div className="ost-player-side">
              <button className="ost-player-button" type="button" onClick={() => currentTrack && addToQueue(currentTrack)} disabled={!currentTrack?.playable}>
                Queue
              </button>
            </div>
          </footer>

          <audio
            ref={audioRef}
            onEnded={playNextTrack}
            onPause={() => setIsPlaying(false)}
            onPlay={() => setIsPlaying(true)}
            onTimeUpdate={handleAudioTimeUpdate}
          />
        </main>
      </div>
    </>
  )
}

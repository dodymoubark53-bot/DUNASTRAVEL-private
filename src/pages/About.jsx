import { useEffect, useRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { FaCalendarAlt, FaSuitcase, FaUsers, FaMapMarkedAlt, FaGlobe } from 'react-icons/fa';
import { useCmsBlock } from '../hooks/useCmsBlock';

const styles = `
  :root {
    --navy-deep: #081830;
    --navy: #0E2A52;
    --navy-mid: #16386B;
    --royal: #1C4587;
    --gold: #C9A227;
    --gold-light: #E8CB72;
    --gold-pale: #F4E6B8;
    --cream: #F8F3E6;
    --ivory: #FBF8F1;
    --ink: #0E1B2E;
    --ink-soft: #3C4A5E;
    --line: rgba(201, 162, 39, 0.28);
    --display: 'Cormorant Garamond', serif;
    --body: 'Jost', sans-serif;
    --mono: 'Space Grotesk', sans-serif;
  }
  .about-page ::selection { background: var(--gold-light); color: var(--navy-deep); }
  .about-page .eyebrow {
    font-family: var(--mono);
    letter-spacing: 0.32em;
    text-transform: uppercase;
    font-size: 11px;
    color: var(--gold);
    font-weight: 600;
  }
  .about-page .hero {
    position: relative;
    min-height: 100vh;
    background: radial-gradient(ellipse 120% 80% at 50% -10%, #11305E 0%, var(--navy) 42%, var(--navy-deep) 100%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 140px 6% 100px;
    overflow: hidden;
  }
  .about-page .hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image:
      radial-gradient(1px 1px at 12% 22%, rgba(232, 203, 114, .5) 0, transparent 60%),
      radial-gradient(1px 1px at 82% 18%, rgba(232, 203, 114, .4) 0, transparent 60%),
      radial-gradient(1.5px 1.5px at 64% 70%, rgba(232, 203, 114, .35) 0, transparent 60%),
      radial-gradient(1px 1px at 30% 80%, rgba(232, 203, 114, .4) 0, transparent 60%),
      radial-gradient(1px 1px at 92% 60%, rgba(232, 203, 114, .3) 0, transparent 60%);
    pointer-events: none;
  }
  .about-page .routes-wrap { width: min(860px, 90vw); margin: 12px auto 18px; position: relative; z-index: 2; }
  .about-page .hero-eyebrow { margin-bottom: 22px; position: relative; z-index: 2; }
  .about-page .hero h1 {
    font-family: var(--display);
    font-weight: 500;
    font-size: clamp(40px, 6vw, 78px);
    line-height: 1.06;
    color: var(--ivory);
    max-width: 920px;
    position: relative;
    z-index: 2;
  }
  .about-page .hero h1 em { font-style: italic; color: var(--gold-light); }
  .about-page .hero p.sub {
    margin-top: 24px;
    font-size: 16px;
    letter-spacing: 0.04em;
    color: rgba(248, 243, 230, 0.68);
    max-width: 560px;
    font-weight: 300;
    position: relative;
    z-index: 2;
  }
  .about-page .hero-stats {
    margin-top: 60px;
    display: flex;
    gap: 0;
    position: relative;
    z-index: 2;
    border-top: 1px solid var(--line);
    border-bottom: 1px solid var(--line);
  }
  .about-page .hero-stats div {
    padding: 22px 34px;
    text-align: center;
    border-right: 1px solid var(--line);
  }
  .about-page .hero-stats div:last-child { border-right: none; }
  .about-page .hero-stats .num {
    font-family: var(--mono);
    font-weight: 600;
    font-size: clamp(22px, 3vw, 32px);
    color: #ffffff;
  }
  .about-page .hero-stats .lbl {
    font-size: 10.5px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: #ffffff;
    margin-top: 6px;
  }
  .about-page .hero-stats .stat-icon {
    font-size: 22px;
    color: var(--gold);
    margin-bottom: 8px;
    display: block;
  }
  @media(max-width:700px) {
    .about-page .hero-stats { flex-wrap: wrap; }
    .about-page .hero-stats div { width: 50%; border-right: 1px solid var(--line); }
  }
  .about-page .hero-watermark {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -46%);
    font-family: var(--display);
    font-weight: 600;
    font-size: clamp(220px, 34vw, 560px);
    color: rgba(232, 203, 114, 0.045);
    letter-spacing: 0.02em;
    z-index: 1;
    pointer-events: none;
    user-select: none;
    white-space: nowrap;
  }
  .about-page .scroll-cue {
    position: absolute;
    bottom: 34px;
    left: 50%;
    transform: translateX(-50%);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    color: rgba(248, 243, 230, 0.5);
    font-size: 10px;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    z-index: 2;
  }
  .about-page .scroll-cue .line {
    width: 1px;
    height: 36px;
    background: linear-gradient(var(--gold), transparent);
    animation: cuemove 1.8s ease-in-out infinite;
  }
  @keyframes cuemove {
    0%, 100% { opacity: .2; }
    50% { opacity: 1; }
  }
  .about-page section { padding: 120px 8%; position: relative; }
  .about-page .section-light { background: var(--ivory); }
  .about-page .section-dark {
    background: linear-gradient(180deg, var(--navy-deep), var(--navy) 60%, var(--navy-deep));
    color: var(--ivory);
  }
  .about-page .section-head { max-width: 680px; margin-bottom: 64px; }
  .about-page .section-head h2 {
    font-family: var(--display);
    font-weight: 500;
    font-size: clamp(32px, 4vw, 50px);
    margin-top: 10px;
    line-height: 1.1;
  }
  .about-page .section-dark .section-head h2 { color: var(--ivory); }
  .about-page .section-light .section-head h2 { color: var(--navy-deep); }
  .about-page .rule {
    width: 64px;
    height: 2px;
    background: var(--gold);
    margin-top: 22px;
    position: relative;
  }
  .about-page .rule::after {
    content: '';
    position: absolute;
    left: 78px;
    top: -3px;
    width: 8px;
    height: 8px;
    background: var(--gold);
    transform: rotate(45deg);
  }
  .about-page .section-dark { position: relative; }
  .about-page #growth {
    background: url('/imgs/egypt.jpg.jpeg') center / cover no-repeat;
  }
  .about-page .section-dark::before {
    content: '';
    position: absolute;
    inset: 0;
    pointer-events: none;
    background-image:
      radial-gradient(1px 1px at 16% 28%, rgba(232, 203, 114, .20) 0, transparent 60%),
      radial-gradient(1px 1px at 76% 62%, rgba(232, 203, 114, .16) 0, transparent 60%),
      radial-gradient(1px 1px at 42% 85%, rgba(232, 203, 114, .14) 0, transparent 60%),
      radial-gradient(1px 1px at 90% 20%, rgba(232, 203, 114, .12) 0, transparent 60%);
  }
  .about-page .section-dark>* { position: relative; z-index: 1; }
  .about-page .who-grid {
    display: grid;
    grid-template-columns: 1.1fr .9fr;
    gap: 80px;
    align-items: start;
  }
  .about-page .who-grid p {
    font-size: 16.5px;
    line-height: 1.85;
    color: var(--ink-soft);
    font-weight: 300;
    margin-bottom: 20px;
  }
  .about-page .who-grid p b { color: var(--navy); font-weight: 600; }
  .about-page .feature-pair {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 18px;
    margin-top: 14px;
  }
  .about-page .feature-card {
    border: 1px solid rgba(14, 42, 82, .14);
    padding: 26px 22px;
    border-radius: 2px;
    background: var(--cream);
    transition: transform .35s ease, box-shadow .35s ease, border-color .35s ease;
  }
  .about-page .feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 18px 40px rgba(14, 42, 82, 0.12);
    border-color: var(--gold);
  }
  .about-page .feature-card .ftitle {
    font-family: var(--mono);
    font-weight: 600;
    font-size: 12.5px;
    letter-spacing: .06em;
    color: var(--navy);
    text-transform: uppercase;
    margin-bottom: 8px;
  }
  .about-page .feature-card p {
    font-size: 13.5px;
    color: var(--ink-soft);
    margin: 0;
    line-height: 1.6;
  }
  .about-page .presence-box {
    background: var(--navy-deep);
    color: var(--ivory);
    padding: 40px 34px;
    border-radius: 3px;
    position: relative;
    overflow: hidden;
  }
  .about-page .presence-box::after {
    content: '';
    position: absolute;
    right: -40px;
    top: -40px;
    width: 160px;
    height: 160px;
    border: 1px solid var(--line);
    border-radius: 50%;
  }
  .about-page .presence-box h3 {
    font-family: var(--display);
    font-size: 24px;
    font-weight: 500;
    color: var(--gold-light);
    margin-bottom: 18px;
  }
  .about-page .presence-list { display: flex; flex-direction: column; gap: 14px; position: relative; z-index: 1; }
  .about-page .presence-row {
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid var(--line);
    padding-bottom: 10px;
    font-size: 14px;
  }
  .about-page .presence-row .k {
    color: rgba(248, 243, 230, .55);
    font-size: 11px;
    letter-spacing: .08em;
    text-transform: uppercase;
  }
  .about-page .presence-row .v { font-weight: 400; text-align: right; max-width: 62%; }
  .about-page .stats-strip {
    display: grid;
    grid-template-columns: repeat(5, 1fr);
    margin-top: 90px;
    border-top: 1px solid rgba(14, 42, 82, .15);
    border-bottom: 1px solid rgba(14, 42, 82, .15);
  }
  .about-page .stat-cell {
    padding: 34px 18px;
    text-align: center;
    border-right: 1px solid rgba(14, 42, 82, .15);
    transition: transform .35s ease;
  }
  .about-page .stat-cell:last-child { border-right: none; }
  .about-page .stat-cell:hover { transform: translateY(-4px); }
  .about-page .stat-cell .n {
    font-family: var(--mono);
    font-weight: 700;
    font-size: clamp(26px, 2.6vw, 38px);
    color: var(--navy);
    transition: color .35s ease;
  }
  .about-page .stat-cell:hover .n { color: var(--gold); }
  .about-page .stat-cell .l {
    margin-top: 6px;
    font-size: 10.5px;
    letter-spacing: .08em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  .about-page .stat-cell .stat-icon {
    font-size: 24px;
    color: var(--royal);
    margin-bottom: 6px;
    display: block;
    transition: color .35s ease;
  }
  .about-page .stat-cell:hover .stat-icon { color: var(--gold); }
  @media(max-width:760px) {
    .about-page .stats-strip { grid-template-columns: repeat(2, 1fr); }
    .about-page .stat-cell { border-bottom: 1px solid rgba(14, 42, 82, .15); }
  }
  .about-page .chart-wrap {
    display: grid;
    grid-template-columns: .85fr 1.15fr;
    gap: 70px;
    align-items: center;
  }
  .about-page .chart {
    display: flex;
    align-items: flex-end;
    gap: 22px;
    height: 300px;
    padding: 0 6px;
    border-bottom: 1px solid var(--line);
    position: relative;
  }
  .about-page .bar-col {
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
    height: 100%;
    justify-content: flex-end;
  }
  .about-page .bar {
    width: 100%;
    max-width: 46px;
    background: linear-gradient(180deg, var(--gold-light), var(--gold));
    border-radius: 3px 3px 0 0;
    position: relative;
    box-shadow: 0 0 0 1px rgba(201, 162, 39, .25);
    transform: scaleY(0);
    transform-origin: bottom;
    transition: transform 1.1s cubic-bezier(.2, .9, .25, 1);
  }
  .about-page .bar .val {
    position: absolute;
    top: -26px;
    left: 50%;
    transform: translateX(-50%);
    font-family: var(--mono);
    font-size: 12px;
    font-weight: 600;
    color: var(--gold-light);
    white-space: nowrap;
  }
  .about-page .route{stroke-dasharray:260;stroke-dashoffset:260;animation:drawRoute 2.4s ease forwards;}
  .about-page #r2{animation-delay:.15s;} .about-page #r3{animation-delay:.3s;} .about-page #r4{animation-delay:.45s;} .about-page #r5{animation-delay:.6s;} .about-page #r6{animation-delay:.75s;}
  @keyframes drawRoute{to{stroke-dashoffset:0;}}
  .about-page .bar-yr {
    margin-top: 12px;
    font-size: 11px;
    letter-spacing: .06em;
    color: rgba(248, 243, 230, .55);
    font-family: var(--mono);
  }
  .about-page .inst-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 1px;
    background: rgba(14, 42, 82, .12);
    border: 1px solid rgba(14, 42, 82, .12);
  }
  .about-page .inst-cell {
    background: var(--ivory);
    padding: 34px 32px;
  }
  .about-page .inst-cell .ic-label {
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .12em;
    text-transform: uppercase;
    color: var(--gold);
    font-weight: 600;
    margin-bottom: 10px;
  }
  .about-page .inst-cell h4 {
    font-family: var(--display);
    font-size: 23px;
    color: var(--navy-deep);
    font-weight: 500;
    margin-bottom: 6px;
  }
  .about-page .inst-cell p {
    font-size: 13.5px;
    color: var(--ink-soft);
    line-height: 1.65;
    font-weight: 300;
  }
  .about-page .quote-block {
    margin-top: 60px;
    border-left: 3px solid var(--gold);
    padding: 6px 0 6px 36px;
    position: relative;
  }
  .about-page .quote-block::before {
    content: '\\201C';
    position: absolute;
    left: 18px;
    top: -58px;
    font-family: var(--display);
    font-size: 140px;
    font-weight: 600;
    color: var(--gold-pale);
    line-height: 1;
    z-index: 0;
  }
  .about-page .quote-block p {
    font-family: var(--display);
    font-style: italic;
    font-size: clamp(22px, 2.6vw, 30px);
    color: var(--navy-deep);
    line-height: 1.5;
    font-weight: 500;
    max-width: 740px;
    position: relative;
    z-index: 1;
  }
  .about-page .quote-block span {
    display: block;
    margin-top: 16px;
    font-family: var(--mono);
    font-size: 11px;
    letter-spacing: .1em;
    text-transform: uppercase;
    color: var(--ink-soft);
  }
  .about-page .events-list { display: flex; flex-direction: column; }
  .about-page .event-row {
    display: grid;
    grid-template-columns: 90px 1fr;
    gap: 30px;
    padding: 26px 0;
    border-bottom: 1px solid var(--line);
    align-items: baseline;
  }
  .about-page .event-row:first-child { border-top: 1px solid var(--line); }
  .about-page .event-row .eyr {
    font-family: var(--mono);
    color: var(--gold-light);
    font-size: 14px;
    font-weight: 600;
  }
  .about-page .event-row .etxt {
    font-size: 16px;
    font-weight: 300;
    color: rgba(248, 243, 230, .88);
    line-height: 1.55;
  }
  .about-page .event-row .etxt b { font-weight: 500; color: var(--ivory); }
  .about-page .events-more {
    margin-top: 26px;
    font-size: 13.5px;
    color: rgba(248, 243, 230, .6);
    font-weight: 300;
    line-height: 1.7;
  }
  .about-page .services-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 1px;
    background: rgba(14, 42, 82, .12);
    border: 1px solid rgba(14, 42, 82, .12);
    margin-bottom: 90px;
  }
  .about-page .svc-card {
    background: var(--ivory);
    padding: 38px 28px;
    min-height: 210px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: background .35s;
  }
  .about-page .svc-card:hover { background: var(--navy-deep); }
  .about-page .svc-card:hover .svc-title,
  .about-page .svc-card:hover p { color: var(--ivory); }
  .about-page .svc-card:hover .svc-num { color: var(--gold-light); }
  .about-page .svc-num {
    font-family: var(--mono);
    font-size: 13px;
    color: var(--gold);
    font-weight: 600;
  }
  .about-page .svc-title {
    font-family: var(--display);
    font-size: 24px;
    color: var(--navy-deep);
    margin-top: 30px;
    font-weight: 500;
    transition: color .35s;
  }
  .about-page .svc-card p {
    font-size: 13.5px;
    color: var(--ink-soft);
    margin-top: 10px;
    font-weight: 300;
    transition: color .35s;
  }
  .about-page .values-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 28px;
  }
  .about-page .value-item {
    text-align: left;
    border-top: 2px solid var(--gold);
    padding-top: 16px;
  }
  .about-page .value-item .vt {
    font-family: var(--display);
    font-size: 19px;
    color: var(--navy-deep);
    font-weight: 600;
  }
  .about-page .value-item .vd {
    font-size: 12.5px;
    color: var(--ink-soft);
    margin-top: 6px;
    font-weight: 300;
  }
  @media(max-width:900px) {
    .about-page .services-grid,
    .about-page .values-row { grid-template-columns: repeat(2, 1fr); }
  }
  :root { --avatar-size: 168px; }
  .about-page .team-badge {
    display: inline-block;
    margin-bottom: 20px;
    font-family: var(--mono);
    font-size: 10.5px;
    letter-spacing: .28em;
    text-transform: uppercase;
    color: var(--gold-light);
    border: 1px solid var(--line);
    border-radius: 999px;
    padding: 7px 20px;
    background: rgba(201, 162, 39, 0.06);
  }
  .about-page .team-lead {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0 auto 96px;
  }
  .about-page .team-grid {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    column-gap: 64px;
    row-gap: 56px;
    max-width: 1020px;
    margin: 0 auto;
  }
  .about-page .team-card {
    width: 208px;
    text-align: center;
    margin-top: var(--offset, 0px);
  }
  .about-page .avatar-frame {
    position: relative;
    width: var(--avatar-size);
    height: var(--avatar-size);
    margin: 0 auto 28px;
    border-radius: 50%;
    cursor: pointer;
    animation: floatY 5.2s ease-in-out infinite;
  }
  @keyframes floatY {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-7px); }
  }
  @media(prefers-reduced-motion:reduce) {
    .about-page .avatar-frame { animation: none; }
  }
  .about-page .avatar-ring {
    position: absolute;
    inset: -8px;
    border-radius: 50%;
    border: 1px solid var(--gold);
    opacity: .55;
    transition: opacity .4s ease, transform .4s ease;
  }
  .about-page .avatar-frame:hover .avatar-ring {
    opacity: 1;
    transform: scale(1.04);
  }
  .about-page .avatar {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background: linear-gradient(160deg, var(--navy-mid), var(--navy-deep));
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border: 1px solid var(--line);
    box-shadow: 0 30px 60px -25px rgba(0, 0, 0, .6);
  }
  .about-page .avatar img { width: 100%; height: 100%; object-fit: cover; display: none; }
  .about-page .avatar.has-photo img { display: block; }
  .about-page .avatar.has-photo .initials,
  .about-page .avatar.has-photo .plus { display: none; }
  .about-page .initials {
    font-family: var(--display);
    font-size: 44px;
    color: var(--gold-light);
    letter-spacing: .04em;
  }
  .about-page .plus {
    position: absolute;
    bottom: 4px;
    right: 4px;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--gold);
    color: var(--navy-deep);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 17px;
    font-weight: 700;
    box-shadow: 0 4px 14px rgba(0, 0, 0, .4);
    border: 2px solid var(--navy-deep);
  }
  .about-page input[type="file"] { display: none; }
  .about-page .member-name {
    font-family: var(--display);
    font-size: 21px;
    font-weight: 600;
    color: var(--ivory);
    margin: 0 0 6px;
  }
  .about-page .lead-name { font-size: 28px; }
  .about-page .member-role {
    font-size: 11px;
    letter-spacing: .14em;
    text-transform: uppercase;
    color: rgba(248, 243, 230, .62);
  }
  .about-page .member-role em { color: var(--gold-light); font-style: normal; }
  .about-page .member-country {
    font-size: 11.5px;
    color: rgba(248, 243, 230, .5);
    margin-top: 9px;
  }
  @media(max-width:760px) {
    :root { --avatar-size: 128px; }
    .about-page .team-card { width: 150px; margin-top: calc(var(--offset, 0px) * .4); }
    .about-page .team-grid { column-gap: 36px; row-gap: 42px; }
  }
  .about-page .tradeshow-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .about-page .tradeshow-chip {
    border: 1px solid rgba(14, 42, 82, .18);
    padding: 14px 24px;
    border-radius: 30px;
    font-family: var(--mono);
    font-size: 12.5px;
    letter-spacing: .04em;
    color: var(--navy);
    background: var(--cream);
    transition: border-color .3s ease, transform .3s ease;
  }
  .about-page .tradeshow-chip:hover {
    border-color: var(--gold);
    transform: translateY(-2px);
  }
  .about-page .reveal {
    opacity: 0;
    transform: translateY(24px);
    transition: opacity .8s ease, transform .8s ease;
  }
  .about-page .reveal.in {
    opacity: 1;
    transform: none;
  }
  @media(max-width:760px) {
    .about-page section { padding: 80px 6%; }
    .about-page .who-grid,
    .about-page .chart-wrap,
    .about-page .inst-grid { grid-template-columns: 1fr; gap: 40px; }
    .about-page .inst-grid { grid-template-columns: 1fr; }
  }
`;

const chartData = [
  { year: '2018', value: '24,000', pct: 25 },
  { year: '2019', value: '32,993', pct: 34 },
  { year: '2022', value: '66,793', pct: 70 },
  { year: '2023', value: '90,202', pct: 94 },
  { year: '2024', value: '95,654', pct: 100 },
];

const About = () => {
  const { t } = useTranslation();
  const pageRef = useRef(null);

  useEffect(() => {
    const el = pageRef.current;
    if (!el) return;

    const revealEls = el.querySelectorAll('.reveal');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(r => io.observe(r));

    const counterEls = el.querySelectorAll('.hero-stats .num, .stats-strip .n');
    const counterIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const target = e.target;
          const count = parseInt(target.dataset.count, 10);
          const suffix = target.dataset.suffix || '';
          let start = 0;
          const dur = Math.min(2000, count * 6);
          const step = Math.max(1, Math.floor(count / 60));
          const interval = setInterval(() => {
            start += step;
            if (start >= count) {
              target.textContent = count.toLocaleString() + suffix;
              clearInterval(interval);
            } else {
              target.textContent = start.toLocaleString();
            }
          }, dur / 60);
          counterIo.unobserve(target);
        }
      });
    }, { threshold: 0.3 });
    counterEls.forEach(c => counterIo.observe(c));

    const chartIo = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const bars = e.target.querySelectorAll('.bar');
          bars.forEach((bar, i) => {
            const h = bar.dataset.h;
            setTimeout(() => {
              bar.style.height = h + '%';
              bar.style.transform = 'scaleY(1)';
            }, i * 120);
          });
          chartIo.unobserve(e.target);
        }
      });
    }, { threshold: 0.3 });
    const chart = el.querySelector('.chart');
    if (chart) chartIo.observe(chart);

    const avatarFrames = el.querySelectorAll('#team .avatar-frame');
    avatarFrames.forEach(frame => {
      const input = frame.querySelector('input[type="file"]');
      const avatar = frame.querySelector('.avatar');
      const img = avatar.querySelector('img');
      if (input) {
        frame.addEventListener('click', () => input.click());
        input.addEventListener('change', (e) => {
          const file = e.target.files[0];
          if (!file) return;
          img.src = URL.createObjectURL(file);
          avatar.classList.add('has-photo');
        });
      }
    });

    return () => {
      io.disconnect();
      counterIo.disconnect();
      chartIo.disconnect();
    };
  }, []);

  return (
    <div className="about-page" ref={pageRef}>
      <Helmet>
        <title>{t('about.seoTitle', 'About Us | Dunas Travel')}</title>
        <meta name="description" content={t('about.seoDescNew', 'Discover our story. Dunas Travel Group — 17+ years designing and operating travel experiences for tour operators and agencies across Europe and Latin America.')} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&family=Jost:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Helmet>

      <style>{styles}</style>

      <header className="hero" id="about-hero">
        <div className="hero-watermark">DT</div>
        <div className="hero-eyebrow eyebrow">{cmsData?.heroEyebrow || t('about.heroEyebrow')}</div>
        <h1 dangerouslySetInnerHTML={{ __html: cmsData?.heroTitle || t('about.heroTitle') }} />
        <p className="sub">{cmsData?.heroSub || t('about.heroSub')}</p>

        <div className="routes-wrap" id="routesWrap">
          <svg viewBox="0 0 980 260" width="100%" height="auto" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block' }}>
            <defs>
              <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#C9A227" stopOpacity="0" />
                <stop offset="50%" stopColor="#E8CB72" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#C9A227" stopOpacity="0" />
              </linearGradient>
            </defs>
            <g stroke="rgba(232,203,114,0.10)" strokeWidth="1">
              <line x1="0" y1="40" x2="980" y2="40" />
              <line x1="0" y1="110" x2="980" y2="110" />
              <line x1="0" y1="180" x2="980" y2="180" />
            </g>
            <g fill="none" stroke="url(#lineGrad)" strokeWidth="2">
              <path id="r1" className="route" d="M490,140 C 430,70 360,50 210,65" />
              <path id="r2" className="route" d="M490,140 C 470,80 460,50 470,28" />
              <path id="r3" className="route" d="M490,140 C 540,170 600,190 700,175" />
              <path id="r4" className="route" d="M490,140 C 430,170 330,190 150,185" />
              <path id="r5" className="route" d="M490,140 C 440,180 360,210 230,225" />
              <path id="r6" className="route" d="M490,140 C 520,195 560,225 640,230" />
            </g>
            <g fontFamily="Space Grotesk, sans-serif" fontSize="14" fill="#F8F3E6" letterSpacing="0.5">
              <circle cx="490" cy="140" r="8" fill="#E8CB72" />
              <circle cx="490" cy="140" r="14" fill="none" stroke="#E8CB72" strokeOpacity="0.5" strokeWidth="1.5" />
              <text x="490" y="168" textAnchor="middle" fill="#E8CB72" fontWeight="600" fontSize="15">{t('about.mapCairo')}</text>
              <circle cx="210" cy="65" r="5" fill="#F8F3E6" />
              <text x="210" y="50" textAnchor="middle" fontSize="14">{t('about.mapMadrid')}</text>
              <circle cx="470" cy="28" r="5" fill="#F8F3E6" />
              <text x="470" y="14" textAnchor="middle" fontSize="14">{t('about.mapItaly')}</text>
              <circle cx="700" cy="175" r="5" fill="#F8F3E6" />
              <text x="700" y="200" textAnchor="middle" fontSize="14">{t('about.mapBrazil')}</text>
              <circle cx="150" cy="185" r="4" fill="rgba(248,243,230,0.7)" />
              <text x="150" y="208" textAnchor="middle" fill="rgba(248,243,230,0.6)" fontSize="12">{t('about.mapColombia')}</text>
              <circle cx="230" cy="225" r="4" fill="rgba(248,243,230,0.7)" />
              <text x="230" y="245" textAnchor="middle" fill="rgba(248,243,230,0.6)" fontSize="12">{t('about.mapArgentina')}</text>
              <circle cx="640" cy="230" r="4" fill="rgba(248,243,230,0.7)" />
              <text x="640" y="250" textAnchor="middle" fill="rgba(248,243,230,0.6)" fontSize="12">{t('about.mapMexico')}</text>
            </g>
          </svg>
        </div>

        <div className="hero-stats">
          {[
            { count: 17, icon: FaCalendarAlt, labelKey: 'about.heroStatsYears' },
            { count: 95654, icon: FaSuitcase, labelKey: 'about.heroStatsTravelers' },
            { count: 438, icon: FaUsers, labelKey: 'about.heroStatsEmployees' },
            { count: 182, icon: FaMapMarkedAlt, labelKey: 'about.heroStatsGuides' },
            { count: 5, icon: FaGlobe, labelKey: 'about.heroStatsOffices' },
          ].map((s, i) => (
            <div key={i}>
              <s.icon className="stat-icon" />
              <div className="num" data-count={s.count}>0</div>
              <div className="lbl">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>

        <div className="scroll-cue"><span>{t('about.heroScroll')}</span><div className="line"></div></div>
      </header>

      <section className="section-light" id="who">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.whoEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.whoTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="who-grid">
          <div className="reveal">
            <p dangerouslySetInnerHTML={{ __html: t('about.whoP1') }} />
            <p>{t('about.whoP2')}</p>
            <p dangerouslySetInnerHTML={{ __html: t('about.whoP3') }} />
            <div className="feature-pair">
              <div className="feature-card">
                <div className="ftitle">{t('about.specialistsTitle')}</div>
                <p>{t('about.specialistsDesc')}</p>
              </div>
              <div className="feature-card">
                <div className="ftitle">{t('about.ownOpsTitle')}</div>
                <p>{t('about.ownOpsDesc')}</p>
              </div>
            </div>
          </div>
          <div className="presence-box reveal">
            <h3>{t('about.presenceTitle')}</h3>
            <div className="presence-list">
              <div className="presence-row"><span className="k">{t('about.presenceSales')}</span><span className="v">{t('about.presenceSalesVal')}</span></div>
              <div className="presence-row"><span className="k">{t('about.presenceNetwork')}</span><span className="v">{t('about.presenceNetworkVal')}</span></div>
              <div className="presence-row"><span className="k">&nbsp;</span><span className="v">{t('about.presenceNetworkVal2')}</span></div>
              <div className="presence-row"><span className="k">{t('about.presenceLanguages')}</span><span className="v">{t('about.presenceLanguagesVal')}</span></div>
            </div>
          </div>
        </div>
        <div className="stats-strip reveal">
          {[
            { count: 17, suffix: '+', icon: FaCalendarAlt, labelKey: 'about.statYears' },
            { count: 95654, suffix: '', icon: FaSuitcase, labelKey: 'about.statTravelers' },
            { count: 438, suffix: '', icon: FaUsers, labelKey: 'about.statEmployees' },
            { count: 182, suffix: '', icon: FaMapMarkedAlt, labelKey: 'about.statGuides' },
            { count: 5, suffix: '', icon: FaGlobe, labelKey: 'about.statOffices' },
          ].map((s, i) => (
            <div className="stat-cell" key={i}>
              <s.icon className="stat-icon" />
              <div className="n" data-count={s.count} data-suffix={s.suffix}>0</div>
              <div className="l">{t(s.labelKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-dark" id="growth">
        <div className="section-head reveal">
          <span className="eyebrow">{t('about.growthEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.growthTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="chart-wrap">
          <div className="reveal">
            <p style={{ fontSize: 16, lineHeight: 1.85, color: 'rgba(248,243,230,.72)', fontWeight: 300 }}>{t('about.growthDesc')}</p>
          </div>
          <div className="chart reveal">
            {chartData.map((c, i) => (
              <div className="bar-col" key={i}>
                <div className="bar" data-h={c.pct}><span className="val">{c.value}</span></div>
                <div className="bar-yr">{c.year}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-light" id="institutional">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.instEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.instTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="inst-grid reveal">
          <div className="inst-cell">
            <div className="ic-label">{t('about.instFoundation')}</div>
            <h4>{t('about.instFoundationDate')}</h4>
            <p>{t('about.instFoundationDesc')}</p>
          </div>
          <div className="inst-cell">
            <div className="ic-label">{t('about.instLicense')}</div>
            <h4>{t('about.instLicenseNo')}</h4>
            <p>{t('about.instLicenseDesc')}</p>
          </div>
          <div className="inst-cell">
            <div className="ic-label">{t('about.instInfra')}</div>
            <h4>{t('about.instInfraVal')}</h4>
            <p>{t('about.instInfraDesc')}</p>
          </div>
          <div className="inst-cell">
            <div className="ic-label">{t('about.instPartnerships')}</div>
            <h4>{t('about.instPartnershipsVal')}</h4>
            <p>{t('about.instPartnershipsDesc')}</p>
          </div>
        </div>
        <div style={{ marginTop: 50 }} className="reveal">
          <div className="ic-label eyebrow" style={{ color: 'var(--royal)' }}>{t('about.instTradeShows')}</div>
          <div className="tradeshow-row" style={{ marginTop: 18 }}>
            {[1,2,3,4,5,6].map((n) => (
              <div className="tradeshow-chip" key={n}>{t('about.tradeShow' + n)}</div>
            ))}
          </div>
        </div>
        <div className="quote-block reveal">
          <p>{t('about.instQuote')}</p>
          <span>{t('about.instQuoteAuthor')}</span>
        </div>
      </section>

      <section className="section-dark" id="events">
        <div className="section-head reveal">
          <span className="eyebrow">{t('about.eventsEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.eventsTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="events-list reveal">
          {[
            { year: '\u2014', textKey: 'about.event1' },
            { year: '2013', textKey: 'about.event2' },
            { year: '2014\u201315', textKey: 'about.event3' },
            { year: '2015', textKey: 'about.event4' },
            { year: '2016', textKey: 'about.event5' },
            { year: '2016\u201317', textKey: 'about.event6' },
            { year: '2018', textKey: 'about.event7' },
            { year: '2019', textKey: 'about.event8' },
          ].map((ev, i) => (
            <div className="event-row" key={i}>
              <div className="eyr">{ev.year}</div>
              <div className="etxt">{t(ev.textKey)}</div>
            </div>
          ))}
        </div>
        <p className="events-more reveal">{t('about.eventsMore')}</p>
      </section>

      <section className="section-light" id="services">
        <div className="section-head reveal">
          <span className="eyebrow" style={{ color: 'var(--royal)' }}>{t('about.servicesEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.servicesTitle') }} />
          <div className="rule"></div>
        </div>
        <div className="services-grid reveal">
          {[
            { num: '01', titleKey: 'about.svc01.title', descKey: 'about.svc01.desc' },
            { num: '02', titleKey: 'about.svc02.title', descKey: 'about.svc02.desc' },
            { num: '03', titleKey: 'about.svc03.title', descKey: 'about.svc03.desc' },
            { num: '04', titleKey: 'about.svc04.title', descKey: 'about.svc04.desc' },
          ].map((svc, i) => (
            <div className="svc-card" key={i}>
              <span className="svc-num">{svc.num}</span>
              <div>
                <div className="svc-title">{t(svc.titleKey)}</div>
                <p>{t(svc.descKey)}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="values-row reveal">
          {[
            { titleKey: 'about.val01.title', descKey: 'about.val01.desc' },
            { titleKey: 'about.val02.title', descKey: 'about.val02.desc' },
            { titleKey: 'about.val03.title', descKey: 'about.val03.desc' },
            { titleKey: 'about.val04.title', descKey: 'about.val04.desc' },
          ].map((v, i) => (
            <div className="value-item" key={i}>
              <div className="vt">{t(v.titleKey)}</div>
              <div className="vd">{t(v.descKey)}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-dark" id="team">
        <div className="section-head reveal" style={{ marginBottom: 80 }}>
          <span className="eyebrow">{t('about.teamEyebrow')}</span>
          <h2 dangerouslySetInnerHTML={{ __html: t('about.teamTitle') }} />
          <div className="rule"></div>
          <p style={{ marginTop: 24, fontSize: '13.5px', color: 'rgba(248,243,230,.6)', fontWeight: 300, lineHeight: 1.8, maxWidth: 520 }}>
            {t('about.teamDesc')}
          </p>
        </div>
        <div className="team-lead reveal">
          <span className="team-badge">{'🇪🇬'} {t('about.teamLeadBadge')}</span>
          <div className="avatar-frame">
            <div className="avatar-ring"></div>
            <div className="avatar has-photo"><span className="initials" style={{display:'none'}}>AY</span><img src="https://res.cloudinary.com/tibx70zb/image/upload/v1783625666/9014b7ab-2eb3-4158-bc0b-246329a06c9b_n48ymc.jpg" alt="Attia Yamany" /></div>
          </div>
          <p className="member-name lead-name">{t('about.leadName')}</p>
          <p className="member-role" dangerouslySetInnerHTML={{ __html: t('about.leadRole') }} />
        </div>
        <div className="team-grid">
          {[
            { initials: 'MS', name: 'Miguel Selma', roleKey: 'about.roleGeneralDirector', country: '\uD83C\uDDEA\uD83C\uDDF8 Spain', offset: '0px', delay: '.05s' },
            { initials: 'GF', name: 'Giovanni Fiore', roleKey: 'about.roleCommercialDirector', country: '\uD83C\uDDEE\uD83C\uDDF9 Italy', offset: '38px', delay: '.1s', img: 'https://res.cloudinary.com/tibx70zb/image/upload/v1783333028/WhatsApp_Image_2026-07-01_at_12.03.27_AM_rj6uko.jpg' },
            { initials: 'VB', name: 'Vinicius Barcellos', roleKey: 'about.roleCommercialDirector', country: '\uD83C\uDDE7\uD83C\uDDF7 Brazil', offset: '8px', delay: '.15s' },
            { initials: 'SM', name: 'Sonia Melo', roleKey: 'about.roleSalesDirector', country: '\uD83C\uDDE7\uD83C\uDDF7 Brazil', offset: '46px', delay: '.2s', img: 'https://res.cloudinary.com/tibx70zb/image/upload/v1783409905/24b2188b-b23a-41ba-9321-dd9ac33de3cd_iylkgt.jpg' },
            { initials: 'LR', name: 'Luciana Rovaroto', roleKey: 'about.roleCustomerService', country: '\uD83C\uDDE7\uD83C\uDDF7 Brazil', offset: '2px', delay: '.25s', img: 'https://res.cloudinary.com/tibx70zb/image/upload/v1783332881/WhatsApp_Image_2026-07-01_at_12.03.27_AM_1_i6suvb.jpg' },
            { initials: 'RP', name: 'Ramiro Poggi', roleKey: 'about.roleCommercialDirector', country: '\uD83C\uDDE6\uD83C\uDDF7 Argentina', offset: '32px', delay: '.3s' },
            { initials: 'EC', name: 'Edgar Ca\u00F1\u00F3n', roleKey: 'about.roleCommercialDirector', country: '\uD83C\uDDE8\uD83C\uDDF4 Colombia', offset: '14px', delay: '.35s' },
          ].map((m, i) => (
            <div className="team-card reveal" key={i} style={{ '--offset': m.offset, transitionDelay: m.delay }}>
              <div className="avatar-frame">
                <div className="avatar-ring"></div>
                <div className={`avatar${m.img ? ' has-photo' : ''}`}>
                  <span className="initials" style={m.img ? { display: 'none' } : {}}>{m.initials}</span>
                  {m.img ? <img src={m.img} alt={m.name} /> : <img alt="" />}
                  {!m.img && <span className="plus">+</span>}
                </div>
                {!m.img && <input type="file" accept="image/*" />}
              </div>
              <p className="member-name">{m.name}</p>
              <p className="member-role" dangerouslySetInnerHTML={{ __html: t(m.roleKey) }} />
              <p className="member-country">{m.country}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default About;

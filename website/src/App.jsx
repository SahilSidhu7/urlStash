import React, { useState } from 'react';
import MockPopup from './MockPopup';
import './App.css';

export default function App() {
  const [siteTheme, setSiteTheme] = useState('dark');

  const toggleSiteTheme = () => {
    setSiteTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className={`showcase-app theme-${siteTheme}`}>
      {/* Navigation Header */}
      <header className="showcase-header">
        <div className="site-logo">
          <svg viewBox="0 0 24 24" width="28" height="28" className="site-logo-icon">
            <path fill="currentColor" d="M19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4h3.6a1.5 1.5 0 0 1 1.1.5l1.6 1.8h4.7A1.5 1.5 0 0 1 19 5.5zM17 9H7v2h10V9zm0 4H7v2h10v-2z" />
          </svg>
          <span className="site-logo-text">urlStash</span>
        </div>

        <nav className="site-nav">
          <a href="#features">Features</a>
          <a href="#sandbox">Interactive Demo</a>
          <a href="#how-it-works">How It Works</a>
        </nav>

        <div className="header-controls">
          {/* Landing Page Theme Toggle */}
          <button
            onClick={toggleSiteTheme}
            className="site-theme-toggle-btn"
            title={`Switch to ${siteTheme === 'dark' ? 'Light Beige' : 'Dark Charcoal'} Theme`}
          >
            {siteTheme === 'dark' ? (
              // Sun Icon
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.03.39 1.41 0s.39-1.03 0-1.41L5.99 4.58zm12.37 12.37a.996.996 0 0 0-1.41 0 .996.996 0 0 0 0 1.41l1.06 1.06c.39.39 1.02.39 1.41 0 .39-.39.39-1.02 0-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06zM7.05 18.01a.996.996 0 0 0 0-1.41.996.996 0 0 0-1.41 0l-1.06 1.06c-.39.39-.39 1.03 0 1.41s1.03.39 1.41 0l1.06-1.06z" />
              </svg>
            ) : (
              // Moon Icon
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M12.3 22h-.1c-5.4 0-10-4.6-10-10.2 0-4.2 2.6-8 6.6-9.6.6-.2 1.2.2 1.2.8v.2c-.8 3.1.2 6.5 2.6 8.8 2.3 2.3 5.7 3.2 8.7 2.4h.2c.6 0 1 .6.8 1.2-1.7 4.2-5.7 6.4-10 6.4zm-6.2-9.6c.1 3.5 2.6 6.5 6 7.2 2.1.4 4.3-.2 5.9-1.6-2.9-.8-5.3-2.9-6.5-5.7-1.2-2.8-.9-5.9.6-8.5-3.3.9-5.9 3.8-6 8.6z" />
              </svg>
            )}
            <span>{siteTheme === 'dark' ? 'Beige Mode' : 'Black Mode'}</span>
          </button>

          <a href="#sandbox" className="btn-install">
            <span>Try Sandbox</span>
          </a>
        </div>
      </header>

      {/* Hero Section */}
      <section className="showcase-hero">
        <div className="hero-content">
          <div className="hero-badge">Chrome Extension • Manifest V3</div>
          <h1 className="hero-title">
            A stashing sanctuary for your <span className="highlight-text">tab storms</span>.
          </h1>
          <p className="hero-desc">
            Organize your browser into sleek, custom-nested folders, stash entire browser states in one click, and restore your clarity with a clean workspace instantly. Beautiful, responsive, and distraction-free.
          </p>
          <div className="hero-ctas">
            <button className="btn-hero-primary" onClick={() => alert('🚀 The extension hasn’t launched yet — we’re currently gathering feedback and early reviews to make it even better before release. Stay tuned!')}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
              </svg>
              <span>Download Extension</span>
            </button>
            <a href="#sandbox" className="btn-hero-secondary">
              <span>Launch Interactive Demo</span>
            </a>
          </div>

          <div className="hero-features-list">
            <div className="hero-feature-item">
              <span className="bullet">✓</span> Fully Offline & Private
            </div>
            <div className="hero-feature-item">
              <span className="bullet">✓</span> Softbeige & Deepblack Aesthetics
            </div>
            <div className="hero-feature-item">
              <span className="bullet">✓</span> Zero Configuration Needed
            </div>
          </div>
        </div>

        <div className="hero-mockup-wrapper">
          <div className="mockup-frame-accent"></div>
          {/* Interactive Extension Sandbox Embedded in Hero */}
          <MockPopup syncedTheme={siteTheme} />
        </div>
      </section>

      {/* Interactive Sandbox Guide Section */}
      <section id="sandbox" className="sandbox-instructions">
        <div className="section-header">
          <h2 className="section-title">Interactive Play Sandbox</h2>
          <p className="section-subtitle">
            Experience urlStash right now inside this web page! Test key stashing actions on the simulated browser widget above.
          </p>
        </div>

        <div className="instructions-grid">
          <div className="instruction-card">
            <div className="step-num">01</div>
            <h3>Stash active webpages</h3>
            <p>Select different browser tabs above the widget, choose your target folder inside the stashing card, and click <b>Stash Page</b> to see it immediately nest inside the tree.</p>
          </div>

          <div className="instruction-card">
            <div className="step-num">02</div>
            <h3>Organize with Subfolders</h3>
            <p>Click the <b>+ icon</b> on the side of the folder dropdown in the widget to create a new folder inside your current selection. The dropdown dynamically updates!</p>
          </div>

          <div className="instruction-card">
            <div className="step-num">03</div>
            <h3>Stash the entire Window</h3>
            <p>Open multiple mock tabs, then click <b>Save State</b>. The widget automatically captures all pages, names the folder after your first active site, and stashes it.</p>
          </div>

          <div className="instruction-card">
            <div className="step-num">04</div>
            <h3>Wipe tabs with Clean Slate</h3>
            <p>Too much clutter? Hit the header's <b>Close Tabs</b> button. The mock simulator closes all tabs and boots up a single clean "New Tab". Zero tab anxiety!</p>
          </div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="features-section">
        <div className="section-header">
          <h2 className="section-title">Minimalist Utility. Powerful Productivity.</h2>
          <p className="section-subtitle">
            Every feature in urlStash is crafted to minimize friction, maintain system resources, and provide absolute visual peace.
          </p>
        </div>

        <div className="features-grid">
          <div className="feature-grid-card">
            <div className="feature-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M22 6H12l-2-2H2v16h20V6zm-2 12H4V8h16v10zm-3-5H7v-2h10v2z" />
              </svg>
            </div>
            <h3>Hierarchical Organization</h3>
            <p>Create recursive folders inside folders to organize work, code, leisure, and research exactly how your brain categorizes them. Deep accordion trees with click-expansion.</p>
          </div>

          <div className="feature-grid-card">
            <div className="feature-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 12h-2v3H7v-3H5v5h14v-5zM12 2L7.5 6.5l1.42 1.42L11 5.83V13h2V5.83l2.08 2.09 1.42-1.42L12 2z" />
              </svg>
            </div>
            <h3>Instant Browser Session States</h3>
            <p>Working on a coding sprint, research paper, or vacation booking? Save all open tabs into a single dedicated folder. Your state is preserved; you can safely close your browser.</p>
          </div>

          <div className="feature-grid-card">
            <div className="feature-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12 19 6.41z" />
              </svg>
            </div>
            <h3>One-Click Clean Slate</h3>
            <p>Reset your workspace. Instantly close all open tabs in your browser while spawning a single clean new tab. Keep your computer fast, and start fresh without saving clutter.</p>
          </div>

          <div className="feature-grid-card">
            <div className="feature-icon-box">
              <svg viewBox="0 0 24 24" width="24" height="24">
                <path fill="currentColor" d="M12 3c-4.97 0-9 4.03-9 9s4.03 9 9 9 9-4.03 9-9c0-.46-.04-.92-.1-1.36-.98 1.37-2.58 2.26-4.4 2.26-2.98 0-5.4-2.42-5.4-5.4 0-1.81.89-3.42 2.26-4.4-.44-.06-.9-.1-1.36-.1z" />
              </svg>
            </div>
            <h3>Curated Color Palette</h3>
            <p>Switch between the soft, warm beige/sand theme for a natural workspace feel, and the shades of solid black for relaxing dark mode productivity. Curved corners add a fluid native style.</p>
          </div>
        </div>
      </section>

      {/* How it works Section */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-header">
          <h2 className="section-title">Install in 1 Simple Steps</h2>
          <p className="section-subtitle">Getting started with urlStash is quick and requires no signup or registration.</p>
        </div>

        <div className="steps-row">
          <div className="step-item-card">
            <div className="step-badge">1</div>
            <h3>Download extension</h3>
            <p>Click the download button below to download the extension.</p>
            <br></br>
            <button className="btn-hero-primary" onClick={() => alert('🚀 The extension hasn’t launched yet — we’re currently gathering feedback and early reviews to make it even better before release. Stay tuned!')}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96zM17 13l-5 5-5-5h3V9h4v4h3z" />
              </svg>
              <span>Download Extension</span>
            </button>
          </div>
          {/* <div className="arrow-step">→</div>
          <div className="step-item-card">
            <div className="step-badge">2</div>
            <h3>Open Extension Board</h3>
            <p>Type <code>chrome://extensions</code> in your URL bar, and toggle on <b>Developer mode</b> in the top right corner.</p>
          </div>
          <div className="arrow-step">→</div>
          <div className="step-item-card">
            <div className="step-badge">3</div>
            <h3>Drag & Drop</h3>
            <p>Drag the <code>extension</code> folder anywhere onto the extensions dashboard. Done! Pin urlStash to your toolbar.</p>
          </div> */}
        </div>
      </section>

      {/* Bottom CTA Block */}
      <section className="bottom-cta-banner">
        <h2>Restore calm to your browsing experience.</h2>
        <p>No account. No telemetry. Fully local and private. Just your tabs, stashed beautifully.</p>
        <button className="btn-cta-large" onClick={() => alert('🚀 The extension hasn’t launched yet — we’re currently gathering feedback and early reviews to make it even better before release. Stay tuned!')}>
          Add to Chrome Browser — It's Free
        </button>
      </section>

      {/* Footer */}
      <footer className="showcase-footer">
        <div className="footer-top">
          <div className="footer-logo">
            <svg viewBox="0 0 24 24" width="24" height="24">
              <path fill="currentColor" d="M19 5.5v13a1.5 1.5 0 0 1-1.5 1.5H6.5A1.5 1.5 0 0 1 5 18.5v-13A1.5 1.5 0 0 1 6.5 4h3.6a1.5 1.5 0 0 1 1.1.5l1.6 1.8h4.7A1.5 1.5 0 0 1 19 5.5zM17 9H7v2h10V9zm0 4H7v2h10v-2z" />
            </svg>
            <span>urlStash</span>
          </div>
          <p className="footer-slogan">Your sanctuary in the browser tab storms.</p>
        </div>
        <div className="footer-bottom">
          <span>© 2026 urlStash. Under MIT License. Open Source.</span>
          <div className="footer-links">
            <a href="https://github.com/SahilSidhu7" target="_blank" rel="noreferrer">GitHub</a>
            <a href="https://www.linkedin.com/in/sahil-sidhu-ai/">LinkedIn</a>
            <a href="privacy.html" target="_blank" rel="noreferrer">Privacy</a>
            <a href="#sandbox">Developer Specs</a>
          </div>
        </div>
      </footer>
    </div>
  );
}

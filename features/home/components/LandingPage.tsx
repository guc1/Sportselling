'use client';

import { useEffect, useState } from 'react';
import { homeCopy } from '@lib/i18n/home';

function WelcomeModal({ onClose }: { onClose: () => void }) {
  return (
    <div className="modal-backdrop" role="presentation">
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <h2 id="welcome-title">{homeCopy.welcome.title}</h2>
        <p>{homeCopy.welcome.description}</p>
        <button type="button" onClick={onClose} aria-label="Close welcome message">
          Close
        </button>
      </div>
    </div>
  );
}

export function LandingPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setIsModalOpen(true), 150);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <main>
        <section className="hero">
          <h1>{homeCopy.hero.headline}</h1>
          <p>{homeCopy.hero.subheadline}</p>
          <button type="button">{homeCopy.cta}</button>
        </section>

        <section className="marketplace" aria-labelledby="marketplace-heading">
          <div className="marketplace__header">
            <h2 id="marketplace-heading">{homeCopy.marketplace.title}</h2>
            <p>{homeCopy.marketplace.subtitle}</p>
          </div>
          <div className="marketplace__grid">
            {homeCopy.marketplace.cards.map((card) => (
              <article key={card.title} className="marketplace__card">
                <span className="marketplace__tag">{card.tag}</span>
                <h3 className="marketplace__title">{card.title}</h3>
                <p className="marketplace__description">{card.description}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      {isModalOpen ? <WelcomeModal onClose={() => setIsModalOpen(false)} /> : null}
    </>
  );
}

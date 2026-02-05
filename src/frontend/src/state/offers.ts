import { useState, useEffect } from 'react';

interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
}

const OFFERS_STORAGE_KEY = 'waffle_naka_offers';

function loadOffers(): Offer[] {
  try {
    const stored = localStorage.getItem(OFFERS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load offers:', error);
    return [];
  }
}

function saveOffers(offers: Offer[]): void {
  try {
    localStorage.setItem(OFFERS_STORAGE_KEY, JSON.stringify(offers));
  } catch (error) {
    console.error('Failed to save offers:', error);
  }
}

export function useOffers() {
  const [offers, setOffers] = useState<Offer[]>(loadOffers);

  useEffect(() => {
    saveOffers(offers);
  }, [offers]);

  const addOffer = (offer: Offer) => {
    setOffers((prev) => [...prev, offer]);
  };

  const updateOffer = (updatedOffer: Offer) => {
    setOffers((prev) =>
      prev.map((offer) => (offer.id === updatedOffer.id ? updatedOffer : offer))
    );
  };

  const deleteOffer = (offerId: string) => {
    setOffers((prev) => prev.filter((offer) => offer.id !== offerId));
  };

  return { offers, addOffer, updateOffer, deleteOffer };
}

import { useEffect, useState, useRef } from 'react';
import { useGetOrders } from './useQueries';
import { isOwnerAuthenticated } from '@/state/ownerAuth';
import { OrderStatus } from '@/backend';

export function useOrderNotifications() {
  const { data: orders } = useGetOrders();
  const isOwner = isOwnerAuthenticated();
  const [newOrderCount, setNewOrderCount] = useState(0);
  const [hasPlayedSound, setHasPlayedSound] = useState(false);
  const previousOrderIdsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!isOwner || !orders) {
      setNewOrderCount(0);
      return;
    }

    const currentOrderIds = new Set(orders.map((o) => o.id));
    const newOrders = orders.filter(
      (order) =>
        order.status === OrderStatus.new_ &&
        !previousOrderIdsRef.current.has(order.id)
    );

    if (newOrders.length > 0 && previousOrderIdsRef.current.size > 0) {
      if (!hasPlayedSound) {
        playNotificationSound();
        setHasPlayedSound(true);
        setTimeout(() => setHasPlayedSound(false), 3000);
      }

      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('New Order Received!', {
          body: `${newOrders.length} new order(s) received`,
          icon: '/assets/generated/waffle-naka-logo.dim_512x512.png',
        });
      } else if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission();
      }
    }

    previousOrderIdsRef.current = currentOrderIds;

    const newOrdersCount = orders.filter((o) => o.status === OrderStatus.new_).length;
    setNewOrderCount(newOrdersCount);
  }, [orders, isOwner, hasPlayedSound]);

  return { newOrderCount };
}

function playNotificationSound() {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = 800;
  oscillator.type = 'sine';

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.5);
}

import { motion, useSpring, useTransform } from 'framer-motion';
import { useEffect } from 'react';

/**
 * Composant de compteur animé utilisant Framer Motion
 * Anime les transitions entre différentes valeurs numériques
 * 
 * @param {number} value - La valeur cible à afficher
 * @param {number} duration - Durée de l'animation (par défaut 1 seconde)
 */
export default function AnimatedCounter({ value, duration = 1 }) {
  const spring = useSpring(0, { mass: 0.8, stiffness: 75, damping: 15 });
  const display = useTransform(spring, current => Math.round(current));
  
  useEffect(() => {
    spring.set(value);
  }, [spring, value]);
  
  return <motion.span>{display}</motion.span>;
}



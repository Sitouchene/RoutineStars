import { motion } from "framer-motion";

/**
 * Mascotte Chouette mOOtify
 * Version améliorée — formes plus douces, yeux expressifs, sourire léger.
 *
 * @param {object} props
 * @param {string} props.size - Taille : 'sm', 'md', 'lg', 'xl'
 * @param {boolean} props.animated - Active l'animation de clignement
 * @param {string} props.className - Classes CSS additionnelles
 */
export default function OwlMascot({
  size = "md",
  animated = true,
  className = "",
}) {
  const sizes = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
    xl: "w-48 h-48",
  };

  return (
    <div className={`${sizes[size]} ${className}`}>
      <svg
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Corps */}
        <ellipse cx="100" cy="125" rx="70" ry="78" fill="#58D6A8" />
        <ellipse cx="100" cy="140" rx="48" ry="52" fill="#A7F3D0" />

        {/* Ailes douces */}
        <path
          d="M 28 115 Q 18 140 28 160"
          stroke="#4DD4A8"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 172 115 Q 182 140 172 160"
          stroke="#4DD4A8"
          strokeWidth="10"
          strokeLinecap="round"
          fill="none"
        />

        {/* Tête */}
        <circle cx="100" cy="70" r="50" fill="#58D6A8" />

        {/* Aigrettes arrondies */}
        <path
          d="M 65 28 Q 55 18 65 12"
          stroke="#4DD4A8"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M 135 28 Q 145 18 135 12"
          stroke="#4DD4A8"
          strokeWidth="7"
          strokeLinecap="round"
          fill="none"
        />

        {/* Halo doux derrière les yeux */}
        <circle cx="80" cy="70" r="22" fill="#CFFAE1" opacity="0.8" />
        <circle cx="120" cy="70" r="22" fill="#CFFAE1" opacity="0.8" />

        {/* Yeux blancs */}
        <circle cx="80" cy="70" r="18" fill="white" />
        <circle cx="120" cy="70" r="18" fill="white" />

        {/* Pupilles animées */}
        <motion.circle
          cx="80"
          cy="70"
          r="9"
          fill="#2E2E2E"
          animate={animated ? { scaleY: [1, 0.15, 1] } : {}}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        />
        <motion.circle
          cx="120"
          cy="70"
          r="9"
          fill="#2E2E2E"
          animate={animated ? { scaleY: [1, 0.15, 1] } : {}}
          transition={{
            duration: 0.3,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 0.08,
          }}
        />

        {/* Reflets */}
        <circle cx="83" cy="67" r="3" fill="white" />
        <circle cx="123" cy="67" r="3" fill="white" />

        {/* Bec */}
        <path d="M 100 82 L 94 92 L 106 92 Z" fill="#B69CF4" />

        {/* Petit sourire */}
        <path
          d="M 87 98 Q 100 106 113 98"
          stroke="#784BB7"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
        />

        {/* Pattes */}
        <ellipse cx="80" cy="188" rx="12" ry="7" fill="#B69CF4" />
        <ellipse cx="120" cy="188" rx="12" ry="7" fill="#B69CF4" />
      </svg>
    </div>
  );
}
        
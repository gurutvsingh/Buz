import { AnimatePresence, motion } from "framer-motion";
import {
  FaArrowTrendUp,
  FaIndianRupeeSign,
} from "react-icons/fa6";

const particles = Array.from({ length: 12 }, (_, index) => ({
  id: index,
  x: ((index % 6) - 2.5) * 42,
  y: -140 - (index % 4) * 22,
}));

const MoneyBurst = ({
  show,
  tone = "green",
  amount,
  label,
}) => {
  const styles = {
    green: {
      card: "from-emerald-500 to-green-600",
      glow: "shadow-emerald-500/30",
    },

    rose: {
      card: "from-rose-500 to-red-600",
      glow: "shadow-rose-500/30",
    },
  };

  const style = styles[tone];

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="pointer-events-none fixed inset-0 z-[999] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/10 backdrop-blur-[2px]" />

          {particles.map((particle, index) => (
            <motion.div
              key={particle.id}
              initial={{ opacity: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                y: particle.y,
                x: particle.x,
                scale: [0, 1, 0.8],
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.04,
              }}
              className="absolute text-2xl text-emerald-600"
            >
              <FaIndianRupeeSign />
            </motion.div>
          ))}

          <motion.div
            initial={{ scale: 0.7, y: 30, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 180 }}
            className={`
              relative
              overflow-hidden
              rounded-2xl
              bg-gradient-to-br
              ${style.card}
              p-8
              text-white
              shadow-2xl
              ${style.glow}
            `}
          >
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/20 blur-2xl" />

            <div className="relative text-center">
              <motion.div
                animate={{ rotate: [0, -8, 8, 0] }}
                transition={{ duration: 0.6 }}
                className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-2xl bg-white/15"
              >
                <FaArrowTrendUp className="text-3xl" />
              </motion.div>

              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/80">
                SUCCESS
              </p>

              <h2 className="mt-3 text-4xl font-black">{label}</h2>

              {amount && (
                <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-5 py-2 text-lg font-black">
                  <FaIndianRupeeSign />
                  {amount}
                </div>
              )}

              <p className="mt-4 text-sm text-white/80">
                Transaction recorded successfully
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoneyBurst;

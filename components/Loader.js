import { motion } from "framer-motion";

export default function Loader() {
  return (
    <div className="flex items-center justify-center space-x-2 h-40">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-4 h-4 bg-green-500 rounded-full"
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

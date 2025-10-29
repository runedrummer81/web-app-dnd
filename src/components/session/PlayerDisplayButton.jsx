import { motion } from "framer-motion";
import { useState } from "react";
import SelectedItem from "../SelectedItem";

export const PlayerDisplayButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="absolute bottom-0 z-9999 p-10">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.2 }}
      >
        <SelectedItem
          onClick={onClick}
          isSelected={true}
          showArrow={false}
          animate={true}
          className="w-full text-center cursor-pointer bg-[var(--dark-muted-bg)]"
        >
          <div className="flex flex-col items-center">
            <div className="text-sm uppercase ">Open Player Display</div>
          </div>
        </SelectedItem>
      </motion.div>
    </div>
  );
};

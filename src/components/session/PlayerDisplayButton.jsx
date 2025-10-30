import { motion } from "framer-motion";
import { useState } from "react";
import ActionButton from "../ActionButton";

export const PlayerDisplayButton = ({ onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="absolute bottom-0 z-9999 p-10">
      <motion.div
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileTap={{ scale: 0.98 }}
        whileHover={{ scale: 1.05 }}
        transition={{ duration: 0.2 }}
      >
        <ActionButton
          onClick={onClick}
          label="OPEN PLAYER DISPLAY"
          isize="sm"
          color="var(--secondary)"
          bgColor="var(--primary"
          textColor="var(--dark-muted-bg)"
          showLeftArrow={false}
          showRightArrow={false}
          showGlow={false}
          animate={true}
          animationDelay={0.2}
          className="w-full text-center cursor-pointer "
        ></ActionButton>
      </motion.div>
    </div>
  );
};

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
        transition={{ duration: 0.2 }}
      >
        <ActionButton
          onClick={onClick}
          label="OPEN PLAYER DISPLAY"
          isize="md"
          color="var(--secondary)"
          bgColor="var(--primary"
          textColor="var(--dark-muted-bg)"
          showLeftArrow={true}
          showRightArrow={true}
          showGlow={true}
          animate={true}
          animationDelay={0.2}
          className="w-full text-center cursor-pointer "
        ></ActionButton>
      </motion.div>
    </div>
  );
};

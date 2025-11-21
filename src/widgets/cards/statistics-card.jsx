import React, { useRef } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Typography,
} from "@material-tailwind/react";
import PropTypes from "prop-types";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

export function StatisticsCard({ color, icon, title, value, footer }) {
  const cardRef = useRef(null);
  
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const mouseXSpring = useSpring(x, { stiffness: 400, damping: 30 });
  const mouseYSpring = useSpring(y, { stiffness: 400, damping: 30 });
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["12deg", "-12deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-12deg", "12deg"]);
  
  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    const xPct = mouseX / width - 0.5;
    const yPct = mouseY / height - 0.5;
    
    x.set(xPct);
    y.set(yPct);
  };
  
  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
      }}
      className="perspective-1000"
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Card className="border border-red-600 shadow-sm dark:bg-gray-800 dark:border-gray-700 relative overflow-hidden h-full flex flex-col">
        <motion.div
          style={{
            transform: "translateZ(60px)",
            transformStyle: "preserve-3d",
          }}
        >
          <CardHeader
            variant="gradient"
            color={color}
            floated={false}
            shadow={false}
            className="absolute grid h-12 w-12 place-items-center rounded-lg"
          >
            {icon}
          </CardHeader>
        </motion.div>
        <CardBody className="p-6 pr-8 text-right flex-1 flex flex-col justify-center">
          <motion.div
            style={{
              transform: "translateZ(40px)",
              transformStyle: "preserve-3d",
            }}
          >
            <Typography variant="small" className="font-normal text-blue-gray-600 dark:text-gray-400 mb-3">
              {title}
            </Typography>
            <Typography variant="h4" color="blue-gray" className="dark:text-white font-bold">
              {value}
            </Typography>
          </motion.div>
        </CardBody>
        {footer && (
          <CardFooter className="border-t border-blue-gray-50 dark:border-gray-700 p-5 px-8">
            <motion.div
              style={{
                transform: "translateZ(20px)",
                transformStyle: "preserve-3d",
              }}
            >
              {footer}
            </motion.div>
          </CardFooter>
        )}
      </Card>
    </motion.div>
  );
}

StatisticsCard.defaultProps = {
  color: "blue",
  footer: null,
};

StatisticsCard.propTypes = {
  color: PropTypes.oneOf([
    "white",
    "blue-gray",
    "gray",
    "brown",
    "deep-orange",
    "orange",
    "amber",
    "yellow",
    "lime",
    "light-green",
    "green",
    "teal",
    "cyan",
    "light-blue",
    "blue",
    "indigo",
    "deep-purple",
    "purple",
    "pink",
    "red",
  ]),
  icon: PropTypes.node.isRequired,
  title: PropTypes.node.isRequired,
  value: PropTypes.node.isRequired,
  footer: PropTypes.node,
};

StatisticsCard.displayName = "/src/widgets/cards/statistics-card.jsx";

export default StatisticsCard;

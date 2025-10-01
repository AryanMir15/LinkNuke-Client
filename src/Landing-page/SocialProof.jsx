import React from "react";
import { motion } from "framer-motion";

const SocialProof = () => {
  // Public avatars from the /public folder
  const userAvatars = [
    { name: "User 1", src: "/User1.jpg" },
    { name: "User 2", src: "/User2.jpg" },
    { name: "User 3", src: "/User3.jpg" },
    { name: "User 4", src: "/User4.jpg" },
    { name: "User 5", src: "/User5.jpg" },
  ];

  const fadeUp = (delay = 0) => ({
    hidden: { opacity: 0, y: 10 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.35, ease: "easeOut", delay },
    },
  });

  return (
    <div
      className="flex items-center justify-center gap-[18px] text-gray-400 text-sm"
      style={{ marginTop: "5px" }}
    >
      {/* 1) Trusted By (first) */}
      <motion.span
        className="text-white/90 tracking-wide leading-tight"
        style={{
          fontFamily: '"Style Script", cursive',
          fontSize: "1.2rem",
          fontStyle: "italic",
        }}
        variants={fadeUp(0)}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.6 }}
      >
        Trusted By
      </motion.span>

      <div className="flex items-center">
        {/* 2) Avatars fade one-by-one */}
        <div className="flex items-center -space-x-[14px]">
          {userAvatars.map((user, index) => (
            <motion.div
              key={index}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-800"
              title={user.name}
              variants={fadeUp(0.12 + index * 0.08)}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, amount: 0.6 }}
            >
              <img
                src={user.src}
                alt={user.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
              />
            </motion.div>
          ))}
          {/* 3) Plus as a black avatar at the end */}
          <motion.div
            className="w-10 h-10 rounded-full border-2 border-gray-800 bg-black flex items-center justify-center"
            title="More users"
            variants={fadeUp(0.12 + userAvatars.length * 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <span className="text-white text-xl leading-none">+</span>
          </motion.div>
        </div>

        {/* 4) 'And More' comes last with clear spacing */}
        <motion.span
          className="text-white/90"
          style={{
            fontFamily: '"Style Script", cursive',
            fontStyle: "normal",
            marginLeft: "7px",
          }}
          variants={fadeUp(0.12 + userAvatars.length * 0.08 + 0.1)}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
        >
          And More
        </motion.span>
      </div>
    </div>
  );
};

export default SocialProof;

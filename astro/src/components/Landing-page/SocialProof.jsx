import React from "react";
// import { motion } from "framer-motion";

const SocialProof = () => {
  // Public avatars from the /public folder
  const userAvatars = [
    { name: "User 1", src: "/User1_small.webp" },
    { name: "User 2", src: "/User2_small.webp" },
    { name: "User 3", src: "/User3_small.webp" },
    { name: "User 4", src: "/User4_small.webp" },
    { name: "User 5", src: "/User5_small.webp" },
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
      {/* 1) Trusted By */}
      <span
        className="text-white/90 tracking-wide leading-tight"
        style={{
          fontFamily: '"Style Script", cursive',
          fontSize: "1.2rem",
          fontStyle: "italic",
        }}
      >
        Trusted By
      </span>

      <div className="flex items-center">
        {/* 2) Avatars fade one-by-one */}
        <div className="flex items-center -space-x-[14px]">
          {userAvatars.map((user, index) => (
            <div
              key={index}
              className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-800"
              title={user.name}
            >
              <img
                src={user.src}
                alt={user.name}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                srcset={`/User${index + 1}_37.jpg 37w, ${user.src} 74w`}
                sizes="37px"
                width="74"
                height="74"
              />
            </div>
          ))}
          {/* 3) Plus as a black avatar at the end */}
          {/* <motion.div
            className="w-10 h-10 rounded-full border-2 border-gray-800 bg-black flex items-center justify-center"
            title="More users"
            variants={fadeUp(0.12 + userAvatars.length * 0.08)}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
          >
            <span className="text-white text-xl leading-none">+</span>
          </motion.div> */}
          <div
            className="w-10 h-10 rounded-full border-2 border-gray-800 bg-black flex items-center justify-center"
            title="More users"
          >
            <span className="text-white text-xl leading-none">+</span>
          </div>
        </div>

        {/* 4) 'And More' comes last with clear spacing */}
        {/* <motion.span
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
        </motion.span> */}
        <span
          className="text-white/90"
          style={{
            fontFamily: '"Style Script", cursive',
            fontStyle: "normal",
            marginLeft: "7px",
          }}
        >
          And More
        </span>
      </div>
    </div>
  );
};

export default SocialProof;

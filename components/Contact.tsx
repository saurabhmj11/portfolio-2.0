import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';

const Contact = () => {
  return (
    <section className="py-20 bg-off-white overflow-hidden" id="contact">
      {/* Marquee Section */}
      <div className="w-full overflow-hidden mb-20 cursor-default">
        <motion.div
          animate={{ x: "-50%" }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 10
          }}
          className="flex whitespace-nowrap"
        >
          {/* Loop content twice for seamless scrolling */}
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-4 md:gap-8 px-2 md:px-4">
              {[1, 2, 3].map((j) => (
                <span key={j} className="text-[15vw] leading-none font-bold tracking-tighter uppercase text-black">
                  Say hello!
                </span>
              ))}
            </div>
          ))}
        </motion.div>
      </div>

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center justify-center text-center">

          <p className="text-xl md:text-2xl max-w-2xl mb-12 text-gray-600">
            Ready to elevate your code base to new heights? Let’s partner to maximize your product's potential.
          </p>

          <Magnetic>
            <motion.a
              href="mailto:saurabhmj11@gmail.com"
              whileHover={{ scale: 1.05 }}
              className="group relative inline-flex items-center gap-4 text-xl md:text-2xl font-medium border border-black rounded-full px-8 py-4 transition-colors hover:bg-black hover:text-white"
            >
              <span>saurabhmj11@gmail.com</span>
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </motion.a>
          </Magnetic>

          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {[
              { name: 'LinkedIn', url: 'https://www.linkedin.com/in/saurabhsl/' },
              { name: 'HackerRank', url: 'https://www.hackerrank.com/profile/saurabhmj11' },
              { name: 'LeetCode', url: 'https://leetcode.com/u/saurabhmj11/' },
              { name: 'GitHub', url: 'https://github.com/saurabhmj11' }
            ].map((social) => (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm uppercase tracking-widest hover:line-through transition-all"
              >
                {social.name}
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;
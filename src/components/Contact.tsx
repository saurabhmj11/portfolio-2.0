
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';

const Contact = () => {
  return (
    <section className="py-20 bg-off-white overflow-hidden" id="contact">

      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col items-center justify-center text-center">

          <p className="text-xl md:text-2xl max-w-2xl mb-12 text-gray-600">
            Ready to elevate your code base to new heights? LetΓÇÖs partner to maximize your product's potential.
          </p>

          <Magnetic>
            <motion.a
              href="mailto:contact@saurabh.dev"
              whileHover={{ scale: 1.05 }}
              className="group relative inline-flex items-center gap-4 text-xl md:text-2xl font-medium border border-black rounded-full px-8 py-4 transition-colors hover:bg-black hover:text-white"
            >
              <span>contact@saurabh.dev</span>
              <ArrowUpRight className="w-5 h-5 group-hover:rotate-45 transition-transform" />
            </motion.a>
          </Magnetic>

          <div className="flex gap-8 mt-16">
            {['Twitter', 'LinkedIn', 'Instagram'].map(social => (
              <a key={social} href="#" className="text-sm uppercase tracking-widest hover:line-through">
                {social}
              </a>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
};

export default Contact;

'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children, className = '', index = 0 }) => {
    const { ref, inView } = useInView({
        triggerOnce: true, // ✅ Only animate the first time it comes into view
        threshold: 0.1,
    });

    const initialX = index % 2 === 0 ? -80 : 80;

    return (
        <div className="overflow-hidden">

            <motion.div
                ref={ref}
                initial={{ opacity: 0, x: initialX }}
                animate={inView ? { opacity: 1, x: 0 } : {}}
                transition={{
                    duration: 0.6,
                    ease: [0.25, 0.46, 0.45, 0.94],
                }}
                className={`w-full ${className}`}
            >
                {children}
            </motion.div>
        </div>
    );
};

export default AnimatedSection;

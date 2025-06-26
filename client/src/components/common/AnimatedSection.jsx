'use client';

import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const AnimatedSection = ({ children, className = '', index = 0 }) => {
    const { ref, inView } = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const initialX = index % 2 === 0 ? -60 : 60;

    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, x: initialX }}
            animate={{ opacity: inView ? 1 : 0, x: inView ? 0 : initialX }}
            transition={{
                duration: 1.1, // ⏱️ Slower
                ease: [0.22, 1, 0.36, 1], // Smooth and natural
            }}
            className={`w-full ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default AnimatedSection;

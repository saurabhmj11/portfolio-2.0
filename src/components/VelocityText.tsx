import React, { useRef } from "react";
import {
    motion,
    useScroll,
    useSpring,
    useTransform,
    useMotionValue,
    useVelocity,
    useAnimationFrame
} from "framer-motion";

const wrap = (min: number, max: number, v: number) => {
    const rangeSize = max - min;
    return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min;
};

interface ParallaxProps {
    children: React.ReactNode;
    baseVelocity?: number;
}

const VelocityText = ({ children, baseVelocity = 5 }: ParallaxProps) => {
    const baseX = useMotionValue(0);
    const { scrollY } = useScroll();
    const scrollVelocity = useVelocity(scrollY);
    const smoothVelocity = useSpring(scrollVelocity, {
        damping: 50,
        stiffness: 400
    });
    const velocityFactor = useTransform(smoothVelocity, [0, 1000], [0, 5], {
        clamp: false
    });

    const skewVelocity = useTransform(smoothVelocity, [-1000, 1000], [-15, 15]);

    /**
     * This is a magic wrapping for the length of the text - you
     * have to replace for wrapping that works for you or dynamically
     * calculate
     */
    const x = useTransform(baseX, (v) => `${wrap(-20, -45, v)}%`);

    const directionFactor = useRef<number>(1);
    useAnimationFrame((_t, delta) => {
        let moveBy = directionFactor.current * baseVelocity * (delta / 1000);

        /**
         * This is what changes the direction of the scroll once we
         * switch scrolling directions.
         */
        if (velocityFactor.get() < 0) {
            directionFactor.current = -1;
        } else if (velocityFactor.get() > 0) {
            directionFactor.current = 1;
        }

        moveBy += directionFactor.current * moveBy * velocityFactor.get();

        baseX.set(baseX.get() + moveBy);
    });

    /**
     * The number of times to repeat the child text should be dynamic
     * or calculated, but a safe high number works for now.
     */
    return (
        <div className="parallax overflow-hidden tracking-tighter leading-[0.8] m-0 whitespace-nowrap flex flex-nowrap">
            <motion.div className="scroller font-display font-black uppercase text-[15vw] md:text-[20vw] whitespace-nowrap flex flex-nowrap" style={{ x, skewX: skewVelocity }}>
                {Array.from({ length: 4 }).map((_, i) => (
                    <span key={i} className="block mr-10">{children} </span>
                ))}
            </motion.div>
        </div>
    );
};

export default VelocityText;

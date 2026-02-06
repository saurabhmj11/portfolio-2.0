import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Canvas } from '@react-three/fiber';
import { Home } from 'lucide-react';
// Lazy load to avoid circular dependencies or heavy initial load
const Robot3D = React.lazy(() => import('../components/Robot3D'));

const NotFound = () => {
    return (
        <div className="min-h-screen bg-off-white dark:bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden text-primary-text dark:text-white">

            {/* Background elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative z-10 flex flex-col items-center text-center max-w-2xl">

                {/* 3D Element */}
                <div className="w-[300px] h-[300px] mb-8 relative">
                    <Canvas camera={{ position: [0, 0, 4], fov: 45 }} gl={{ alpha: true }}>
                        <ambientLight intensity={0.5} />
                        <pointLight position={[10, 10, 10]} intensity={1} />
                        <Suspense fallback={null}>
                            <Robot3D />
                        </Suspense>
                    </Canvas>
                </div>

                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-8xl font-bold mb-4 tracking-tighter"
                >
                    404
                </motion.h1>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                >
                    <h2 className="text-2xl md:text-3xl font-bold mb-4">System Error: Page Not Found</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        The requested trajectory is outside the known universe. The coordinate you are trying to access does not exist.
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                >
                    <Link
                        to="/"
                        className="group flex items-center gap-2 bg-black dark:bg-white text-white dark:text-black px-8 py-3 rounded-full font-bold uppercase tracking-wide hover:opacity-90 transition-all hover:scale-105"
                    >
                        <Home size={20} />
                        <span>Return to Base</span>
                    </Link>
                </motion.div>

            </div>
        </div>
    );
};

export default NotFound;

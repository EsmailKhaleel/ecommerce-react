
export const Background = () => {
    return (
        <>
            <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
                {/* Left gradient wave */}
                <div
                    className="absolute -top-32 -left-32 w-[32rem] h-[150vh] rounded-full bg-gradient-to-br from-secondary/30 to-transparent rotate-12 scale-150 animate-float-slow dark:from-secondary/5"
                >
                </div>

                {/* Right gradient wave */}
                <div
                    className="absolute -top-32 -right-32 w-[32rem] h-[150vh] rounded-full bg-gradient-to-bl from-secondary/30 to-transparent -rotate-12 scale-150 animate-float-slow delay-1000 dark:from-secondary/5"
                >
                </div>

                {/* Center gradient wave */}
                <div
                    className="absolute inset-0 w-full h-full bg-gradient-to-b from-background/5 to-transparent dark:from-secondary/5"
                    style={{ clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' }}
                >
                </div>

                {/* Subtle corner wave ellipses */}
                <div className="absolute top-1/6 left-1/3 w-64 h-64 rotate-45 bg-secondary/10 dark:bg-secondary/5 rounded-full" style={{
                    clipPath: 'ellipse(40% 30% at 50% 50%)'
                }}>
                </div>

            </div>
        </>
    );
};

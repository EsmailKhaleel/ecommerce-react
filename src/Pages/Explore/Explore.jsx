import ScrollToTopButton from "../../Components/ScrollToTopButton";
import Hero from "../../Components/Explore/Hero";
import { BrowseByCategory } from "../../Components/Explore/BrowseByCategory";
import { Background } from "../../Components/Background";
import Heading from "../../Components/Explore/Heading";
import AnimatedCollections from "../../Components/Explore/AnimatedCollections";
import FirstBanner from "../../Components/Explore/FirstBanner";
import SecondBanner from "../../Components/Explore/SecondBanner";
import ThirdSection from "../../Components/Explore/ThirdSection";
import FeaturesSection from "../../Components/Explore/FeaturesSection";

function Explore() {
    return (
        <>
            <ScrollToTopButton />
            <Hero />
            <BrowseByCategory />
            <div className="min-h-screen dark:bg-neutral-dark relative overflow-hidden">
                <Background />
                <main className="relative z-10 py-20">
                    <div className="max-w-7xl mx-auto px-0">
                        <Heading />
                        <AnimatedCollections />
                        <div className="mt-32 space-y-32">
                            <FirstBanner />
                            <SecondBanner />
                            <ThirdSection />
                        </div>
                    </div>
                </main>
            </div>
            <FeaturesSection />
        </>
    );
}

export default Explore;
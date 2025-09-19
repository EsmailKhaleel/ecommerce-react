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
import { ProductGridSections } from "../../Components/Explore/ProductGridSections";

function Explore() {
    return (
        <div className="overflow-x-hidden">
            <ScrollToTopButton />
            <Hero />
            <BrowseByCategory />
            <ProductGridSections />
            <div className="min-h-screen dark:bg-neutral-dark relative overflow-hidden">
                <Background />
                <main className="relative z-10 py-20">
                    <div className="mx-auto px-4 sm:px-6 lg:px-8">
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
        </div>
    );
}

export default Explore;
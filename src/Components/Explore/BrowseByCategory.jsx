import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { CATEGORIES } from "./categoriesConfig";


export const BrowseByCategory = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();


    function handleCategoryClick(category) {
        navigate(`/products?category=${category}`);
    }

    return (
        <section className="py-12 px-4 md:px-8 lg:px-16 xl:px-24">
            <div className="container mx-auto px-4">
                {/* Title Section */}
                <div className="flex items-center gap-2 mb-8">
                    <div className="w-2 h-8 bg-primary rounded"></div>
                    <h2 className="text-2xl font-bold dark:text-white">{t('products.category')}</h2>
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {CATEGORIES.map((category) => (
                        <div
                            key={category.id}
                            onClick={() => handleCategoryClick(category.name)}
                            className="bg-white border border-gray-400 hover:bg-primary hover:text-white text-primary dark:bg-neutral-800 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-300"
                        >
                            <category.icon className="text-4xl mb-3 " />
                            <h3 className="text-center font-medium dark:text-white">{t(`products.categories.${category.name}`)}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

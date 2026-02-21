import Image from 'next/image';

export default function BenefitsSection() {
    const benefits = [
        {
            image: '/virteez/Energy bar closeup.jpeg',
            title: '20g Grass-fed',
            subtitle: 'Whey Protein',
            bg: 'bg-[#E8F5E0]',
        },
        {
            image: '/virteez/Cashew cookies in plate along with box.jpeg',
            title: 'No Fillers &',
            subtitle: 'Palm Oil',
            bg: 'bg-[#FFF3CD]',
        },
        {
            image: '/virteez/Blueberry cookies.jpeg',
            title: 'Zero Added',
            subtitle: 'Sugar',
            bg: 'bg-[#FCE4EC]',
        },
        {
            image: '/virteez/Energy bar.jpeg',
            title: 'Organic',
            subtitle: 'Chocolate',
            bg: 'bg-[#D7CCC8]',
        },
        {
            image: '/virteez/Almond cookies in plate.jpeg',
            title: 'Tastes Like Dessert,',
            subtitle: 'Fuels Like Protein',
            bg: 'bg-[#FFF8E1]',
        },
    ];

    return (
        <section className="py-16 md:py-24 bg-white relative overflow-hidden">
            <div className="max-w-7xl mx-auto px-8 relative">
                <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
                        WHY CHOOSE VRATEEZ?
                    </h2>
                    <p className="text-gray-500 max-w-lg mx-auto text-base">
                        Every product is crafted with purpose — clean protein, real ingredients, and flavours you&apos;ll crave.
                    </p>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 md:gap-8">
                    {benefits.map((benefit, index) => (
                        <div key={index} className="flex flex-col items-center text-center group">
                            <div className={`w-32 h-32 md:w-36 md:h-36 rounded-full ${benefit.bg} overflow-hidden mb-6 group-hover:scale-105 transition-transform duration-300 shadow-md`}>
                                <Image
                                    src={benefit.image}
                                    alt={benefit.title + ' ' + benefit.subtitle}
                                    width={160}
                                    height={160}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <h3 className="text-sm md:text-base font-bold text-gray-900 leading-snug">{benefit.title}</h3>
                            <p className="text-sm md:text-base font-bold text-gray-900 leading-snug">{benefit.subtitle}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

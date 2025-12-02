'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';

import BasicPageLayout from '../../layouts/BasicPageLayout';
import ImageSlider from "../../components/ImageSlider";
import media from '../../../../../locales/media.json';  

const useInView = (threshold = 0.2) => {
    const [inView, setInView] = useState(false);
    const ref = useRef<HTMLDivElement>(null);
    
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setInView(true);
            },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, [threshold]);
    
    return [ref, inView] as const;
};

export default function AboutPage() {
    const router = useRouter();
    const { t, i18n } = useTranslation();
    const [heroRef, heroInView] = useInView(0.1);
    const [contentRef, contentInView] = useInView(0.2);
    
    const isRTL = i18n.language === 'he';
    const direction = isRTL ? 'rtl' : 'ltr';
    const textAlign = isRTL ? 'text-right' : 'text-left';

    const images = (media.items || [])
        .filter((item) => item.type === 'image' && item.location === 'about') 
        .map((item) => item.url);               
    return (
        <div dir={direction} className={textAlign}>
            <BasicPageLayout>
                {/* Hero Section */}
                <section ref={heroRef} className="relative py-20 bg-gradient-to-bl from-slate-50 via-green-50 to-slate-100">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className={`text-center transition-all duration-1000 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                {t('about.badge')}
                            </div>
                            <h1 className="font-he text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                                {t('about.heroTitle')}
                            </h1>
                            <p className="font-he text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                                {t('about.heroSubtitle')}
                            </p>
                        </div>
                    </div>
                </section>

                {/* Main Content Section */}
                <section className="py-20 bg-white">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                            {/* Text Content */}
                            <div className={`transition-all duration-700 ease-out ${
                                contentInView 
                                    ? 'opacity-100 translate-x-0' 
                                    : `opacity-0 ${isRTL ? 'translate-x-8' : '-translate-x-8'}`
                            }`}>
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-bl from-green-50 to-green-100 rounded-3xl p-8">
                                        <h2 className="font-he text-3xl font-bold text-gray-900 mb-6">
                                            {t('about.missionTitle')}
                                        </h2>
                                        <div className="space-y-4 font-he text-lg text-gray-700 leading-relaxed">
                                            <p>{t('about.missionText1')}</p>
                                            <p>{t('about.missionText2')}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-gradient-to-bl from-blue-50 to-blue-100 rounded-3xl p-8">
                                        <h3 className="font-he text-2xl font-bold text-gray-900 mb-4">
                                            {t('about.resultsTitle')}
                                        </h3>
                                        <p className="font-he text-lg text-gray-700 leading-relaxed">
                                            {t('about.resultsText')}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Image Slider */}
                            <div className={`transition-all duration-700 ease-out ${
                                contentInView 
                                    ? 'opacity-100 translate-x-0' 
                                    : `opacity-0 ${isRTL ? '-translate-x-8' : 'translate-x-8'}`
                            }`} style={{ transitionDelay: '200ms' }}>
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-bl from-green-200 to-green-300 rounded-3xl transform rotate-3"></div>
                                    <div className="relative bg-white rounded-3xl p-4 shadow-xl">
                                        <div className="w-full">
                                            <ImageSlider
                                                images={images}
                                                style={{
                                                    width: '100%',
                                                    height: 'auto'
                                                }}
                                                imageStyle={{
                                                    objectFit: 'contain',
                                                    width: '100%',
                                                    height: 'auto'
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* CTA Section */}
                <section className="py-20 bg-gradient-to-bl from-green-700 to-green-800 text-white">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <h2 className="font-he text-4xl font-bold mb-6">
                            {t('about.ctaTitle')}
                        </h2>
                        <p className="font-he text-xl mb-8 opacity-90 leading-relaxed">
                            {t('about.ctaSubtitle')}
                        </p>
                        <div className="flex flex-col sm:flex-row justify-center gap-6">
                            <button
                                onClick={() => router.push('/register')}
                                className="bg-white text-green-700 hover:bg-gray-100 px-10 py-4 rounded-xl text-lg font-he font-bold transition-all duration-300 hover:scale-105 shadow-lg"
                            >
                                {t('about.soldierRegistration')}
                            </button>
                            <button
                                onClick={() => router.push('/contact')}
                                className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-10 py-4 rounded-xl text-lg font-he font-bold transition-all duration-300 hover:scale-105"
                            >
                                {t('about.contact')}
                            </button>
                        </div>
                    </div>
                </section>
            </BasicPageLayout>
        </div>
    );
}

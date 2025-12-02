'use client';

import { useEffect, useState } from 'react';
type ImageSliderProps = {
    images: string[];
    style?: React.CSSProperties;
    imageStyle?: React.CSSProperties;
};

export default function ImageSlider({ images, style, imageStyle }: ImageSliderProps) {
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % images.length);
        }, 3000);
        return () => clearInterval(interval);
    }, [images]);

    const goToImage = (index: number) => setCurrentIndex(index);

    return (
        <div style={style}>
            <div className="relative h-[650px] w-[500px]">
                {images.map((image, index) => (
                    index === currentIndex && (
                        <img
                            key={index}
                            src={image}
                            alt={`Slide ${currentIndex + 1}`}
                            style={imageStyle}
                            className={`absolute top-0 left-0 w-full h-full object-cover transition-opacity duration-300 ease-in-out ${
                                index === currentIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
                            }`}
                        />
                    )
                ))}
            </div>
            <div className="flex justify-center gap-2 mt-4">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`w-2.5 h-2.5 rounded-full transition-colors duration-300 ${
                            index === currentIndex ? 'bg-gray-500' : 'bg-gray-300 hover:bg-gray-400'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
}

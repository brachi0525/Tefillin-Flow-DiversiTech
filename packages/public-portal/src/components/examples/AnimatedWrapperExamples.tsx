import React from 'react';
import AnimatedWrapper from '../common/AnimatedWrapper';

const AnimatedWrapperExamples: React.FC = () => {
    return (
        <div className="p-8 space-y-8">
            <h1 className="text-3xl font-bold text-center mb-8">דוגמאות לשימוש ב-AnimatedWrapper</h1>

            {/* אנימציה בסיסית */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">אנימציה בסיסית</h2>
                <AnimatedWrapper animation="fadeIn">
                    <div className="bg-primary p-4 rounded-lg text-white">
                        תוכן שמופיע בהדרגה
                    </div>
                </AnimatedWrapper>
            </section>

            {/* אנימציה עם עיכוב */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">אנימציה עם עיכוב</h2>
                <AnimatedWrapper animation="slideUp" delay="delay-300">
                    <div className="bg-secondary p-4 rounded-lg">
                        תוכן שמחליק למעלה עם עיכוב
                    </div>
                </AnimatedWrapper>
            </section>

            {/* אנימציה עם משך זמן מותאם */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">אנימציה עם משך זמן מותאם</h2>
                <AnimatedWrapper animation="slideLeft" duration="2s">
                    <div className="bg-primary-light p-4 rounded-lg">
                        תוכן שמחליק לשמאל במשך 2 שניות
                    </div>
                </AnimatedWrapper>
            </section>

            {/* אנימציה בגלילה */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">אנימציה בגלילה</h2>
                <div className="h-96"></div> {/* רווח לגלילה */}
                <AnimatedWrapper animation="fadeIn" triggerOnScroll threshold={0.3}>
                    <div className="bg-secondary-dark p-4 rounded-lg text-white">
                        תוכן שמופיע כשגוללים אליו
                    </div>
                </AnimatedWrapper>
            </section>

            {/* מספר אנימציות ברצף */}
            <section>
                <h2 className="text-2xl font-semibold mb-4">מספר אנימציות ברצף</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <AnimatedWrapper animation="slideUp" delay="delay-100">
                        <div className="bg-primary p-4 rounded-lg text-white text-center">
                            ראשון
                        </div>
                    </AnimatedWrapper>
                    <AnimatedWrapper animation="slideUp" delay="delay-300">
                        <div className="bg-primary p-4 rounded-lg text-white text-center">
                            שני
                        </div>
                    </AnimatedWrapper>
                    <AnimatedWrapper animation="slideUp" delay="delay-500">
                        <div className="bg-primary p-4 rounded-lg text-white text-center">
                            שלישי
                        </div>
                    </AnimatedWrapper>
                </div>

                {/* // שימוש בסיסי */}
                <AnimatedWrapper animation="fadeIn">
                    <h1>כותרת שמופיעה בהדרגה</h1>
                </AnimatedWrapper>

                {/* // עם עיכוב */}
                <AnimatedWrapper animation="slideUp" delay="delay-300">
                    <div>תוכן עם עיכוב</div>
                </AnimatedWrapper>

                {/* // אנימציה בגלילה */}
                <AnimatedWrapper animation="fadeIn" triggerOnScroll>
                    <div>תוכן שמופיע בגלילה</div>
                </AnimatedWrapper>

                {/* // משך זמן מותאם */}
                <AnimatedWrapper animation="slideLeft" duration="1.5s">
                    <div>אנימציה איטית יותר</div>
                </AnimatedWrapper>
            </section>
        </div>
    );
};

export default AnimatedWrapperExamples;
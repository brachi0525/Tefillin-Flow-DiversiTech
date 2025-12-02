'use client'
import { useTranslation } from "react-i18next";
import { useRouter } from 'next/navigation';
import { useState, useEffect, useRef } from 'react';
import BasicPageLayout from '../layouts/BasicPageLayout';
import { useDirection } from '../hooks/useDirection';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Sector } from 'recharts';
import { User, PackageCheck, MapPin } from "lucide-react";
import { PieLabelRenderProps } from 'recharts';
import media from '../../../../locales/media.json';

const videoItem = (media.items || []).find((item) => item.id === "11");
 
const useCountUp = (end: number, duration: number = 2500, shouldStart: boolean = false) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let startTime: number;
    let animationFrame: number;
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(end * easeOutCubic));
      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };
    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration, shouldStart]);
  return count;
};

const useInView = (threshold = 0.2) => {
  const [inView, setInView] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) setInView(true);
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
};

const AnimatedCounter = ({ end , suffix = '', duration = 2500, shouldStart = false } : any) => {
  const count = useCountUp(end, duration, shouldStart);
  return <div className="text-5xl font-extrabold text-green-800 mb-2 font-mono drop-shadow-lg">{count.toLocaleString()}{suffix}</div>;
};


const COLORS = ['#15803d', '#16a34a', '#4ade80'];

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.6;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="#0f172a"
textAnchor={x > Number(cx) ? 'start' : 'end'}
      dominantBaseline="central"
      className="font-he text-sm"
    >
      {`${name} - ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

const StatsWithPieChart = ({ soldiers, distributed, bases, shouldStart }: any) => {

  const data = [
    { name: 'חיילים', value: soldiers },
    { name: 'תפילין', value: distributed },
    { name: 'בסיסים', value: bases },
  ];

  return (
    <div className="w-full flex justify-center items-center mt-16">
      <div className="relative w-full max-w-md bg-white p-8 rounded-3xl shadow-2xl hover:shadow-green-200 transition-all duration-500">
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={100}
              innerRadius={50}
              dataKey="value"
              isAnimationActive={shouldStart}
            >

              {data.map((_, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                  stroke="#ffffff"
                  strokeWidth={3}
                />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                fontFamily: 'inherit',
                borderRadius: '12px',
                boxShadow: '0 0 10px rgba(0,0,0,0.1)',
              }}
              formatter={(value, name) => [`${value.toLocaleString()}`, name]}
            />
            <Legend
              verticalAlign="bottom"
              iconType="circle"
              formatter={(value) => (
                <span className="text-sm font-he text-gray-700">{value}</span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default function HomePage() {
  const { t } = useTranslation();
  const router = useRouter();
  const { isRTL, textAlign, direction } = useDirection();
  const [statsRef, statsInView] = useInView(0.3);
  const [heroRef, heroInView] = useInView(0.1);
  const [stats, setStats] = useState<{
    tefillinDistributed: number;
    soldiersCount: number;
    locationsCount: number;
  } | null>(null);

  // useEffect(() => {
  //   fetch('/api/stats')
  //     .then(res => res.json())
  //     .then(data => setStats(data))
  //     .catch(err => console.error('Error fetching stats:', err));
  // }, []);
  return (
    <div className={`${textAlign}`}>
      <BasicPageLayout>
        <section ref={heroRef} className="relative h-screen flex items-center bg-gradient-to-bl from-slate-50 via-green-50 to-slate-100">

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:grid lg:grid-cols-2 gap-12 items-center">

            <div className={`order-1 ${isRTL ? 'lg:order-1' : 'lg:order-1'}`}>
              <div className={`transition-all duration-1000 ease-out ${heroInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>

                <div className={`inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-8`}>
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {t('home.badge')}
                </div>

                <h1 className="font-he text-6xl md:text-7xl lg:text-8xl font-bold text-gray-900 mb-8 leading-tight">
                  {t('home.heroTitle')}
                </h1>

                <p className="font-he text-2xl md:text-3xl text-gray-700 mb-12 max-w-4xl mx-auto leading-relaxed font-light">
                  {t('home.heroSubtitle')}
                </p>

                <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16">
                  <button
                    onClick={() => router.push('/register')}
                    className="group relative bg-green-700 hover:bg-green-800 text-white px-12 py-5 rounded-xl text-xl font-he font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {t('home.register')}
                    </span>
                    <div className={`absolute inset-0 bg-gradient-to-l from-green-600 to-green-800 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isRTL ? 'origin-left' : 'origin-right'}`}></div>
                  </button>

                  <button
                    onClick={() => router.push('/donate')}
                    className="group relative border-2 border-green-700 text-green-700 hover:text-white px-12 py-5 rounded-xl text-xl font-he font-semibold transition-all duration-300 overflow-hidden"
                  >
                    <span className="relative z-10 flex items-center justify-center gap-3">
                      {t('home.donate')}
                    </span>
                    <div className={`absolute inset-0 bg-green-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 ${isRTL ? 'origin-left' : 'origin-right'}`}></div>
                  </button>
                </div>

                <div className="flex flex-wrap justify-center items-center gap-8 text-gray-600 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="font-he">{t('home.trustIndicators.approved')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="font-he">{t('home.trustIndicators.kosher')}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-green-600">✓</span>
                    <span className="font-he">{t('home.trustIndicators.shipping')}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
              <div className="w-6 h-10 border-2 border-gray-400 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-gray-400 rounded-full mt-2 animate-pulse"></div>
              </div>
            </div>
          </div>

          <div className={`order-2 ${isRTL ? 'lg:order-2' : 'lg:order-2'} w-full lg:w-auto`} style={{ height: 'auto', margin: '1%' }}>
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-screen object-cover"
              >

                <source src="/videos/וידאו תפילין.mp4" type="video/mp4" />
              </video>
            </div>
          </div>

        </section>



        <section className="py-24 bg-gradient-to-br from-white via-green-50 to-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12">

              <div className="flex flex-col items-center text-center transition-all duration-700 ease-out">
                <div className="w-48 h-48 bg-white border-4 border-green-100 rounded-full shadow-2xl flex flex-col justify-center items-center hover:scale-105 transition-transform">
                  <User className="w-14 h-14 text-green-700 mb-3" strokeWidth={1} />
                  <AnimatedCounter end={stats?.soldiersCount ?? t('home.counter.solidersLocation')} shouldStart={statsInView} />
                </div>
                <div className="mt-6 font-he text-xl text-gray-700 font-medium">{t('home.stats.soldiers')}</div>
                <div className="font-he text-sm text-gray-500 mt-2">{t('home.stats.soldiersLocation')}</div>
              </div>

              <div className="flex flex-col items-center text-center transition-all duration-700 ease-out">
                <div className="w-48 h-48 bg-white border-4 border-green-100 rounded-full shadow-2xl flex flex-col justify-center items-center hover:scale-105 transition-transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 466 466"
                    width="64"
                    height="64"
                    fill="#15803d"
                    className="mb-3"
                  >
                    <path d="M465.993,213.171c-0.004-0.312-0.021-0.625-0.062-0.937c-0.004-0.03-0.011-0.058-0.016-0.087
	c-0.04-0.28-0.097-0.558-0.167-0.835c-0.024-0.096-0.053-0.19-0.081-0.284c-0.062-0.209-0.132-0.417-0.212-0.623
	c-0.038-0.099-0.075-0.199-0.117-0.297c-0.094-0.219-0.202-0.434-0.318-0.647c-0.036-0.067-0.066-0.136-0.104-0.201
	c-0.002-0.004-0.004-0.008-0.006-0.013c-0.154-0.265-0.324-0.515-0.503-0.755c-0.053-0.071-0.111-0.137-0.166-0.206
	c-0.148-0.185-0.301-0.363-0.462-0.532c-0.063-0.066-0.128-0.131-0.193-0.196c-0.188-0.184-0.384-0.358-0.588-0.521
	c-0.043-0.034-0.083-0.072-0.127-0.105c-0.257-0.197-0.524-0.377-0.801-0.54c-0.015-0.009-0.027-0.02-0.042-0.028L341.214,135.98
	V90.044c0-0.048-0.009-0.094-0.01-0.142c-0.005-0.256-0.022-0.511-0.051-0.764c-0.009-0.081-0.016-0.162-0.028-0.243
	c-0.045-0.31-0.104-0.617-0.185-0.919c-0.011-0.042-0.027-0.082-0.039-0.123c-0.074-0.261-0.163-0.518-0.264-0.771
	c-0.033-0.083-0.069-0.165-0.105-0.247c-0.1-0.23-0.212-0.454-0.334-0.674c-0.031-0.056-0.06-0.114-0.092-0.17
	c-0.162-0.277-0.34-0.545-0.536-0.802c-0.016-0.021-0.034-0.04-0.051-0.061c-0.177-0.228-0.37-0.446-0.574-0.655
	c-0.056-0.057-0.113-0.113-0.171-0.169c-0.181-0.175-0.37-0.341-0.57-0.5c-0.061-0.049-0.119-0.099-0.181-0.146
	c-0.249-0.187-0.508-0.366-0.784-0.526L205.475,6.367c-2.49-1.45-5.564-1.45-8.055,0L65.652,83.131
	c-0.276,0.161-0.535,0.339-0.784,0.526c-0.062,0.047-0.12,0.097-0.181,0.146c-0.199,0.159-0.389,0.325-0.57,0.5
	c-0.057,0.056-0.115,0.111-0.171,0.169c-0.204,0.21-0.396,0.427-0.574,0.655c-0.016,0.021-0.035,0.04-0.051,0.061
	c-0.196,0.257-0.374,0.525-0.536,0.802c-0.033,0.056-0.061,0.114-0.092,0.17c-0.122,0.22-0.233,0.444-0.334,0.674
	c-0.036,0.082-0.072,0.164-0.105,0.247c-0.101,0.253-0.189,0.51-0.264,0.771c-0.012,0.042-0.028,0.082-0.039,0.123
	c-0.081,0.302-0.14,0.609-0.185,0.919c-0.012,0.081-0.019,0.162-0.028,0.243c-0.029,0.254-0.046,0.508-0.051,0.764
	c-0.001,0.048-0.01,0.094-0.01,0.142v119.462L3.973,243.126c-0.276,0.161-0.535,0.339-0.784,0.526
	c-0.062,0.047-0.12,0.097-0.181,0.146c-0.199,0.159-0.389,0.325-0.57,0.5c-0.057,0.056-0.115,0.111-0.171,0.169
	c-0.204,0.21-0.396,0.427-0.574,0.655c-0.016,0.021-0.035,0.04-0.051,0.061c-0.196,0.257-0.374,0.525-0.536,0.802
	c-0.033,0.056-0.061,0.114-0.092,0.17c-0.122,0.22-0.233,0.444-0.334,0.674c-0.036,0.082-0.072,0.164-0.105,0.247
	c-0.101,0.253-0.189,0.51-0.264,0.771c-0.012,0.042-0.028,0.082-0.039,0.123c-0.081,0.302-0.14,0.609-0.185,0.919
	c-0.012,0.081-0.019,0.162-0.028,0.243c-0.029,0.254-0.046,0.508-0.051,0.764C0.009,249.944,0,249.99,0,250.038v89.984
	c0,2.847,1.513,5.479,3.973,6.913L197.42,459.633c0.024,0.014,0.05,0.023,0.074,0.037c0.284,0.162,0.576,0.31,0.881,0.437
	c0.007,0.003,0.015,0.005,0.022,0.008c0.286,0.118,0.582,0.216,0.884,0.3c0.078,0.022,0.157,0.041,0.235,0.06
	c0.238,0.059,0.48,0.107,0.727,0.144c0.083,0.013,0.165,0.028,0.249,0.038c0.314,0.037,0.632,0.062,0.956,0.062
	s0.642-0.025,0.956-0.062c0.083-0.01,0.166-0.025,0.249-0.038c0.246-0.037,0.488-0.085,0.727-0.144
	c0.079-0.02,0.157-0.038,0.235-0.06c0.302-0.085,0.597-0.182,0.884-0.3c0.007-0.003,0.015-0.005,0.022-0.008
	c0.304-0.127,0.597-0.275,0.881-0.437c0.024-0.014,0.05-0.023,0.074-0.037l193.446-112.698l63.104-36.763
	c2.46-1.433,3.973-4.065,3.973-6.913L466,213.276C466,213.24,465.994,213.206,465.993,213.171z M442.105,213.274l-47.212,27.505
	l-53.68-31.273v-55.009L442.105,213.274z M201.447,216.746c-4.418,0-8,3.582-8,8v81.673L77.68,238.975V103.964l115.768,67.443
	v23.339c0,4.418,3.582,8,8,8s8-3.582,8-8v-23.339l115.767-67.443v135.012l-115.767,67.443v-81.673
	C209.447,220.327,205.865,216.746,201.447,216.746z M201.447,22.538l115.874,67.506L201.447,157.55L85.573,90.044L201.447,22.538z
	 M65.652,250.486l131.768,76.765c0.024,0.014,0.05,0.023,0.074,0.037c0.284,0.162,0.576,0.31,0.881,0.437
	c0.007,0.003,0.015,0.005,0.022,0.008c0.286,0.118,0.582,0.216,0.884,0.3c0.078,0.022,0.157,0.041,0.235,0.06
	c0.238,0.059,0.48,0.107,0.727,0.144c0.083,0.013,0.165,0.028,0.249,0.038c0.314,0.037,0.632,0.062,0.956,0.062
	c0.324,0,0.642-0.025,0.956-0.062c0.083-0.01,0.164-0.025,0.246-0.038c0.248-0.037,0.491-0.086,0.731-0.145
	c0.077-0.019,0.154-0.038,0.23-0.059c0.306-0.086,0.606-0.184,0.895-0.304c0.004-0.002,0.008-0.003,0.011-0.004
	c0.305-0.127,0.598-0.276,0.883-0.438c0.024-0.014,0.05-0.023,0.074-0.037l131.767-76.765c2.46-1.433,3.973-4.065,3.973-6.913
	v-15.549l37.787,22.014L201.447,353.477L23.893,250.038l37.787-22.014v15.549C61.68,246.421,63.192,249.053,65.652,250.486z
	 M16,263.958l177.447,103.377v71.467L16,335.424V263.958z M386.894,335.424L209.447,438.801v-71.467l177.446-103.377V335.424z
	 M402.894,326.103v-71.467L450,227.193l-0.002,71.468L402.894,326.103z" />
                  </svg>
                  <AnimatedCounter end={stats?.tefillinDistributed ?? t('home.counter.tefillin')} shouldStart={statsInView} />
                </div>
                <div className="mt-6 font-he text-xl text-gray-700 font-medium">{t('home.stats.distributed')}</div>
                <div className="font-he text-sm text-gray-500 mt-2">{t('home.stats.distributedPeriod')}</div>
              </div>

              <div className="flex flex-col items-center text-center transition-all duration-700 ease-out">
                <div className="w-48 h-48 bg-white border-4 border-green-100 rounded-full shadow-2xl flex flex-col justify-center items-center hover:scale-105 transition-transform">
                  <MapPin className="w-14 h-14 text-green-700 mb-3" strokeWidth={1} />
                  <AnimatedCounter end={stats?.locationsCount ?? t('home.counter.locations')} shouldStart={statsInView} />
                </div>
                <div className="mt-6 font-he text-xl text-gray-700 font-medium">{t('home.stats.bases')}</div>
                <div className="font-he text-sm text-gray-500 mt-2">{t('home.stats.basesLocation')}</div>
              </div>

            </div>
          </div>
        </section>



        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <h2 className="font-he text-5xl font-bold text-gray-900 mb-6">
                {t('home.howItWorks.title')}
              </h2>
              <p className="font-he text-xl text-gray-600 max-w-2xl mx-auto">
                {t('home.howItWorks.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="bg-white rounded-3xl w-24 h-24 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-4xl">📝</span>
                  </div>
                </div>
                <h3 className="font-he text-2xl font-bold text-gray-900 mb-4">{t('home.howItWorks.step1.title')}</h3>
                <p className="font-he text-gray-600 leading-relaxed text-lg">
                  {t('home.howItWorks.step1.description')}
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="bg-white rounded-3xl w-24 h-24 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-4xl">📦</span>
                  </div>
                </div>
                <h3 className="font-he text-2xl font-bold text-gray-900 mb-4">{t('home.howItWorks.step2.title')}</h3>
                <p className="font-he text-gray-600 leading-relaxed text-lg">
                  {t('home.howItWorks.step2.description')}
                </p>
              </div>

              <div className="text-center group">
                <div className="relative mb-8">
                  <div className="bg-white rounded-3xl w-24 h-24 flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110">
                    <span className="text-4xl">👍</span>
                  </div>
                </div>
                <h3 className="font-he text-2xl font-bold text-gray-900 mb-4">{t('home.howItWorks.step3.title')}</h3>
                <p className="font-he text-gray-600 leading-relaxed text-lg">
                  {t('home.howItWorks.step3.description')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <div>
                <h2 className="font-he text-5xl font-bold text-gray-900 mb-8">
                  {t('home.mission.title')}
                </h2>

                <div className="space-y-8">
                  <div className="flex gap-4">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-he text-xl font-bold text-gray-900 mb-2">{t('home.mission.spiritual.title')}</h4>
                      <p className="font-he text-gray-600 leading-relaxed">
                        {t('home.mission.spiritual.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-2xl">🤝</span>
                    <div>
                      <h4 className="font-he text-xl font-bold text-gray-900 mb-2">{t('home.mission.community.title')}</h4>
                      <p className="font-he text-gray-600 leading-relaxed">
                        {t('home.mission.community.description')}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <span className="text-2xl">🎁</span>
                    <div>
                      <h4 className="font-he text-xl font-bold text-gray-900 mb-2">{t('home.mission.accessibility.title')}</h4>
                      <p className="font-he text-gray-600 leading-relaxed">
                        {t('home.mission.accessibility.description')}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-bl from-green-700 to-green-800 rounded-3xl p-12 text-white text-center shadow-2xl">
                <h3 className="font-he text-3xl font-bold mb-8">{t('home.mission.cta.title')}</h3>
                <p className="font-he text-xl mb-10 opacity-90 leading-relaxed">
                  {t('home.mission.cta.description')}
                </p>
                <button
                  onClick={() => router.push('/register')}
                  className="bg-white text-green-700 hover:bg-gray-100 px-10 py-4 rounded-xl font-he font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {t('home.mission.cta.button')}
                </button>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <h2 className="font-he text-5xl font-bold text-gray-900 mb-6">
                {t('home.testimonials.title')}
              </h2>
              <p className="font-he text-xl text-gray-600">
                {t('home.testimonials.subtitle')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl ml-4">
                  {t('home.testimonials.david.name').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-he font-bold text-gray-900 text-lg">{t('home.testimonials.david.name')}</div>
                    <div className="font-he text-gray-600">{t('home.testimonials.david.role')}</div>
                  </div>
                </div>
                <p className="font-he text-gray-700 leading-relaxed text-lg">
                  "{t('home.testimonials.david.text')}"
                </p>
                <div className="flex text-yellow-400 mt-4 justify-end">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl ml-4">
                    {t('home.testimonials.moshe.name').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-he font-bold text-gray-900 text-lg">{t('home.testimonials.moshe.name')}</div>
                    <div className="font-he text-gray-600">{t('home.testimonials.moshe.role')}</div>
                  </div>
                </div>
                <p className="font-he text-gray-700 leading-relaxed text-lg">
                  "{t('home.testimonials.moshe.text')}"
                </p>
                <div className="flex text-yellow-400 mt-4 justify-end">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>

              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="flex items-center mb-6">
                  <div className="bg-green-600 rounded-full w-16 h-16 flex items-center justify-center text-white font-bold text-xl ml-4">
                    {t('home.testimonials.avi.name').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="font-he font-bold text-gray-900 text-lg">{t('home.testimonials.avi.name')}</div>
                    <div className="font-he text-gray-600">{t('home.testimonials.avi.role')}</div>
                  </div>
                </div>
                <p className="font-he text-gray-700 leading-relaxed text-lg">
                  "{t('home.testimonials.avi.text')}"
                </p>
                <div className="flex text-yellow-400 mt-4 justify-end">
                  ⭐⭐⭐⭐⭐
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">

            <div className="text-center mb-16">
              <h2 className="font-he text-5xl font-bold text-gray-900 mb-6">
                {t('home.faq.title')}
              </h2>
              <p className="font-he text-xl text-gray-600">
                {t('home.faq.subtitle')}
              </p>
            </div>

            <div className="space-y-6">

              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <h4 className="font-he text-xl font-bold text-gray-900 mb-4">{t('home.faq.free.question')}</h4>
                <p className="font-he text-gray-600 leading-relaxed">
                  {t('home.faq.free.answer')}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <h4 className="font-he text-xl font-bold text-gray-900 mb-4">{t('home.faq.delivery.question')}</h4>
                <p className="font-he text-gray-600 leading-relaxed">
                  {t('home.faq.delivery.answer')}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <h4 className="font-he text-xl font-bold text-gray-900 mb-4">{t('home.faq.kosher.question')}</h4>
                <p className="font-he text-gray-600 leading-relaxed">
                  {t('home.faq.kosher.answer')}
                </p>
              </div>

              <div className="bg-gray-50 rounded-2xl p-8 hover:bg-gray-100 transition-colors duration-300">
                <h4 className="font-he text-xl font-bold text-gray-900 mb-4">{t('home.faq.afterService.question')}</h4>
                <p className="font-he text-gray-600 leading-relaxed">
                  {t('home.faq.afterService.answer')}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-20 bg-gradient-to-bl from-green-700 to-green-800 text-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">

            <h2 className="font-he text-5xl font-bold mb-8">
              {t('home.finalCta.title')}
            </h2>

            <p className="font-he text-2xl mb-12 opacity-90 leading-relaxed">
              {t('home.finalCta.subtitle')}
            </p>

            <div className="flex flex-col sm:flex-row justify-center gap-6 mb-12">
              <button
                onClick={() => router.push('/register')}
                className="bg-white text-green-700 hover:bg-gray-100 px-12 py-5 rounded-xl text-xl font-he font-bold transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-3"
              >
                {t('home.register')}
              </button>
              <button
                onClick={() => router.push('/donate')}
                className="border-2 border-white text-white hover:bg-white hover:text-green-700 px-12 py-5 rounded-xl text-xl font-he font-bold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
              >
                {t('home.donate')}
              </button>
            </div>

            <div className="text-center opacity-75">
              <p className="font-he text-lg">
                {t('home.finalCta.contact')} <span className="underline">{t('home.finalCta.email')}</span>
              </p>
            </div>
          </div>
        </section>
      </BasicPageLayout>
    </div >
  );
}
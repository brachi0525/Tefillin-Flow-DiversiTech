'use client';

import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  price: number;
}

interface DonationData {
  donorName: string;
  phone?: string;
  email: string;
}

const DonationForm: React.FC = () => {
  const [meshulamUrl, setMeshulamUrl] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductQuantities, setSelectedProductQuantities] = useState<{ [key: string]: number }>({});
  const [generalDonationAmount, setGeneralDonationAmount] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [dedication, setDedication] = useState<string>('');
  const [donationData, setDonationData] = useState<DonationData>({
    donorName: '',
    phone: '',
    email: '',
  });
  const [showProductQuantity, setShowProductQuantity] = useState<{ [key: string]: boolean }>({});
  const [showGeneralDonation, setShowGeneralDonation] = useState<boolean>(false);
  const [showMoreProducts, setShowMoreProducts] = useState<boolean>(false);
  const [showPayment, setShowPayment] = useState<boolean>(false);
  const [paymentData, setPaymentData] = useState<any>(null);

  const ALLOW_GENERAL_DONATION = true;

  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/donate');
        const data = await response.json();
        if (Array.isArray(data)) {
          setProducts(data);
        } else if (data && Array.isArray(data.products)) {
          setProducts(data.products);
        } else {
          setProducts([]);
        }
      } catch (error) {
        setProducts([]);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const productsTotal = products.reduce((acc, product) => {
      const quantity = selectedProductQuantities[product.id] || 0;
      return acc + product.price * quantity;
    }, 0);
    setTotalAmount(productsTotal + generalDonationAmount);
  }, [selectedProductQuantities, products, generalDonationAmount]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const productItems = products.map(product => ({
      donationType: 'product' as const,
      productId: product.id,
      quantity: selectedProductQuantities[product.id] || 0,
      totalAmount: product.price * (selectedProductQuantities[product.id] || 0),
    })).filter(item => item.quantity > 0);

    const generalItem = generalDonationAmount > 0 ? [{
      donationType: 'general' as const,
      amount: generalDonationAmount,
      totalAmount: generalDonationAmount,
    }] : [];

    const donationItems = [...productItems, ...generalItem];

    setPaymentData({
      donationData: { ...donationData, dedication },
      donationItems,
      totalAmount
    });

    setShowPayment(true);
  };

  const handlePaymentCancel = () => {
    setShowPayment(false);
    setPaymentData(null);
  };

  const startPayment = async (isSuccess: boolean) => {
    if (!paymentData) return;

    if (isSuccess) {
      try {
        const response = await fetch('/api/donate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...paymentData,
            paymentResult: {
              transactionId: 'MOCK12345',
              status: 'success',
              message: 'תשלום הושלם בהצלחה',
            },
          }),
        });

        if (response.ok) {
          setDonationData({ donorName: '', phone: '', email: '' });
          setSelectedProductQuantities({});
          setGeneralDonationAmount(0);
          setDedication('');
          setShowProductQuantity({});
          setShowGeneralDonation(false);
          setShowMoreProducts(false);
          setShowPayment(false);
          setPaymentData(null);
          localStorage.setItem('lastDonation', JSON.stringify({
            fullName: paymentData.donationData.donorName,
            email: paymentData.donationData.email,
            amount: paymentData.totalAmount,
          }));
          router.push('/thank-you');


        } else {
          alert('שגיאה בשמירת התרומה');
        }
      } catch (error) {
        console.error(error);
        alert('שגיאה כללית');
      }
    } else {
      router.push('/payment-failed');
    }
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setDonationData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleQuantityChange = (productId: string, quantity: number) => {
    setSelectedProductQuantities(prev => ({ ...prev, [productId]: quantity }));
  };

  const handleProductClick = (productId: string) => {
    setShowProductQuantity(prev => ({ ...prev, [productId]: !prev[productId] }));
  };

  const handleGeneralDonationClick = () => {
    setShowGeneralDonation(prev => !prev);
  };

  const tefillinProduct = products.find(product =>
    product.name.toLowerCase().includes('תפילין') ||
    product.name.toLowerCase().includes('tefillin')
  );

  const otherProducts = products.filter(product =>
    !product.name.toLowerCase().includes('תפילין') &&
    !product.name.toLowerCase().includes('tefillin')
  );

  if (showPayment && paymentData) {
    return (
      <div dir="rtl" className="min-h-screen bg-gradient-to-bl from-slate-50 via-green-50 to-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              שלב אחרון • תשלום מאובטח
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">תשלום</h2>
            <p className="text-lg text-gray-700">סכום לתשלום: <span className="font-bold text-green-700">{totalAmount} ₪</span></p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-l from-green-700 to-green-800 p-8 text-white">
              <h3 className="text-2xl font-bold text-center mb-6">פרטי תשלום</h3>

              <div className="space-y-4">
                <div className="bg-white/10 backdrop-blur rounded-2xl p-6">
                  <p><strong>תורם:</strong> {paymentData.donationData.donorName}</p>
                  <p><strong>אימייל:</strong> {paymentData.donationData.email}</p>
                  {paymentData.donationData.phone && (
                    <p><strong>טלפון:</strong> {paymentData.donationData.phone}</p>
                  )}
                  {paymentData.donationData.dedication && (
                    <p><strong>הקדשה:</strong> {paymentData.donationData.dedication}</p>
                  )}
                </div>

                <div className="border-2 border-dashed border-green-300 bg-green-50 rounded-2xl p-8 text-center">
                  <div className="mb-6">
                    <span className="text-6xl mb-4 block">💳</span>
                    <p className="text-green-700 font-bold mb-4 text-xl">סימולציית תשלום</p>
                    <p className="mb-4 text-gray-700">
                      סכום לתשלום:
                      <span className="font-bold text-2xl text-green-700"> {paymentData.totalAmount} ₪</span>
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                      onClick={() => startPayment(true)}
                      className="bg-green-700 hover:bg-green-800 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      סימולציה - תשלום הצליח
                    </button>

                    <button
                      onClick={() => startPayment(false)}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                    >
                      סימולציה - תשלום נכשל
                    </button>

                    <button
                      onClick={handlePaymentCancel}
                      className="border-2 border-gray-400 text-gray-600 hover:bg-gray-600 hover:text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105"
                    >
                      ביטול
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-gradient-to-bl from-slate-50 via-green-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            תרומה מאובטחת • מגן רוחני לכל חייל
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">תרומה לפרויקט</h2>
          <p className="text-lg text-gray-700">עזרו לנו לחבר עוד חיילים למסורת היהודית</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* PERSONAL DETAILS */}
            <div className="bg-gradient-to-l from-green-100 to-green-50 p-8 space-y-6">
              <h3 className="text-2xl font-bold text-gray-900">פרטים אישיים</h3>

              <div>
                <label className="block mb-2 font-bold text-gray-700">שם תורם:</label>
                <input
                  type="text"
                  name="donorName"
                  value={donationData.donorName}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700">אימייל:</label>
                <input
                  type="email"
                  name="email"
                  value={donationData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>

              <div>
                <label className="block mb-2 font-bold text-gray-700">טלפון:</label>
                <input
                  type="tel"
                  name="phone"
                  value={donationData.phone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                />
              </div>
            </div>

            {/* DONATION OPTIONS */}
            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">בחר אפשרות תרומה:</h3>

              {!ALLOW_GENERAL_DONATION && products.length === 0 && (
                <div className="text-center p-8 text-gray-500 bg-gray-50 rounded-2xl">
                  <p className="text-lg">אין אפשרויות תרומה זמינות כרגע</p>
                  <p>אנא נסה שוב מאוחר יותר</p>
                </div>
              )}

              {ALLOW_GENERAL_DONATION && (
                <div className="mb-4 p-4 border border-gray-200 rounded-2xl hover:bg-green-50 transition-colors">
                  <label
                    onClick={handleGeneralDonationClick}
                    className="cursor-pointer font-bold text-gray-900 flex justify-between items-center"
                  >
                    <span>תרומה כללית</span>
                    <span className="text-sm text-gray-500">
                      {showGeneralDonation ? '▽' : '▷'}
                    </span>
                  </label>

                  {showGeneralDonation && (
                    <div className="mt-4 animate-slideUp">
                      <input
                        type="number"
                        min="0"
                        value={generalDonationAmount || ''}
                        onChange={(e) => setGeneralDonationAmount(parseInt(e.target.value) || 0)}
                        placeholder="הכנס סכום בשקלים"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  )}
                </div>
              )}

              {tefillinProduct && (
                <div className="mb-4 p-4 border border-gray-200 rounded-2xl hover:bg-green-50 transition-colors">
                  <label
                    onClick={() => handleProductClick(tefillinProduct.id)}
                    className="cursor-pointer font-bold text-gray-900 flex justify-between items-center"
                  >
                    <span>{tefillinProduct.name} - {tefillinProduct.price} ₪</span>
                    <span className="text-sm text-gray-500">
                      {showProductQuantity[tefillinProduct.id] ? '▽' : '▷'}
                    </span>
                  </label>
                  {showProductQuantity[tefillinProduct.id] && (
                    <div className="mt-4 animate-slideUp">
                      <input
                        type="number"
                        min="0"
                        value={selectedProductQuantities[tefillinProduct.id] || ''}
                        onChange={(e) => handleQuantityChange(tefillinProduct.id, parseInt(e.target.value) || 0)}
                        placeholder="כמות"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  )}
                </div>
              )}

              {otherProducts.length > 0 && (
                <div className="mb-4">
                  <button
                    type="button"
                    onClick={() => setShowMoreProducts(!showMoreProducts)}
                    className="w-full p-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-600 hover:border-green-400 hover:text-green-600 transition-colors"
                  >
                    {showMoreProducts ? 'הסתר מוצרים נוספים' : 'הצג מוצרים נוספים'}
                  </button>
                </div>
              )}

              {showMoreProducts && otherProducts.map(product => (
                <div key={product.id} className="mb-4 p-4 border border-gray-200 rounded-2xl hover:bg-green-50 transition-colors">
                  <label
                    onClick={() => handleProductClick(product.id)}
                    className="cursor-pointer font-bold text-gray-900 flex justify-between items-center"
                  >
                    <span>{product.name} - {product.price} ₪</span>
                    <span className="text-sm text-gray-500">
                      {showProductQuantity[product.id] ? '▽' : '▷'}
                    </span>
                  </label>
                  {showProductQuantity[product.id] && (
                    <div className="mt-4 animate-slideUp">
                      <input
                        type="number"
                        min="0"
                        value={selectedProductQuantities[product.id] || ''}
                        onChange={(e) => handleQuantityChange(product.id, parseInt(e.target.value) || 0)}
                        placeholder="כמות"
                        className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300"
                      />
                    </div>
                  )}
                </div>
              ))}

              <div className="mt-8">
                <label className="block mb-2 font-bold text-gray-700">הקדשה (אופציונלי):</label>
                <textarea
                  value={dedication}
                  onChange={(e) => setDedication(e.target.value)}
                  placeholder="הכנס הקדשה..."
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 resize-none"
                />
              </div>

              {totalAmount > 0 && (
                <div className="mt-8 p-6 bg-green-100 rounded-2xl text-center">
                  <p className="text-lg text-gray-700 mb-2">סכום כולל:</p>
                  <p className="text-3xl font-bold text-green-700">{totalAmount} ₪</p>
                </div>
              )}

              <div className="mt-8">
                <button
                  type="submit"
                  disabled={totalAmount === 0}
                  className="w-full bg-green-700 hover:bg-green-800 disabled:bg-gray-400 disabled:cursor-not-allowed text-white px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 hover:scale-105 shadow-lg"
                >
                  {totalAmount === 0 ? 'לא נבחרו מוצרים' : `המשך לתשלום - ${totalAmount} ₪`}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { DonationForm };
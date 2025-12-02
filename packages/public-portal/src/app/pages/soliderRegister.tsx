"use client";
import React, { useState, useEffect } from "react";
import {
  User,
  Phone,
  MapPin,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

export interface StepDefinition {
  number: number;
  labelKey: string;
  icon: LucideIcon;
}

export const stepDefinitions: StepDefinition[] = [
  { number: 1, labelKey: "soldierRegistration.steps.step1.title", icon: User },
  { number: 2, labelKey: "soldierRegistration.steps.step2.title", icon: Phone },
  { number: 3, labelKey: "soldierRegistration.steps.step3.title", icon: MapPin },
];

const StepBar: React.FC<{ currentStep: number }> = ({ currentStep }) => {
  const { t } = useTranslation();
  return (
    <div className="flex justify-center gap-4 mb-6 mt-4">
      {stepDefinitions.map((step, index) => {
        const Icon = step.icon;
        return (
          <div key={index} className="flex items-center">
            <div className="flex flex-col items-center min-h-[100px] w-24 relative">
              <div
                className={`w-12 h-12 flex items-center justify-center rounded-full text-white text-lg
              ${currentStep === step.number ? "bg-green-700" : "bg-gray-300"}`}
              >
                <Icon size={24} />
              </div>
              <span
                className={`mt-2 text-sm text-center leading-tight min-h-[2rem]
              ${currentStep === step.number
                    ? "font-bold text-green-700"
                    : "text-gray-500"
                  }`}
              >
                {t(step.labelKey)}
              </span>
            </div>
            {index !== stepDefinitions.length - 1 && (
              <div className="w-8 border-t-2 border-gray-300"></div>
            )}
          </div>
        );
      })}
    </div>
  );
}
const RegistrationForm: React.FC = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [loadingStatuses, setLoadingStatuses] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [isEmailTaken, setIsEmailTaken] = useState(false);
  const [locations, setLocations] = useState<{ id: string; name: string }[]>([]);
  const [loadingLocations, setLoadingLocations] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    address: "",
    mothersName: "",
    dominant_Hand: "right",
    formFillerName: "",
    formFillerPhone: "",
    formFillerRelationship: "",
    current_Status: "registered",
    locationId: "",
    contactMethod: "",

  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});


  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const res = await fetch("/api/register/local");
        const data = await res.json();
        setLocations(data);
      } catch (error) {
        console.error("שגיאה בטעינת מיקומים:", error);
      } finally {
        setLoadingLocations(false);
      }
    };
    fetchLocations();
  }, []);
  useEffect(() => {
    const checkEmail = async () => {
      if (
        !formData.email ||
        !/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email)
      ) {
        setIsEmailTaken(false);
        return;
      }

      try {
        const res = await fetch(
          `/api/register/check-email/?email=${formData.email}`
        );
        const data = await res.json();
        setIsEmailTaken(data.exists);

        if (data.exists) {
          setErrors((prev) => ({
            ...prev,
            email: t('soldierRegistration.fields.email'),
          }));
        }
      } catch (err) {
        console.error("שגיאה בבדיקת מייל:", err);
      }
    };

    const timeoutId = setTimeout(checkEmail, 500);
    return () => clearTimeout(timeoutId);
  }, [formData.email]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const nameRegex = /^[\p{L}\s'-]{2,}$/u;
  const phoneRegex = /^05\d{8}$/;
  const emailRegex = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

  const validateStep = () => {
    let stepErrors: { [key: string]: string } = {};

    if (currentStep === 1) {
      if (!nameRegex.test(formData.name.trim())) {
        stepErrors.name = "נא להזין שם תקין  ללא מספרים, לפחות 2 תווים";
      }

      if (!formData.email || !emailRegex.test(formData.email)) {
        stepErrors.email = "נא להזין כתובת מייל תקינה";
      }

      if (isEmailTaken) {
        stepErrors.email = t('soldierRegistration.fields.email');
      }

      if (!phoneRegex.test(formData.phone)) {
        stepErrors.phone =
          "מספר טלפון לא תקין (צריך להתחיל ב־05 ולהכיל 10 ספרות)";
      }

      if (!formData.dominant_Hand) {
        stepErrors.dominant_Hand = "נא לבחור יד דומיננטית";
      }

      if (!formData.address.trim()) {
        stepErrors.address = "נא להזין כתובת מגורים";
      }

      if (!nameRegex.test(formData.mothersName.trim())) {
        stepErrors.mothersName =
          "נא להזין שם אם תקין , לפחות 2 תווים";
      }
      if (!formData.contactMethod) {
        stepErrors.contactMethod = "נא לבחור צורת התקשרות מועדפת";
      }
    }

    if (currentStep === 2) {
      if (!nameRegex.test(formData.formFillerName.trim())) {
        stepErrors.formFillerName =
          "נא להזין שם ממלא תקין  ללא מספרים";
      }
      if (!phoneRegex.test(formData.formFillerPhone)) {
        stepErrors.formFillerPhone =
          "טלפון לא תקין – חייב להתחיל ב־05 ולהכיל 10 ספרות";
      }
      if (formData.formFillerRelationship.trim().length < 1) {
        stepErrors.formFillerRelationship = "נא למלא את הקשר לחייל";
      }
    }



    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep()) {
      setCurrentStep((prev) => Math.min(prev + 1, stepDefinitions.length));
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((prev) => prev - 1);
  };

  const convertToPayload = (data: typeof formData) => ({
    name: data.name,
    phone: data.phone,
    email: data.email,
    address: data.address,
    mothers_name: data.mothersName,
    dominant_hand: data.dominant_Hand,
    form_filler_name: data.formFillerName,
    form_filler_phone: data.formFillerPhone,
    form_filler_relationship: data.formFillerRelationship,
    current_status: data.current_Status,

    location_id: data.locationId
  });



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setSuccessMessage("");
    setSubmitError("");

    if (!validateStep()) return;

    if (isEmailTaken) {
      setErrors((prev) => ({
        ...prev,
        email: t('soldierRegistration.fields.email'),
      }));
      return;
    }

    if (currentStep < stepDefinitions.length) {
      nextStep();
      return;
    }

    try {
      const payload = convertToPayload(formData);
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error("שליחה נכשלה: " + (errorText || response.status));
      }

      const text = await response.text();
      const result = text ? JSON.parse(text) : null;

      router.push("/success");

    } catch (error) {
      console.error("❌ שגיאה בשליחה:", error);
      setSubmitError("שגיאה בשליחה לשרת. נסו שוב או בדקו את החיבור.");
    }
  };

  const CurrentIcon = stepDefinitions[currentStep - 1].icon;

  return (

    <div dir="rtl" className="max-w-md mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4 text-center">{t("footer.registration")}</h1>
      <StepBar currentStep={currentStep} />

      <div className="p-6 bg-white rounded-xl shadow-lg">
        <div className="flex flex-col items-center mb-4">
          <div className="bg-green-700 text-white rounded-full p-5 inline-flex items-center justify-center">
            <CurrentIcon className="text-white" size={46} />
          </div>
          <h2 className="text-xl font-bold mt-2">{t(stepDefinitions[currentStep - 1].labelKey)}</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {successMessage && (
            <p className="text-green-700 text-center">{successMessage}</p>
          )}
          {submitError && (
            <p className="text-red-600 text-center">{submitError}</p>
          )}

          {currentStep === 1 && (
            <>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.name')}
                className={`w-full border rounded p-2 ${errors.name ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.name && (
                <p className="text-red-500 text-sm">{errors.name}</p>
              )}

              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t('contact.email')}
                className={`w-full border rounded p-2 ${errors.email ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
              {!errors.email && isEmailTaken && (
                <p className="text-red-500 text-sm">
                  {t('soldierRegistration.fields.email')}
                </p>
              )}

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.phone')}
                className={`w-full border rounded p-2 ${errors.phone ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}

              <input
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.address')}
                className={`w-full border rounded p-2 ${errors.address ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.address && (
                <p className="text-red-500 text-sm">{errors.address}</p>
              )}

              <input
                name="mothersName"
                value={formData.mothersName}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.mothersName')}
                className={`w-full border rounded p-2 ${errors.mothersName ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.mothersName && (
                <p className="text-red-500 text-sm">{errors.mothersName}</p>
              )}

              <select
                name="dominant_Hand"
                value={formData.dominant_Hand}
                onChange={handleChange}
                className={`w-full border rounded p-2 ${errors.dominant_Hand ? "border-red-500" : ""
                  }`}
              >
                <option value="right">{t('soldierRegistration.fields.rightHand')}</option>
                <option value="left">{t('soldierRegistration.fields.leftHand')}</option>
              </select>
              <select name="contactMethod" value={formData.contactMethod} onChange={handleChange} className="w-full border rounded p-2">
                <option value="whatsapp">{t('soldierRegistration.fields.contactMethod.whatsapp')}</option>
                <option value="sms">{t('soldierRegistration.fields.contactMethod.sms')}</option>
              </select>
              {errors.dominant_Hand && (
                <p className="text-red-500 text-sm">{errors.dominant_Hand}</p>
              )}
            </>
          )}

          {currentStep === 2 && (
            <>
              <input
                name="formFillerName"
                value={formData.formFillerName}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.formFillerName')}
                className={`w-full border rounded p-2 ${errors.formFillerName ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.formFillerName && (
                <p className="text-red-500 text-sm">{errors.formFillerName}</p>
              )}

              <input
                name="formFillerPhone"
                value={formData.formFillerPhone}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.formFillerPhone')}
                className={`w-full border rounded p-2 ${errors.formFillerPhone ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.formFillerPhone && (
                <p className="text-red-500 text-sm">{errors.formFillerPhone}</p>
              )}

              <input
                name="formFillerRelationship"
                value={formData.formFillerRelationship}
                onChange={handleChange}
                placeholder={t('soldierRegistration.fields.formFillerRelationship')}
                className={`w-full border rounded p-2 ${errors.formFillerRelationship ? "border-red-500" : ""
                  }`}
                required
              />
              {errors.formFillerRelationship && (
                <p className="text-red-500 text-sm">
                  {errors.formFillerRelationship}
                </p>
              )}
            </>
          )}


          {currentStep === 3 && (
            <>
              {loadingLocations ? (
                <p>טוען מיקומים...</p>
              ) : (
                <select
                  name="locationId"
                  value={formData.locationId}
                  onChange={handleChange}
                  className="w-full border rounded p-2"
                  required
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name}
                    </option>
                  ))}
                </select>

              )}

            </>
          )}

          <div className="flex justify-between mt-6">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={prevStep}
                className="bg-gray-400 text-white px-6 py-2 rounded"
              >
                {t('soldierRegistration.buttons.back')}
              </button>
            )}
            <button
              type="submit"
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded"
            >
              {currentStep === stepDefinitions.length ? t('soldierRegistration.buttons.finish') : t('soldierRegistration.buttons.continue')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;

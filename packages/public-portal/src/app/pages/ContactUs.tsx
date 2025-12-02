    'use client';

    import React, { useState } from 'react';
    import { useTranslation } from 'react-i18next';
    import { useDirection } from '../../hooks/useDirection';
    import FormPageTemplate from "@/layouts/form/FormPageTemplate"
    import Input from "@/components/ui/Input";

    export default function ContactUs() {
      const { t } = useTranslation();
      const { textAlign } = useDirection();
  
      const [form, setForm] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
      });

      const [isLoading, setIsLoading] = useState(false);
      const [successMessage, setSuccessMessage] = useState('');
      const [errorMessage, setErrorMessage] = useState('');

      const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
      ) => {
        setForm({ ...form, [e.target.name]: e.target.value });
      };

      const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setSuccessMessage('');
        setErrorMessage('');

        try {
          const res = await fetch('/api/contact', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form),
          });

          if (res.ok) {
            setSuccessMessage(t('contact.successMessage'));
            setForm({ name: '', email: '', subject: '', message: '' });
          } else {
            setErrorMessage(t('contact.errorMessage'));
          }
        } catch {
          setErrorMessage(t('contact.unexpectedError'));
        } finally {
          setIsLoading(false);
        }
      };

      return (
        <div className={textAlign}>
          <FormPageTemplate
            title={t('contact.title')}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            submitButtonText={t('contact.submitButton')}
          >
            <label className="form-label block">
              {t('contact.name')}
              <Input
                variant="text"
                fullWidth
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder={t('contact.namePlaceholder')}
              />
            </label>

            <label className="form-label block">
              {t('contact.email')}
              <Input
                variant="email"
                fullWidth
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder={t('contact.emailPlaceholder')}
              />
            </label>

            <label className="form-label block">
              {t('contact.subject')}
              <Input
                variant="text"
                fullWidth
                name="subject"
                value={form.subject}
                onChange={handleChange}
                placeholder={t('contact.subjectPlaceholder')}
              />
            </label>

            <label className="form-label block">
              {t('contact.message')}
              <textarea
                name="message"
                value={form.message}
                onChange={handleChange}
                required
                rows={4}
                className="form-textarea w-full rounded border border-gray-300 p-3"
                placeholder={t('contact.messagePlaceholder')}
              />
            </label>

            {successMessage && (
              <p className="form-success text-green-600">{successMessage}</p>
            )}
            {errorMessage && (
              <p className="form-error text-red-600">{errorMessage}</p>
            )}
          </FormPageTemplate>
        </div>
      );
    }

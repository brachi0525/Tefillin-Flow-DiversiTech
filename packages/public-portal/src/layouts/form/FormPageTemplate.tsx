import React from 'react';
import './FormPageTemplate.css';
import BasicPageLayout from '../BasicPageLayout';

interface FormPageTemplateProps {
  title: string;
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  submitButtonText?: string;
  isLoading?: boolean;
}

const FormPageTemplate: React.FC<FormPageTemplateProps> = ({
  title,
  children,
  onSubmit,
  submitButtonText = "שלח",
  isLoading = false
}) => {
  return (
    <BasicPageLayout>
      <div className="form-page-container">
        <div className="form-wrapper">
          <h1 className="form-title">{title}</h1>
          <form className="form-content" onSubmit={onSubmit}>
            <div className="form-fields">
              {children}
            </div>
            <div className="form-actions">
              <button 
                type="submit" 
              className="bg-green-700 hover:bg-green-800 text-white px-6 py-2 rounded"
                disabled={isLoading}
              >
                {isLoading ? "שולח..." : submitButtonText}
              </button>
            </div>
          </form>
        </div>
      </div>
    </BasicPageLayout>
  );
};

export default FormPageTemplate;

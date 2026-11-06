
import { useState } from "react";

interface FormField {
  field_label: string;
  field_name: string;
  field_type: string | null;
  placeholder?: string;
  required?: boolean;
  options?: string;
  $?: Record<string, any>;
}

interface FormStep {
  step_title: string;
  fields: FormField[];
  $?: Record<string, any>;
}

interface RegistrationFormProps {
  form_title?: string;
  form_description?: string;
  steps?: FormStep[];
  next_button_label?: string;
  previous_button_label?: string;
  submit_button_label?: string;
}

const RegistrationForm = ({
  form_title,
  form_description,
  steps = [],
  next_button_label = "Next",
  previous_button_label = "Previous",
  submit_button_label = "Submit",
}: RegistrationFormProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const currentStepData = steps[currentStep];

  const handleChange = (name: string, value: string) => {
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};

    currentStepData?.fields?.forEach((field) => {
      const value = formData[field.field_name] || "";

      if (field.required && !value.trim()) {
        newErrors[field.field_name] = `${field.field_label} is required`;
      }

      if (
        field.field_type?.toLowerCase() === "email" &&
        value &&
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
      ) {
        newErrors[field.field_name] = "Enter a valid email address";
      }
    });

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    setCurrentStep((previous) => previous + 1);
  };

  const handlePrevious = () => {
    setCurrentStep((previous) => Math.max(0, previous - 1));
    setErrors({});
  };

  const handleSubmit = () => {
    if (!validateStep()) return;

    // Demo submission. Connect this to your backend API later.
    console.log("Registration Data:", formData);
    setSubmitted(true);
  };

  const renderField = (field: FormField) => {
    const name = field.field_name;
    const type = field.field_type?.toLowerCase();

    const commonProps = {
      id: name,
      name,
      value: formData[name] || "",
      required: field.required,
      placeholder: field.placeholder || `Enter ${field.field_label}`,
      onChange: (
        event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
      ) => handleChange(name, event.target.value),
    };

    return (
      <div key={name} className="mb-5">
        <label
          htmlFor={name}
          className="mb-2 block text-sm font-medium text-gray-700"
          {...field.$?.field_label}
        >
          {field.field_label}
          {field.required && <span className="text-red-500"> *</span>}
        </label>

        {type === "select" ? (
          <select
            {...commonProps}
            className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3"
          >
            <option value="">Select {field.field_label}</option>
            {field.options
              ?.split("\n")
              .map((option) => option.trim())
              .filter(Boolean)
              .map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
          </select>
        ) : (
          <input
            {...commonProps}
            type={
              type === "email"
                ? "email"
                : type === "phone"
                  ? "tel"
                  : "text"
            }
            className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
          />
        )}

        {errors[name] && (
          <p className="mt-1 text-sm text-red-500">{errors[name]}</p>
        )}
      </div>
    );
  };

  if (!steps.length) return null;

  if (submitted) {
    return (
      <section className="mx-auto my-10 max-w-2xl rounded-xl border p-8 text-center">
        <h2 className="text-2xl font-bold text-green-600">
          Registration Submitted!
        </h2>
        <p className="mt-2 text-gray-600">
          Your details have been captured successfully.
        </p>
      </section>
    );
  }

  return (
    <section className="mx-auto my-10 max-w-2xl rounded-xl border border-gray-200 bg-white p-6 shadow-sm md:p-8">
      {form_title && (
        <h2 className="mb-2 text-3xl font-bold">{form_title}</h2>
      )}

      {form_description && (
        <p className="mb-8 text-gray-600">{form_description}</p>
      )}

      {/* Progress indicator */}
      <div className="mb-8">
        <div className="mb-2 flex justify-between text-sm text-gray-600">
          <span>
            Step {currentStep + 1} of {steps.length}
          </span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
        </div>

        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-blue-600 transition-all"
            style={{
              width: `${((currentStep + 1) / steps.length) * 100}%`,
            }}
          />
        </div>
      </div>

      <h3
        className="mb-6 text-xl font-semibold"
        {...currentStepData.$?.step_title}
      >
        {currentStepData.step_title}
      </h3>

      {currentStepData.fields?.map(renderField)}

      {/* Review screen */}
      {currentStep === steps.length - 1 && (
        <div className="mt-8 rounded-lg bg-gray-50 p-5">
          <h4 className="mb-4 font-semibold">Review Your Details</h4>

          {steps.flatMap((step) =>
            step.fields.map((field) => (
              <div
                key={field.field_name}
                className="flex justify-between gap-4 border-b py-2 text-sm"
              >
                <span className="text-gray-500">
                  {field.field_label}
                </span>
                <span className="text-right font-medium">
                  {formData[field.field_name] || "-"}
                </span>
              </div>
            ))
          )}
        </div>
      )}

      {/* Navigation */}
      <div className="mt-8 flex justify-between gap-4">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={handlePrevious}
            className="rounded-lg border border-gray-300 px-6 py-3 font-medium"
          >
            {previous_button_label}
          </button>
        ) : (
          <span />
        )}

        {currentStep < steps.length - 1 ? (
          <button
            type="button"
            onClick={handleNext}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white"
          >
            {next_button_label}
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white"
          >
            {submit_button_label}
          </button>
        )}
      </div>
    </section>
  );
};

export default RegistrationForm;

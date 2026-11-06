import { useState } from "react";

import {
  Heading,
  TextInput,
  FieldLabel,
  Button,
} from "@contentstack/venus-components";

import "@contentstack/venus-components/build/main.css";

interface ContactFormProps {
  data: {
    form_title?: string;
    form_description?: string;
    name_label?: string;
    name_placeholder?: string;
    email_label?: string;
    email_placeholder?: string;
    subject_label?: string;
    subject_options?: {
      option_label: string;
      option_value: string;
    }[];
    message_label?: string;
    message_placeholder?: string;
    submit_button_text?: string;
    success_message?: string;
  };
}

const ContactForm = ({ data }: ContactFormProps) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    console.log("Form submitted:", formData);

    alert(data.success_message || "Form submitted successfully!");
  };

  return (
    <div className="contact-form">
      <Heading
        tagName="h2"
        text={data.form_title || "Contact Us"}
      />

      {data.form_description && <p>{data.form_description}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <FieldLabel htmlFor="name" required>
            {data.name_label || "Full Name"}
          </FieldLabel>

          <TextInput
            id="name"
            placeholder={data.name_placeholder || "Enter your name"}
            value={formData.name}
            onChange={(event) =>
              handleChange("name", event.target.value)
            }
          />
        </div>

        <div className="form-field">
          <FieldLabel htmlFor="email" required>
            {data.email_label || "Email Address"}
          </FieldLabel>

          <TextInput
            id="email"
            type="email"
            placeholder={data.email_placeholder || "Enter your email"}
            value={formData.email}
            onChange={(event) =>
              handleChange("email", event.target.value)
            }
          />
        </div>

        <div className="form-field">
          <FieldLabel htmlFor="subject">
            {data.subject_label || "Subject"}
          </FieldLabel>

          <select
            id="subject"
            value={formData.subject}
            onChange={(event) =>
              handleChange("subject", event.target.value)
            }
          >
            <option value="">Select subject</option>

            {data.subject_options?.map((option, index) => (
              <option key={index} value={option.option_value}>
                {option.option_label}
              </option>
            ))}
          </select>
        </div>

        <div className="form-field">
          <FieldLabel htmlFor="message">
            {data.message_label || "Message"}
          </FieldLabel>

          <textarea
            id="message"
            placeholder={data.message_placeholder || "Write your message"}
            value={formData.message}
            onChange={(event) =>
              handleChange("message", event.target.value)
            }
          />
        </div>

        <Button buttonType="primary" type="submit">
          {data.submit_button_text || "Submit"}
        </Button>
      </form>
    </div>
  );
};

export default ContactForm;
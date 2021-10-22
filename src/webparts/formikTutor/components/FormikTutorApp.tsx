import React from "react";
import FormikExampleForm from "./forms/FormikExampleForm";

interface FormikTutorAppProps {}

const FormikTutorApp: React.FC<FormikTutorAppProps> =
  ({}: FormikTutorAppProps) => {
    return (
      <>
        <FormikExampleForm></FormikExampleForm>
      </>
    );
  };

export default FormikTutorApp;

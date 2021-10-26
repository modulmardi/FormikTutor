import React from "react";
import FormikExampleForm from "./forms/FormikExampleForm";

interface FormikTutorAppProps {
  listName: string;
}

const FormikTutorApp: React.FC<FormikTutorAppProps> = ({
  listName,
}: FormikTutorAppProps) => {
  return (
    <>
      <FormikExampleForm listName={listName}></FormikExampleForm>
    </>
  );
};

export default FormikTutorApp;

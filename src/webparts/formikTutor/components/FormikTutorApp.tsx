import { WebPartContext } from "@microsoft/sp-webpart-base";
import React from "react";
import FormikExampleForm from "./forms/FormikExampleForm";

interface FormikTutorAppProps {
  context: WebPartContext;
  listName: string;
}

const FormikTutorApp: React.FC<FormikTutorAppProps> = ({
  context,
  listName,
}: FormikTutorAppProps) => {
  return (
    <>
      <FormikExampleForm
        context={context}
        listName={listName}
      ></FormikExampleForm>
    </>
  );
};

export default FormikTutorApp;

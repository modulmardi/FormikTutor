import { DatePicker } from "@fluentui/react";
import { useField, useFormikContext } from "formik";
import React from "react";
interface IFormikDatePicker {
  name: string;
  value: any;
  toucher: () => void;
}

const FormikDatePicker: React.FC<IFormikDatePicker> = (
  props: IFormikDatePicker
) => {
  const { setFieldValue } = useFormikContext();
  const [field] = useField(props);
  return (
    <>
      {console.log(field.value)}

      <DatePicker
        label="Дата регистрации"
        value={field.value}
        {...field}
        {...props}
        onSelectDate={(val) => {
          props.toucher();
          setFieldValue(field.name, val);
        }}
      />
    </>
  );
};

export default FormikDatePicker;

import { Form, Formik, FormikHelpers } from "formik";
import React from "react";

interface FormikExampleFormProps {}

/**
 * Данный интерфейс описывает поля находящиеся в распоряжении formik
 */
interface FormikValues {}

const FormikExampleForm: React.FC<FormikExampleFormProps> = (
  props: FormikExampleFormProps
) => {
  return (
    </**
       * флаг, который переинициализирует форму,если изменятся props компонента
       */>
      <Formik
        enableReinitialize
        /**
         * Сюда передается объект, содержащий начальные значения полей
         */
        initialValues={undefined}
        /**
         * Сюда передается yup-описание схемы валидации
         */
        validationSchema={undefined}
        /**
         * Функция, которая будет вызываться при отправке формы
         */
        onSubmit={(
          /**
           * Объект с полями за которые отвечает formik
           */
          values: FormikValues,
          /**
           * Объект с различными методами formik'а
           ** Примеры:
           *  • formikHelpers.setFieldValue('название переменной', значение) -- устанавливает значение переменной по её названию
           */
          formikHelpers: FormikHelpers<FormikValues>
        ): void | Promise<any> => {
          throw new Error("Function not implemented.");
        }}
        /**
         * Функция, которая будет вызываться при сбросе формы
         */
        onReset={(values, formikHelpers): void | Promise<any> => {
          throw new Error("Function not implemented.");
        }}
      >
        {(
          /**
           * Аргументы следующей функции являются одним объектом,
           * который, для читаемости, следует разбивать
           */
          {
            /**
             * Объект, в котором находятся поля, за которые отвечает formik
             */
            values,
            /**
             * Объект, в котором находятся ошибки валидации полей
             */
            errors,
            /**
             * Объект, в котором находятся флаги, сигнализирующие о том, что некоторое поле было "посещено".
             * Используется для того, чтобы отображать ошибки валидации полей только после того,
             * как поле побывало в фокусе или же пользователь попытался отправить форму
             */
            touched,
            /**
             * Обработчик события выведения поля из фокуса. Указывается в onBlur в полях,
             * сообщение валидации которых, нужно выводить после того как поле посетили
             */
            handleBlur,
            /**
             * Обработчик события изменения значения поля.
             * Указывается в onChange в управляемых формиком полях.
             */
            handleChange,
            /**
             * Обработчик вызова отправки формы
             */
            handleSubmit,
            /**
             * Обработчик сброса формы
             */
            handleReset,
            /**
             * Остальные объектыы и функции формика включая установку значения полей и тд
             */
            ...formikProps
          }
        ) => (
          <>
            <Form></Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default FormikExampleForm;

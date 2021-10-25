import {
  Checkbox,
  DefaultButton,
  PrimaryButton,
  Stack,
  Text,
  TextField,
} from "@fluentui/react";
import { ErrorMessage, FieldArray, Form, Formik, FormikHelpers } from "formik";
import React from "react";
import * as yup from "yup";
import FormikDatePicker from "./customFields/FormikDatePicker";

interface FormikExampleFormProps {}
/**
 * Стиль ошибок Formik скопированный из браузера
 */
const errorStyle = {
  root: {
    display: "flex",
    fontFamily:
      "Segoe UI, Segoe UI Web (West European), Segoe UI, -apple-system, BlinkMacSystemFont, Roboto, Helvetica Neue, sans-serif",
    color: "rgb(164, 38, 44)",
    fontSize: "12px",
    fontWeight: "400",
  },
};

/**
 * Данный интерфейс описывает поля находящиеся в распоряжении formik
 */
interface FormikValues {
  person: {
    misc?: {
      checks?: {
        checkEmailRequired: boolean;
        checkWebsiteVisible: boolean;
        checkWebsiteActive: boolean;
      };
      passwordConfirmation: string;
    };
    fullName: string;
    password: string;
    age: number;
    photo: File;
    email: string;
    website: string;
    registrationDate: Date;
    pets: {
      name: string;
      age: number;
    }[];
  };
}
/**
 * Получение вчерашней даты
 */
const date = new Date();
const yesterday = new Date(date.getTime());
yesterday.setDate(date.getDate() - 1);

const FormikExampleForm: React.FC<FormikExampleFormProps> = (
  props: FormikExampleFormProps
) => {
  const requiredMessage: string = "Поле обязательно к заполнению";
  return (
    <>
      <Formik
        /**
         * Флаг, который переинициализирует форму,если изменятся props компонента
         * По дефолту -- false. То есть если вы дадите новые props форма не перерисуется
         */
        enableReinitialize //=true
        /**
         * Сюда передается объект, содержащий начальные значения полей
         */
        initialValues={{
          person: {
            fullName: "",
            password: "",
            age: null,
            email: "",
            website: "",
            registrationDate: null,
            pets: [],
            photo: null,
            misc: {
              checks: {
                checkEmailRequired: false,
                checkWebsiteVisible: false,
                checkWebsiteActive: false,
              },
              passwordConfirmation: "",
            },
          },
        }}
        /**
         * Сюда передается yup-описание схемы валидации
         */
        validationSchema={
          /**
           * Для валидации создаем объект yup-схемы
           */
          yup.object().shape({
            /**
             * Указываем имя переменной, которую валидируем
             * Указываем схему валидации переменной
             * В данном случае: person представляет собой объект с полями, указанными в аргументе метода shape
             */
            person: yup.object().shape({
              /**
               * Поле fullName представляет собой строку, обязательную к заполнению, состоящую из кириллицы, пробелов и тире.
               * При желании в "ограничивающие" методы можно передавать сообщение,
               * которое будет записываться в поле errors.
               * Порядок "ограничивающих" методов важен:
               * допустим мы сделали валидацию использующую regex и указали, что поле обязательно для заполнения.
               * Если пустая строка будет нарушать regex, то
               * matches(regex, 'Нарушен regex').required('Поле обязательно для заполнения') -- выведет 'Нарушен regex'
               * required('Поле обязательно для заполнения').matches(regex, 'Нарушен regex') -- выведет 'Поле обязательно для заполнения'
               */
              fullName: yup
                .string()
                .required(requiredMessage)
                .matches(
                  /^[А-Я][а-я]*((\s|-)[А-Я][а-я]*)*$/,
                  "Поле должно соответствовать имени человека"
                ),
              password: yup
                .string()
                .required(requiredMessage)
                .oneOf(
                  [yup.ref("misc.passwordConfirmation"), null],
                  "Пароли должны совпадать"
                ),
              passwordConfirmation: yup.string(),
              age: yup
                .number()
                /**
                 * Ошибки типа указываются следующим образом
                 */
                .typeError("Поле должно содержать число")
                .required(requiredMessage)
                .positive("Поле может содержать только положительные значения")
                .integer("Поле может содержать только целочисленные значения"),
              //photo: yup.,
              email: yup.string().when("misc.checks.checkEmailRequired", {
                is: true,
                then: yup
                  .string()
                  .required(requiredMessage)
                  .email("Поле должно содержать email"),
                otherwise: yup.string().email("Поле должно содержать email"),
              }),
              website: yup.string().url("Поле должно содержать ссылку на сайт"),
              registrationDate: yup
                .date()
                .typeError("Поле должно содержать дату")
                .min(
                  yesterday,
                  "Дата регистрации должна не раньше настоящей даты"
                ),
              pets: yup.array().of(
                yup.object().shape({
                  name: yup.string().required(requiredMessage),
                  age: yup.number().required(requiredMessage),
                })
              ),
            }),
          })
        }
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
          alert(JSON.stringify({ ...values.person, misc: undefined }, null, 2));
          formikHelpers.resetForm();
        }}
        /**
         * Функция, которая будет вызываться при сбросе формы
         */
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
            <Form>
              <h1>Регистрация</h1>
              <TextField
                label="ФИО"
                /**
                 * В данное поле следует ввести название переменной за которую отвечает данное поле.
                 * Вложенные переменные пишутся через точку
                 */
                name={"person.fullName"}
                /**
                 * Поле содержит идентификатор используемый реактом. Особенно важен при генерации полей.
                 */
                key={"person.fullName"}
                /**
                 * В данное поле следует указать переменнуую за которое отвечает данное поле
                 * Помним, что все контролируемые переменные лежат в values
                 */
                value={values.person.fullName}
                /**
                 * В данное поле вносится сообщение об ошибке.
                 * Если мы хотим показывать ошибку только ПОСЛЕ того как поле было посещено,
                 * нам следует построить условие использующее объект touched
                 *
                 * Если хотим использовать стандартное решение по выводу ошибок FluentUI,
                 * то придется расписывать вывод ошибок(Могут появиться проблемы, особенно при генерации полей для вложенных массивов).
                 * Иначе можно использовать formik компонент <ErrorMessage name="тут пишем имя переменной, то же, что и выше" />
                 */
                errorMessage={
                  touched?.person?.fullName ? errors?.person?.fullName : ""
                }
                /**
                 * Не забываем повесить обработчики
                 */
                onChange={handleChange} // изменения
                onBlur={handleBlur} // вывода из фокуса
              />
              {/**
               * Вариант использующий вывод ошибки при помощи formik. Далее буду использовать его
               */}
              <ErrorMessage
                name="person.fullName"
                render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
              />
              <TextField
                label={"Возраст"}
                name={"person.age"}
                key={"person.age"}
                value={values.person.age?.toString() || ""}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="person.age"
                render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
              />
              <>
                <TextField
                  label={"Пароль"}
                  name={"person.password"}
                  key={"person.password"}
                  value={values.person.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="person.password"
                  render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
                />
                <TextField
                  label={"Подтверждение пароля"}
                  name={"person.misc.passwordConfirmation"}
                  key={"person.misc.passwordConfirmation"}
                  value={values.person.misc.passwordConfirmation}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <ErrorMessage
                  name="person.misc.passwordConfirmation"
                  render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
                />
              </>
              <>
                <Checkbox
                  label={"Сделать email обязательным полем"}
                  name={"person.misc.checks.checkEmailRequired"}
                  key={"person.misc.checks.checkEmailRequired"}
                  checked={values.person.misc.checks.checkEmailRequired}
                  onChange={handleChange}
                />
                <Checkbox
                  label={"Сделать сайт видимым полем"}
                  name={"person.misc.checks.checkWebsiteVisible"}
                  key={"person.misc.checks.checkWebsiteVisible"}
                  checked={values.person.misc.checks.checkWebsiteVisible}
                  onChange={handleChange}
                />
                <Checkbox
                  label={"Сделать сайт активным полем"}
                  disabled={!values.person.misc.checks.checkWebsiteVisible}
                  name={"person.misc.checks.checkWebsiteActive"}
                  key={"person.misc.checks.checkWebsiteActive"}
                  checked={values.person.misc.checks.checkWebsiteActive}
                  onChange={handleChange}
                />
              </>
              <TextField
                label={"Email"}
                name={"person.email"}
                key={"person.email"}
                value={values.person.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <ErrorMessage
                name="person.email"
                render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
              />
              {/**
               * Условный рендеринг компонент. Текстовое поле сайта будет отображено только в том случае,
               * если checkWebsiteVisible == true
               */}
              {values.person.misc.checks.checkWebsiteVisible && (
                <>
                  <TextField
                    label={"Сайт"}
                    name={"person.website"}
                    key={"person.website"}
                    value={values.person.website}
                    disabled={!values.person.misc.checks.checkWebsiteActive}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                  <ErrorMessage
                    name="person.website"
                    render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
                  />
                </>
              )}
              {/**
               * Допиливание компоненты под Formik. Смотри соответствующий файл
               */}
              <FormikDatePicker
                name="person.registrationDate"
                toucher={() =>
                  formikProps.setFieldTouched("person.registrationDate")
                }
                value={values.person.registrationDate}
              />
              <ErrorMessage
                name="person.registrationDate"
                render={(msg) => <Text styles={errorStyle}>{msg}</Text>}
              />
              <input
                type="file"
                name="person.photo"
                onChange={(e) => console.log(e.target.files[0])}
              />
              <FieldArray
                name="person.pets"
                render={(arrayHelpers) => {
                  return (
                    <Stack>
                      <h2>Питомцы</h2>
                      {values.person.pets.map((pet, petId, pets) => (
                        <>
                          <PrimaryButton
                            text={`Добавить перед ${petId + 1} питомцем`}
                            onClick={() =>
                              arrayHelpers.insert(petId, {
                                name: "",
                                age: null,
                              })
                            }
                          />
                          <Stack
                            horizontal
                            styles={{ root: { margin: "auto" } }}
                          >
                            <DefaultButton
                              text="Удалить питомца"
                              onClick={() => arrayHelpers.remove(petId)}
                              styles={{ root: { margin: "auto" } }}
                            />
                            <Stack>
                              <TextField
                                label={`Имя питомца ${petId + 1}`}
                                name={`person.pets[${petId}].name`}
                                key={`person.pets[${petId}].name`}
                                value={pet?.name}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                              <TextField
                                label={`Возраст питомца ${petId + 1}`}
                                name={`person.pets[${petId}].age`}
                                key={`person.pets[${petId}].age`}
                                value={pet?.age?.toString() || ""}
                                onChange={handleChange}
                                onBlur={handleBlur}
                              />
                            </Stack>
                          </Stack>
                        </>
                      ))}
                      <PrimaryButton
                        text="Добавить питомца"
                        onClick={() =>
                          arrayHelpers.push({ name: "", age: null })
                        }
                      />
                    </Stack>
                  );
                }}
              />

              {/**
               * Кнопки сбросить и отправить
               */}
              <Stack horizontal>
                <DefaultButton text="Сбросить" onClick={handleReset} />
                <PrimaryButton text="Отправить" type="submit" />
              </Stack>
            </Form>
          </>
        )}
      </Formik>
    </>
  );
};

export default FormikExampleForm;

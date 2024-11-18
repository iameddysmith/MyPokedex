import { useState, useCallback, useEffect } from "react";

export function useFormAndValidation(formRef, extraValidityCheck = () => true) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: value,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: e.target.validationMessage || "",
    }));

    const formValidity = formRef.current?.checkValidity();
    const noEmptyFields = Object.entries({
      ...values,
      [name]: value,
    }).every(([fieldName, fieldValue]) => {
      if (fieldName === name) return value.trim() !== "";
      return typeof fieldValue === "string" ? fieldValue.trim() !== "" : true;
    });

    setIsValid(formValidity && noEmptyFields && extraValidityCheck(values));
  };

  const resetForm = useCallback(
    (newValues = {}, newErrors = {}, newIsValid = false) => {
      setValues(newValues);
      setErrors(newErrors);
      setIsValid(newIsValid);
    },
    []
  );

  useEffect(() => {
    if (formRef.current) {
      const formValidity = formRef.current.checkValidity();
      const noEmptyFields = Object.entries(values).every(([, fieldValue]) => {
        return typeof fieldValue === "string" ? fieldValue.trim() !== "" : true;
      });
      setIsValid(formValidity && noEmptyFields && extraValidityCheck(values));
    }
  }, [values, extraValidityCheck, formRef]);

  return {
    values,
    handleChange,
    errors,
    isValid,
    resetForm,
  };
}

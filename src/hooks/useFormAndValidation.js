import { useState, useCallback, useEffect } from "react";
//validation hook
export function useFormAndValidation(formRef, extraValidityCheck = () => true) {
  const [values, setValues] = useState({});
  const [errors, setErrors] = useState({});
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const trimmedValue = typeof value === "string" ? value.trim() : value;

    setValues((prevValues) => ({
      ...prevValues,
      [name]: trimmedValue,
    }));

    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: e.target.validationMessage || "",
    }));

    const formValidity = formRef.current?.checkValidity();
    const hasNoSpaceOnlyValues = Object.entries(values).every(
      ([fieldName, fieldValue]) => {
        if (typeof fieldValue !== "string") return true;
        if (fieldName === name) return trimmedValue !== "";
        return fieldValue.trim() !== "";
      }
    );

    setIsValid(
      formValidity && hasNoSpaceOnlyValues && extraValidityCheck(values)
    );
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
      const hasNoSpaceOnlyValues = Object.entries(values).every(
        ([, fieldValue]) => {
          if (typeof fieldValue !== "string") return true;
          return fieldValue.trim() !== "";
        }
      );
      setIsValid(
        formValidity && hasNoSpaceOnlyValues && extraValidityCheck(values)
      );
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

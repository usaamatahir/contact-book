import React, { FC } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { TextField, Grid, Button } from "@material-ui/core";
import TextError from "../TextError";

type initialValueTye = {
  name: string;
  number: string;
};

const initialValue: initialValueTye = {
  name: "",
  number: "",
};

type Props = {
  setAddContact: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = Yup.object({
  name: Yup.string().optional(),
  number: Yup.string().required("Number is required"),
});

const AddContact: FC<Props> = ({ setAddContact }) => {
  return (
    <div className="Form">
      <Formik
        initialValues={initialValue}
        validationSchema={validationSchema}
        onSubmit={(values: initialValueTye, onSubmitProps: any) => {
          fetch(`/.netlify/functions/add`, {
            method: "post",
            body: JSON.stringify({ name: values.name, number: values.number }),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log("Contact created successfully", data);
              setAddContact((val) => !val);
              onSubmitProps.resetForm();
            })
            .catch((e) => {
              console.log("Failed to create this contact");
              console.log("Error : ", e);
            });
        }}
      >
        <Grid
          container
          spacing={3}
          direction="column"
          justify="center"
          alignItems="stretch"
        >
          <Form className="TextInput">
            <Grid item md={4} sm={6} xs={10}>
              <Field
                as={TextField}
                name="name"
                variant="outlined"
                label="Name"
                helperText={<ErrorMessage name="name" component={TextError} />}
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={6} xs={10}>
              <Field
                as={TextField}
                name="number"
                variant="outlined"
                label="Number"
                helperText={
                  <ErrorMessage name="number" component={TextError} />
                }
                fullWidth
              />
            </Grid>
            <Grid item md={4} sm={6} xs={10}>
              <Button variant="contained" color="secondary" type="submit">
                ADD
              </Button>
            </Grid>
          </Form>
        </Grid>
      </Formik>
    </div>
  );
};

export default AddContact;

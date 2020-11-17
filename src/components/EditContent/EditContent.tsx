import React, { FC } from "react";
import { Grid, TextField } from "@material-ui/core";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Button from "@material-ui/core/Button";
import Modal from "react-awesome-modal";
import TextError from "../TextError";

type ContactData = {
  name: string;
  number: string;
  Ref: any;
};

type Props = {
  name: string;
  number: string;
  Ref: any;
  setAddContact: React.Dispatch<React.SetStateAction<boolean>>;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const validationSchema = Yup.object({
  name: Yup.string().optional(),
  number: Yup.string().required("Number is required"),
});

const EditContent: FC<Props> = ({
  name,
  number,
  Ref,
  setAddContact,
  open,
  setOpen,
}) => {
  const initialValue: ContactData = {
    name: name,
    number: number,
    Ref: Ref,
  };

  return (
    <div>
      <Modal
        visible={open}
        width="600"
        height="400"
        effect="fadeInUp"
        onClickAway={() => setOpen(false)}
      >
        <Formik
          initialValues={initialValue}
          validationSchema={validationSchema}
          onSubmit={(values, onSubmitProps: any) => {
            fetch(`/.netlify/functions/update`, {
              method: "post",
              body: JSON.stringify({
                name: values.name,
                number: values.number,
                id: Ref["@ref"].id,
              }),
            })
              .then((response) => response.json())
              .then((data) => {
                console.log("Contact created successfully", data);
                setAddContact((val) => !val);
                onSubmitProps.resetForm();
                setOpen(false);
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
            // direction="column"
            // justify="center"
            // alignItems="center"
          >
            <Form className="TextInput">
              <Grid item xs={10}>
                <Field
                  defaultValue={name}
                  as={TextField}
                  name="name"
                  variant="outlined"
                  label="Name"
                  helperText={
                    <ErrorMessage name="name" component={TextError} />
                  }
                  fullWidth
                />
              </Grid>
              <Grid item xs={10}>
                <Field
                  defaultValue={number}
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
              <Grid item xs={6}>
                <Button variant="contained" color="secondary" type="submit">
                  UPDATE
                </Button>
              </Grid>
            </Form>
          </Grid>
        </Formik>
      </Modal>
    </div>
  );
};

export default EditContent;

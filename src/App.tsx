import React, { useState, useEffect } from "react";
import { Grid, Typography } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import "./App.css";
import AddContact from "./components/AddContact/AddContact";
import EditContent from "./components/EditContent/EditContent";

type data = {
  name: string;
  number: string;
};

type ContactData = {
  ref: Object;
  ts: number;
  data: data;
};

function App() {
  const [readData, setReadData] = useState<null | ContactData[]>(null);
  const [addContact, setAddContact] = useState(false);
  const [openEditor, setOpenEditor] = useState(false);
  const [updateContact, setUpdateContent] = useState<null | ContactData>(null);

  useEffect(() => {
    fetch(`/.netlify/functions/read`)
      .then((response) => response.json())
      .then((data) => {
        setReadData(data.data);
        console.log(data.data);
      })
      .catch((e) => {
        console.log("Error : ", e);
        console.log("Failed to get Data");
      });
  }, [addContact]);

  function deleteContact(ref: any) {
    fetch(`/.netlify/functions/remove`, {
      method: "post",
      body: JSON.stringify({ id: ref["@ref"].id }),
    })
      .then((response) => {
        response.json();
        console.log("Deleting");
      })
      .then((data) => {
        setAddContact((val) => !val);
        console.log("Deleted : ", data);
      });
  }

  function updateContent(contact: ContactData) {
    setUpdateContent(contact);
    setOpenEditor(true);
  }

  return (
    <div className="App">
      <AddContact setAddContact={setAddContact} />
      <div>
        <h3>All Contacts</h3>
        {readData === null || readData.length === 0 ? (
          <h5>Currently No Contacts are added</h5>
        ) : (
          readData.map((contacts: ContactData, ind) => {
            return (
              <div key={ind} className="contactList">
                <Grid
                  container
                  spacing={3}
                  justify="space-around"
                  alignItems="stretch"
                >
                  <Grid item md={2} sm={3} xs={4}>
                    <Typography variant="h6">{contacts.data.name}</Typography>
                  </Grid>
                  <Grid item md={2} sm={3} xs={5}>
                    <Typography variant="h6">{contacts.data.number}</Typography>
                  </Grid>
                  <Grid item md={2} sm={3} xs={3}>
                    <EditIcon
                      className="Icon"
                      onClick={() => updateContent(contacts)}
                    />

                    <DeleteIcon
                      className="Icon"
                      onClick={() => deleteContact(contacts.ref)}
                    />
                  </Grid>
                </Grid>
              </div>
            );
          })
        )}
      </div>

      {updateContact !== null && (
        <EditContent
          name={updateContact.data.name}
          number={updateContact.data.number}
          Ref={updateContact.ref}
          setAddContact={setAddContact}
          open={openEditor}
          setOpen={setOpenEditor}
        />
      )}
    </div>
  );
}

export default App;

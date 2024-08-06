"use client"

import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material";
import { firestore } from "@/firebase";
import { collection, getDocs, query, doc, getDoc, setDoc } from "firebase/firestore";
import { useEffect, useState } from "react";

export default function Home() {
  const [inventory, setInventory ] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');
  const [search, setSearch] = useState('');
  const [found, setFound] = useState(false);
  const [foundItem, setFounditem] = useState({});
  const [openSearch, setOpenSearch] = useState(false);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot);
    let inventoryList = [];
    docs.forEach((document) => {
      inventoryList.push({
        name: document.id,
        ...document.data(),
      });
    })
    setInventory(inventoryList);
  }  
  useEffect (() => {
    updateInventory();
  }
  , []);

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      if(quantity === 1) {
        deleteDoc(docRef);
      } else {
        await setDoc(docRef, {quantity: quantity-1});
      }
    }
    await updateInventory();
  }

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity+1});
    } else {
      await setDoc(docRef, {quantity: 1});
    }
    await updateInventory();
  };

  const handleSearch = async (item) => {
    setFound(false);
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      setFounditem({
        name: docSnap.id,
        ...docSnap.data(),
      })
      setFound(true);
    }
    searchOpen();
    console.log(foundItem);
  }
  
  const addSearchItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      await setDoc(docRef, {quantity: quantity+1});
    } else {
      await setDoc(docRef, {quantity: 1});
    }
    // setFounditem({
    //   name: docSnap.id,
    //   ...docSnap.data(),
    // })
    await updateInventory();
  }; 

  const removeSearchItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);

    if(docSnap.exists()){
      const {quantity} = docSnap.data();
      if(quantity === 1) {
        deleteDoc(docRef);
        setFound(false)
      } else {
        await setDoc(docRef, {quantity: quantity-1});
        // setFounditem({
        //   name: docSnap.id,
        //   ...docSnap.data(),
        // })
      }
    }
    await updateInventory();
  }

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const searchOpen = () => setOpenSearch(true);
  const closeSearch = () => setOpenSearch(false);

  // ###############################################################
  // ####################################################################
  
  return (
    <Box
      width="100wv"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Stack direction={'row'} spacing={15}>

        <Stack direction={'row'} spacing={1}>
          <TextField value={search} onChange={(e) => setSearch(e.target.value)}>
          </TextField>
          
          <Button variant="contained" onClick={() => handleSearch(search)}>
            Search
          </Button>
          <Modal open={openSearch} onClose={closeSearch}>
            <Box 
              position={"absolute"}
              top="50%"
              left="50%"
              width={900}
              bgcolor="white"
              borber="2px solid #000"
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={3}
              sx={{
                transform: 'translate(-50%,-50%)',
              }}
            >
              <Box
                width="100%"
                minheight="200px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                padding={5}
              >
                {found ? <>
                <Typography
                  variant={'h3'}
                  color={'#333'}
                  textAlign={'centre'}
                >
                  {foundItem.name.charAt(0).toUpperCase()+foundItem.name.slice(1)}
                </Typography>

                <Typography
                  variant={'h3'}
                  color={'#333'}
                  textAlign={'centre'}
                >
                  {foundItem.quantity}
                </Typography>

                {/* <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  bgcolor="red"
                  onClick={() => addSearchItem(foundItem.name)}
                >
                  Add
                </Button>

                <Button
                  variant="outline"
                  bgcolor="red"
                  onClick={() => removeSearchItem(foundItem.name)}
                >
                  Remove
                </Button>
                </Stack> */}
                </> : <>
                  <Typography
                    variant={'h3'}
                    color={'#333'}
                    textAlign={'centre'}
                  >
                    Item Named " {search} " Not Found... 
                  </Typography>
                </>
                }
              </Box>
              <Button onClick={closeSearch}>
                OK
              </Button>
            </Box>
          </Modal>  
        </Stack> 

        <Button variant="contained" onClick={handleOpen}>Add New Item</Button>
        <Modal
          open={open}
          onClose={handleClose}
          // aria-labelledby="modal-modal-title"
          // aria-describedby="modal-modal-description"
        >
          <Box 
            position={"absolute"}
            top="50%"
            left="50%"
            width={400}
            bgcolor="white"
            borber="2px solid #000"
            boxShadow={24}
            p={4}
            display="flex"
            flexDirection="column"
            gap={3}
            sx={{
              transform: 'translate(-50%,-50%)',
            }}
          >
            <Typography variant="h6" >
              Add New Item
            </Typography>
            <Stack width="100%" direction="row" spacing={2}>
              <TextField
                variant="outlined"
                fullWidth
                value={itemName}
                onChange={(e) => {
                  setItemName(e.target.value);
                }}
              >
              </TextField>
              <Button
                variant="contained"
                onClick={
                  () => {
                    addItem(itemName);
                    setItemName('');
                    handleClose();
                  }
                }
              >
                Add Item
              </Button>
            </Stack>
          </Box>
        </Modal>
      
      </Stack>

      <Box border={'1px solid #333' }
      borderRadius={'20px'}
      overflow={'hidden'}
      >
        <Box width="900px" 
        height="100px" 
        bgcolor={'#ADD8E6'}
        display={'flex'}
        justifyContent={'center'}
        alignContent={'center'}
        >
          <Typography sx={{ pt: 1.5 }} variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory Managment System
          </Typography>

        </Box>
        <Stack
          width="900px"
          height="300px"
          spacing={2}
          overflow={'auto'}
        >
          {inventory.map(
            ({name, quantity}) => (
              <Box
                key={name}
                width="100%"
                minheight="200px"
                display={'flex'}
                justifyContent={'space-between'}
                alignItems={'center'}
                bgcolor={'#f0f0f0'}
                padding={5}
              >
                <Typography
                  variant={'h3'}
                  color={'#333'}
                  textAlign={'centre'}
                >
                  {name.charAt(0).toUpperCase()+name.slice(1)}
                </Typography>

                <Typography
                  variant={'h3'}
                  color={'#333'}
                  textAlign={'centre'}
                >
                  {quantity}
                </Typography>

                <Stack direction={'row'} spacing={2}>
                <Button
                  variant="contained"
                  bgcolor="red"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>

                <Button
                  variant="outline"
                  bgcolor="red"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
                </Stack>

              </Box>
            )
          )}

        </Stack>
      </Box>

    </Box>
  );
}

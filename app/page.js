'use client';

import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, Button, Modal, TextField } from '@mui/material';
import { firestore } from '@/firebase';
import { collection, doc, getDocs, query, setDoc, deleteDoc, getDoc } from 'firebase/firestore';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { getLlamaCompletion } from '@/lib/claude_quickstart';
ChartJS.register(ArcElement, Tooltip, Legend);



const Home = () => {
  const [gen, setGen] = useState(true);
  const [nutrients, setNutrients] = useState("");
  const completion = (name) => {
    console.log("GOT HERE");
    var facts = getLlamaCompletion(name);
    console.log(facts);
    setNutrients(facts);
    setGen(false);
  }
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState('');

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data() });
    });
    setInventory(inventoryList);
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const addItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + 1 });
    } else {
      await setDoc(docRef, { quantity: 1 });
    }
    await updateInventory();
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 });
      }
    }
    await updateInventory();
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const pieChartData = {
    labels: inventory.map(item => item.name),
    datasets: [
      {
        label: 'Quantity',
        data: inventory.map(item => item.quantity),
        backgroundColor: [
          'rgba(255, 99, 132, 0.3)',
          'rgba(54, 162, 235, 0.3)',
          'rgba(255, 206, 86, 0.3)',
          'rgba(75, 192, 192, 0.3)',
          'rgba(153, 102, 255, 0.3)',
          'rgba(255, 159, 64, 0.3)',
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)',
        ],
        borderWidth: 3,
      },
    ],
  };

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Lilita+One&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
  }, []);

  const appStyle = {
    fontFamily: "'Lilita One', cursive",
    fontSize: '45px',
  };

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      alignItems={'center'}
      flexDirection={'column'}
      gap={2}
      style={{
        ...appStyle,
        backgroundColor: 'rgba(0, 128, 128, 0.1)' // Teal color with 30% opacity
      }}
    >
       <Typography 
        variant="h3" 
        style={{ 
          color: "#008080", 
          fontSize: "100px",
          fontFamily: "'Lilita One', cursive", 
          fontWeight: 'bold', 
          textAlign: 'center', // Center text within its container
          marginBottom: '60px' // Add margin to separate from the modal
        }}
      >
        Pantry Tracker
      </Typography>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" fontFamily={"'Lilita One', cursive"}>
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={1}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName);
                setItemName('');
                handleClose();
              }}
              size="small"
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Box display={'flex'} flexDirection={'row'} height="600px" width="100%" justifyContent={'space-between'}>
        {/* Box on the left-hand side */}
        <Box border={'8px solid rgba(0, 128, 128)'} borderRadius="20px" padding="10px" width="400px" display={'flex'} flexDirection={'column'} alignItems={'center'}>
          <Button style={{ 
          backgroundColor: "#008080",
          fontFamily: "'Lilita One', cursive", 
          fontWeight: 'bold', 
          textAlign: 'center'
          }} marginBottom="100px" variant="contained" onClick={handleOpen} sx={{ mb: 2 }}>
            Add New Item
          </Button>
          <Box border="2px" width="100%" padding={2} sx={{ borderRadius: '10px', height: '400px' }}>
            <Box
              width="100%"
              height="60px"
              bgcolor={'#ADD8E6'}
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              style={{ 
                backgroundColor: "#008080",
                fontFamily: "'Lilita One'", 
                fontWeight: 'bold', 
                textAlign: 'center'
                }}
              sx={{ borderRadius: '10px 10px 0 0' }}
            >
              <Typography variant={'h6'} fontFamily="'Lilita One', cursive" fontSize="40px" color={'white'} fontWeight="bold" textAlign={'center'}>
                Inventory Items
              </Typography>
            </Box>
            <Stack width="100%" height="100%" spacing={1} overflow={'auto'} padding="10px">
              {inventory.map(({ name, quantity }) => (
                <Box
                  onClick={() => completion(name)} // Define load function or remove this
                  key={name}
                  width="100%"
                  minHeight="60px"
                  display={'flex'}
                  justifyContent={'space-between'}
                  alignItems={'center'}
                  bgcolor={'#f0f0f0'}
                  paddingX={2}
                  sx={{ borderRadius: '10px' }}
                >
                  <Typography variant={'body1'} color={'#333'} textAlign={'center'}>
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Typography variant={'body1'} color={'#333'} textAlign={'center'}>
                    Quantity: {quantity}
                  </Typography>
                  <Button style={{ 
          backgroundColor: "#008080",
          fontFamily: "'Lilita One', cursive", 
          fontWeight: 'bold', 
          textAlign: 'center'
          }} variant="contained" onClick={() => removeItem(name)} size="small">
                    Remove
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>
        </Box>
        {/* PieChart in the center */}
        <Box flex={1} display={'flex'} justifyContent={'center'} alignItems={'center'} padding={2}>
          <Box width="600px" height="600px" sx={{ borderRadius: '10px' }}>
            <PieChart data={pieChartData} width="100%" height="100%"/>
          </Box>
        </Box>
        <Box border={'8px solid #008080'} color="#008080" borderRadius="20px" padding="10px" width="400px" display={'flex'} flexDirection={'column'} alignItems={'center'}>
          {gen ? <p>Select an item to generate its nutritional data.</p> : <p></p>}
          <p>{nutrients}</p>
        </Box>
      </Box>
    </Box>
  );
};

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
};

const PieChart = ({ data }) => (
  <Pie data={data} />
);

export default Home;
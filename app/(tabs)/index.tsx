
// import { Ionicons } from '@expo/vector-icons';
// import DateTimePicker from '@react-native-community/datetimepicker';
// import { printToFileAsync } from 'expo-print';
// import { shareAsync } from 'expo-sharing';
// import React, { useState } from 'react';
// import { Alert, Platform, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';

// // Define the type for an item
// interface Item {
//   consignerName: string;
//   consigneeName: string;
//   particulars: string;
//   noOfArticles: string;
//   paid: string;
//   toPay: string;
// }

// // Define styles type
// interface Styles {
//   container: StyleProp<ViewStyle>;
//   sectionTitle: StyleProp<TextStyle>;
//   input: StyleProp<TextStyle>;
//   itemContainer: StyleProp<ViewStyle>;
//   itemTitle: StyleProp<TextStyle>;
//   addButton: StyleProp<ViewStyle>;
//   addButtonText: StyleProp<TextStyle>;
//   removeButton: StyleProp<ViewStyle>;
//   generateButtonContainer: StyleProp<ViewStyle>;
//   generateButton: StyleProp<ViewStyle>;
//   generateButtonText: StyleProp<TextStyle>;
//   spacer: StyleProp<ViewStyle>;
//   errorText: StyleProp<TextStyle>;
// }

// const IndexScreen: React.FC = () => {
//   // State for general info with type annotations
//   const [slipNumber, setSlipNumber] = useState<string>('');
//   const [billDate, setBillDate] = useState<string>('');
//   const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
//   const [vehicleNumber, setVehicleNumber] = useState<string>('');
//   const [vehicleNumberError, setVehicleNumberError] = useState<string>('');
//   const [fromCity, setFromCity] = useState<string>('');
//   const [toCity, setToCity] = useState<string>('');

//   // State for dynamic items with type annotations
//   const [items, setItems] = useState<Item[]>([
//     { consignerName: '', consigneeName: '', particulars: '', noOfArticles: '', paid: '', toPay: '' }
//   ]);

//   // Indian vehicle number validation regex: XX-YY-ZZ-YYYY
//   const vehicleNumberRegex = /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$/;

//   // Handle vehicle number input with auto-formatting
//   const handleVehicleNumberChange = (text: string): void => {
//     const cleanedText = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
//     let formattedText = '';
//     for (let i = 0; i < cleanedText.length; i++) {
//       if (i === 2 || i === 4 || i === 6) {
//         formattedText += '-';
//       }
//       formattedText += cleanedText[i];
//     }
//     if (cleanedText.length > 10) {
//       formattedText = formattedText.substring(0, 14);
//     }
//     setVehicleNumber(formattedText);

//     if (formattedText.length === 14) {
//       if (!vehicleNumberRegex.test(formattedText)) {
//         setVehicleNumberError('Invalid vehicle number. Format: XX-YY-ZZ-YYYY (e.g., MH-32-AC-2024)');
//       } else {
//         setVehicleNumberError('');
//       }
//     } else {
//       setVehicleNumberError('');
//     }
//   };

//   // Handle date selection
//   const onDateChange = (event: any, selectedDate?: Date) => {
//     setShowDatePicker(Platform.OS === 'ios'); // Keep picker open on iOS until user confirms
//     if (selectedDate) {
//       const day = String(selectedDate.getDate()).padStart(2, '0');
//       const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
//       const year = selectedDate.getFullYear();
//       setBillDate(`${day}/${month}/${year}`);
//     }
//   };

//   // Add new item
//   const addItem = (): void => {
//     setItems([...items, { consignerName: '', consigneeName: '', particulars: '', noOfArticles: '', paid: '', toPay: '' }]);
//   };

//   // Remove item
//   const removeItem = (index: number): void => {
//     if (items.length === 1) {
//       Alert.alert("Cannot remove the last item.");
//       return;
//     }
//     const newItems = items.filter((_, i) => i !== index);
//     setItems(newItems);
//   };

//   // Update item field
//   const updateItem = (index: number, field: keyof Item, value: string): void => {
//     const newItems = [...items];
//     newItems[index][field] = value;
//     setItems(newItems);
//   };

//   // Generate PDF
//   const generatePDF = async (): Promise<void> => {
//     if (vehicleNumber && !vehicleNumberRegex.test(vehicleNumber)) {
//       Alert.alert("Invalid Vehicle Number", "Please enter a valid vehicle number in the format XX-YY-ZZ-YYYY (e.g., MH-32-AC-2024).");
//       return;
//     }

//     const totalPaid = items.reduce((sum, item) => sum + (parseFloat(item.paid) || 0), 0).toFixed(2);
//     const totalToPay = items.reduce((sum, item) => sum + (parseFloat(item.toPay) || 0), 0).toFixed(2);

//     const html = `
//       <html>
//         <head>
//           <style>
//             body { font-family: Arial, sans-serif; margin: 20px; }
//             .header { text-align: center; font-size: 18px; font-weight: bold; }
//             .sub-header { display: flex; justify-content: space-between; margin: 10px 0; }
//             .table { width: 100%; border-collapse: collapse; margin-top: 10px; }
//             .table th, .table td { border: 1px solid black; padding: 5px; text-align: center; font-size: 12px; }
//             .total-row { font-weight: bold; }
//             .footer { margin-top: 20px; display: flex; justify-content: space-between; }
//           </style>
//         </head>
//         <body>
//           <div class="header">SMR TRANSPORTS</div>
//           <div class="header">PH</div>
//           <div class="sub-header">
//             <div>No: ${slipNumber}<br>From: ${fromCity}</div>
//             <div>ENROLLMENT NO:<br>Date: ${billDate}</div>
//             <div>Vehicle No: ${vehicleNumber}<br>To: ${toCity}</div>
//           </div>
//           <table class="table">
//             <tr>
//               <th>SNo</th>
//               <th>LR No</th>
//               <th>Area</th>
//               <th>Consigner Name</th>
//               <th>Area</th>
//               <th>Consignee Name</th>
//               <th>Particulars</th>
//               <th>No of Articles</th>
//               <th>Paid</th>
//               <th>To Pay</th>
//             </tr>
//             ${items.map((item, index) => `
//               <tr>
//                 <td>${index + 1}</td>
//                 <td>${index + 1}</td>
//                 <td>${fromCity}</td>
//                 <td>${item.consignerName}</td>
//                 <td>${toCity}</td>
//                 <td>${item.consigneeName}</td>
//                 <td>${item.particulars}</td>
//                 <td>${item.noOfArticles}</td>
//                 <td>${item.paid}</td>
//                 <td>${item.toPay}</td>
//               </tr>
//             `).join('')}
//             <tr class="total-row">
//               <td colspan="8">TOTAL</td>
//               <td>${totalPaid}</td>
//               <td>${totalToPay}</td>
//             </tr>
//           </table>
//           <div class="footer">
//             <div>Loading Charges: __________</div>
//             <div>Paid: __________</div>
//             <div>Driver Signature: __________</div>
//           </div>
//         </body>
//       </html>
//     `;

//     try {
//       const { uri } = await printToFileAsync({ html });
//       await shareAsync(uri, { dialogTitle: 'Share or Download PDF' });
//     } catch (error) {
//       Alert.alert("Error generating PDF", (error as Error).message);
//     }
//   };

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.sectionTitle}>General Information</Text>
//       <TextInput
//         style={styles.input}
//         placeholder="Slip Number"
//         value={slipNumber}
//         onChangeText={setSlipNumber}
//       />
//       <TouchableOpacity onPress={() => setShowDatePicker(true)}>
//         <TextInput
//           style={styles.input}
//           placeholder="Bill Date (e.g., 27/04/2022)"
//           value={billDate}
//           editable={false} // Prevent manual editing
//           pointerEvents="none" // Prevent keyboard from showing
//         />
//       </TouchableOpacity>
//       {showDatePicker && (
//         <DateTimePicker
//           value={billDate ? new Date(billDate.split('/').reverse().join('-')) : new Date()}
//           mode="date"
//           display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
//           onChange={onDateChange}
//         />
//       )}
//       <TextInput
//         style={styles.input}
//         placeholder="Vehicle Number (e.g., MH-32-AC-2024)"
//         value={vehicleNumber}
//         onChangeText={handleVehicleNumberChange}
//         maxLength={14}
//       />
//       {vehicleNumberError ? <Text style={styles.errorText}>{vehicleNumberError}</Text> : null}
//       <TextInput
//         style={styles.input}
//         placeholder="From City"
//         value={fromCity}
//         onChangeText={setFromCity}
//       />
//       <TextInput
//         style={styles.input}
//         placeholder="To City"
//         value={toCity}
//         onChangeText={setToCity}
//       />

//       <Text style={styles.sectionTitle}>Items/Goods Information</Text>
//       {items.map((item, index) => (
//         <View key={index} style={styles.itemContainer}>
//           <Text style={styles.itemTitle}>Item {index + 1}</Text>
//           <TextInput
//             style={styles.input}
//             placeholder="Consigner Name"
//             value={item.consignerName}
//             onChangeText={(text) => updateItem(index, 'consignerName', text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Consignee Name"
//             value={item.consigneeName}
//             onChangeText={(text) => updateItem(index, 'consigneeName', text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Particulars"
//             value={item.particulars}
//             onChangeText={(text) => updateItem(index, 'particulars', text)}
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="No of Articles"
//             value={item.noOfArticles}
//             onChangeText={(text) => updateItem(index, 'noOfArticles', text)}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="Paid"
//             value={item.paid}
//             onChangeText={(text) => updateItem(index, 'paid', text)}
//             keyboardType="numeric"
//           />
//           <TextInput
//             style={styles.input}
//             placeholder="To Pay"
//             value={item.toPay}
//             onChangeText={(text) => updateItem(index, 'toPay', text)}
//             keyboardType="numeric"
//           />
//           <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
//             <Ionicons name="trash-outline" size={24} color="red" />
//           </TouchableOpacity>
//         </View>
//       ))}

//       <TouchableOpacity onPress={addItem} style={styles.addButton}>
//         <Ionicons name="add-circle-outline" size={24} color="green" />
//         <Text style={styles.addButtonText}>Add Item</Text>
//       </TouchableOpacity>

//       <View style={styles.generateButtonContainer}>
//         <TouchableOpacity onPress={generatePDF} style={styles.generateButton}>
//           <Text style={styles.generateButtonText}>Generate PDF</Text>
//         </TouchableOpacity>
//       </View>

//       <View style={styles.spacer} />
//     </ScrollView>
//   );
// };

// const styles: Styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: '#f5f5f5',
//     marginTop: 25,
//   },
//   sectionTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     marginVertical: 10,
//     color: '#333',
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: '#ccc',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#fff',
//   },
//   itemContainer: {
//     borderWidth: 1,
//     borderColor: '#ddd',
//     borderRadius: 5,
//     padding: 10,
//     marginVertical: 5,
//     backgroundColor: '#fff',
//   },
//   itemTitle: {
//     fontSize: 16,
//     fontWeight: 'bold',
//     color: '#555',
//   },
//   addButton: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   addButtonText: {
//     marginLeft: 5,
//     color: 'green',
//     fontSize: 16,
//   },
//   removeButton: {
//     alignSelf: 'flex-end',
//     marginTop: 5,
//   },
//   generateButtonContainer: {
//     alignItems: 'center',
//     marginVertical: 10,
//   },
//   generateButton: {
//     backgroundColor: '#007AFF',
//     paddingVertical: 10,
//     paddingHorizontal: 20,
//     borderRadius: 5,
//   },
//   generateButtonText: {
//     color: '#fff',
//     fontSize: 16,
//     fontWeight: 'bold',
//   },
//   spacer: {
//     height: 50,
//   },
//   errorText: {
//     color: 'red',
//     fontSize: 12,
//     marginBottom: 5,
//   },
// });

// export default IndexScreen;





import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import * as MediaLibrary from 'expo-media-library';
import { printToFileAsync } from 'expo-print';
import { shareAsync } from 'expo-sharing';
import React, { useState } from 'react';
import { Alert, Platform, ScrollView, StyleProp, StyleSheet, Text, TextInput, TextStyle, TouchableOpacity, View, ViewStyle } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

// Define the type for an item
interface Item {
  consignerName: string;
  consigneeName: string;
  particulars: string;
  noOfArticles: string;
  unit: string;
  paid: string;
  toPay: string;
}

// Define styles type
interface Styles {
  container: StyleProp<ViewStyle>;
  sectionTitle: StyleProp<TextStyle>;
  input: StyleProp<TextStyle>;
  pickerContainer: StyleProp<ViewStyle>;
  picker: StyleProp<TextStyle>;
  itemContainer: StyleProp<ViewStyle>;
  itemTitle: StyleProp<TextStyle>;
  addButton: StyleProp<ViewStyle>;
  addButtonText: StyleProp<TextStyle>;
  removeButton: StyleProp<ViewStyle>;
  generateButtonContainer: StyleProp<ViewStyle>;
  generateButton: StyleProp<ViewStyle>;
  generateButtonText: StyleProp<TextStyle>;
  actionButtonContainer: StyleProp<ViewStyle>;
  actionButton: StyleProp<ViewStyle>;
  actionButtonText: StyleProp<TextStyle>;
  spacer: StyleProp<ViewStyle>;
  errorText: StyleProp<TextStyle>;
}

const IndexScreen: React.FC = () => {
  // State for general info with type annotations
  const [slipNumber, setSlipNumber] = useState<string>('');
  const [billDate, setBillDate] = useState<string>('');
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [vehicleNumber, setVehicleNumber] = useState<string>('');
  const [vehicleNumberError, setVehicleNumberError] = useState<string>('');
  const [fromCity, setFromCity] = useState<string>('');
  const [toCity, setToCity] = useState<string>('');
  const [pdfUri, setPdfUri] = useState<string | null>(null);

  // State for dynamic items with type annotations
  const [items, setItems] = useState<Item[]>([
    { consignerName: '', consigneeName: '', particulars: '', noOfArticles: '', unit: 'Tons', paid: '', toPay: '' }
  ]);

  // Indian vehicle number validation regex: XX-YY-ZZ-YYYY
  const vehicleNumberRegex = /^[A-Z]{2}-[0-9]{2}-[A-Z]{2}-[0-9]{4}$/;

  // Handle vehicle number input with auto-formatting
  const handleVehicleNumberChange = (text: string): void => {
    const cleanedText = text.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    let formattedText = '';
    for (let i = 0; i < cleanedText.length; i++) {
      if (i === 2 || i === 4 || i === 6) {
        formattedText += '-';
      }
      formattedText += cleanedText[i];
    }
    if (cleanedText.length > 10) {
      formattedText = formattedText.substring(0, 14);
    }
    setVehicleNumber(formattedText);

    if (formattedText.length === 14) {
      if (!vehicleNumberRegex.test(formattedText)) {
        setVehicleNumberError('Invalid vehicle number. Format: XX-YY-ZZ-YYYY (e.g., MH-32-AC-2024)');
      } else {
        setVehicleNumberError('');
      }
    } else {
      setVehicleNumberError('');
    }
  };

  // Handle date selection
  const handleConfirmDate = (selectedDate: Date) => {
    setShowDatePicker(false);
    const day = String(selectedDate.getDate()).padStart(2, '0');
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const year = selectedDate.getFullYear();
    setBillDate(`${day}/${month}/${year}`);
  };

  const handleCancelDate = () => {
    setShowDatePicker(false);
  };

  // Add new item
  const addItem = (): void => {
    setItems([...items, { consignerName: '', consigneeName: '', particulars: '', noOfArticles: '', unit: 'Tons', paid: '', toPay: '' }]);
  };

  // Remove item
  const removeItem = (index: number): void => {
    if (items.length === 1) {
      Alert.alert("Cannot remove the last item.");
      return;
    }
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
  };

  // Update item field
  const updateItem = (index: number, field: keyof Item, value: string): void => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
  };

  // Download the PDF
  const downloadPDF = async () => {
    if (!pdfUri) return;

    try {
      const fileName = `LoadingSlip_${slipNumber || 'NoSlip'}_${billDate.replace(/\//g, '-') || 'NoDate'}.pdf`;

      if (Platform.OS === 'android') {
        // Request permission to access media library on Android
        const { status } = await MediaLibrary.requestPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert("Permission Denied", "Storage permission is required to save the PDF.");
          return;
        }

        // Create an asset from the PDF file
        const asset = await MediaLibrary.createAssetAsync(pdfUri);
        
        // Save the asset to the Downloads album (user-accessible location)
        await MediaLibrary.createAlbumAsync('Download', asset, false);
        
        Alert.alert("Success", "PDF has been saved to your Downloads folder.");
      } else {
        // On iOS, use the share sheet to let the user save the file
        await shareAsync(pdfUri, { dialogTitle: 'Save PDF' });
        Alert.alert("Success", "Please use the share sheet to save the PDF to your desired location.");
      }
    } catch (error) {
      Alert.alert("Error saving PDF", (error as Error).message);
    }
  };

  // Share the PDF
  const sharePDF = async () => {
    if (!pdfUri) return;

    try {
      await shareAsync(pdfUri, { dialogTitle: 'Share PDF' });
    } catch (error) {
      Alert.alert("Error sharing PDF", (error as Error).message);
    }
  };

  // Generate PDF
  const generatePDF = async (): Promise<void> => {
    if (vehicleNumber && !vehicleNumberRegex.test(vehicleNumber)) {
      Alert.alert("Invalid Vehicle Number", "Please enter a valid vehicle number in the format XX-YY-ZZ-YYYY (e.g., MH-32-AC-2024).");
      return;
    }

    const totalPaid = items.reduce((sum, item) => sum + (parseFloat(item.paid) || 0), 0).toFixed(2);
    const totalToPay = items.reduce((sum, item) => sum + (parseFloat(item.toPay) || 0), 0).toFixed(2);

    const html = `
      <html>
        <head>
          <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@700&display=swap" rel="stylesheet">
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            .header-container { 
              display: flex; 
              justify-content: space-between; 
              align-items: center; 
              padding: 20px; 
              border-bottom: 2px solid #000; 
              margin-bottom: 20px; 
            }
            .header-center { 
              text-align: center; 
              flex: 1; 
            }
            .header { 
              font-size: 28px; 
              font-weight: bold; 
              color: #000; 
              font-family: 'Rajdhani', sans-serif;
            }
            .address { 
              font-size: 14px; 
              font-weight: bold; 
              color: #333; 
              margin-top: 5px; 
            }
            .header-right { 
              font-size: 14px; 
              font-weight: bold; 
              color: #000; 
              display: flex;
              flex-direction: column;
            }
            .sub-header { 
              display: flex; 
              justify-content: space-between; 
              padding: 15px; 
              background-color: #fff; 
            }
            .table { 
              width: 100%; 
              border-collapse: collapse; 
              margin-top: 10px; 
            }
            .table th, .table td { 
              border: 1px solid black; 
              padding: 5px; 
              text-align: center; 
              font-size: 12px; 
            }
            .total-row { 
              font-weight: bold; 
            }
            .footer { 
              margin-top: 20px; 
              display: flex; 
              justify-content: space-between; 
            }
            .top-shloka {
              text-align: center;
              color: red;
              font-size: 18px;
              font-weight: bold;
              margin-bottom: 10px;
              border-top: 1px solid lightgray;
              border-bottom: 1px solid lightgray;
              padding: 5px;
            }
          </style>
        </head>
        <body>
          <div class="top-shloka">
            || जई माई माता कृपा ||  || श्री गणेशाय नमः ||  || आशो माता कृपा ||   || ओम नमः शिवाय  ||
          </div>
          <div class="header-container">
            <div class="header-center">
              <div class="header">MAA AGHORA KALI TRANSPORT</div>
              <div class="address">
                Transport Contractor, Lorry Supplier Commission Agent & Fleet Owner<br>
                Plot No.6-A, Near Bharat Petrolpump, Vhirgaon, Nagpur (Rural), MH - 441108
              </div>
            </div>
            <div class="header-right">
              <div>8400910042</div>
              <div>7620168347</div>
              <div>7788000026</div>
              <div>7709787299</div>
            </div>
          </div>
          <div class="sub-header">
            <div>No: ${slipNumber}<br>From: ${fromCity}</div>
            <div><br>Date: ${billDate}</div>
            <div>Vehicle No: ${vehicleNumber}<br>To: ${toCity}</div>
          </div>
          <table class="table">
            <tr>
              <th>SNo</th>
              <th>LR No</th>
              <th>Area</th>
              <th>Consigner Name</th>
              <th>Area</th>
              <th>Consignee Name</th>
              <th>Particulars</th>
              <th>No of Articles</th>
              <th>Paid</th>
              <th>To Pay</th>
            </tr>
            ${items.map((item, index) => `
              <tr>
                <td>${index + 1}</td>
                <td>${index + 1}</td>
                <td>${fromCity}</td>
                <td>${item.consignerName}</td>
                <td>${toCity}</td>
                <td>${item.consigneeName}</td>
                <td>${item.particulars}</td>
                <td>${item.noOfArticles} ${item.unit}</td>
                <td>${item.paid}</td>
                <td>${item.toPay}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="8">TOTAL</td>
              <td>${totalPaid}</td>
              <td>${totalToPay}</td>
            </tr>
          </table>
          <div class="footer">
            <div>Loading Charges: __________</div>
            <div>Paid: __________</div>
            <div>Driver Signature: __________</div>
          </div>
        </body>
      </html>
    `;

    try {
      const { uri } = await printToFileAsync({ html });
      setPdfUri(uri);
    } catch (error) {
      Alert.alert("Error generating PDF", (error as Error).message);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.sectionTitle}>General Information</Text>
      <TextInput
        style={styles.input}
        placeholder="Slip Number"
        value={slipNumber}
        onChangeText={setSlipNumber}
      />
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Bill Date (e.g., 27/04/2022)"
          value={billDate}
          editable={false}
          pointerEvents="none"
        />
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={handleCancelDate}
        maximumDate={new Date()}
      />
      <TextInput
        style={styles.input}
        placeholder="Vehicle Number (e.g., MH-32-AC-2024)"
        value={vehicleNumber}
        onChangeText={handleVehicleNumberChange}
        maxLength={14}
      />
      {vehicleNumberError ? <Text style={styles.errorText}>{vehicleNumberError}</Text> : null}
      <TextInput
        style={styles.input}
        placeholder="From City"
        value={fromCity}
        onChangeText={setFromCity}
      />
      <TextInput
        style={styles.input}
        placeholder="To City"
        value={toCity}
        onChangeText={setToCity}
      />

      <Text style={styles.sectionTitle}>Items/Goods Information</Text>
      {items.map((item, index) => (
        <View key={index} style={styles.itemContainer}>
          <Text style={styles.itemTitle}>Item {index + 1}</Text>
          <TextInput
            style={styles.input}
            placeholder="Consigner Name"
            value={item.consignerName}
            onChangeText={(text) => updateItem(index, 'consignerName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Consignee Name"
            value={item.consigneeName}
            onChangeText={(text) => updateItem(index, 'consigneeName', text)}
          />
          <TextInput
            style={styles.input}
            placeholder="Particulars"
            value={item.particulars}
            onChangeText={(text) => updateItem(index, 'particulars', text)}
          />
          <View style={styles.pickerContainer}>
            <TextInput
              style={[styles.input, { flex: 1 }]}
              placeholder="No of Articles"
              value={item.noOfArticles}
              onChangeText={(text) => updateItem(index, 'noOfArticles', text)}
              keyboardType="numeric"
            />
            <Picker
              selectedValue={item.unit}
              style={styles.picker}
              onValueChange={(value) => updateItem(index, 'unit', value)}
            >
              <Picker.Item label="Tons" value="Tons" />
              <Picker.Item label="Kg" value="Kg" />
              <Picker.Item label="Units" value="Units" />
              <Picker.Item label="Feets" value="Feets" />
              <Picker.Item label="Meters" value="Meters" />
              <Picker.Item label="Kg / m³" value="Kg / m³" />
            </Picker>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Paid"
            value={item.paid}
            onChangeText={(text) => updateItem(index, 'paid', text)}
            keyboardType="numeric"
          />
          <TextInput
            style={styles.input}
            placeholder="To Pay"
            value={item.toPay}
            onChangeText={(text) => updateItem(index, 'toPay', text)}
            keyboardType="numeric"
          />
          <TouchableOpacity onPress={() => removeItem(index)} style={styles.removeButton}>
            <Ionicons name="trash-outline" size={24} color="red" />
          </TouchableOpacity>
        </View>
      ))}

      <TouchableOpacity onPress={addItem} style={styles.addButton}>
        <Ionicons name="add-circle-outline" size={24} color="green" />
        <Text style={styles.addButtonText}>Add Item</Text>
      </TouchableOpacity>

      <View style={styles.generateButtonContainer}>
        <TouchableOpacity onPress={generatePDF} style={styles.generateButton}>
          <Text style={styles.generateButtonText}>Generate PDF</Text>
        </TouchableOpacity>
      </View>

      {pdfUri && (
        <View style={styles.actionButtonContainer}>
          <TouchableOpacity onPress={downloadPDF} style={[styles.actionButton, { backgroundColor: '#28a745' }]}>
            <Text style={styles.actionButtonText}>Download PDF</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={sharePDF} style={[styles.actionButton, { backgroundColor: '#007AFF' }]}>
            <Text style={styles.actionButtonText}>Share PDF</Text>
          </TouchableOpacity>
        </View>
      )}

      <View style={styles.spacer} />
    </ScrollView>
  );
};

const styles: Styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
    marginTop: 25
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginVertical: 10,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  pickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  picker: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  itemContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#fff',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#555',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  addButtonText: {
    marginLeft: 5,
    color: 'green',
    fontSize: 16,
  },
  removeButton: {
    alignSelf: 'flex-end',
    marginTop: 5,
  },
  generateButtonContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  generateButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  generateButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  actionButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 10,
    gap: 10,
  },
  actionButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  actionButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  spacer: {
    height: 50,
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
  },
});

export default IndexScreen;
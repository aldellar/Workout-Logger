import AsyncStorage from '@react-native-async-storage/async-storage';

//function for setting the item two input the key to find the item
//value is the value of the key the data of it
export const setItem = async (key, value) => {
  //using a try catch block here because we dont want the app to crash if the data cannot be retrieved
  try {
    //await is used here because it is an asyncronous call
    //we are using the setItem function that was given to us from the react native async storage
    //library
    //here we have two things the key
    //and the value is turned into a string
    await AsyncStorage.setItem(key, JSON.stringify(value));
    //if there is an error catch it and continue running only displaying somethign to the console
  } catch (error) {
    //display the console error message
    console.error('Error setting item:', error);
  }
};

//end set item function

//get item function another asynchronous storage function
export const getItem = async (key) => {
  //again here we are using the try catch block to ensure the apps reliability
  try {

    const value = await AsyncStorage.getItem(key);
    //if the value is actually recieved from sttorage meaning is not null or undefined we parse
    //the value back into its original form
    //if the value is not valid then we return null by default
    return value ? JSON.parse(value) : null;
    //catching the error
  } catch (error) {
    //displaying the appropriate error to console
    console.error('Error getting item:', error);
  }
};

//end get item function

//get all keys function this has no required parameters again an asynchronous function
export const getAllKeys = async () => {
  //try catch block to ensure apps reliability
  try {
    //gather all the keys the getAll keys function returns an array of strings
    const keys = await AsyncStorage.getAllKeys();
    //return the string array of all keys
    return keys;
    //catch the error
  } catch (error) {
    //display the approrpriate error
    console.error('Error getting all keys:', error);
  }
};

//end getall keys function

//get all items function another asynchronous function that has no required parameters
export const getAllItems = async () => {
  //try catch block to ensure the apps reliability
  try {
    //store the array of strings in value keys
    //call the getAllKeys functions and wait until the keys is resolved
    const keys = await getAllKeys();
    //getting the items from the value keys
    //we are using multiget here instead of muitiple getItem calls because it is more efficient
    //multi get gets multiple items in a single call
    const items = await AsyncStorage.multiGet(keys);
    //reduce here is a method that iterates over the items array and stores the results
    //into a single object
    //reduce takes to arguments a callback function and an initial accumlator value
    return items.reduce((acc, [key, value]) => {
      //from the array acc we look at the key and parse the value back into the original data
      acc[key] = JSON.parse(value);
      //return the acc array with all the key value pairs
      return acc;
    }, {});
    //catching the error
  } catch (error) {
    //displaying the appropriate error
    console.error('Error getting all items:', error);
  }
};

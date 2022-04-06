import {useState, useEffect} from 'react'
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput, FlatList } from 'react-native';
import axios from 'axios';
import IonicIcons from 'react-native-vector-icons/Ionicons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import {debounce} from 'lodash'

export default function App() {

  const [query, setQuery] = useState()
  const [isRegisting, setIsRegisting ] = useState(false)
  const [ userName, setUserName ] = useState()
  const [ phoneNumber, setPhoneNumber ] = useState()
  const [contacts, setContacts ] = useState([])

  async function getData(){
    await axios.post('http://172.20.10.5:5000/getData').then(response =>{
      setContacts(response.data)
      console.log(response.data)
    }).catch(error => {
      console.log(error)
    })
  }
  
  useEffect(()=> {
    getData()
  },[])

  async function handleSubmit() {
    const data ={
      name_user: userName,
      phone:phoneNumber
    }
    await axios.post('http://172.20.10.5:5000/setData', data).then(response => {
      console.log(response.data)
      setIsRegisting(false)
    }).then(error => {
      console.log(error)
    })
  }

  async function handleDelete(id){
    const data = {
      userID: id
    }
    axios.post('http://172.20.10.5:5000/deleteData', data).then(response => {
      console.log(response.data)
      getData()
    }).then(error => {
      console.log(error)
    })
  }

  const sendQuery = debounce((text) => {
    if(text && text !== " "){

      axios.post('http://172.20.10.5:5000/searchData', {query: text}).then(response => {
        setContacts(response.data)
      }).catch(error => {
        console.log(error)
      })
    }else{
      getData()
    }
  },500)


  const styles = StyleSheet.create({
    cardContacts: {
      height: 60,
      backgroundColor: '#fff',
      borderRadius: 5,
      padding: 10,
      margin: 5,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems:'center',
      shadowColor: '#000', 
      shadowOffset: {width:0,height: 1},
      shadowOpacity: .2,
      shadowRadius: 1.4,
      elevation: 2,
    }
  })

  return (
    
    <SafeAreaView>
        <StatusBar />
        <View style={{flexDirection: 'row', alignItems: 'center', padding: 20,justifyContent: 'space-between'}}>
          <Text style={{fontSize: 18, fontWeight: 'bold'}}>Contactos</Text>
          <TouchableOpacity onPress={()=> setIsRegisting(!isRegisting)} style={{backgroundColor:'#66ab8c', height: 50, width: 50, borderRadius: 5, justifyContent: 'center',alignItems: 'center'}}>
            <Text style={{fontSize: 18, fontWeight: 'bold', color: '#fff'}}>{isRegisting ? '<': '+'}</Text>
          </TouchableOpacity>
        </View>
        <View>
          <View style={{padding: 20}}>
         { !isRegisting ? 
          <View>

            <View style={{backgroundColor: '#ddd', height: 50, borderRadius: 5, padding: 5, flexDirection: 'row',alignItems: 'center'}}>
              <TextInput style={{flex: 1}} placeholder='pesquisar' onChangeText={text => sendQuery(text)}/> 
            </View>
                <FlatList
                  style={{marginTop: 50, height: 400}}
                  contentContainerStyle={{marginTop:10}}
                  data={contacts}
                  keyExtractor={item => item._id}
                  renderItem={({item}) => {

                    var menu = false
                    return(
                      <TouchableOpacity onPress={()=> menu == true} key={item._id} style={styles.cardContacts}>
                        <View>
                          <Text style={{fontSize: 16, fontWeight: 'bold', color: '#444'}}>{item.name}</Text>
                          <Text style={{color: '#999'}}>{item.phone} </Text>  
                        </View>
                        <View style={{flexDirection: 'row',alignItems: 'center'}}>
                            <TouchableOpacity onPress={()=> handleDelete(item._id)} style={{marginRight: 5, backgroundColor: '#f1f1f1', borderRadius: 2, padding:5, height: 40, width: 40, justifyContent: 'center',alignItems:'center'}}>
                              <IonicIcons name='ios-trash-bin' color={'#66ab8c'} size={25} />
                            </TouchableOpacity>
                            <TouchableOpacity style={{marginRight: 5, backgroundColor: '#f1f1f1', borderRadius: 2, padding:5, height: 40, width: 40, justifyContent: 'center',alignItems:'center'}}>
                              <MaterialIcons  name='edit' color={'#66ab8c'} size={25}/>
                            </TouchableOpacity>
                        </View>
                      </TouchableOpacity>
                    )
                }}
              />
            </View>

            
          
          :
          <View>
            <View style={{backgroundColor: '#ddd', height: 50, borderRadius: 5, padding: 5, flexDirection: 'row',alignItems: 'center'}}>
              <TextInput placeholder='Digite o nome' onChangeText={text => setUserName(text)}/> 
            </View>
            <View style={{backgroundColor: '#ddd',marginTop: 10, height: 50, borderRadius: 5, padding: 5, flexDirection: 'row',alignItems: 'center'}}>
              <TextInput placeholder='Digite o numero de celular' onChangeText={text => setPhoneNumber(text)}/> 
            </View>
            <TouchableOpacity onPress={()=> handleSubmit()} style={{backgroundColor: '#66ab8c',marginTop: 10, height: 50, borderRadius: 5, padding: 5, flexDirection: 'row',alignItems: 'center', justifyContent: 'center'}}>
              <Text style={{fontWeight: 'bold', color: '#fff'}}>Registar</Text>
            </TouchableOpacity>
          </View>
          }         
          </View>
        </View>
      </SafeAreaView>
    
  );
}

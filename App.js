import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, StyleSheet, View, Text, ScrollView, Dimensions } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import React, { useState, useEffect } from 'react';
import * as Location from 'expo-location';
import { Fontisto } from '@expo/vector-icons'; 

const { width:SCREEN_WIDTH } = Dimensions.get("window");
const API_KEY = "f15590dd9cef4c640807e57878f65405";
const icons = {
  Clouds:"cloudy",
  Clear: "day-sunny",
  Rain: "rain",
  Atmosphere: "cloudy-gusts",
  Snow: "snow",
  Drizzle: "day-rain",
  Thunderstorm: "lightning",
}

export default function App() {
  const [city, setCity] = useState("확인중..");
  const [today, setToday] = useState({});
  const [days,setDays] = useState([]);
  const [ok, setOk] = useState();
  const getWeather = async() => {
    const {status} = await Location.requestForegroundPermissionsAsync();
    if(status !== "granted"){
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps:false});
    setCity(location[0].region);
    const resp = await (await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly,alerts&units=metric&appid=${API_KEY}`)).json();
    setToday(resp.current);
    setDays(resp.daily);
  };
  useEffect(()=>{
    getWeather();
  },[]);
  return (
    <View style={styles.container}>
      <StatusBar style="light"/>
      <View style={styles.city}>
        <View style={styles.today.detail}>
          <Fontisto name="map-marker-alt" size={14} color="black" />
          <Text style={styles.cityName}>{city}</Text>
        </View>
      </View>
      <View style={styles.weather}>
        <View style={styles.today}>
          {today.constructor === Object && Object.keys(today).length === 0 ? (
            <View><ActivityIndicator color="white" size="large" /></View>
          ) : (
            <View style={styles.today.weather}>
              <Text style={styles.today.main}>{today.weather[0].main}</Text>
              <Fontisto name={icons[today.weather[0].main]} size={120} color="white" />
              <Text style={styles.today.temp}>{parseFloat(today.temp).toFixed(1)}°</Text>
              <View style={styles.today.detail}>
                <View style={styles.today.detailTxt}><Fontisto name="wind" size={16} color="black" /><Text style={styles.today.description}>  {today.wind_speed}km/h</Text></View>
                <View style={styles.today.detailTxt}><Fontisto name="mad" size={16} color="black" /><Text style={styles.today.description}>  {today.humidity}%</Text></View>
              </View>
            </View>
          )}
        </View>
        <Text style={styles.smtitle}>D+7일 날씨</Text>
        <ScrollView pagingEnabled horizontal contentContainerStyle={styles.days}>
          {days.length === 0 ? (
            <View style={styles.day}>
              <ActivityIndicator color="white" size="large" />
            </View>
            ) : (
              days.map((day,index) => 
            <View key={index} style={styles.day}>
              <Text>{new Date(day.dt * 1000).toString().substring(0, 10)}</Text>
              <Text style={styles.day.description}>{day.weather[0].main}</Text>
              <Fontisto name={icons[day.weather[0].main]} size={45} color="white" />
              <Text style={styles.day.temp}>{parseFloat(day.temp.day).toFixed(1)}°</Text>
            </View>)
          )}
        </ScrollView>
      </View>
      <View style={styles.bottom}></View>
    </View>
  );
}
const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor:"#6bbcfa"
  },
  city:{
    flex:2,
    paddingTop:40,
    paddingLeft:30,
  },
  cityName:{
    marginLeft:16,
    fontSize:16,
    fontWeight:"600"
  },
  weather:{
    flex:12
  },
  today:{
    justifyContent:"center",
    alignItems:"center",
    weather:{
      justifyContent:"center",
      alignItems:"center"
    },
    detail:{
      flexDirection:"row",
      alignItems:"center",
      marginBottom:20
    },
    detailTxt:{
      flexDirection:"row",
      alignItems:"center",
      marginLeft:6,
      marginRight:6,
    },
    main:{fontSize:32,color:"rgba(0,0,0,.6)",marginBottom:20},
    description:{fontSize:18,color:"rgba(0,0,0,.6)"},
    temp:{fontSize:100, fontWeight:"600"},
  },
  smtitle:{
    paddingLeft:30,
    fontSize:18,
    fontWeight:"600"
  },
  days:{
    
  },
  day:{
    width:SCREEN_WIDTH/3,
    padding:10,
    backgroundColor:"rgba(255,255,255,.3)",
    alignItems:"center",
    marginTop:20,
    marginLeft:10,
    marginRight:10,
    borderRadius:15,
    description:{
      fontSize:18,
      marginBottom:12,
      color:"rgba(0,0,0,.6)"
    },
    temp:{
      fontSize:32,
      fontWeight:"600",
      marginTop:8
    }
  },
  bottom:{
    flex:1
  },
})
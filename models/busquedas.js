const fs = require('fs')
const axios = require('axios')
const { info } = require('console')

class Busquedas {
    constructor(){
        //leer DB si existe
        this.historial = [];
        this.dbPath = './db/database.json';
        this.leerDB()
    }
    get historialCap(){
      return this.historial.map( lugar =>{
        return lugar.split(' ').map( text => text[0].toUpperCase() + text.slice(1)).join(' ')
      })
    }

    get paramsMapbox(){
        return {
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    get paramsClima(){
      return {
        appid: process.env.OPENWEATHER_KEY,
        units: 'metric',
        lang: 'es'
      }
    }
    async ciudad(lugar = '') {
        try {
            //petición http
          const intance = axios.create({
            baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
            params: this.paramsMapbox
          })
          const resp = await intance.get()
          // Retornar los datos de respuesta
          return resp.data.features.map( lugar => ({
            id: lugar.id,
            nombre: lugar.place_name,
            lng: lugar.center[0],
            lat: lugar.center[1]
          }))
        } catch (error) {
          console.error(error);
          return [];
        }
      }


      async climaLugar( lat, lon ){
        try {
          //intances axios.create()
          const intance = axios.create({
            baseURL: `https://api.openweathermap.org/data/2.5/weather`,
            params: {...this.paramsClima, lat, lon}
          })
          //resp => extraer info de resp.data
          const resp = await intance.get()
          const { weather, main } = resp.data
          return {
            desc: weather[0].description,
            min: main.temp_min,
            max: main.temp_max,
            temp: main.temp
          }
        } catch (error) {
          console.log(error)
        }
      }
      
      agregarHistorial(lugar = ''){
        //prevenir duplicados
        if(this.historial.includes( lugar.toLocaleLowerCase() )){
          return;
        }
        //grabar en archivo json
        this.historial.unshift(lugar.toLocaleLowerCase())

        //grabar en DB 
        this.guardarDB()
      }
      guardarDB() {
        const payload = {
          historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
      }

      leerDB(){
        if(!fs.existsSync(this.dbPath)) return
        // debe de existir...

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})
        const data = JSON.parse( info )
        this.historial = data.historial
        
      }

    }

module.exports = Busquedas

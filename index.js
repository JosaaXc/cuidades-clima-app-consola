require('dotenv').config()

const { leerInput, inquirerMenu, pausa, listarLugares } = require("./helpers/inquierer")
const Busquedas = require("./models/busquedas")

const main = async() =>{
    const busquedas = new Busquedas()
    let opt
    do{
        opt = await inquirerMenu()
        switch(opt){
            case 1:
                //mostrar mensaje para que escriba
                const buscarCiudad = await leerInput('Ciudad: ')
                //luego buscar el lugar
                const lugares = await busquedas.ciudad( buscarCiudad )
                //seleccionar el lugar 
                const id = await listarLugares(lugares)
                if( id === '0') continue

                const lugarSel = lugares.find( l => l.id === id)
                //guardar en DB
                busquedas.agregarHistorial( lugarSel.nombre )
                //Obtener datos de Clima
                const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

                //Mostrar resultados
                console.clear()
                console.log('\nInformación del lugar\n'.green)
                console.log('Ciudad:', lugarSel.nombre) 
                console.log('Lat:', lugarSel.lat) 
                console.log('Lng:', lugarSel.lng) 
                console.log('Temperatura:', `${clima.temp}`) 
                console.log('Máxima:', `${clima.max}`) 
                console.log('Maxima:', `${clima.min}`)
                console.log(`Como está el clima: ${clima.desc}`)
            break
            case 2:
                busquedas.historialCap.forEach((lugar, indice) => {
                    console.log(`${indice+1}. ${lugar}`)
                })
            break
        }
        if(opt !==0) await pausa()
    }while(opt !== 0)
}

main()
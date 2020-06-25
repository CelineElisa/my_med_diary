import React, { useState, useEffect } from 'react'
import Write from '../Firebase/Write'
import { Link } from 'react-router-dom'

import BurgerMenu from './BurgerMenu'

import './MyPillbox.css'

// const medicaments = [
//     { id: 1, nom: 'doliprane', quantiteParPrise: 2, matin: true, midi: true, soir: true, debut: new Date(2020, 6, 12), fin: new Date(2020, 6, 20), present: 1 },
//     { id: 2, nom: 'ibuprofène', quantiteParPrise: 4, matin: true, midi: false, soir: true, debut: new Date(2020, 6, 12), fin: new Date(2020, 6, 20), present: 1 },
//     { id: 3, nom: 'medoc', quantiteParPrise: 2, matin: false, midi: true, soir: false, debut: new Date(2020, 4, 12), fin: new Date(2020, 6, 26), present: 0 },
//     { id: 4, nom: 'strepsil', quantiteParPrise: 1, matin: true, midi: true, soir: true, debut: new Date(2020, 4, 12), fin: new Date(2020, 6, 26), present: 1 },
//     { id: 5, nom: 'xanax', quantiteParPrise: 1, matin: false, midi: false, soir: true, debut: new Date(2020, 5, 12), fin: new Date(2020, 6, 20), present: 1 },
//     { id: 6, nom: 'aspirine', quantiteParPrise: 2, matin: true, midi: true, soir: true, debut: new Date(2020, 5, 12), fin: new Date(2020, 6, 26), present: 1 }
// ]

//var uneAutreDate = new Date(annee, mois, jour);

const MyPillbox = (props) => {
    const [medList, setMedList] = useState([])
    const [message, setMessage] = useState(null)
    const [allMedsTaken, setAllMedsTaken] = useState({})
    const [dataMedicine, setDataMedicine] = useState([])
    const [dataHistoric, setDataHistoric] = useState([])
    const [checkedSomething, setCheckedSomething] = useState(false)
    const collection = 'historic'

    useEffect(() => {
        setDataMedicine(props.medicine)
    },[props.medicine])

    useEffect(() => {
        setDataHistoric(props.historic)
    },[props.historic])

    useEffect(() => { 
        getCurrentMedList() 
    }, [dataMedicine])

    if (dataHistoric[0] !== undefined){
        dataHistoric.map((index) => {
            for(const i in index) {
                console.log(Date(index[i].takenDate.second))
            }
        }
        )
        //console.log(dataHistoric[0][0])
    }
    
    // const dejaPris = dataHistoric.map(index => {
    //     index.map(i => console.log(i))
    // })

    const getCurrentMedList = () => {
        const today = new Date()

        let todayMedList = dataMedicine
        for (let i = 0; i < dataMedicine.length; i++) {
            todayMedList[i].debut = new Date(todayMedList[i].debut)
            todayMedList[i].fin = new Date(todayMedList[i].fin)
            todayMedList[i].taken = false
        }

        todayMedList = todayMedList.filter(med => (
            med.present === true && med.debut <= today && med.fin >= today))

        if (today.getHours() < 11) {
            setMessage("Your medicines to take with breakfast :")
            setMedList(todayMedList.filter(med => med.matin === true))
        } else if (today.getHours() >= 11 && today.getHours() < 17) {
            setMessage("Your medicines to take with lunch :")
            setMedList(todayMedList.filter(med => med.midi === true))
        } else {
            setMessage("Your medicines to take with diner :")
            setMedList(todayMedList.filter(med => med.soir === true))
        }
    }

    const handleCheckedMeds = (event) => {
        const takenMeds = medList
        const index = takenMeds.findIndex(med => med.id === parseInt(event.target.id))
        takenMeds[index].taken = !takenMeds[index].taken
        takenMeds[index].takenDate = new Date()
        setAllMedsTaken(takenMeds)
        setCheckedSomething(true)
    }
    
    const sendData = () => {
        if (checkedSomething === true) {
            Write(collection, {...allMedsTaken})
            console.log('allMedsTaken',allMedsTaken)
        } else {
            for ( let i=0 ; i < medList.length ;i++ ){
                medList[i].takenDate = new Date()
            }
            console.log('medList',medList)
            Write(collection, {...medList})
        }
    }

    return (
        <div className="pillbox">
            <BurgerMenu/>
            <h2 className="pillboxH2">My Pillbox</h2>
            <p className="pillboxP">{message}</p>
            <div className="medListContainer">
                <div className="medList">
                    {medList.map(med => (
                        <div key={med.id}>
                            <input id={med.id} type='checkbox' onClick={(event) => { document.getElementById(`${med.nom}`).classList.toggle('green'); handleCheckedMeds(event); }} />
                            <label id={med.nom} htmlFor={med.id} >{med.nom}</label>
                        </div>
                    ))}
                </div>
            </div>
            <button onClick={()=> sendData()} ><Link to='/Home'>VALIDATE</Link></button>
        </div>
    )
}

export default MyPillbox

//{console.log(dataHistoric)}